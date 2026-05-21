import { motion } from 'framer-motion'
import { HOTSPOTS, PLAYBACK_TOTAL_FRAMES, type HotspotId } from '@simulation'

import { useSimulationStore } from '@/store/useSimulationStore'

const hotspotButtons: { id: HotspotId; label: string }[] = [
  { id: 'global', label: 'Statewide rehearsal' },
  ...(Object.keys(HOTSPOTS) as Array<Exclude<HotspotId, 'global'>>).map((hotspotKey) => ({
    id: hotspotKey,
    label: HOTSPOTS[hotspotKey].districtName,
  })),
]

export const SimulationDeck = () => {
  const paused = useSimulationStore((s) => s.paused)
  const togglePlayback = useSimulationStore((s) => s.togglePlayback)
  const restartScenario = useSimulationStore((s) => s.restartScenario)
  const seekPlaybackFrame = useSimulationStore((s) => s.seekPlaybackFrame)
  const frameIndex = useSimulationStore((s) => s.frameIndex)
  const playbackSpeed = useSimulationStore((s) => s.playbackSpeed)
  const setPlaybackSpeed = useSimulationStore((s) => s.setPlaybackSpeed)
  const rainfallIntensity = useSimulationStore((s) => s.rainfallIntensity)
  const setRainfallIntensity = useSimulationStore((s) => s.setRainfallIntensity)
  const floodIntensity = useSimulationStore((s) => s.floodIntensity)
  const setFloodIntensity = useSimulationStore((s) => s.setFloodIntensity)
  const escalation = useSimulationStore((s) => s.escalation)
  const globalInundation = useSimulationStore((s) => s.globalInundation)
  const hotspot = useSimulationStore((s) => s.hotspot)
  const setHotspot = useSimulationStore((s) => s.setHotspot)

  const scrubMax = Math.max(1, PLAYBACK_TOTAL_FRAMES - 1)

  const scrubPercent = Math.min(1, frameIndex / scrubMax)

  return (
    <motion.div
      initial={{ opacity: 0, y: 34 }}
      animate={{ opacity: 1, y: 0 }}

      transition={{ duration: 0.45 }}

      className="pointer-events-auto flex w-max max-w-[95vw] flex-col gap-6 rounded-[2.5rem] glass-panel p-6 shadow-2xl"
    >
      <div className="flex flex-wrap gap-6">
        <div className="flex-1 min-w-[220px]">

          <p className="text-[10px] uppercase tracking-widest text-slate-500">Live flood rehearsal console</p>
          <h3 className="mt-1 text-xl font-semibold text-slate-900">{escalation.label}</h3>
          <div className="mt-2 flex gap-4 text-[10px] uppercase tracking-widest text-slate-500">
            <span>{escalation.timelineLabel}</span>
            <span>Inundation {(globalInundation * 100).toFixed(0)}%</span>
          </div>
        </div>

        <div className="flex flex-1 flex-wrap items-start justify-end gap-2">

          {hotspotButtons.map((button) => {
            const selected = hotspot === button.id


            return (

              <button
                key={button.id}
                data-active={selected}


                type="button"

                onClick={() => setHotspot(button.id)}



                className="rounded-full border px-4 py-2 text-[10px] uppercase tracking-widest transition-colors data-[active=true]:border-teal-300 data-[active=true]:bg-teal-50 data-[active=true]:text-teal-700 border-slate-200 bg-white/60 text-slate-600 hover:text-slate-900 hover:bg-white"
              >
                {button.label}
              </button>
            )


          })}
        </div>



      </div>


      <div className="flex flex-wrap items-center gap-3">

        <button
          type="button"






          className="rounded-full border border-teal-200 bg-teal-50 px-6 py-2.5 text-[10px] uppercase tracking-widest text-teal-700 hover:bg-teal-100 transition-colors shadow-sm"
          onClick={togglePlayback}
        >
          {paused ? 'Play rehearsal' : 'Pause'}
        </button>






        <button


          type="button"






          className="rounded-full border border-slate-300 bg-white/60 px-6 py-2.5 text-[10px] uppercase tracking-widest text-slate-600 hover:bg-white hover:text-slate-900 transition-colors shadow-sm"
          onClick={restartScenario}
        >
          Restart
        </button>




      </div>




      <div className="space-y-3">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-slate-500">
          <span>
            Playback frame {frameIndex}/{scrubMax}
          </span>
          <span>{paused ? 'Scrub-ready' : 'Live propagation feed'}</span>
        </div>

        <input
          aria-label="Flood escalation timeline scrubber"


          type="range"




          min={0}




          max={scrubMax}




          value={frameIndex}




          className="w-full accent-teal-500"




          onChange={(event) => seekPlaybackFrame(Number(event.target.value))}




        />
        <div className="h-[3px] rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-teal-500"






            style={{ width: `${scrubPercent * 100}%` }}




          />




        </div>




      </div>






      <div className="grid gap-4 md:grid-cols-3">
        <RangeField


          legend="Rainfall intensity"






          description="Feeds cellular forcing across active cells"






          value={rainfallIntensity}




          step={0.02}







          formatter={(value) => `${(value * 100).toFixed(0)}%`}




          onCommit={setRainfallIntensity}







        />




        <RangeField


          legend="Flood velocity"


          description="Controls hydraulic relaxation between neighbors"


          value={floodIntensity}




          formatter={(value) => `${(value * 100).toFixed(0)}%`}




          step={0.02}


          onCommit={setFloodIntensity}




        />




        <RangeField


          legend="Playback multiplier"


          description="Increases simulation pacing & timeline velocity"


          min={0.35}


          max={4}




          step={0.05}




          value={playbackSpeed}




          formatter={(value) => `${value.toFixed(2)}x`}


          onCommit={setPlaybackSpeed}




        />






      </div>




    </motion.div>



  )


}
























type RangeProps = {


  legend: string


  description: string




  min?: number


  max?: number


  step?: number


  value: number




  formatter: (next: number) => string




  onCommit: (next: number) => void


}








































const RangeField = ({




  legend,


  description,


  min = 0,


  max = 1,




  step = 0.02,





  value,




  formatter,




  onCommit,















}: RangeProps) => (










  <label className="space-y-2 rounded-2xl border border-white/80 bg-white/60 p-4 text-[10px] shadow-sm backdrop-blur-sm">
    <span className="flex items-center justify-between text-[10px] text-slate-700 font-medium">




      <span>{legend}</span>




      <span className="text-teal-700 font-bold tracking-widest">{formatter(value)}</span>




    </span>




    <p className="text-[10px] normal-case tracking-normal text-slate-500 mt-1 font-light">{description}</p>




    <input



      aria-label={legend}




      type="range"




      className="w-full accent-teal-500"






      min={min}




      max={max}




      step={step}




      value={value}




      onChange={(event) => onCommit(Number(event.target.value))}




    />

















  </label>




)
