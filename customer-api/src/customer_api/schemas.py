"""Response models. Field names are snake_case in Python and camelCase on the wire."""

from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, field_validator
from pydantic.alias_generators import to_camel

from customer_api.domain import AccountType, GoalStatus, PaymentMethod, Period


class CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, serialize_by_alias=True)


class CustomerSummary(CamelModel):
    customer_id: str
    name: str
    email: str
    account_type: AccountType


class CustomerList(CamelModel):
    customers: list[CustomerSummary]


class CustomerProfile(CamelModel):
    customer_id: str
    name: str
    email: str
    join_date: date
    account_type: AccountType
    total_spent: float
    currency: str


class PeriodComparison(CamelModel):
    spent_change: float | None  # percentage; null when the previous period had no spend
    transaction_change: float | None


class SpendingSummary(CamelModel):
    period: Period
    total_spent: float
    transaction_count: int
    average_transaction: float
    top_category: str | None
    compared_to_previous: PeriodComparison


class DateRangeOut(CamelModel):
    start_date: date
    end_date: date


class CategorySpend(CamelModel):
    name: str
    amount: float
    percentage: float
    transaction_count: int
    color: str
    icon: str


class SpendingByCategory(CamelModel):
    date_range: DateRangeOut
    total_amount: float
    categories: list[CategorySpend]


class MonthTrend(CamelModel):
    month: str
    total_spent: float
    transaction_count: int
    average_transaction: float


class SpendingTrends(CamelModel):
    trends: list[MonthTrend]


class TransactionOut(CamelModel):
    id: str
    date: datetime
    merchant: str
    category: str
    amount: float
    description: str
    payment_method: PaymentMethod
    icon: str
    category_color: str


class Pagination(CamelModel):
    total: int
    limit: int
    offset: int
    has_more: bool


class TransactionPage(CamelModel):
    transactions: list[TransactionOut]
    pagination: Pagination


class GoalOut(CamelModel):
    id: str
    category: str
    monthly_budget: float
    current_spent: float
    percentage_used: float
    days_remaining: int
    status: GoalStatus


class GoalList(CamelModel):
    goals: list[GoalOut]


class CategoryFilter(CamelModel):
    name: str
    color: str
    icon: str


class DateRangePreset(CamelModel):
    label: str
    value: Period


class Filters(CamelModel):
    categories: list[CategoryFilter]
    date_range_presets: list[DateRangePreset]
    payment_methods: list[PaymentMethod]
    # Choices offered when creating a category.
    icons: list[str]
    colors: list[str]


class TransactionCreate(CamelModel):
    """Body of POST /transactions. Amounts are in rand with at most two decimals."""

    merchant: str = Field(min_length=1, max_length=80)
    category: str = Field(min_length=1, max_length=40)
    amount: Decimal = Field(gt=0, le=1_000_000, decimal_places=2)
    # Defaults to now. Naive values are taken as UTC, matching how the API buckets by day.
    date: datetime | None = None
    description: str = Field(default="", max_length=120)
    payment_method: PaymentMethod

    @field_validator("merchant", "description", mode="before")
    @classmethod
    def strip(cls, value: object) -> object:
        return value.strip() if isinstance(value, str) else value

    @property
    def amount_cents(self) -> int:
        return int((self.amount * 100).to_integral_value())


class CategoryCreate(CamelModel):
    """Body of POST /categories. Colour is a hex value; icon is one of the names the dashboard can render."""

    name: str = Field(min_length=1, max_length=40)
    color: str = Field(pattern=r"^#[0-9a-fA-F]{6}$")
    icon: str = Field(min_length=1, max_length=40)

    @field_validator("name", mode="before")
    @classmethod
    def strip(cls, value: object) -> object:
        return value.strip() if isinstance(value, str) else value
