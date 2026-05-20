import type { FloodGridState } from '../engine/types'

/** Deep-clone aquatic depth buffer for rewind / deterministic replay scaffolding. */

export function cloneDepthBuffer(state: FloodGridState): Float32Array {
  return Float32Array.from(state.depth)

}

interface FrameRingBuffer {
  snapshots: Float32Array[]
}

export function createFrameRingBuffer(): FrameRingBuffer {

  return { snapshots: [] }

}

export function recordFrame(ring: FrameRingBuffer, snapshot: Float32Array, capacity: number): void {
  ring.snapshots.push(Float32Array.from(snapshot))

  if (ring.snapshots.length > capacity) {
    ring.snapshots.shift()
  }
}

export function snapshotAt(ring: FrameRingBuffer, frame: number): Float32Array | null {
  return ring.snapshots[frame] ?? null
}

/** Reset cache when hotspot or terrain changes. */

export function clearSnapshots(ring: FrameRingBuffer): void {
  ring.snapshots.length = 0
}
