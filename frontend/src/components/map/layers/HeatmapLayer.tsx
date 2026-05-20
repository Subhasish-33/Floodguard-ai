import { useMemo } from 'react'
import * as THREE from 'three'
import type { BoundingBox } from '@/types/geospatial'
import { useDisasterStore } from '@/store/useDisasterStore'
import { RISK_COLORS } from '@/utils/color'
import { featureToShape } from '@/utils/geospatial'

interface HeatmapLayerProps {
  bbox: BoundingBox
}

export const HeatmapLayer = ({ bbox }: HeatmapLayerProps) => {
  const districtBoundaries = useDisasterStore((state) => state.districtBoundaries)
  const riskScores = useDisasterStore((state) => state.riskScores)
  const riskOpacity = useDisasterStore((state) => state.riskOpacity)

  const riskMap = useMemo(
    () => new Map(riskScores.map((risk) => [risk.districtId, risk])),
    [riskScores],
  )

  const renderItems = useMemo(() => {
    if (!districtBoundaries) return []
    return districtBoundaries.features.flatMap((feature, index) => {
      const properties = feature.properties ?? {}
      const districtId = String(properties.district_id ?? properties.district_code ?? properties.id ?? index)
      const risk = riskMap.get(districtId)
      const color = risk ? RISK_COLORS[risk.level] : '#334155'
      const shapes = featureToShape(feature, bbox)
      return shapes.map((shape, shapeIndex) => ({ key: `${districtId}-${shapeIndex}`, shape, color }))
    })
  }, [bbox, districtBoundaries, riskMap])

  return (
    <group>
      {renderItems.map((item) => (
        <mesh key={item.key} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <shapeGeometry args={[item.shape]} />
          <meshStandardMaterial
            color={item.color}
            emissive={item.color}
            emissiveIntensity={0.12}
            transparent
            opacity={riskOpacity}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}
