"""POST /api/customers/{id}/transactions appends to the in-memory store."""

from fastapi.testclient import TestClient

from .conftest import CUSTOMER_ID

URL = f"/api/customers/{CUSTOMER_ID}/transactions"

VALID = {
    "merchant": "  Kauai ",
    "category": "Dining",
    "amount": 89.5,
    "date": "2024-09-16T12:30:00Z",
    "description": "Lunch",
    "paymentMethod": "Credit Card",
}


def test_creates_and_lists_the_transaction(client: TestClient) -> None:
    before = client.get(URL, params={"limit": 1}).json()["pagination"]["total"]
    summary_before = client.get(f"/api/customers/{CUSTOMER_ID}/spending/summary", params={"period": "7d"}).json()

    response = client.post(URL, json=VALID)
    assert response.status_code == 201, response.text
    created = response.json()
    assert created["id"].startswith("txn_")
    assert created["merchant"] == "Kauai"  # trimmed
    assert created["amount"] == 89.5
    assert created["category"] == "Dining"
    assert created["icon"] == "utensils"
    assert created["date"] == "2024-09-16T12:30:00Z"

    page = client.get(URL, params={"limit": 3}).json()
    assert page["pagination"]["total"] == before + 1
    assert created["id"] in {t["id"] for t in page["transactions"]}  # newest-first, so on the first page

    summary_after = client.get(f"/api/customers/{CUSTOMER_ID}/spending/summary", params={"period": "7d"}).json()
    assert summary_after["transactionCount"] == summary_before["transactionCount"] + 1
    assert round(summary_after["totalSpent"] - summary_before["totalSpent"], 2) == 89.5


def test_date_defaults_to_now_and_naive_dates_are_utc(client: TestClient) -> None:
    created = client.post(URL, json={**VALID, "date": None}).json()
    assert created["date"].endswith("Z")
    created = client.post(URL, json={**VALID, "date": "2024-09-10T08:00:00"}).json()
    assert created["date"] == "2024-09-10T08:00:00Z"


def test_rejects_bad_input(client: TestClient) -> None:
    assert client.post(URL, json={**VALID, "amount": 0}).status_code == 422
    assert client.post(URL, json={**VALID, "amount": 12.345}).status_code == 422
    assert client.post(URL, json={**VALID, "merchant": "   "}).status_code == 422
    assert client.post(URL, json={**VALID, "category": "Crypto"}).status_code == 422
    assert client.post(URL, json={**VALID, "paymentMethod": "Cash"}).status_code == 422
    assert client.post(URL, json={**VALID, "date": "2030-01-01T00:00:00Z"}).status_code == 422
    assert client.post("/api/customers/nope/transactions", json=VALID).status_code == 404


def test_filters_list_payment_methods(client: TestClient) -> None:
    body = client.get(f"/api/customers/{CUSTOMER_ID}/filters").json()
    assert "Credit Card" in body["paymentMethods"]
    assert len(body["paymentMethods"]) == 5
