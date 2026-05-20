"""
middleware.py — Production middleware stack for FloodGuard API.
Phase-4: Rate limiting, security headers, request tracing, timing.
"""

from __future__ import annotations

import time
import uuid
import logging

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.types import ASGIApp

from app.core.config import get_settings

logger = logging.getLogger("floodguard.middleware")

# ─── Request ID Tracing ────────────────────────────────────────────────────────

class RequestTracingMiddleware(BaseHTTPMiddleware):
    """Injects X-Request-ID into every request + response for distributed tracing."""

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        request.state.request_id = request_id

        start = time.perf_counter()
        response = await call_next(request)
        elapsed_ms = (time.perf_counter() - start) * 1000

        response.headers["X-Request-ID"] = request_id
        response.headers["X-Response-Time-Ms"] = f"{elapsed_ms:.1f}"

        logger.info(
            "%s %s → %d (%.1fms) [%s]",
            request.method,
            request.url.path,
            response.status_code,
            elapsed_ms,
            request_id,
        )
        return response


# ─── Security Headers ─────────────────────────────────────────────────────────

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Adds security headers to all responses. Hardened for production."""

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        response = await call_next(request)
        settings = get_settings()

        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["X-Service"] = f"{settings.service_name}/{settings.api_version}"

        if settings.is_production:
            response.headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains"
            response.headers["Content-Security-Policy"] = "default-src 'self'"

        return response


# ─── In-Memory Rate Limiter ────────────────────────────────────────────────────

class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Simple sliding-window rate limiter (in-memory per IP).
    For production at scale, replace with Redis + slowapi.
    """

    def __init__(self, app: ASGIApp) -> None:
        super().__init__(app)
        self._buckets: dict[str, list[float]] = {}
        self._rpm = get_settings().rate_limit_rpm
        self._enabled = get_settings().rate_limit_enabled

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        if not self._enabled:
            return await call_next(request)

        # Skip health checks from rate limiting
        if request.url.path in ("/health", "/metrics"):
            return await call_next(request)

        client_ip = request.client.host if request.client else "unknown"
        now = time.monotonic()
        window_start = now - 60.0

        bucket = self._buckets.get(client_ip, [])
        bucket = [t for t in bucket if t > window_start]  # evict old entries

        if len(bucket) >= self._rpm:
            return Response(
                content='{"detail":"Rate limit exceeded. Please wait before retrying."}',
                status_code=429,
                media_type="application/json",
                headers={
                    "Retry-After": "60",
                    "X-RateLimit-Limit": str(self._rpm),
                    "X-RateLimit-Remaining": "0",
                },
            )

        bucket.append(now)
        self._buckets[client_ip] = bucket

        response = await call_next(request)
        response.headers["X-RateLimit-Limit"] = str(self._rpm)
        response.headers["X-RateLimit-Remaining"] = str(max(0, self._rpm - len(bucket)))
        return response
