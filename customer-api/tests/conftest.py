from collections.abc import Iterator
from datetime import date

import pytest
from fastapi.testclient import TestClient

from customer_api.main import create_app
from customer_api.settings import Settings

# Pinning "today" makes every rolling period, and therefore the generated dataset, reproducible.
TODAY = date(2024, 9, 16)
CUSTOMER_ID = "10001"


@pytest.fixture(scope="session")
def client() -> Iterator[TestClient]:
    app = create_app(Settings(mock_seed=1, mock_today=TODAY, cors_origins=["http://localhost:3000"]))
    with TestClient(app) as c:
        yield c
