import type { RiskLevel } from '@/types/geospatial'

export const RISK_COLORS: Record<RiskLevel, string> = {
  high: '#ef4444',
  moderate: '#f59e0b',
  safe: '#22c55e',
}

export const riskLevelFromValue = (value: number): RiskLevel => {
  if (value >= 0.7) return 'high'
  if (value >= 0.4) return 'moderate'
  return 'safe'
}

export const hexToThreeColor = (hex: string): [number, number, number] => {
  const normalized = hex.replace('#', '')
  const bigint = Number.parseInt(normalized, 16)
  const r = ((bigint >> 16) & 255) / 255
  const g = ((bigint >> 8) & 255) / 255
  const b = (bigint & 255) / 255
  return [r, g, b]
}
