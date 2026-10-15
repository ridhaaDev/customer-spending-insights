"""Contract tests against the HTTP API with the seeded mock dataset."""

from fastapi.testclient import TestClient

from customer_api.domain import Category

from .conftest import CUSTOMER_ID, TODAY

BASE = f"/api/customers/{CUSTOMER_ID}"


def test_list_customers(client: TestClient) -> None:
    body = client.get("/api/customers").json()
    assert len(body["customers"]) >= 5
    assert {"customerId", "name", "email", "accountType"} <= body["customers"][0].keys()


def test_unknown_customer_is_404(client: TestClient) -> None:
    response = client.get("/api/customers/nope/profile")
    assert response.status_code == 404
    assert "nope" in response.json()["detail"]


def test_profile(client: TestClient) -> None:
    body = client.get(f"{BASE}/profile").json()
    assert body["customerId"] == CUSTOMER_ID
    assert body["currency"] == "ZAR"
    assert body["totalSpent"] > 0
    assert body["accountType"] in {"standard", "premium", "business"}


def test_summary_defaults_to_30d(client: TestClient) -> None:
    body = client.get(f"{BASE}/spending/summary").json()
    assert body["period"] == "30d"
    assert body["transactionCount"] > 0
    assert body["averageTransaction"] == round(body["totalSpent"] / body["transactionCount"], 2)
    assert body["topCategory"] in {c.value for c in Category}
    assert {"spentChange", "transactionChange"} == body["comparedToPrevious"].keys()


def test_summary_rejects_unknown_period(client: TestClient) -> None:
    assert client.get(f"{BASE}/spending/summary", params={"period": "2d"}).status_code == 422


def test_categories_default_window(client: TestClient) -> None:
    body = client.get(f"{BASE}/spending/categories").json()
    assert body["dateRange"] == {"startDate": "2024-08-18", "endDate": "2024-09-16"}
    cats = body["categories"]
    assert cats == sorted(cats, key=lambda c: c["amount"], reverse=True)
    assert abs(sum(c["percentage"] for c in cats) - 100) < 1
    assert round(sum(c["amount"] for c in cats), 2) == body["totalAmount"]
    assert all(c["color"].startswith("#") and c["icon"] for c in cats)


def test_categories_custom_range(client: TestClient) -> None:
    body = client.get(f"{BASE}/spending/categories", params={"startDate": "2024-01-01", "endDate": "2024-01-31"}).json()
    assert body["dateRange"] == {"startDate": "2024-01-01", "endDate": "2024-01-31"}


def test_categories_half_range_is_422(client: TestClient) -> None:
    assert client.get(f"{BASE}/spending/categories", params={"startDate": "2024-01-01"}).status_code == 422


def test_trends(client: TestClient) -> None:
    body = client.get(f"{BASE}/spending/trends", params={"months": 6}).json()
    months = [t["month"] for t in body["trends"]]
    assert months == ["2024-04", "2024-05", "2024-06", "2024-07", "2024-08", "2024-09"]
    assert all(t["totalSpent"] > 0 for t in body["trends"])
    assert client.get(f"{BASE}/spending/trends", params={"months": 25}).status_code == 422


def test_transactions_pagination_and_sorting(client: TestClient) -> None:
    first = client.get(f"{BASE}/transactions", params={"limit": 5}).json()
    assert len(first["transactions"]) == 5
    assert first["pagination"]["hasMore"] is True
    dates = [t["date"] for t in first["transactions"]]
    assert dates == sorted(dates, reverse=True)
    assert dates[0].startswith(TODAY.isoformat()) or dates[0] < TODAY.isoformat() + "T23:59:59"

    second = client.get(f"{BASE}/transactions", params={"limit": 5, "offset": 5}).json()
    assert {t["id"] for t in first["transactions"]}.isdisjoint({t["id"] for t in second["transactions"]})

    by_amount = client.get(f"{BASE}/transactions", params={"sortBy": "amount_desc", "limit": 3}).json()
    amounts = [t["amount"] for t in by_amount["transactions"]]
    assert amounts == sorted(amounts, reverse=True)


def test_transactions_category_filter(client: TestClient) -> None:
    body = client.get(f"{BASE}/transactions", params={"category": "Dining", "limit": 100}).json()
    assert body["transactions"]
    assert all(t["category"] == "Dining" and t["icon"] == "utensils" for t in body["transactions"])
    assert client.get(f"{BASE}/transactions", params={"category": "Crypto"}).status_code == 422
    assert client.get(f"{BASE}/transactions", params={"limit": 101}).status_code == 422


def test_goals(client: TestClient) -> None:
    body = client.get(f"{BASE}/goals").json()
    assert body["goals"]
    for g in body["goals"]:
        assert g["status"] in {"on_track", "warning", "exceeded"}
        assert g["daysRemaining"] == 14
        assert g["percentageUsed"] == round(g["currentSpent"] / g["monthlyBudget"] * 100, 2)


def test_filters(client: TestClient) -> None:
    body = client.get(f"{BASE}/filters").json()
    assert [c["name"] for c in body["categories"]] == [c.value for c in Category]
    assert [p["value"] for p in body["dateRangePresets"]] == ["7d", "30d", "90d", "1y"]


def test_cors_allows_configured_origin(client: TestClient) -> None:
    response = client.get("/health", headers={"Origin": "http://localhost:3000"})
    assert response.headers["access-control-allow-origin"] == "http://localhost:3000"
