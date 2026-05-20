import { useRef } from 'react'

import { useFrame } from '@react-three/fiber'

import { useSimulationStore } from '@/store/useSimulationStore'

export const SimulationTicker = () => {

  const accumulator = useRef(0)

  useFrame((_state, delta) => {

    const simulation = useSimulationStore.getState()


    if (simulation.paused || !simulation.floodGrid) {

      accumulator.current = 0

      return

    }


    accumulator.current += delta * simulation.playbackSpeed * 48


    while (accumulator.current >= 1) {

      simulation.advanceLiveHydrologyPulse()

      accumulator.current -= 1

    }

  })


  return null

}
