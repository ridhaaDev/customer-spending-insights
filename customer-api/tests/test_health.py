from fastapi.testclient import TestClient

from customer_api.main import app, handler

client = TestClient(app)


def test_health() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_lambda_handler_serves_health() -> None:
    # Minimal API Gateway HTTP API (v2) / Function URL event.
    event = {
        "version": "2.0",
        "routeKey": "$default",
        "rawPath": "/health",
        "rawQueryString": "",
        "headers": {"host": "example.com"},
        "requestContext": {
            "http": {"method": "GET", "path": "/health", "protocol": "HTTP/1.1", "sourceIp": "127.0.0.1", "userAgent": "test"},
            "requestId": "test",
            "stage": "$default",
        },
        "isBase64Encoded": False,
    }
    response = handler(event, {})
    assert response["statusCode"] == 200
    assert '"status":"ok"' in response["body"]
