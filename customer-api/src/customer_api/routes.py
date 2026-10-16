from __future__ import annotations

from datetime import UTC, date, datetime, timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status

from customer_api import services
from customer_api.domain import CATEGORY_META, Category, Customer, PaymentMethod, Period, SortBy, Transaction, cents_to_amount
from customer_api.repository import CustomerRepository, NewTransaction
from customer_api.schemas import (
    CategoryFilter,
    CategorySpend,
    CustomerList,
    CustomerProfile,
    CustomerSummary,
    DateRangeOut,
    DateRangePreset,
    Filters,
    GoalList,
    GoalOut,
    MonthTrend,
    Pagination,
    PeriodComparison,
    SpendingByCategory,
    SpendingSummary,
    SpendingTrends,
    TransactionCreate,
    TransactionOut,
    TransactionPage,
)

router = APIRouter(prefix="/api/customers", tags=["customers"])


# --- dependencies -------------------------------------------------------------------------------


def get_repository(request: Request) -> CustomerRepository:
    repo, _ = request.app.state.repository_provider.current()
    return repo


def get_today(request: Request) -> date:
    """The reference date for rolling periods; always the date the current dataset was generated for.
    Overridable via MOCK_TODAY for reproducible demos/tests."""
    _, today = request.app.state.repository_provider.current()
    return today


def get_customer(customer_id: str, repo: Annotated[CustomerRepository, Depends(get_repository)]) -> Customer:
    customer = repo.get_customer(customer_id)
    if customer is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail=f"Customer {customer_id!r} not found")
    return customer


Repo = Annotated[CustomerRepository, Depends(get_repository)]
Today = Annotated[date, Depends(get_today)]
CurrentCustomer = Annotated[Customer, Depends(get_customer)]

PeriodQuery = Annotated[Period, Query(description="Rolling window ending today.")]
StartDate = Annotated[date | None, Query(alias="startDate", description="YYYY-MM-DD, inclusive.")]
EndDate = Annotated[date | None, Query(alias="endDate", description="YYYY-MM-DD, inclusive.")]


def _range_or_422(period: Period, start: date | None, end: date | None, today: date):
    try:
        return services.resolve_range(period, start, end, today)
    except services.InvalidDateRange as exc:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, detail=str(exc)) from exc


# --- endpoints ----------------------------------------------------------------------------------


@router.get("", summary="List customers (for the dashboard's customer picker)")
def list_customers(repo: Repo) -> CustomerList:
    return CustomerList(
        customers=[
            CustomerSummary(customer_id=c.id, name=c.name, email=c.email, account_type=c.account_type)
            for c in repo.list_customers()
        ]
    )


@router.get("/{customer_id}/profile")
def customer_profile(customer: CurrentCustomer, repo: Repo) -> CustomerProfile:
    total = sum(t.amount_cents for t in repo.transactions_for(customer.id))
    return CustomerProfile(
        customer_id=customer.id,
        name=customer.name,
        email=customer.email,
        join_date=customer.join_date,
        account_type=customer.account_type,
        total_spent=cents_to_amount(total),
        currency=customer.currency,
    )


@router.get("/{customer_id}/spending/summary")
def spending_summary(customer: CurrentCustomer, repo: Repo, today: Today, period: PeriodQuery = Period.D30) -> SpendingSummary:
    window = services.resolve_range(period, None, None, today)
    s = services.summarise(repo.transactions_for(customer.id), window)
    return SpendingSummary(
        period=period,
        total_spent=s.total,
        transaction_count=s.transaction_count,
        average_transaction=s.average,
        top_category=s.top_category,
        compared_to_previous=PeriodComparison(spent_change=s.spent_change, transaction_change=s.transaction_change),
    )


@router.get("/{customer_id}/spending/categories")
def spending_by_category(
    customer: CurrentCustomer,
    repo: Repo,
    today: Today,
    period: PeriodQuery = Period.D30,
    start_date: StartDate = None,
    end_date: EndDate = None,
) -> SpendingByCategory:
    window = _range_or_422(period, start_date, end_date, today)
    total, rows = services.by_category(repo.transactions_for(customer.id), window)
    return SpendingByCategory(
        date_range=DateRangeOut(start_date=window.start, end_date=window.end),
        total_amount=cents_to_amount(total),
        categories=[
            CategorySpend(
                name=r.category,
                amount=cents_to_amount(r.amount_cents),
                percentage=r.percentage,
                transaction_count=r.transaction_count,
                color=CATEGORY_META[r.category].color,
                icon=CATEGORY_META[r.category].icon,
            )
            for r in rows
        ],
    )


@router.get("/{customer_id}/spending/trends")
def spending_trends(
    customer: CurrentCustomer,
    repo: Repo,
    today: Today,
    months: Annotated[int, Query(ge=1, le=24, description="Calendar months to include, ending with the current month.")] = 12,
) -> SpendingTrends:
    rows = services.monthly_trends(repo.transactions_for(customer.id), months, today)
    return SpendingTrends(
        trends=[
            MonthTrend(
                month=r.month,
                total_spent=cents_to_amount(r.total_cents),
                transaction_count=r.transaction_count,
                average_transaction=r.average,
            )
            for r in rows
        ]
    )


@router.get("/{customer_id}/transactions")
def list_transactions(
    customer: CurrentCustomer,
    repo: Repo,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    offset: Annotated[int, Query(ge=0)] = 0,
    category: Category | None = None,
    start_date: StartDate = None,
    end_date: EndDate = None,
    sort_by: Annotated[SortBy, Query(alias="sortBy")] = SortBy.DATE_DESC,
) -> TransactionPage:
    try:
        rows = services.filter_transactions(
            repo.transactions_for(customer.id), category=category, start=start_date, end=end_date, sort_by=sort_by
        )
    except services.InvalidDateRange as exc:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, detail=str(exc)) from exc
    page = rows[offset : offset + limit]
    return TransactionPage(
        transactions=[_transaction_out(t) for t in page],
        pagination=Pagination(total=len(rows), limit=limit, offset=offset, has_more=offset + limit < len(rows)),
    )


def _transaction_out(t: Transaction) -> TransactionOut:
    return TransactionOut(
        id=t.id,
        date=t.occurred_at,
        merchant=t.merchant,
        category=t.category,
        amount=cents_to_amount(t.amount_cents),
        description=t.description,
        payment_method=t.payment_method,
        icon=CATEGORY_META[t.category].icon,
        category_color=CATEGORY_META[t.category].color,
    )


# Tolerates clock skew between the client and the API.
_FUTURE_GRACE = timedelta(minutes=5)


@router.post("/{customer_id}/transactions", status_code=status.HTTP_201_CREATED, summary="Record a transaction")
def create_transaction(customer: CurrentCustomer, repo: Repo, body: TransactionCreate) -> TransactionOut:
    now = datetime.now(UTC)
    occurred_at = body.date or now
    occurred_at = occurred_at.replace(tzinfo=UTC) if occurred_at.tzinfo is None else occurred_at.astimezone(UTC)
    if occurred_at > now + _FUTURE_GRACE:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, detail="date must not be in the future")
    created = repo.add_transaction(
        NewTransaction(
            customer_id=customer.id,
            occurred_at=occurred_at,
            merchant=body.merchant,
            category=body.category,
            amount_cents=body.amount_cents,
            description=body.description,
            payment_method=body.payment_method,
        )
    )
    return _transaction_out(created)


@router.get("/{customer_id}/goals")
def spending_goals(customer: CurrentCustomer, repo: Repo, today: Today) -> GoalList:
    progress = services.goal_progress(repo.goals_for(customer.id), repo.transactions_for(customer.id), today)
    return GoalList(
        goals=[
            GoalOut(
                id=p.goal.id,
                category=p.goal.category,
                monthly_budget=cents_to_amount(p.goal.monthly_budget_cents),
                current_spent=cents_to_amount(p.spent_cents),
                percentage_used=p.percentage_used,
                days_remaining=p.days_remaining,
                status=p.status,
            )
            for p in progress
        ]
    )


_PRESET_LABELS = {Period.D7: "Last 7 days", Period.D30: "Last 30 days", Period.D90: "Last 90 days", Period.Y1: "Last year"}


@router.get("/{customer_id}/filters")
def available_filters(customer: CurrentCustomer) -> Filters:
    return Filters(
        categories=[CategoryFilter(name=c, color=m.color, icon=m.icon) for c, m in CATEGORY_META.items()],
        date_range_presets=[DateRangePreset(label=label, value=p) for p, label in _PRESET_LABELS.items()],
        payment_methods=list(PaymentMethod),
    )
