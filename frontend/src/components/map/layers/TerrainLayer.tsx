import { useMemo, useRef } from 'react'

import { useFrame } from '@react-three/fiber'

import * as THREE from 'three'

import { appConfig } from '@/config/env'

import { normalizeElevation } from '@/utils/dem'

import { useDisasterStore } from '@/store/useDisasterStore'

import { useSimulationStore } from '@/store/useSimulationStore'

export const TerrainLayer = () => {
  const terrain = useDisasterStore((state) => state.terrain)
  const meshRef = useRef<THREE.Mesh>(null)

  const geometry = useMemo(() => {


    if (!terrain) {

      return null

    }


    const { width, height, values, minElevation, maxElevation } = terrain

    const geo = new THREE.PlaneGeometry(20, 20, width - 1, height - 1)


    const positions = geo.attributes.position as THREE.BufferAttribute

    const vertexColors = new Float32Array(positions.count * 3)

    geo.setAttribute('color', new THREE.BufferAttribute(vertexColors, 3))



    for (let i = 0; i < positions.count; i += 1) {
      const elevation = values[i] ?? minElevation
      const normalized = normalizeElevation(elevation, minElevation, maxElevation)
      positions.setY(i, normalized * appConfig.terrainHeightScale)

      vertexColors[i * 3] = 0.08 + normalized * 0.24
      vertexColors[i * 3 + 1] = 0.16 + normalized * 0.64
      vertexColors[i * 3 + 2] = 0.12 + normalized * 0.2

    }



    geo.computeVertexNormals()


    geo.attributes.position.needsUpdate = true

    geo.attributes.color.needsUpdate = true




    return geo

  }, [terrain])


  useFrame(() => {


    const simGrid = useSimulationStore.getState().floodGrid

    const terrainSnapshot = useDisasterStore.getState().terrain

    if (!geometry || !simGrid || !terrainSnapshot) return

    const colorAttr = geometry.getAttribute('color') as THREE.BufferAttribute

    const { depth } = simGrid



    const {

      width,

      height,

      values,

      minElevation,

      maxElevation,

    } = terrainSnapshot


    for (let row = 0; row < height; row += 1) {


      for (let col = 0; col < width; col += 1) {

        const idx = row * width + col

        const dryTone = normalizeElevation(values[idx] ?? minElevation, minElevation, maxElevation)

        const depthSignal = THREE.MathUtils.clamp(depth[idx] * 22, 0, 3.5)



        /** Green/brown terrestrial baseline **/

        let r = 0.06 + dryTone * 0.36

        let g = 0.18 + dryTone * 0.74

        let b = 0.08 + dryTone * 0.22


        if (depthSignal > 0.04) {


          /** Inundation teal push */


          const cover = THREE.MathUtils.clamp(depthSignal / 2.9, 0, 1)

          r = THREE.MathUtils.lerp(r, 0.05 + cover * 0.06, Math.min(1, depthSignal))


          g = THREE.MathUtils.lerp(g, 0.54 + dryTone * 0.06, Math.min(1, depthSignal * 0.9))


          b = THREE.MathUtils.lerp(b, 0.94, Math.min(1, depthSignal * 0.85))



        }



        if (depthSignal > 0.045 && depthSignal < 1.05) {


          /** Riparian warning band */


          const edge = THREE.MathUtils.clamp(depthSignal, 0, 1)


          const edgeTint = THREE.MathUtils.clamp(edge * 0.7, 0, 1)

          r += edgeTint * 0.6

          g += edgeTint * 0.3

          b -= edgeTint * 0.42

        }




        colorAttr.setXYZ(idx, r, g, b)




      }



    }



    colorAttr.needsUpdate = true

  })



  if (!geometry) {


    return null

  }



  return (

    <mesh ref={meshRef} geometry={geometry} position={[0, -0.02, 0]} castShadow receiveShadow>

      <meshStandardMaterial vertexColors metalness={0.22} roughness={0.78} />

    </mesh>





  )


}
