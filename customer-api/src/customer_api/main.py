from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

from customer_api.settings import get_settings

settings = get_settings()

app = FastAPI(title="Customer API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


# AWS Lambda entrypoint. Lambda is configured to call `customer_api.main.handler`.
handler = Mangum(app)
