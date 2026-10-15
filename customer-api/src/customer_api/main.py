from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

from customer_api.repository import MockRepositoryProvider
from customer_api.routes import router
from customer_api.settings import Settings, get_settings


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings or get_settings()

    app = FastAPI(
        title="Customer Spending Insights API",
        version="0.1.0",
        description="Spending analytics for a customer's (mocked) transaction history.",
    )
    # Built at import time (not in a lifespan hook) so Lambda generates the dataset once per
    # container rather than on every invocation. The provider regenerates if the calendar date
    # moves on, keeping "today" and the data consistent in long-running processes.
    app.state.repository_provider = MockRepositoryProvider(seed=settings.mock_seed, today_override=settings.mock_today)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_methods=["GET"],
        allow_headers=["*"],
    )
    app.include_router(router)

    @app.get("/health", tags=["ops"])
    def health() -> dict[str, str]:
        return {"status": "ok"}

    return app


app = create_app()

# AWS Lambda entrypoint. Lambda is configured to call `customer_api.main.handler`.
handler = Mangum(app, lifespan="off")
