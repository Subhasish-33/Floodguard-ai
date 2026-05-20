import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useIntelligenceStore } from '@/store/useIntelligenceStore'
import { Html } from '@react-three/drei'
import { projectCoordinates } from '@/utils/geospatial'

export const IntelligenceLayer = ({ bbox }: { bbox: [number, number, number, number] }) => {
  const { villages, villageRisks, evacuationRoutes, droneMissions } = useIntelligenceStore()
  
  const riskMap = useMemo(() => {
    const map = new Map()
    villageRisks.forEach(r => map.set(r.villageId, r))
    return map
  }, [villageRisks])

  return (
    <group position={[0, 0.5, 0]}>
      {/* Evacuation Routes */}
      {evacuationRoutes.map(route => (
        <EvacuationRouteLine key={route.routeId} route={route} bbox={bbox} />
      ))}
      
      {/* Villages */}
      {villages.map(v => {
        const risk = riskMap.get(v.villageId)
        const isCritical = risk?.riskBand === 'critical'
        const color = isCritical ? '#ef4444' : risk?.riskBand === 'warning' ? '#f59e0b' : risk?.riskBand === 'watch' ? '#eab308' : '#22c55e'
        const vec = projectCoordinates(v.centroid.lat, v.centroid.lon, bbox)
        
        return (
          <group key={v.villageId} position={[vec.x, 0, vec.z]}>
            <mesh rotation={[-Math.PI/2, 0, 0]}>
              <circleGeometry args={[0.08, 16]} />
              <meshBasicMaterial color={color} transparent opacity={0.8} depthWrite={false} />
            </mesh>
            {isCritical && (
              <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0.01, 0]}>
                <ringGeometry args={[0.1, 0.15, 32]} />
                <meshBasicMaterial color={color} transparent opacity={0.5} depthWrite={false} />
              </mesh>
            )}
            
            {isCritical && (
              <Html position={[0, 0.2, 0]} center>
                <div className="flex flex-col items-center pointer-events-none">
                  <div className="bg-slate-900/90 border border-red-500/50 px-2 py-1 rounded text-[10px] text-red-400 whitespace-nowrap shadow-[0_0_10px_rgba(239,68,68,0.3)]">
                    <span className="font-bold">{v.villageName}</span>
                    <div className="flex justify-between gap-2 opacity-80 mt-0.5">
                      <span>Pop: {v.population?.population2011}</span>
                      <span>Depth: {risk?.floodDepth.toFixed(1)}m</span>
                    </div>
                  </div>
                  <div className="w-px h-4 bg-red-500/50" />
                </div>
              </Html>
            )}
          </group>
        )
      })}
      
      {/* Drones */}
      {droneMissions.map(m => (
        <DroneMarker key={m.missionId} mission={m} bbox={bbox} />
      ))}
    </group>
  )
}

const EvacuationRouteLine = ({ route, bbox }: any) => {
  const lineRef = useRef<THREE.Line>(null)
  
  const points = useMemo(() => {
    return route.waypoints.map((w: any) => {
      const vec = projectCoordinates(w.lat, w.lon, bbox)
      return new THREE.Vector3(vec.x, 0.1, vec.z)
    })
  }, [route, bbox])
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points)
    return geo
  }, [points])
  
  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial color={route.status === 'safe' ? '#3b82f6' : '#ef4444'} linewidth={2} transparent opacity={0.7} />
    </line>
  )
}

const DroneMarker = ({ mission, bbox }: any) => {
  const ref = useRef<THREE.Group>(null)
  const waypoint = mission.waypoints[0]
  const vec = projectCoordinates(waypoint.lat, waypoint.lon, bbox)
  
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = 1 + Math.sin(clock.elapsedTime * 2) * 0.1
      ref.current.rotation.y = clock.elapsedTime
    }
  })

  return (
    <group ref={ref} position={[vec.x, 1, vec.z]}>
      <mesh>
        <octahedronGeometry args={[0.15]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.5} wireframe />
      </mesh>
      <Html position={[0, 0.3, 0]} center>
         <div className="bg-slate-900/80 border border-cyan-500/50 px-2 py-0.5 rounded text-[9px] text-cyan-300 font-mono shadow-[0_0_10px_rgba(6,182,212,0.3)] whitespace-nowrap">
           UAV: {mission.missionId}
         </div>
      </Html>
    </group>
  )
}
