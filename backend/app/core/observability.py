"""
observability.py — Structured logging and metrics for FloodGuard API.
Phase-4: Prometheus-compatible metrics endpoint + structured JSON logging.
"""

from __future__ import annotations

import logging
import time
from collections import defaultdict
from typing import Any

from app.core.config import get_settings

# ─── Structured Logging Setup ─────────────────────────────────────────────────

def configure_logging() -> None:
    settings = get_settings()
    logging.basicConfig(
        level=getattr(logging, settings.log_level, logging.INFO),
        format='{"time":"%(asctime)s","level":"%(levelname)s","logger":"%(name)s","msg":"%(message)s"}',
        datefmt="%Y-%m-%dT%H:%M:%SZ",
    )
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)


# ─── In-Memory Metrics Store ──────────────────────────────────────────────────

class MetricsRegistry:
    """Simple Prometheus-compatible metrics collector."""

    def __init__(self) -> None:
        self._counters:   dict[str, float]       = defaultdict(float)
        self._gauges:     dict[str, float]        = defaultdict(float)
        self._histograms: dict[str, list[float]]  = defaultdict(list)
        self._start_time = time.time()

    def inc(self, name: str, value: float = 1.0, labels: dict[str, str] | None = None) -> None:
        key = self._key(name, labels)
        self._counters[key] += value

    def gauge(self, name: str, value: float, labels: dict[str, str] | None = None) -> None:
        key = self._key(name, labels)
        self._gauges[key] = value

    def observe(self, name: str, value: float) -> None:
        self._histograms[name].append(value)
        if len(self._histograms[name]) > 10_000:
            self._histograms[name] = self._histograms[name][-10_000:]

    def _key(self, name: str, labels: dict[str, str] | None) -> str:
        if not labels:
            return name
        label_str = ",".join(f'{k}="{v}"' for k, v in sorted(labels.items()))
        return f"{name}{{{label_str}}}"

    def to_prometheus_text(self) -> str:
        lines: list[str] = []
        uptime = time.time() - self._start_time

        lines.append(f"# HELP floodguard_uptime_seconds Service uptime")
        lines.append(f"# TYPE floodguard_uptime_seconds gauge")
        lines.append(f"floodguard_uptime_seconds {uptime:.1f}")

        for name, value in self._counters.items():
            clean = name.replace("{", "").replace("}", "").split(",")[0]
            lines.append(f"# TYPE {clean} counter")
            lines.append(f"{name} {value}")

        for name, value in self._gauges.items():
            clean = name.replace("{", "").replace("}", "").split(",")[0]
            lines.append(f"# TYPE {clean} gauge")
            lines.append(f"{name} {value}")

        return "\n".join(lines) + "\n"

    def to_json(self) -> dict[str, Any]:
        return {
            "uptime_seconds": round(time.time() - self._start_time, 1),
            "counters": dict(self._counters),
            "gauges": dict(self._gauges),
            "histogram_counts": {k: len(v) for k, v in self._histograms.items()},
        }


# ─── Singleton ────────────────────────────────────────────────────────────────

_registry: MetricsRegistry | None = None


def get_metrics() -> MetricsRegistry:
    global _registry
    if _registry is None:
        _registry = MetricsRegistry()
    return _registry
