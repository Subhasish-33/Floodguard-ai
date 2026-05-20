import { useRef } from 'react'

import { useFrame } from '@react-three/fiber'

import * as THREE from 'three'

import { appConfig } from '@/config/env'

import { useSimulationStore } from '@/store/useSimulationStore'

export const WaterLayer = () => {
  const meshRef = useRef<THREE.Mesh>(null)


  const materialRef = useRef<THREE.MeshStandardMaterial>(null)

  const phase = useRef(0)



  useFrame((_state, delta) => {


    phase.current += delta



    const globalSignal = THREE.MathUtils.clamp(useSimulationStore.getState().globalInundation, 0, 1)


    const swell = THREE.MathUtils.lerp(
      globalSignal * appConfig.terrainHeightScale * 0.55 + 0.35,

      globalSignal * appConfig.terrainHeightScale + 1.08,

      globalSignal,

    )

    const turbulence = Math.sin(phase.current * 1.4) * 0.065 + Math.cos(phase.current * 0.92) * 0.048

    if (meshRef.current) {


      meshRef.current.position.y = swell + turbulence

    }



    const opacityDynamic = THREE.MathUtils.lerp(
      0.06,
      0.58,
      THREE.MathUtils.clamp(globalSignal * 3.25, 0, 1),
    )





    const mat = materialRef.current

    if (mat) {
      mat.opacity = opacityDynamic
      mat.transparent = true

    }





  })

  return (



    <mesh ref={meshRef} position={[0, 1.08, 0]} rotation={[0, 0, 0]}>

      <planeGeometry args={[20, 20, 1, 1]} />

      <meshStandardMaterial

        ref={materialRef}



        color="#1d91c0"


        transparent

        metalness={0.18}

        roughness={0.22}

      />






    </mesh>





  )


}
