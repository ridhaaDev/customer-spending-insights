from datetime import date
from functools import lru_cache
from typing import Annotated

from pydantic import field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime configuration, read from environment variables (or a local .env)."""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    database_url: str | None = None
    # NoDecode stops pydantic-settings from JSON-decoding the env var, so a plain
    # comma-separated string like "http://a.com,http://b.com" works.
    cors_origins: Annotated[list[str], NoDecode] = []

    # Mock dataset controls. The seed fixes the generated history; MOCK_TODAY pins the
    # reference date so rolling periods (and therefore the whole dataset) are reproducible.
    mock_seed: int = 20240916
    mock_today: date | None = None

    @field_validator("database_url", "mock_today", mode="before")
    @classmethod
    def empty_is_none(cls, value: object) -> object:
        # CloudFormation passes "" when the parameter is unset.
        return None if isinstance(value, str) and not value.strip() else value

    @field_validator("cors_origins", mode="before")
    @classmethod
    def split_origins(cls, value: object) -> object:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()
