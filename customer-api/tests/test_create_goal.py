"""POST /api/customers/{id}/goals sets a monthly budget for a category."""

from fastapi.testclient import TestClient

from .conftest import CUSTOMER_ID

URL = f"/api/customers/{CUSTOMER_ID}/goals"


def test_creates_a_budget_with_current_progress(client: TestClient) -> None:
    before = {g["category"] for g in client.get(URL).json()["goals"]}
    assert "Transportation" not in before

    response = client.post(URL, json={"category": "Transportation", "monthlyBudget": 2500})
    assert response.status_code == 201, response.text
    goal = response.json()
    assert goal["id"].startswith("goal_")
    assert goal["category"] == "Transportation"
    assert goal["monthlyBudget"] == 2500.0
    assert goal["currentSpent"] > 0  # the seeded customer spends on transport this month
    assert goal["percentageUsed"] == round(goal["currentSpent"] / 2500 * 100, 2)
    assert goal["daysRemaining"] == 14
    assert goal["status"] in {"on_track", "warning", "exceeded"}

    after = client.get(URL).json()["goals"]
    assert after[-1]["id"] == goal["id"]


def test_rejects_duplicates_unknown_categories_and_bad_amounts(client: TestClient) -> None:
    assert client.post(URL, json={"category": "Groceries", "monthlyBudget": 100}).status_code == 409  # seeded goal
    assert client.post(URL, json={"category": "Crypto", "monthlyBudget": 100}).status_code == 422
    assert client.post(URL, json={"category": "Utilities", "monthlyBudget": 0}).status_code == 422
    assert client.post(URL, json={"category": "Utilities", "monthlyBudget": 12.345}).status_code == 422
    assert client.post("/api/customers/nope/goals", json={"category": "Utilities", "monthlyBudget": 100}).status_code == 404


def test_new_category_can_be_budgeted(client: TestClient) -> None:
    client.post(f"/api/customers/{CUSTOMER_ID}/categories", json={"name": "Fitness", "color": "#1baf7a", "icon": "heart-pulse"})
    response = client.post(URL, json={"category": "Fitness", "monthlyBudget": 800})
    assert response.status_code == 201
    assert response.json()["currentSpent"] == 0
    assert response.json()["status"] == "on_track"
