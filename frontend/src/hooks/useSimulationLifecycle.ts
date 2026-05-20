import { useEffect } from 'react'

import type { GeoJsonFeatureCollection } from '@/types/geospatial'

import { useDisasterStore } from '@/store/useDisasterStore'

import { useSimulationStore } from '@/store/useSimulationStore'
import { useIntelligenceStore } from '@/store/useIntelligenceStore'

import { computeBoundingBox } from '@/utils/geospatial'

import { buildSceneFocusForHotspot } from '@/simulation/simulationRuntime'

import { HOTSPOTS, type HotspotId } from '@simulation'

export const useSimulationLifecycle = () => {

  const terrain = useDisasterStore((state) => state.terrain)

  const districts = useDisasterStore((state) => state.districtBoundaries)

  const envelopeSource = useDisasterStore((state) => state.stateBoundary ?? state.districtBoundaries)

  const hotspot = useSimulationStore((state) => state.hotspot)

  const seekPlaybackFrame = useSimulationStore((state) => state.seekPlaybackFrame)

  const setCameraIntent = useSimulationStore((state) => state.setCameraIntent)

  const { fetchIntelligence, updateLiveRisks } = useIntelligenceStore.getState()
  const frameIndex = useSimulationStore((state) => state.frameIndex)

  useEffect(() => {
    if (!terrain || !districts || !envelopeSource) {
      return
    }
    seekPlaybackFrame(0)
    fetchIntelligence()
  }, [districts, envelopeSource, seekPlaybackFrame, terrain])

  useEffect(() => {
    updateLiveRisks(frameIndex)
  }, [frameIndex])

  useEffect(() => {

    if (!districts || !envelopeSource) {

      return

    }

    if (hotspot === 'global') {

      setCameraIntent(null)

      return

    }

    const hotspotKey = hotspot as Exclude<HotspotId, 'global'>

    const envelopeBBox = computeBoundingBox(envelopeSource as GeoJsonFeatureCollection)

    const focusVec = buildSceneFocusForHotspot(hotspotKey, envelopeBBox)


    const cameraScalar = HOTSPOTS[hotspotKey].cameraRadialOffset ?? 1

    setCameraIntent({
      targetXZ: [focusVec.x, focusVec.z],

      distanceScalar: cameraScalar,
    })

  }, [districts, envelopeSource, hotspot, setCameraIntent])

}
