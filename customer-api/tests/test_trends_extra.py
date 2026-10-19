"""Category-split trends and weekday aggregation."""

from datetime import UTC, date, datetime

from fastapi.testclient import TestClient

from customer_api import services
from customer_api.domain import DateRange, PaymentMethod, Transaction

from .conftest import CUSTOMER_ID

BASE = f"/api/customers/{CUSTOMER_ID}/spending"
TODAY = date(2024, 9, 16)


def txn(day: date, cents: int, category: str = "Groceries") -> Transaction:
    return Transaction(
        id="t",
        customer_id="c",
        occurred_at=datetime(day.year, day.month, day.day, 12, tzinfo=UTC),
        merchant="m",
        category=category,
        amount_cents=cents,
        description="",
        payment_method=PaymentMethod.EFT,
    )


def test_monthly_by_category_splits_and_zero_fills() -> None:
    txns = [txn(date(2024, 9, 1), 100, "Dining"), txn(date(2024, 9, 2), 300, "Groceries"), txn(date(2024, 7, 10), 50, "Dining")]
    rows = services.monthly_trends_by_category(txns, months=3, today=TODAY)
    assert [r.month for r in rows] == ["2024-07", "2024-08", "2024-09"]
    assert rows[0].by_category == {"Dining": 50}
    assert rows[1].by_category == {} and rows[1].total_cents == 0
    assert rows[2].by_category == {"Dining": 100, "Groceries": 300} and rows[2].total_cents == 400


def test_weekday_totals_average_over_occurrences() -> None:
    # Mon 2 Sep .. Sun 15 Sep 2024: exactly two weeks, so every weekday occurs twice.
    window = DateRange(start=date(2024, 9, 2), end=date(2024, 9, 15))
    txns = [txn(date(2024, 9, 2), 1_000), txn(date(2024, 9, 9), 3_000), txn(date(2024, 9, 7), 500)]  # Mon, Mon, Sat
    rows = services.weekday_totals(txns, window)
    assert [r.weekday for r in rows][:2] == ["Monday", "Tuesday"]
    monday, saturday = rows[0], rows[5]
    assert (monday.total_cents, monday.transaction_count, monday.days, monday.average_per_day) == (4_000, 2, 2, 20.0)
    assert (saturday.total_cents, saturday.days, saturday.average_per_day) == (500, 2, 2.5)
    assert rows[1].average_per_day == 0.0


def test_weekday_occurrences_handle_partial_weeks() -> None:
    # Mon 2 Sep .. Wed 11 Sep: Mon/Tue/Wed occur twice, the rest once.
    rows = services.weekday_totals([], DateRange(start=date(2024, 9, 2), end=date(2024, 9, 11)))
    assert [r.days for r in rows] == [2, 2, 2, 1, 1, 1, 1]


def test_category_trends_endpoint(client: TestClient) -> None:
    body = client.get(f"{BASE}/trends/categories", params={"months": 6}).json()
    assert [t["month"] for t in body["trends"]][-1] == "2024-09"
    assert len(body["trends"]) == 6
    names = [c["name"] for c in body["categories"]]
    assert "Groceries" in names and all(c["color"].startswith("#") for c in body["categories"])
    for t in body["trends"]:
        assert round(sum(t["categories"].values()), 2) == t["totalSpent"]
    assert client.get(f"{BASE}/trends/categories", params={"months": 25}).status_code == 422


def test_weekday_endpoint(client: TestClient) -> None:
    body = client.get(f"{BASE}/weekdays", params={"months": 3}).json()
    assert body["dateRange"] == {"startDate": "2024-07-01", "endDate": "2024-09-16"}
    assert [w["weekday"] for w in body["weekdays"]] == [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ]
    assert all(w["averagePerDay"] >= 0 for w in body["weekdays"])
    assert sum(w["transactionCount"] for w in body["weekdays"]) > 0
