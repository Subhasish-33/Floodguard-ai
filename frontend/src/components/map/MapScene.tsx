import { Suspense, useMemo, useRef } from 'react'

import { Canvas } from '@react-three/fiber'

import { OrbitControls, Stars } from '@react-three/drei'

import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'


import { DistrictLayer } from '@/components/map/layers/DistrictLayer'

import { HeatmapLayer } from '@/components/map/layers/HeatmapLayer'

import { HotspotIndicators } from '@/components/map/layers/HotspotIndicators'

import { TerrainLayer } from '@/components/map/layers/TerrainLayer'
import { IntelligenceLayer } from '@/components/map/layers/IntelligenceLayer'
import { WaterLayer } from '@/components/map/layers/WaterLayer'

import { SimulationTicker } from '@/components/map/SimulationTicker'


import { CameraDirector } from '@/components/map/CameraDirector'




import { appConfig } from '@/config/env'


import { useDisasterStore } from '@/store/useDisasterStore'

import { computeBoundingBox } from '@/utils/geospatial'


export const MapScene = () => {


  const stateBoundary = useDisasterStore((state) => state.stateBoundary)


  const districtBoundaries = useDisasterStore((state) => state.districtBoundaries)



  const orbitRef = useRef<OrbitControlsImpl>(null)



  const bbox = useMemo(() => {


    const collection = stateBoundary ?? districtBoundaries


    return collection ? computeBoundingBox(collection) : null


  }, [stateBoundary, districtBoundaries])


  return (


    <Canvas


      camera={{ position: [0, appConfig.cameraDistance * 0.7, appConfig.cameraDistance], fov: 45 }}



      dpr={[1, 1.8]}


      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}



    >
      <color attach="background" args={['#020617']} />


      <ambientLight intensity={0.4} />


      <directionalLight position={[18, 24, 14]} intensity={1.1} color="#dbeafe" />


      <directionalLight position={[-12, 10, -8]} intensity={0.3} color="#67e8f9" />


      <SimulationTicker />


      <CameraDirector orbitRef={orbitRef} />


      <Suspense fallback={null}> 


        <Stars fade radius={80} depth={35} count={1200} factor={2.3} saturation={0} speed={0.4} />


        <group rotation={[-Math.PI / 2, 0, 0]}>

          <TerrainLayer />


          <WaterLayer />

          {bbox && (
            <>
              <HeatmapLayer bbox={bbox} />
              <DistrictLayer bbox={bbox} />
              <HotspotIndicators bbox={bbox} />
              <IntelligenceLayer bbox={bbox} />
            </>
          )}
        </group>



      </Suspense>


      <OrbitControls




        ref={orbitRef}




        makeDefault


        minDistance={12}




        maxDistance={52}




        minPolarAngle={0.45}


        maxPolarAngle={1.34}


        enablePan={false}




        dampingFactor={0.08}


      />

    </Canvas>


  )

}
