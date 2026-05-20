import { useMemo, type DependencyList } from 'react'

export const useStableMemo = <T>(factory: () => T, deps: DependencyList): T => {
  return useMemo(factory, deps)
}

export const clampFrameRate = (delta: number, maxDelta = 1 / 30): number =>
  Math.min(delta, maxDelta)
