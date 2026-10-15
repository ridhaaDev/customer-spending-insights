"""Core domain types. Framework-free so the generator, repository and services can share them."""

from __future__ import annotations

import calendar
from dataclasses import dataclass
from datetime import date, datetime, timedelta
from enum import StrEnum


class Category(StrEnum):
    GROCERIES = "Groceries"
    ENTERTAINMENT = "Entertainment"
    TRANSPORTATION = "Transportation"
    DINING = "Dining"
    SHOPPING = "Shopping"
    UTILITIES = "Utilities"


@dataclass(frozen=True, slots=True)
class CategoryMeta:
    color: str
    icon: str


# Presentation metadata lives with the category so every endpoint reports the same colour/icon.
# Colours are a colour-vision-checked categorical set (the spec's original hex values had two
# near-identical blues and a yellow that failed contrast); the UI always pairs them with an icon + label.
CATEGORY_META: dict[Category, CategoryMeta] = {
    Category.GROCERIES: CategoryMeta(color="#e34948", icon="shopping-cart"),
    Category.ENTERTAINMENT: CategoryMeta(color="#e87ba4", icon="film"),
    Category.TRANSPORTATION: CategoryMeta(color="#2a78d6", icon="car"),
    Category.DINING: CategoryMeta(color="#eda100", icon="utensils"),
    Category.SHOPPING: CategoryMeta(color="#4a3aa7", icon="shopping-bag"),
    Category.UTILITIES: CategoryMeta(color="#1baf7a", icon="zap"),
}


class AccountType(StrEnum):
    STANDARD = "standard"
    PREMIUM = "premium"
    BUSINESS = "business"


class PaymentMethod(StrEnum):
    CREDIT_CARD = "Credit Card"
    DEBIT_CARD = "Debit Card"
    DEBIT_ORDER = "Debit Order"
    EFT = "EFT"
    INSTANT_EFT = "Instant EFT"


class Period(StrEnum):
    """Quick-select rolling windows ending today."""

    D7 = "7d"
    D30 = "30d"
    D90 = "90d"
    Y1 = "1y"

    @property
    def days(self) -> int:
        return {Period.D7: 7, Period.D30: 30, Period.D90: 90, Period.Y1: 365}[self]


class SortBy(StrEnum):
    DATE_DESC = "date_desc"
    DATE_ASC = "date_asc"
    AMOUNT_DESC = "amount_desc"
    AMOUNT_ASC = "amount_asc"


class GoalStatus(StrEnum):
    ON_TRACK = "on_track"
    WARNING = "warning"
    EXCEEDED = "exceeded"


@dataclass(frozen=True, slots=True)
class Customer:
    id: str
    name: str
    email: str
    join_date: date
    account_type: AccountType
    currency: str = "ZAR"


@dataclass(frozen=True, slots=True)
class Transaction:
    id: str
    customer_id: str
    occurred_at: datetime  # timezone-aware UTC
    merchant: str
    category: Category
    amount_cents: int  # money is stored as integer cents so aggregation is exact
    description: str
    payment_method: PaymentMethod

    @property
    def occurred_on(self) -> date:
        return self.occurred_at.date()


@dataclass(frozen=True, slots=True)
class Goal:
    id: str
    customer_id: str
    category: Category
    monthly_budget_cents: int


@dataclass(frozen=True, slots=True)
class DateRange:
    """Inclusive calendar-day range."""

    start: date
    end: date

    def __post_init__(self) -> None:
        if self.start > self.end:
            raise ValueError("start must be on or before end")

    @property
    def days(self) -> int:
        return (self.end - self.start).days + 1

    def contains(self, day: date) -> bool:
        return self.start <= day <= self.end

    def previous(self) -> DateRange:
        """The same-length window immediately before this one."""
        return DateRange(start=self.start - timedelta(days=self.days), end=self.start - timedelta(days=1))

    @classmethod
    def ending(cls, end: date, days: int) -> DateRange:
        return cls(start=end - timedelta(days=days - 1), end=end)

    @classmethod
    def month_of(cls, day: date) -> DateRange:
        last = calendar.monthrange(day.year, day.month)[1]
        return cls(start=day.replace(day=1), end=day.replace(day=last))


def cents_to_amount(cents: int) -> float:
    return round(cents / 100, 2)
