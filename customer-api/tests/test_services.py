"""Unit tests for the analytics functions, using hand-built transactions."""

from datetime import UTC, date, datetime

import pytest

from customer_api import services
from customer_api.domain import Category, DateRange, Goal, GoalStatus, PaymentMethod, Period, SortBy, Transaction

TODAY = date(2024, 9, 16)


def txn(day: date, cents: int, category: Category = Category.GROCERIES, id: str = "t") -> Transaction:
    return Transaction(
        id=id,
        customer_id="c",
        occurred_at=datetime(day.year, day.month, day.day, 12, tzinfo=UTC),
        merchant="m",
        category=category,
        amount_cents=cents,
        description="",
        payment_method=PaymentMethod.CREDIT_CARD,
    )


class TestDateRange:
    def test_ending_has_exact_length(self) -> None:
        r = DateRange.ending(TODAY, 30)
        assert r.days == 30
        assert r.end == TODAY
        assert r.start == date(2024, 8, 18)

    def test_previous_is_adjacent_and_same_length(self) -> None:
        r = DateRange.ending(TODAY, 7)
        p = r.previous()
        assert p.days == 7
        assert p.end == r.start.replace(day=r.start.day - 1)

    def test_rejects_inverted_range(self) -> None:
        with pytest.raises(ValueError):
            DateRange(start=TODAY, end=date(2024, 1, 1))


class TestResolveRange:
    def test_period_only(self) -> None:
        assert services.resolve_range(Period.D7, None, None, TODAY) == DateRange.ending(TODAY, 7)

    def test_custom_range_overrides_period(self) -> None:
        r = services.resolve_range(Period.Y1, date(2024, 1, 1), date(2024, 1, 31), TODAY)
        assert (r.start, r.end) == (date(2024, 1, 1), date(2024, 1, 31))

    @pytest.mark.parametrize("start,end", [(date(2024, 1, 1), None), (None, date(2024, 1, 1))])
    def test_half_specified_range_is_invalid(self, start: date | None, end: date | None) -> None:
        with pytest.raises(services.InvalidDateRange):
            services.resolve_range(Period.D30, start, end, TODAY)


class TestSummarise:
    def test_totals_and_comparison(self) -> None:
        window = DateRange.ending(TODAY, 7)
        txns = [
            txn(TODAY, 10_000, Category.DINING),
            txn(TODAY, 20_000, Category.GROCERIES),
            txn(window.start, 10_000, Category.GROCERIES),  # inclusive start
            txn(window.previous().end, 20_000),  # previous period
            txn(date(2020, 1, 1), 999_999),  # ignored
        ]
        s = services.summarise(txns, window)
        assert s.total == 400.0
        assert s.transaction_count == 3
        assert s.average == 133.33
        assert s.top_category == Category.GROCERIES
        assert s.spent_change == 100.0  # 400 vs 200
        assert s.transaction_change == 200.0  # 3 vs 1

    def test_empty_window(self) -> None:
        s = services.summarise([], DateRange.ending(TODAY, 30))
        assert (s.total, s.transaction_count, s.average, s.top_category) == (0.0, 0, 0.0, None)
        assert s.spent_change is None


def test_by_category_percentages_sum_and_order() -> None:
    window = DateRange.ending(TODAY, 30)
    txns = [txn(TODAY, 30_000, Category.SHOPPING), txn(TODAY, 60_000, Category.GROCERIES), txn(TODAY, 10_000, Category.DINING)]
    total, rows = services.by_category(txns, window)
    assert total == 100_000
    assert [r.category for r in rows] == [Category.GROCERIES, Category.SHOPPING, Category.DINING]
    assert [r.percentage for r in rows] == [60.0, 30.0, 10.0]


def test_monthly_trends_zero_fills_and_orders_oldest_first() -> None:
    txns = [
        txn(date(2024, 9, 1), 5_000),
        txn(date(2024, 7, 15), 2_500),
        txn(date(2024, 7, 20), 2_500),
        txn(date(2023, 12, 31), 1),
    ]
    rows = services.monthly_trends(txns, months=3, today=TODAY)
    assert [r.month for r in rows] == ["2024-07", "2024-08", "2024-09"]
    assert [r.total_cents for r in rows] == [5_000, 0, 5_000]
    assert rows[0].average == 25.0


def test_filter_transactions_sorting_and_filters() -> None:
    txns = [
        txn(date(2024, 9, 1), 100, Category.DINING, "a"),
        txn(date(2024, 9, 2), 300, Category.GROCERIES, "b"),
        txn(date(2024, 9, 3), 200, Category.DINING, "c"),
    ]
    ids = lambda rows: [t.id for t in rows]  # noqa: E731
    assert ids(services.filter_transactions(txns, category=None, start=None, end=None, sort_by=SortBy.AMOUNT_DESC)) == [
        "b",
        "c",
        "a",
    ]
    assert ids(services.filter_transactions(txns, category=Category.DINING, start=None, end=None, sort_by=SortBy.DATE_ASC)) == [
        "a",
        "c",
    ]
    assert ids(
        services.filter_transactions(txns, category=None, start=date(2024, 9, 2), end=date(2024, 9, 2), sort_by=SortBy.DATE_DESC)
    ) == ["b"]
    with pytest.raises(services.InvalidDateRange):
        services.filter_transactions(txns, category=None, start=date(2024, 9, 3), end=date(2024, 9, 1), sort_by=SortBy.DATE_DESC)


def test_goal_progress_statuses() -> None:
    goals = [
        Goal("g1", "c", Category.DINING, 100_000),
        Goal("g2", "c", Category.GROCERIES, 100_000),
        Goal("g3", "c", Category.SHOPPING, 100_000),
    ]
    txns = [
        txn(date(2024, 9, 5), 50_000, Category.DINING),
        txn(date(2024, 9, 5), 85_000, Category.GROCERIES),
        txn(date(2024, 9, 5), 120_000, Category.SHOPPING),
        txn(date(2024, 8, 31), 999_999, Category.DINING),  # last month, ignored
    ]
    progress = services.goal_progress(goals, txns, TODAY)
    assert [p.status for p in progress] == [GoalStatus.ON_TRACK, GoalStatus.WARNING, GoalStatus.EXCEEDED]
    assert progress[0].percentage_used == 50.0
    assert progress[0].days_remaining == 14
