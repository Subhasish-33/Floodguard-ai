/**
 * renderScheduler.ts — Priority RAF Scheduler
 * Phase-4: Decouples physics, UI, and camera updates to maintain 60fps.
 * Throttles non-critical updates when FPS drops below target.
 */

type Priority = 'critical' | 'high' | 'normal' | 'low'

interface ScheduledTask {
  id: string
  priority: Priority
  callback: (deltaMs: number) => void
  interval?: number       // ms between executions (undefined = every frame)
  lastRun: number
}

class RenderScheduler {
  private tasks: Map<string, ScheduledTask> = new Map()
  private rafHandle = 0
  private lastFrame = performance.now()
  private fpsHistory: number[] = []
  private isRunning = false

  get currentFps(): number {
    if (this.fpsHistory.length === 0) return 60
    return Math.round(this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length)
  }

  get isThrottled(): boolean {
    return this.currentFps < 45
  }

  register(id: string, callback: (deltaMs: number) => void, priority: Priority = 'normal', intervalMs?: number): void {
    this.tasks.set(id, { id, priority, callback, interval: intervalMs, lastRun: 0 })
  }

  unregister(id: string): void {
    this.tasks.delete(id)
  }

  start(): void {
    if (this.isRunning) return
    this.isRunning = true
    this.tick()
  }

  stop(): void {
    this.isRunning = false
    cancelAnimationFrame(this.rafHandle)
  }

  private tick = () => {
    const now = performance.now()
    const delta = now - this.lastFrame
    this.lastFrame = now

    // Track FPS
    const fps = 1000 / Math.max(delta, 1)
    this.fpsHistory.push(fps)
    if (this.fpsHistory.length > 30) this.fpsHistory.shift()

    const throttled = this.isThrottled

    // Execute tasks by priority
    for (const task of this.sortedTasks()) {
      // Under throttling, skip low-priority tasks
      if (throttled && task.priority === 'low') continue
      if (throttled && task.priority === 'normal' && task.interval === undefined) continue

      // Check interval
      if (task.interval !== undefined && now - task.lastRun < task.interval) continue

      try {
        task.callback(delta)
        task.lastRun = now
      } catch (err) {
        console.error(`[RenderScheduler] Task ${task.id} failed:`, err)
      }
    }

    if (this.isRunning) {
      this.rafHandle = requestAnimationFrame(this.tick)
    }
  }

  private sortedTasks(): ScheduledTask[] {
    const order: Record<Priority, number> = { critical: 0, high: 1, normal: 2, low: 3 }
    return [...this.tasks.values()].sort((a, b) => order[a.priority] - order[b.priority])
  }
}

// ─── Singleton ────────────────────────────────────────────────────────────────

let _scheduler: RenderScheduler | null = null

export const getRenderScheduler = (): RenderScheduler => {
  if (!_scheduler) {
    _scheduler = new RenderScheduler()
  }
  return _scheduler
}

export { RenderScheduler }
