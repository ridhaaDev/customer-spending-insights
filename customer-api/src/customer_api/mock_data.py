"""Deterministic mock dataset.

The brief calls for mocked data. Rather than a static fixture, this generates a realistic
South African spending history for a handful of customer personas from a fixed seed, so the
same seed always produces the same transactions and the data always ends "today".
"""

from __future__ import annotations

import calendar
import random
from dataclasses import dataclass, field
from datetime import UTC, date, datetime, timedelta

from customer_api.domain import AccountType, Category, Customer, Goal, PaymentMethod, Transaction

MONTHS_OF_HISTORY = 24

CARD = (PaymentMethod.CREDIT_CARD, PaymentMethod.DEBIT_CARD)


@dataclass(frozen=True, slots=True)
class Merchant:
    name: str
    category: Category
    min_cents: int
    max_cents: int
    description: str
    payment_methods: tuple[PaymentMethod, ...] = CARD
    # Set for subscriptions/bills: charged once a month on this day at a fixed amount (max_cents).
    recurring_day: int | None = None


MERCHANTS: tuple[Merchant, ...] = (
    # Groceries
    Merchant("Pick n Pay", Category.GROCERIES, 15_000, 180_000, "Groceries"),
    Merchant("Checkers", Category.GROCERIES, 12_000, 160_000, "Groceries"),
    Merchant("Woolworths Food", Category.GROCERIES, 9_000, 120_000, "Groceries"),
    Merchant("Spar", Category.GROCERIES, 6_000, 70_000, "Top-up shop"),
    Merchant("Food Lover's Market", Category.GROCERIES, 20_000, 110_000, "Fresh produce"),
    # Entertainment
    Merchant("Netflix", Category.ENTERTAINMENT, 19_900, 19_900, "Monthly subscription", (PaymentMethod.DEBIT_ORDER,), 1),
    Merchant("Spotify", Category.ENTERTAINMENT, 6_499, 6_499, "Monthly subscription", (PaymentMethod.DEBIT_ORDER,), 5),
    Merchant("DStv", Category.ENTERTAINMENT, 47_900, 47_900, "DStv Compact", (PaymentMethod.DEBIT_ORDER,), 1),
    Merchant("Showmax", Category.ENTERTAINMENT, 9_900, 9_900, "Monthly subscription", (PaymentMethod.CREDIT_CARD,), 10),
    Merchant("Ster-Kinekor", Category.ENTERTAINMENT, 9_500, 42_000, "Movie tickets"),
    Merchant("Steam", Category.ENTERTAINMENT, 9_900, 89_900, "Game purchase", (PaymentMethod.CREDIT_CARD,)),
    Merchant("Kirstenbosch Gardens", Category.ENTERTAINMENT, 10_000, 30_000, "Sunset concert"),
    # Transportation
    Merchant("Uber", Category.TRANSPORTATION, 4_500, 32_000, "Ride"),
    Merchant("Bolt", Category.TRANSPORTATION, 3_500, 28_000, "Ride"),
    Merchant("Shell", Category.TRANSPORTATION, 40_000, 110_000, "Fuel"),
    Merchant("Engen", Category.TRANSPORTATION, 35_000, 105_000, "Fuel"),
    Merchant("Gautrain", Category.TRANSPORTATION, 3_000, 22_000, "Train fare"),
    Merchant("MyCiTi", Category.TRANSPORTATION, 1_500, 8_000, "Bus fare"),
    # Dining
    Merchant("Nando's", Category.DINING, 8_500, 42_000, "Takeaway"),
    Merchant("Ocean Basket", Category.DINING, 18_000, 65_000, "Dinner"),
    Merchant("Vida e Caffè", Category.DINING, 3_200, 12_000, "Coffee"),
    Merchant("Mugg & Bean", Category.DINING, 7_000, 28_000, "Breakfast"),
    Merchant("Uber Eats", Category.DINING, 12_000, 45_000, "Food delivery"),
    Merchant("Kauai", Category.DINING, 6_500, 21_000, "Lunch"),
    Merchant("Steers", Category.DINING, 6_000, 22_000, "Takeaway"),
    # Shopping
    Merchant("Takealot", Category.SHOPPING, 15_000, 250_000, "Online order", (*CARD, PaymentMethod.INSTANT_EFT)),
    Merchant("Mr Price", Category.SHOPPING, 12_000, 90_000, "Clothing"),
    Merchant("Zara", Category.SHOPPING, 35_000, 220_000, "Clothing"),
    Merchant("Clicks", Category.SHOPPING, 6_000, 65_000, "Pharmacy & toiletries"),
    Merchant("Dis-Chem", Category.SHOPPING, 7_000, 80_000, "Pharmacy"),
    Merchant("Superbalist", Category.SHOPPING, 25_000, 180_000, "Online order", (*CARD, PaymentMethod.INSTANT_EFT)),
    Merchant("Cotton On", Category.SHOPPING, 15_000, 70_000, "Clothing"),
    # Utilities
    Merchant("City of Cape Town", Category.UTILITIES, 120_000, 240_000, "Municipal account", (PaymentMethod.EFT,), 15),
    Merchant("Vodacom", Category.UTILITIES, 59_900, 59_900, "Mobile contract", (PaymentMethod.DEBIT_ORDER,), 25),
    Merchant("Afrihost", Category.UTILITIES, 89_700, 89_700, "Fibre", (PaymentMethod.DEBIT_ORDER,), 1),
    Merchant("Eskom Prepaid", Category.UTILITIES, 20_000, 80_000, "Prepaid electricity"),
    Merchant("MTN", Category.UTILITIES, 5_000, 30_000, "Airtime & data"),
)


@dataclass(frozen=True, slots=True)
class Persona:
    customer: Customer
    # Relative likelihood of each category for ad-hoc (non-recurring) transactions.
    weights: dict[Category, float]
    # Mean ad-hoc transactions per month and a multiplier on amounts.
    monthly_transactions: int
    spend_level: float
    subscriptions: tuple[str, ...]
    # Categories this customer has set a monthly budget for.
    goal_categories: tuple[Category, ...] = field(default_factory=tuple)


def _personas(today: date) -> list[Persona]:
    joined = lambda months_ago: (today.replace(day=1) - timedelta(days=30 * months_ago)).replace(day=15)  # noqa: E731
    return [
        Persona(
            Customer("10001", "Thandi Mokoena", "thandi.mokoena@example.com", joined(30), AccountType.PREMIUM),
            {
                Category.GROCERIES: 30,
                Category.DINING: 18,
                Category.SHOPPING: 16,
                Category.TRANSPORTATION: 20,
                Category.ENTERTAINMENT: 8,
                Category.UTILITIES: 8,
            },
            42,
            1.15,
            ("Netflix", "Spotify", "Vodacom", "Afrihost", "City of Cape Town"),
            (Category.GROCERIES, Category.DINING, Category.ENTERTAINMENT),
        ),
        Persona(
            Customer("10002", "Johan van der Merwe", "johan.vdm@example.com", joined(48), AccountType.STANDARD),
            {
                Category.GROCERIES: 34,
                Category.DINING: 10,
                Category.SHOPPING: 10,
                Category.TRANSPORTATION: 28,
                Category.ENTERTAINMENT: 6,
                Category.UTILITIES: 12,
            },
            34,
            0.9,
            ("DStv", "Vodacom", "City of Cape Town"),
            (Category.TRANSPORTATION, Category.GROCERIES),
        ),
        Persona(
            Customer("10003", "Priya Naidoo", "priya.naidoo@example.com", joined(14), AccountType.PREMIUM),
            {
                Category.GROCERIES: 22,
                Category.DINING: 24,
                Category.SHOPPING: 24,
                Category.TRANSPORTATION: 14,
                Category.ENTERTAINMENT: 12,
                Category.UTILITIES: 4,
            },
            55,
            1.35,
            ("Netflix", "Showmax", "Spotify", "Afrihost"),
            (Category.SHOPPING, Category.DINING, Category.ENTERTAINMENT, Category.TRANSPORTATION),
        ),
        Persona(
            Customer("10004", "Sipho Dlamini", "sipho.dlamini@example.com", joined(8), AccountType.STANDARD),
            {
                Category.GROCERIES: 28,
                Category.DINING: 22,
                Category.SHOPPING: 12,
                Category.TRANSPORTATION: 22,
                Category.ENTERTAINMENT: 10,
                Category.UTILITIES: 6,
            },
            38,
            0.75,
            ("Spotify", "Vodacom"),
            (Category.DINING, Category.TRANSPORTATION),
        ),
        Persona(
            Customer("10005", "Aisha Patel", "aisha.patel@example.com", joined(60), AccountType.BUSINESS),
            {
                Category.GROCERIES: 18,
                Category.DINING: 26,
                Category.SHOPPING: 14,
                Category.TRANSPORTATION: 26,
                Category.ENTERTAINMENT: 6,
                Category.UTILITIES: 10,
            },
            64,
            1.6,
            ("Netflix", "DStv", "Vodacom", "Afrihost", "City of Cape Town"),
            (Category.DINING, Category.TRANSPORTATION, Category.SHOPPING),
        ),
        Persona(
            Customer("10006", "Liam O'Connor", "liam.oconnor@example.com", joined(20), AccountType.STANDARD),
            {
                Category.GROCERIES: 26,
                Category.DINING: 14,
                Category.SHOPPING: 10,
                Category.TRANSPORTATION: 10,
                Category.ENTERTAINMENT: 30,
                Category.UTILITIES: 10,
            },
            30,
            0.95,
            ("Netflix", "Showmax", "Spotify", "DStv", "Afrihost"),
            (Category.ENTERTAINMENT, Category.GROCERIES),
        ),
    ]


def _weighted_category(rng: random.Random, weights: dict[Category, float]) -> Category:
    return rng.choices(list(weights), weights=list(weights.values()), k=1)[0]


def _seasonal_multiplier(month: int, category: Category) -> float:
    # December shopping/dining spike, January slump.
    if month == 12 and category in (Category.SHOPPING, Category.DINING, Category.ENTERTAINMENT):
        return 1.35
    if month == 1 and category in (Category.SHOPPING, Category.DINING):
        return 0.8
    return 1.0


@dataclass(frozen=True, slots=True)
class Dataset:
    customers: list[Customer]
    transactions: list[Transaction]
    goals: list[Goal]


def generate_dataset(seed: int, today: date, months: int = MONTHS_OF_HISTORY) -> Dataset:
    rng = random.Random(seed)
    merchants_by_category: dict[Category, list[Merchant]] = {c: [] for c in Category}
    recurring: dict[str, Merchant] = {}
    for m in MERCHANTS:
        if m.recurring_day is None:
            merchants_by_category[m.category].append(m)
        else:
            recurring[m.name] = m

    first_month = (today.replace(day=1) - timedelta(days=1)).replace(day=1)
    for _ in range(months - 2):
        first_month = (first_month - timedelta(days=1)).replace(day=1)

    customers: list[Customer] = []
    transactions: list[Transaction] = []
    goals: list[Goal] = []
    txn_seq = 0
    goal_seq = 0

    def new_txn(customer: Customer, merchant: Merchant, day: date, cents: int) -> Transaction:
        nonlocal txn_seq
        txn_seq += 1
        when = datetime(day.year, day.month, day.day, rng.randint(6, 22), rng.randint(0, 59), tzinfo=UTC)
        return Transaction(
            id=f"txn_{txn_seq:06d}",
            customer_id=customer.id,
            occurred_at=when,
            merchant=merchant.name,
            category=merchant.category,
            amount_cents=cents,
            description=merchant.description,
            payment_method=rng.choice(merchant.payment_methods),
        )

    for persona in _personas(today):
        customer = persona.customer
        customers.append(customer)
        customer_txns: list[Transaction] = []

        month_start = first_month
        while month_start <= today:
            days_in_month = calendar.monthrange(month_start.year, month_start.month)[1]
            last_day = (
                min(days_in_month, today.day)
                if month_start.month == today.month and month_start.year == today.year
                else days_in_month
            )

            for name in persona.subscriptions:
                merchant = recurring[name]
                assert merchant.recurring_day is not None
                if merchant.recurring_day <= last_day:
                    cents = rng.randint(merchant.min_cents, merchant.max_cents)
                    customer_txns.append(new_txn(customer, merchant, month_start.replace(day=merchant.recurring_day), cents))

            # Ad-hoc spending, scaled to the portion of the month that has elapsed.
            expected = persona.monthly_transactions * last_day / days_in_month
            count = max(0, round(rng.gauss(expected, expected * 0.15)))
            for _ in range(count):
                category = _weighted_category(rng, persona.weights)
                merchant = rng.choice(merchants_by_category[category])
                scale = persona.spend_level * _seasonal_multiplier(month_start.month, category)
                # Triangular skews towards the lower end, like real card spend.
                cents = int(rng.triangular(merchant.min_cents, merchant.max_cents, merchant.min_cents * 1.5) * scale)
                day = month_start.replace(day=rng.randint(1, last_day))
                customer_txns.append(new_txn(customer, merchant, day, max(cents, 500)))

            month_start = (month_start + timedelta(days=days_in_month)).replace(day=1)

        # Budgets are derived from the persona's own history so some are comfortably met and others blown.
        recent_cutoff = today - timedelta(days=180)
        for category in persona.goal_categories:
            recent = sum(t.amount_cents for t in customer_txns if t.category == category and t.occurred_on >= recent_cutoff)
            avg_month = recent / 6
            budget = int(round(avg_month * rng.uniform(0.85, 1.3) / 5_000) * 5_000)
            goal_seq += 1
            goals.append(
                Goal(
                    id=f"goal_{goal_seq:03d}",
                    customer_id=customer.id,
                    category=category,
                    monthly_budget_cents=max(budget, 50_000),
                )
            )

        transactions.extend(customer_txns)

    return Dataset(customers=customers, transactions=transactions, goals=goals)
