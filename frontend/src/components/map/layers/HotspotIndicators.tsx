import { Html } from '@react-three/drei'
import { useMemo } from 'react'
import type { BoundingBox } from '@/types/geospatial'
import { useDisasterStore } from '@/store/useDisasterStore'
import { lonLatToScene } from '@/utils/geospatial'

interface HotspotIndicatorsProps {
  bbox: BoundingBox
}

export const HotspotIndicators = ({ bbox }: HotspotIndicatorsProps) => {
  const districtBoundaries = useDisasterStore((state) => state.districtBoundaries)
  const riskScores = useDisasterStore((state) => state.riskScores)

  const topRiskDistricts = useMemo(
    () => [...riskScores].sort((a, b) => b.value - a.value).slice(0, 4),
    [riskScores],
  )

  const centroidMap = useMemo(() => {
    if (!districtBoundaries) return new Map<string, [number, number]>()
    const map = new Map<string, [number, number]>()
    districtBoundaries.features.forEach((feature, index) => {
      const properties = feature.properties ?? {}
      const districtId = String(properties.district_id ?? properties.district_code ?? properties.id ?? index)
      const coordinates: number[][] =
        feature.geometry.type === 'Polygon'
          ? (feature.geometry.coordinates as number[][][])[0]
          : (feature.geometry.coordinates as number[][][][])[0][0]

      if (!coordinates?.length) return
      const [sumLon, sumLat] = coordinates.reduce(
        (acc, [lon, lat]) => [acc[0] + lon, acc[1] + lat],
        [0, 0],
      )
      map.set(districtId, [sumLon / coordinates.length, sumLat / coordinates.length])
    })
    return map
  }, [districtBoundaries])

  return (
    <group>
      {topRiskDistricts.map((risk) => {
        const centroid = centroidMap.get(risk.districtId)
        if (!centroid) return null
        const point = lonLatToScene({ lon: centroid[0], lat: centroid[1] }, bbox)
        return (
          <group key={risk.districtId} position={[point.x, 0.35, point.z]}>
            <mesh>
              <sphereGeometry args={[0.08, 12, 12]} />
              <meshBasicMaterial color="#fb7185" />
            </mesh>
            <Html distanceFactor={13}>
              <div className="rounded-md border border-rose-400/40 bg-slate-950/85 px-2 py-1 text-[10px] font-medium tracking-wide text-rose-200 shadow-lg backdrop-blur">
                {risk.districtName}: {(risk.value * 100).toFixed(0)}%
              </div>
            </Html>
          </group>
        )
      })}
    </group>
  )
}
