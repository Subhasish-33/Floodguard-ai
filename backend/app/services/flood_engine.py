
from __future__ import annotations

import numpy as np


def relax_depth_step(
    elevation: np.ndarray,
    depth: np.ndarray,
    mask: np.ndarray | None,
    rainfall: float,
    velocity: float,
) -> np.ndarray:
    """Simplified NumPy relaxation to mirror browser cellular automaton (API contract testbed)."""

    working = depth.astype(float, copy=True)
    rain_pulse = np.clip(rainfall / 40_000.0, 1e-4, 0.02)

    active = mask.astype(bool) if mask is not None else np.ones_like(working, dtype=bool)

    working[active] += rain_pulse

    h, w = working.shape

    flux = velocity * 0.18

    buffer = working.copy()

    for y in range(1, h - 1):
        for x in range(1, w - 1):
            idx = (y, x)
            if not active[idx]:
                continue

            head = elevation[idx] + buffer[idx]

            for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                ny, nx = y + dy, x + dx

                if not active[ny, nx]:
                    continue

                neighbor = elevation[ny, nx] + buffer[ny, nx]

                delta = head - neighbor

                if delta <= 0 or buffer[idx] <= 0:
                    continue

                slope = max(0.15, delta)

                transfer = flux * slope * min(buffer[idx], delta)

                transfer = min(transfer, buffer[idx] * 0.42)

                buffer[idx] -= transfer

                buffer[ny, nx] += transfer

    return np.clip(buffer, 0.0, None)


def summarize_depth(depth: np.ndarray) -> float:
    mean = float(depth.mean()) if depth.size else 0.0
    peak = float(depth.max()) if depth.size else 0.0
    return float(min(1.0, mean * 12 + peak * 2.8))


def run_playback(
    width: int = 12,
    height: int = 12,
    frames: int = 24,
    rainfall_mm: float = 120.0,
    velocity_scalar: float = 0.65,
) -> tuple[np.ndarray, float]:
    """Deterministic coarse rehearsal used by HTTP façade."""

    rng = np.random.default_rng(2026)

    elevation = rng.uniform(0.05, 1.0, size=(height, width))

    depth = np.zeros_like(elevation)

    mask = np.ones_like(elevation, dtype=bool)

    for _ in range(max(1, frames)):
        depth = relax_depth_step(
            elevation,
            depth,
            mask,
            rainfall=rainfall_mm,
            velocity=velocity_scalar,
        )

    return depth, summarize_depth(depth)
