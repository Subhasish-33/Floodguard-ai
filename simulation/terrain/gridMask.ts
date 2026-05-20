
/** BBox-aligned uniform grid inclusion mask (fast hotspot footprint). */

export interface LonLatBounds {

  minLon: number

  minLat: number

  maxLon: number

  maxLat: number

}

export function buildBBoxMaskUniformGrid(
  width: number,

  height: number,

  envelope: LonLatBounds,

  region: LonLatBounds,
): Uint8Array {

  const mask = new Uint8Array(width * height)

  const lonSpan = envelope.maxLon - envelope.minLon || 1

  const latSpan = envelope.maxLat - envelope.minLat || 1

  for (let row = 0; row < height; row += 1) {

    const latFrac = row / Math.max(1, height - 1)

    const lat = envelope.minLat + latFrac * latSpan

    for (let col = 0; col < width; col += 1) {

      const lonFrac = col / Math.max(1, width - 1)

      const lon = envelope.minLon + lonFrac * lonSpan

      const insideLon = lon >= region.minLon && lon <= region.maxLon

      const insideLat = lat >= region.minLat && lat <= region.maxLat

      if (insideLon && insideLat) mask[row * width + col] = 1

    }

  }

  return mask

}
