import * as THREE from 'three'
import type {
  BoundingBox,
  GeoJsonFeature,
  GeoJsonFeatureCollection,
  GeoPoint,
} from '@/types/geospatial'

export const computeBoundingBox = (
  featureCollection: GeoJsonFeatureCollection,
): BoundingBox => {
  let minLon = Number.POSITIVE_INFINITY
  let minLat = Number.POSITIVE_INFINITY
  let maxLon = Number.NEGATIVE_INFINITY
  let maxLat = Number.NEGATIVE_INFINITY

  featureCollection.features.forEach((feature) => {
    const polygons: number[][][][] =
      feature.geometry.type === 'Polygon'
        ? [feature.geometry.coordinates as number[][][]]
        : (feature.geometry.coordinates as number[][][][])

    polygons.forEach((polygon) => {
      polygon.forEach((ring) => {
        ring.forEach(([lon, lat]) => {
          minLon = Math.min(minLon, lon)
          minLat = Math.min(minLat, lat)
          maxLon = Math.max(maxLon, lon)
          maxLat = Math.max(maxLat, lat)
        })
      })
    })
  })

  return { minLon, minLat, maxLon, maxLat }
}

export const lonLatToScene = (
  point: GeoPoint,
  bbox: BoundingBox,
  sceneSize = 20,
): THREE.Vector3 => {
  const x = ((point.lon - bbox.minLon) / (bbox.maxLon - bbox.minLon) - 0.5) * sceneSize
  const z = ((point.lat - bbox.minLat) / (bbox.maxLat - bbox.minLat) - 0.5) * sceneSize
  return new THREE.Vector3(x, 0, z)
}

export const featureToShape = (
  feature: GeoJsonFeature,
  bbox: BoundingBox,
  sceneSize = 20,
): THREE.Shape[] => {
  const polygons: number[][][][] =
    feature.geometry.type === 'Polygon'
      ? [feature.geometry.coordinates as number[][][]]
      : (feature.geometry.coordinates as number[][][][])

  return polygons
    .map((polygon) => {
      const [outerRing, ...holes] = polygon
      if (!outerRing) return null

      const outerPoints = outerRing.map(([lon, lat]) =>
        lonLatToScene({ lon, lat }, bbox, sceneSize),
      )
      const shape = new THREE.Shape(outerPoints.map((p) => new THREE.Vector2(p.x, p.z)))

      holes.forEach((holeRing) => {
        const holePoints = holeRing.map(([lon, lat]) =>
          lonLatToScene({ lon, lat }, bbox, sceneSize),
        )
        shape.holes.push(new THREE.Path(holePoints.map((p) => new THREE.Vector2(p.x, p.z))))
      })
      return shape
    })
    .filter((shape): shape is THREE.Shape => Boolean(shape))
}
