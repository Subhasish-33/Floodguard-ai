import { useMemo } from 'react'
import * as THREE from 'three'
import type { BoundingBox } from '@/types/geospatial'
import { useDisasterStore } from '@/store/useDisasterStore'
import { featureToShape } from '@/utils/geospatial'

interface DistrictLayerProps {
  bbox: BoundingBox
}

export const DistrictLayer = ({ bbox }: DistrictLayerProps) => {
  const districtBoundaries = useDisasterStore((state) => state.districtBoundaries)
  const selectedDistrictId = useDisasterStore((state) => state.selectedDistrictId)
  const hoveredDistrictId = useDisasterStore((state) => state.hoveredDistrictId)
  const setSelectedDistrict = useDisasterStore((state) => state.setSelectedDistrict)
  const setHoveredDistrict = useDisasterStore((state) => state.setHoveredDistrict)

  const districtMeshes = useMemo(() => {
    if (!districtBoundaries) return []
    return districtBoundaries.features.flatMap((feature, index) => {
      const properties = feature.properties ?? {}
      const districtId =
        String(properties.district_id ?? properties.district_code ?? properties.id ?? index)
      const shapes = featureToShape(feature, bbox)
      return shapes.map((shape, shapeIndex) => ({ districtId, shape, key: `${districtId}-${shapeIndex}` }))
    })
  }, [bbox, districtBoundaries])

  return (
    <group>
      {districtMeshes.map(({ districtId, shape, key }) => {
        const isActive = districtId === selectedDistrictId || districtId === hoveredDistrictId
        return (
          <mesh
            key={key}
            rotation={[Math.PI / 2, 0, 0]}
            position={[0, 0.04 + (isActive ? 0.02 : 0), 0]}
            onPointerOver={(event) => {
              event.stopPropagation()
              setHoveredDistrict(districtId)
              document.body.style.cursor = 'pointer'
            }}
            onPointerOut={() => {
              setHoveredDistrict(null)
              document.body.style.cursor = 'default'
            }}
            onClick={(event) => {
              event.stopPropagation()
              setSelectedDistrict(districtId)
            }}
          >
            <shapeGeometry args={[shape]} />
            <meshStandardMaterial
              color={isActive ? '#e2e8f0' : '#0f172a'}
              transparent
              opacity={isActive ? 0.35 : 0.2}
              side={THREE.DoubleSide}
            />
          </mesh>
        )
      })}
    </group>
  )
}
