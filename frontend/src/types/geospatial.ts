export type RiskLevel = 'high' | 'moderate' | 'safe'

export interface RiskScore {
  districtId: string
  districtName: string
  value: number
  level: RiskLevel
}

export interface GeoPoint {
  lat: number
  lon: number
}

export interface BoundingBox {
  minLon: number
  minLat: number
  maxLon: number
  maxLat: number
}

export interface DistrictFeatureProperties {
  district_id?: string
  district_name?: string
  name?: string
  [key: string]: string | number | null | undefined
}

export interface GeoJsonFeature<TProps = DistrictFeatureProperties> {
  type: 'Feature'
  geometry: {
    type: 'Polygon' | 'MultiPolygon'
    coordinates: number[][][] | number[][][][]
  }
  properties: TProps
}

export interface GeoJsonFeatureCollection<TProps = DistrictFeatureProperties> {
  type: 'FeatureCollection'
  features: Array<GeoJsonFeature<TProps>>
}

export interface TerrainGrid {
  width: number
  height: number
  values: number[]
  minElevation: number
  maxElevation: number
}

export interface DataManifest {
  geojson: {
    stateBoundary?: string
    districts?: string
  }
  dem: {
    heightmap?: string
    grid?: string
  }
}
