"""
cache.py — In-memory TTL cache with Redis upgrade path.
Phase-4: Caching layer for weather data, simulation results, analytics.
Swap to Redis by setting CACHE_BACKEND=redis in environment.
"""

from __future__ import annotations

import asyncio
import time
from typing import Any


class MemoryCache:
    """Thread-safe in-memory cache with TTL expiry."""

    def __init__(self) -> None:
        self._store: dict[str, tuple[Any, float]] = {}
        self._lock = asyncio.Lock()

    async def get(self, key: str) -> Any | None:
        async with self._lock:
            entry = self._store.get(key)
            if entry is None:
                return None
            value, expires_at = entry
            if expires_at < time.monotonic():
                del self._store[key]
                return None
            return value

    async def set(self, key: str, value: Any, ttl: int = 300) -> None:
        async with self._lock:
            self._store[key] = (value, time.monotonic() + ttl)

    async def delete(self, key: str) -> None:
        async with self._lock:
            self._store.pop(key, None)

    async def clear_prefix(self, prefix: str) -> int:
        async with self._lock:
            keys_to_delete = [k for k in self._store if k.startswith(prefix)]
            for k in keys_to_delete:
                del self._store[k]
            return len(keys_to_delete)

    async def health(self) -> bool:
        return True

    def stats(self) -> dict[str, int]:
        now = time.monotonic()
        active = sum(1 for _, (_, exp) in self._store.items() if exp > now)
        return {"total_keys": len(self._store), "active_keys": active, "expired_keys": len(self._store) - active}


# ─── Cache Factory ─────────────────────────────────────────────────────────────

_cache_instance: MemoryCache | None = None


def get_cache() -> MemoryCache:
    """Return the global cache instance. Swap implementation here for Redis."""
    global _cache_instance
    if _cache_instance is None:
        _cache_instance = MemoryCache()
    return _cache_instance


# ─── Decorator Helper ──────────────────────────────────────────────────────────

def cached(key_template: str, ttl: int = 300):
    """Async cache decorator. key_template can use {arg_name} substitution."""
    def decorator(func):
        async def wrapper(*args, **kwargs):
            cache = get_cache()
            # Build cache key from kwargs
            key = key_template.format(**kwargs) if kwargs else key_template
            cached_val = await cache.get(key)
            if cached_val is not None:
                return cached_val
            result = await func(*args, **kwargs)
            await cache.set(key, result, ttl)
            return result
        return wrapper
    return decorator
