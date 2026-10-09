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

Deployment is defined in `template.yaml` (AWS SAM) and `samconfig.toml` (stack name,
region `us-east-1`, AWS profile `personal`). The Lambda is arm64, Python 3.11, with a
public Function URL and CORS handled by the app.

```sh
# After changing dependencies: regenerate the requirements file SAM packages from.
poetry run python scripts/export_requirements.py

sam build                 # builds inside a Lambda-like container (needs Docker)
sam local invoke ApiFunction --event <event.json>
sam deploy                # first deploy creates the stack
sam deploy --parameter-overrides CorsOrigins=https://xxxx.cloudfront.net DatabaseUrl=postgresql+asyncpg://...
```

The `ApiUrl` stack output is the value for the client's `NEXT_PUBLIC_API_URL`.
