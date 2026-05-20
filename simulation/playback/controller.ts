export interface PlaybackControllerState {

  paused: boolean
  /** 0 … totalFrames inclusive */

  currentFrame: number
  playbackSpeed: number
  /** Total scripted frames available for escalation narrative. */

  totalFrames: number
}

export function clampFrame(frame: number, total: number): number {
  if (total <= 0) return 0

  const maxIdx = Math.max(0, total - 1)
  return Math.min(maxIdx, Math.max(0, Math.floor(frame)))
}

export function nextFrame(controller: PlaybackControllerState, dtMs: number): number {
  if (controller.paused) return controller.currentFrame

  const deltaFrames = controller.playbackSpeed * (dtMs / 1000) * 45

  return clampFrame(controller.currentFrame + deltaFrames, controller.totalFrames)
}
