"""Data access. The API only depends on the `CustomerRepository` protocol, so the in-memory
implementation backed by the mock dataset can be replaced by a database-backed one later."""

from __future__ import annotations

import threading
from collections import defaultdict
from dataclasses import dataclass
from datetime import date, datetime
from typing import Protocol

from customer_api.domain import Category, Customer, Goal, PaymentMethod, Transaction
from customer_api.mock_data import Dataset, generate_dataset


class CustomerRepository(Protocol):
    def list_customers(self) -> list[Customer]: ...

    def get_customer(self, customer_id: str) -> Customer | None: ...

    def transactions_for(self, customer_id: str) -> list[Transaction]:
        """All transactions for a customer, newest first."""
        ...

    def add_transaction(self, transaction: NewTransaction) -> Transaction:
        """Stores a new transaction and returns it with its assigned id."""
        ...

    def goals_for(self, customer_id: str) -> list[Goal]: ...


@dataclass(frozen=True, slots=True)
class NewTransaction:
    """A transaction before the repository assigns its id."""

    customer_id: str
    occurred_at: datetime
    merchant: str
    category: Category
    amount_cents: int
    description: str
    payment_method: PaymentMethod


class InMemoryRepository:
    def __init__(self, dataset: Dataset) -> None:
        self._customers = {c.id: c for c in dataset.customers}
        by_customer: dict[str, list[Transaction]] = defaultdict(list)
        for t in dataset.transactions:
            by_customer[t.customer_id].append(t)
        self._transactions = {cid: sorted(ts, key=lambda t: t.occurred_at, reverse=True) for cid, ts in by_customer.items()}
        goals: dict[str, list[Goal]] = defaultdict(list)
        for g in dataset.goals:
            goals[g.customer_id].append(g)
        self._goals = dict(goals)
        self._next_id = len(dataset.transactions) + 1
        self._lock = threading.Lock()

    def list_customers(self) -> list[Customer]:
        return list(self._customers.values())

    def get_customer(self, customer_id: str) -> Customer | None:
        return self._customers.get(customer_id)

    def transactions_for(self, customer_id: str) -> list[Transaction]:
        return self._transactions.get(customer_id, [])

    def add_transaction(self, new: NewTransaction) -> Transaction:
        with self._lock:
            transaction = Transaction(
                id=f"txn_{self._next_id:06d}",
                customer_id=new.customer_id,
                occurred_at=new.occurred_at,
                merchant=new.merchant,
                category=new.category,
                amount_cents=new.amount_cents,
                description=new.description,
                payment_method=new.payment_method,
            )
            self._next_id += 1
            # Lists are read without the lock, so swap in a new sorted list instead of mutating in place.
            current = self._transactions.get(new.customer_id, [])
            self._transactions[new.customer_id] = sorted([*current, transaction], key=lambda t: t.occurred_at, reverse=True)
        return transaction

    def goals_for(self, customer_id: str) -> list[Goal]:
        return self._goals.get(customer_id, [])


class MockRepositoryProvider:
    """Serves an `InMemoryRepository` generated for the current date.

    The mock history always ends "today", so a process that lives across midnight regenerates
    on first use the next day; otherwise the rolling windows would drift away from the data.
    """

    def __init__(self, seed: int, today_override: date | None = None) -> None:
        self._seed = seed
        self._today_override = today_override
        self._lock = threading.Lock()
        self._repo: InMemoryRepository | None = None
        self._generated_for: date | None = None

    def current(self) -> tuple[InMemoryRepository, date]:
        today = self._today_override or date.today()
        if self._repo is None or self._generated_for != today:
            with self._lock:
                if self._repo is None or self._generated_for != today:
                    self._repo = InMemoryRepository(generate_dataset(seed=self._seed, today=today))
                    self._generated_for = today
        assert self._repo is not None
        return self._repo, today
