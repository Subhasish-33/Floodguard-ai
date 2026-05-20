import { useRef } from 'react'

import type { MutableRefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

import * as THREE from 'three'

import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

import { useSimulationStore } from '@/store/useSimulationStore'

interface CameraDirectorProps {
  orbitRef: MutableRefObject<OrbitControlsImpl | null>
}

export const CameraDirector = ({ orbitRef }: CameraDirectorProps) => {
  const baselineRadius = useRef<number | null>(null)
  const direction = useRef(new THREE.Vector3())

  const { camera } = useThree()

  useFrame((_state, delta) => {

    const smoothing = THREE.MathUtils.clamp(delta * 2.75, 0, 1)

    const controls = orbitRef.current


    if (!controls) return

    if (!baselineRadius.current) {
      baselineRadius.current = camera.position.length()
    }


    const intent = useSimulationStore.getState().cameraIntent

    const desiredTarget = intent ? new THREE.Vector3(intent.targetXZ[0], 0, intent.targetXZ[1]) : new THREE.Vector3(0, 0, 0)

    controls.target.lerp(desiredTarget, smoothing)


    const desiredScalar =
      baselineRadius.current * (intent?.distanceScalar ?? 1)

    direction.current.copy(camera.position).normalize()

    const currentLength = camera.position.length()

    const nextLength = THREE.MathUtils.lerp(currentLength, desiredScalar, smoothing)

    camera.position.copy(direction.current.multiplyScalar(nextLength))

    controls.update()

  })


  return null

}
