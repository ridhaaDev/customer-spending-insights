# customer-api

FastAPI backend for Customer Spending Insights.

## Setup

```sh
poetry install
```

## Run

```sh
poetry run fastapi dev src/customer_api/main.py
```

API docs are served at http://127.0.0.1:8000/docs.

## Configuration

Read from environment variables (or a local `.env`):

| Variable       | Example                                   | Notes                                  |
|----------------|-------------------------------------------|----------------------------------------|
| `DATABASE_URL` | `postgresql+asyncpg://user:pw@host/db`    | Optional until the DB layer is added   |
| `CORS_ORIGINS` | `http://localhost:3000,https://app.example` | Comma-separated list of allowed origins |

## Test

```sh
poetry run pytest
```

## AWS Lambda

`customer_api.main.handler` wraps the app with [Mangum](https://github.com/jordaneremieff/mangum)
for API Gateway / Lambda Function URL events.
