# syntax=docker/dockerfile:1

FROM python:3.11-slim AS base
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    POETRY_VIRTUALENVS_CREATE=false \
    POETRY_NO_INTERACTION=1
WORKDIR /app

# Install dependencies from the lockfile first so this layer caches.
FROM base AS deps
RUN pip install --no-cache-dir "poetry>=2.0,<3.0"
COPY pyproject.toml poetry.lock README.md ./
RUN poetry install --no-root --only main

# Development image: source is bind-mounted by compose, hot reload on.
FROM deps AS dev
COPY src ./src
EXPOSE 8000
CMD ["fastapi", "dev", "src/customer_api/main.py", "--host", "0.0.0.0", "--port", "8000"]

# Production image: non-root, no reload.
FROM deps AS prod
COPY src ./src
RUN useradd --create-home --uid 1000 appuser && chown -R appuser:appuser /app
USER appuser
EXPOSE 8000
CMD ["fastapi", "run", "src/customer_api/main.py", "--host", "0.0.0.0", "--port", "8000"]
