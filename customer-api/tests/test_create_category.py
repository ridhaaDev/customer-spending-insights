"""POST /api/customers/{id}/categories adds a per-customer category usable by new transactions."""

from fastapi.testclient import TestClient

from .conftest import CUSTOMER_ID

URL = f"/api/customers/{CUSTOMER_ID}/categories"
FILTERS = f"/api/customers/{CUSTOMER_ID}/filters"
TRANSACTIONS = f"/api/customers/{CUSTOMER_ID}/transactions"

VALID = {"name": " Pets ", "color": "#E34948", "icon": "paw-print"}


def test_creates_and_lists_the_category(client: TestClient) -> None:
    before = [c["name"] for c in client.get(FILTERS).json()["categories"]]

    response = client.post(URL, json=VALID)
    assert response.status_code == 201, response.text
    assert response.json() == {"name": "Pets", "color": "#e34948", "icon": "paw-print"}

    after = client.get(FILTERS).json()["categories"]
    assert [c["name"] for c in after] == [*before, "Pets"]
    assert after[-1] == {"name": "Pets", "color": "#e34948", "icon": "paw-print"}


def test_new_category_can_be_used_by_transactions_and_filters(client: TestClient) -> None:
    client.post(URL, json={"name": "Garden", "color": "#008300", "icon": "house"})
    created = client.post(
        TRANSACTIONS,
        json={"merchant": "Stodels", "category": "Garden", "amount": 250, "paymentMethod": "EFT", "date": "2024-09-15T10:00:00Z"},
    )
    assert created.status_code == 201, created.text
    assert created.json()["icon"] == "house"
    assert created.json()["categoryColor"] == "#008300"

    listed = client.get(TRANSACTIONS, params={"category": "Garden"}).json()
    assert [t["merchant"] for t in listed["transactions"]] == ["Stodels"]

    by_category = client.get(f"/api/customers/{CUSTOMER_ID}/spending/categories", params={"period": "7d"}).json()
    assert any(c["name"] == "Garden" and c["icon"] == "house" for c in by_category["categories"])


def test_categories_are_per_customer(client: TestClient) -> None:
    client.post(URL, json={"name": "Hobbies", "color": "#4a3aa7", "icon": "gift"})
    other = client.get("/api/customers/10002/filters").json()["categories"]
    assert "Hobbies" not in [c["name"] for c in other]
    body = {"merchant": "x", "category": "Hobbies", "amount": 1, "paymentMethod": "EFT"}
    assert client.post("/api/customers/10002/transactions", json=body).status_code == 422


def test_rejects_duplicates_and_bad_input(client: TestClient) -> None:
    assert client.post(URL, json={**VALID, "name": "Travel"}).status_code == 201
    assert client.post(URL, json={**VALID, "name": "travel"}).status_code == 409
    assert client.post(URL, json={**VALID, "name": "Dining"}).status_code == 409
    assert client.post(URL, json={**VALID, "name": "   "}).status_code == 422
    assert client.post(URL, json={**VALID, "color": "red"}).status_code == 422
    assert client.post(URL, json={**VALID, "icon": "rocket"}).status_code == 422
    assert client.post("/api/customers/nope/categories", json=VALID).status_code == 404


def test_filters_offer_icons_and_colours(client: TestClient) -> None:
    body = client.get(FILTERS).json()
    assert "paw-print" in body["icons"] and "shopping-cart" in body["icons"]
    assert len(body["colors"]) == 8 and all(c.startswith("#") for c in body["colors"])
