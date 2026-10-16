from __future__ import annotations

from datetime import UTC, date, datetime, timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status

from customer_api import services
from customer_api.domain import (
    CATEGORY_COLORS,
    CATEGORY_ICONS,
    CategoryMeta,
    Customer,
    PaymentMethod,
    Period,
    SortBy,
    Transaction,
    cents_to_amount,
)
from customer_api.repository import CustomerRepository, DuplicateCategory, DuplicateGoal, NewTransaction
from customer_api.schemas import (
    CategoryCreate,
    CategoryFilter,
    CategorySpend,
    CustomerList,
    CustomerProfile,
    CustomerSummary,
    DateRangeOut,
    DateRangePreset,
    Filters,
    GoalCreate,
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
    meta = repo.categories_for(customer.id)
    return SpendingByCategory(
        date_range=DateRangeOut(start_date=window.start, end_date=window.end),
        total_amount=cents_to_amount(total),
        categories=[
            CategorySpend(
                name=r.category,
                amount=cents_to_amount(r.amount_cents),
                percentage=r.percentage,
                transaction_count=r.transaction_count,
                color=_meta(meta, r.category).color,
                icon=_meta(meta, r.category).icon,
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
    category: str | None = None,
    start_date: StartDate = None,
    end_date: EndDate = None,
    sort_by: Annotated[SortBy, Query(alias="sortBy")] = SortBy.DATE_DESC,
) -> TransactionPage:
    meta = repo.categories_for(customer.id)
    if category is not None and category not in meta:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, detail=f"Unknown category {category!r}")
    try:
        rows = services.filter_transactions(
            repo.transactions_for(customer.id), category=category, start=start_date, end=end_date, sort_by=sort_by
        )
    except services.InvalidDateRange as exc:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, detail=str(exc)) from exc
    page = rows[offset : offset + limit]
    return TransactionPage(
        transactions=[_transaction_out(t, meta) for t in page],
        pagination=Pagination(total=len(rows), limit=limit, offset=offset, has_more=offset + limit < len(rows)),
    )


DEFAULT_META = CategoryMeta(color="#6b7280", icon="receipt")


def _meta(categories: dict[str, CategoryMeta], name: str) -> CategoryMeta:
    return categories.get(name, DEFAULT_META)


def _transaction_out(t: Transaction, categories: dict[str, CategoryMeta]) -> TransactionOut:
    return TransactionOut(
        id=t.id,
        date=t.occurred_at,
        merchant=t.merchant,
        category=t.category,
        amount=cents_to_amount(t.amount_cents),
        description=t.description,
        payment_method=t.payment_method,
        icon=_meta(categories, t.category).icon,
        category_color=_meta(categories, t.category).color,
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
    meta = repo.categories_for(customer.id)
    if body.category not in meta:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, detail=f"Unknown category {body.category!r}")
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
    return _transaction_out(created, meta)


@router.get("/{customer_id}/goals")
def spending_goals(customer: CurrentCustomer, repo: Repo, today: Today) -> GoalList:
    progress = services.goal_progress(repo.goals_for(customer.id), repo.transactions_for(customer.id), today)
    return GoalList(goals=[_goal_out(p) for p in progress])


def _goal_out(p: services.GoalProgress) -> GoalOut:
    return GoalOut(
        id=p.goal.id,
        category=p.goal.category,
        monthly_budget=cents_to_amount(p.goal.monthly_budget_cents),
        current_spent=cents_to_amount(p.spent_cents),
        percentage_used=p.percentage_used,
        days_remaining=p.days_remaining,
        status=p.status,
    )


@router.post("/{customer_id}/goals", status_code=status.HTTP_201_CREATED, summary="Set a monthly budget for a category")
def create_goal(customer: CurrentCustomer, repo: Repo, today: Today, body: GoalCreate) -> GoalOut:
    if body.category not in repo.categories_for(customer.id):
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, detail=f"Unknown category {body.category!r}")
    try:
        goal = repo.add_goal(customer.id, body.category, body.monthly_budget_cents)
    except DuplicateGoal:
        raise HTTPException(status.HTTP_409_CONFLICT, detail=f"A budget for {body.category!r} already exists") from None
    (progress,) = services.goal_progress([goal], repo.transactions_for(customer.id), today)
    return _goal_out(progress)


_PRESET_LABELS = {Period.D7: "Last 7 days", Period.D30: "Last 30 days", Period.D90: "Last 90 days", Period.Y1: "Last year"}


@router.get("/{customer_id}/filters")
def available_filters(customer: CurrentCustomer, repo: Repo) -> Filters:
    return Filters(
        categories=[CategoryFilter(name=c, color=m.color, icon=m.icon) for c, m in repo.categories_for(customer.id).items()],
        date_range_presets=[DateRangePreset(label=label, value=p) for p, label in _PRESET_LABELS.items()],
        payment_methods=list(PaymentMethod),
        icons=list(CATEGORY_ICONS),
        colors=list(CATEGORY_COLORS),
    )


@router.post("/{customer_id}/categories", status_code=status.HTTP_201_CREATED, summary="Add a category")
def create_category(customer: CurrentCustomer, repo: Repo, body: CategoryCreate) -> CategoryFilter:
    if body.icon not in CATEGORY_ICONS:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, detail=f"Unknown icon {body.icon!r}")
    meta = CategoryMeta(color=body.color.lower(), icon=body.icon)
    try:
        repo.add_category(customer.id, body.name, meta)
    except DuplicateCategory:
        raise HTTPException(status.HTTP_409_CONFLICT, detail=f"Category {body.name!r} already exists") from None
    return CategoryFilter(name=body.name, color=meta.color, icon=meta.icon)
