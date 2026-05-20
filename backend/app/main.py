"""
main.py — FloodGuard AI FastAPI Entrypoint (Phase-4)
Production-grade: middleware stack, all routers, health monitoring, observability.
"""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import simulation, intelligence, weather, replay, incidents, telemetry
from app.core.config import get_settings
from app.core.middleware import RequestTracingMiddleware, SecurityHeadersMiddleware, RateLimitMiddleware
from app.core.observability import configure_logging, get_metrics


# ─── Lifespan ─────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown hooks."""
    configure_logging()
    settings = get_settings()

    import logging
    logger = logging.getLogger("floodguard.startup")
    logger.info("FloodGuard API starting — environment=%s live_weather=%s database=%s",
                settings.environment, settings.has_live_weather, settings.has_database)

    get_metrics().gauge("startup_timestamp", __import__("time").time())

    yield  # Application runs

    logger.info("FloodGuard API shutting down.")


# ─── App Factory ──────────────────────────────────────────────────────────────

settings = get_settings()

app = FastAPI(
    title="FloodGuard AI — Disaster Intelligence API",
    version=settings.api_version,
    description=(
        "Phase-4 operational disaster intelligence platform for Odisha. "
        "Provides flood simulation, historical replay, live weather intelligence, "
        "incident management, PostGIS persistence, and real-time telemetry."
    ),
    docs_url="/docs" if not settings.is_production else None,
    redoc_url="/redoc" if not settings.is_production else None,
    lifespan=lifespan,
)

# ─── Middleware Stack (order matters — outermost first) ───────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(RequestTracingMiddleware)

# ─── Routers ──────────────────────────────────────────────────────────────────

app.include_router(simulation.router,  prefix="/api")
app.include_router(intelligence.router, prefix="/api")
app.include_router(weather.router,     prefix="/api")
app.include_router(replay.router,      prefix="/api")
app.include_router(incidents.router,   prefix="/api")
app.include_router(telemetry.router,   prefix="/api")

# ─── Health Endpoints ─────────────────────────────────────────────────────────

@app.get("/health", tags=["system"])
async def health() -> dict:
    """Lightweight liveness probe — always returns 200 if process is alive."""
    return {
        "status": "ok",
        "service": settings.service_name,
        "version": settings.api_version,
        "environment": settings.environment,
    }


@app.get("/health/ready", tags=["system"])
async def readiness() -> dict:
    """Readiness probe — checks cache and optional dependencies."""
    from app.core.cache import get_cache
    cache_ok = await get_cache().health()

    checks = {"cache": "ok" if cache_ok else "degraded"}

    if settings.has_live_weather:
        checks["weather_api"] = "configured"
    if settings.has_database:
        checks["database"] = "configured"

    overall = "ready" if all(v in ("ok", "configured") for v in checks.values()) else "degraded"
    return {"status": overall, "checks": checks}
