"""Spending analytics over a customer's transactions. Pure functions: easy to test, no I/O."""

from __future__ import annotations

import calendar
from collections import defaultdict
from dataclasses import dataclass
from datetime import date

from customer_api.domain import (
    DateRange,
    Goal,
    GoalStatus,
    Period,
    SortBy,
    Transaction,
    cents_to_amount,
)


class InvalidDateRange(ValueError):
    pass


def resolve_range(period: Period, start: date | None, end: date | None, today: date) -> DateRange:
    """Custom start/end wins over the quick-select period. Both or neither must be given."""
    if start is None and end is None:
        return DateRange.ending(today, period.days)
    if start is None or end is None:
        raise InvalidDateRange("startDate and endDate must be provided together")
    try:
        return DateRange(start=start, end=end)
    except ValueError as exc:
        raise InvalidDateRange("startDate must be on or before endDate") from exc


def in_range(transactions: list[Transaction], window: DateRange) -> list[Transaction]:
    return [t for t in transactions if window.contains(t.occurred_on)]


def _pct_change(current: int, previous: int) -> float | None:
    if previous == 0:
        return None
    return round((current - previous) / previous * 100, 1)


def _average(total_cents: int, count: int) -> float:
    return cents_to_amount(round(total_cents / count)) if count else 0.0


@dataclass(frozen=True, slots=True)
class Summary:
    total_cents: int
    transaction_count: int
    top_category: str | None
    spent_change: float | None
    transaction_change: float | None

    @property
    def total(self) -> float:
        return cents_to_amount(self.total_cents)

    @property
    def average(self) -> float:
        return _average(self.total_cents, self.transaction_count)


def summarise(transactions: list[Transaction], window: DateRange) -> Summary:
    current = in_range(transactions, window)
    previous = in_range(transactions, window.previous())
    totals = _totals_by_category(current)
    top = max(totals, key=lambda c: totals[c]) if totals else None
    cur_total, prev_total = sum(t.amount_cents for t in current), sum(t.amount_cents for t in previous)
    return Summary(
        total_cents=cur_total,
        transaction_count=len(current),
        top_category=top,
        spent_change=_pct_change(cur_total, prev_total),
        transaction_change=_pct_change(len(current), len(previous)),
    )


@dataclass(frozen=True, slots=True)
class CategoryTotal:
    category: str
    amount_cents: int
    percentage: float
    transaction_count: int


def _totals_by_category(transactions: list[Transaction]) -> dict[str, int]:
    totals: dict[str, int] = defaultdict(int)
    for t in transactions:
        totals[t.category] += t.amount_cents
    return totals


def by_category(transactions: list[Transaction], window: DateRange) -> tuple[int, list[CategoryTotal]]:
    """Returns (total_cents, per-category totals sorted by amount, descending). Empty categories are omitted."""
    current = in_range(transactions, window)
    totals = _totals_by_category(current)
    counts: dict[str, int] = defaultdict(int)
    for t in current:
        counts[t.category] += 1
    grand = sum(totals.values())
    rows = [
        CategoryTotal(
            category=c,
            amount_cents=cents,
            percentage=round(cents / grand * 100, 1) if grand else 0.0,
            transaction_count=counts[c],
        )
        for c, cents in totals.items()
    ]
    rows.sort(key=lambda r: r.amount_cents, reverse=True)
    return grand, rows


@dataclass(frozen=True, slots=True)
class MonthTotal:
    month: str  # YYYY-MM
    total_cents: int
    transaction_count: int

    @property
    def average(self) -> float:
        return _average(self.total_cents, self.transaction_count)


def _month_keys(months: int, today: date) -> list[tuple[int, int]]:
    """(year, month) for the last `months` calendar months including the current one, oldest first."""
    keys: list[tuple[int, int]] = []
    year, month = today.year, today.month
    for _ in range(months):
        keys.append((year, month))
        month -= 1
        if month == 0:
            year, month = year - 1, 12
    keys.reverse()
    return keys


def monthly_trends(transactions: list[Transaction], months: int, today: date) -> list[MonthTotal]:
    """The last `months` calendar months including the current one, oldest first, zero-filled."""
    keys = _month_keys(months, today)

    totals: dict[tuple[int, int], int] = defaultdict(int)
    counts: dict[tuple[int, int], int] = defaultdict(int)
    earliest = date(keys[0][0], keys[0][1], 1)
    for t in transactions:
        d = t.occurred_on
        if d >= earliest:
            totals[(d.year, d.month)] += t.amount_cents
            counts[(d.year, d.month)] += 1
    return [MonthTotal(month=f"{y:04d}-{m:02d}", total_cents=totals[(y, m)], transaction_count=counts[(y, m)]) for y, m in keys]


@dataclass(frozen=True, slots=True)
class MonthCategoryTotals:
    month: str  # YYYY-MM
    total_cents: int
    by_category: dict[str, int]  # category -> cents, only categories with spend that month


def monthly_trends_by_category(transactions: list[Transaction], months: int, today: date) -> list[MonthCategoryTotals]:
    """Monthly totals split by category, oldest first, zero-filled months."""
    keys = _month_keys(months, today)
    per_month: dict[tuple[int, int], dict[str, int]] = {k: defaultdict(int) for k in keys}
    earliest = date(keys[0][0], keys[0][1], 1)
    for t in transactions:
        d = t.occurred_on
        if d >= earliest and (d.year, d.month) in per_month:
            per_month[(d.year, d.month)][t.category] += t.amount_cents
    return [
        MonthCategoryTotals(
            month=f"{y:04d}-{m:02d}", total_cents=sum(per_month[(y, m)].values()), by_category=dict(per_month[(y, m)])
        )
        for y, m in keys
    ]


WEEKDAYS = ("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday")


@dataclass(frozen=True, slots=True)
class WeekdayTotal:
    weekday: str
    total_cents: int
    transaction_count: int
    # How many of that weekday fall inside the window; 0 only for a window shorter than a week.
    days: int

    @property
    def average_per_day(self) -> float:
        return cents_to_amount(round(self.total_cents / self.days)) if self.days else 0.0


def weekday_totals(transactions: list[Transaction], window: DateRange) -> list[WeekdayTotal]:
    """Spend per weekday over the window, Monday first, with the average per occurrence of that day."""
    totals = [0] * 7
    counts = [0] * 7
    for t in in_range(transactions, window):
        wd = t.occurred_on.weekday()
        totals[wd] += t.amount_cents
        counts[wd] += 1
    full_weeks, rest = divmod(window.days, 7)
    days = [full_weeks] * 7
    for i in range(rest):
        days[(window.start.weekday() + i) % 7] += 1
    return [WeekdayTotal(weekday=WEEKDAYS[i], total_cents=totals[i], transaction_count=counts[i], days=days[i]) for i in range(7)]


_SORTERS = {
    SortBy.DATE_DESC: (lambda t: t.occurred_at, True),
    SortBy.DATE_ASC: (lambda t: t.occurred_at, False),
    SortBy.AMOUNT_DESC: (lambda t: (t.amount_cents, t.occurred_at), True),
    SortBy.AMOUNT_ASC: (lambda t: (t.amount_cents, t.occurred_at), False),
}


def filter_transactions(
    transactions: list[Transaction],
    *,
    category: str | None,
    start: date | None,
    end: date | None,
    sort_by: SortBy,
) -> list[Transaction]:
    if start is not None and end is not None and start > end:
        raise InvalidDateRange("startDate must be on or before endDate")
    rows = [
        t
        for t in transactions
        if (category is None or t.category == category)
        and (start is None or t.occurred_on >= start)
        and (end is None or t.occurred_on <= end)
    ]
    key, reverse = _SORTERS[sort_by]
    rows.sort(key=key, reverse=reverse)
    return rows


@dataclass(frozen=True, slots=True)
class GoalProgress:
    goal: Goal
    spent_cents: int
    days_remaining: int

    @property
    def percentage_used(self) -> float:
        return round(self.spent_cents / self.goal.monthly_budget_cents * 100, 2)

    @property
    def status(self) -> GoalStatus:
        if self.percentage_used >= 100:
            return GoalStatus.EXCEEDED
        if self.percentage_used >= 80:
            return GoalStatus.WARNING
        return GoalStatus.ON_TRACK


def goal_progress(goals: list[Goal], transactions: list[Transaction], today: date) -> list[GoalProgress]:
    """Month-to-date spend against each monthly budget."""
    this_month = DateRange.month_of(today)
    totals = _totals_by_category(in_range(transactions, this_month))
    days_remaining = calendar.monthrange(today.year, today.month)[1] - today.day
    return [GoalProgress(goal=g, spent_cents=totals.get(g.category, 0), days_remaining=days_remaining) for g in goals]
