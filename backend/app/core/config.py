"""
config.py — Environment-driven configuration for FloodGuard API.
Phase-4: Full environment separation with validated settings.
"""

from __future__ import annotations

import os
from functools import lru_cache
from typing import Literal


class Settings:
    """Application settings sourced from environment variables."""

    # ─── Core ───────────────────────────────────────────────────────────────────
    environment: Literal["development", "staging", "production"] = "development"
    debug: bool = True
    secret_key: str = "changeme-use-strong-secret-in-production"
    service_name: str = "floodguard-simulation"
    api_version: str = "4.0.0"

    # ─── Database (optional — PostGIS/Supabase) ──────────────────────────────────
    database_url: str | None = None          # postgresql+asyncpg://... enables PostGIS
    supabase_url: str | None = None
    supabase_anon_key: str | None = None

    # ─── Weather (optional — enables live OpenWeatherMap) ────────────────────────
    openweather_api_key: str | None = None
    weather_poll_interval_seconds: int = 900

    # ─── Cache ───────────────────────────────────────────────────────────────────
    cache_backend: Literal["memory", "redis"] = "memory"
    redis_url: str = "redis://localhost:6379"
    default_cache_ttl_seconds: int = 300

    # ─── Rate Limiting ────────────────────────────────────────────────────────────
    rate_limit_rpm: int = 120   # requests per minute per IP
    rate_limit_enabled: bool = True

    # ─── CORS ────────────────────────────────────────────────────────────────────
    cors_origins: list[str] = ["*"]

    # ─── Observability ────────────────────────────────────────────────────────────
    log_level: str = "INFO"
    enable_metrics: bool = True

    def __init__(self) -> None:
        self.environment = os.getenv("ENVIRONMENT", "development")  # type: ignore[assignment]
        self.debug = os.getenv("DEBUG", "true").lower() == "true"
        self.secret_key = os.getenv("SECRET_KEY", "changeme-use-strong-secret-in-production")

        self.database_url = os.getenv("DATABASE_URL")
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_anon_key = os.getenv("SUPABASE_ANON_KEY")

        self.openweather_api_key = os.getenv("OPENWEATHER_API_KEY")
        self.weather_poll_interval_seconds = int(os.getenv("WEATHER_POLL_INTERVAL_SECONDS", "900"))

        self.cache_backend = os.getenv("CACHE_BACKEND", "memory")  # type: ignore[assignment]
        self.redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
        self.default_cache_ttl_seconds = int(os.getenv("CACHE_TTL_SECONDS", "300"))

        self.rate_limit_rpm = int(os.getenv("RATE_LIMIT_RPM", "120"))
        self.rate_limit_enabled = os.getenv("RATE_LIMIT_ENABLED", "true").lower() == "true"

        raw_origins = os.getenv("CORS_ORIGINS", "*")
        self.cors_origins = raw_origins.split(",") if raw_origins != "*" else ["*"]

        self.log_level = os.getenv("LOG_LEVEL", "INFO").upper()
        self.enable_metrics = os.getenv("ENABLE_METRICS", "true").lower() == "true"

    @property
    def is_production(self) -> bool:
        return self.environment == "production"

    @property
    def has_live_weather(self) -> bool:
        return bool(self.openweather_api_key)

    @property
    def has_database(self) -> bool:
        return bool(self.database_url)


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
