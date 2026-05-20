/**
 * weatherService.ts — Weather API Client
 * Phase-4: Typed client for backend weather endpoints with stale-while-revalidate caching.
 */

import type { DistrictWeather, WeatherForecastPoint } from '@/store/useWeatherStore'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

// ─── IMD Bulletin Format ──────────────────────────────────────────────────────

export interface IMDBulletin {
  district_id: string
  rainfall_mm_hr: number
  wind_kph: number
  alert_level: 'NONE' | 'WATCH' | 'WARNING' | 'EXTREME'
  bulletin_time: string
  source: 'IMD' | 'MANUAL'
}

// ─── API Client ───────────────────────────────────────────────────────────────

export const weatherService = {
  async fetchAllDistricts(): Promise<DistrictWeather[]> {
    const res = await fetch(`${API_BASE}/api/weather/current`, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) throw new Error(`Weather API error: ${res.status}`)
    return res.json()
  },

  async fetchDistrict(districtId: string): Promise<DistrictWeather> {
    const res = await fetch(`${API_BASE}/api/weather/district/${districtId}`, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) throw new Error(`District weather error: ${res.status}`)
    return res.json()
  },

  async fetchForecast(districtId: string): Promise<WeatherForecastPoint[]> {
    const res = await fetch(`${API_BASE}/api/weather/forecast/${districtId}`, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) throw new Error(`Forecast error: ${res.status}`)
    return res.json()
  },

  async ingestIMDBulletin(bulletin: IMDBulletin): Promise<{ status: string }> {
    const res = await fetch(`${API_BASE}/api/weather/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bulletin),
    })
    if (!res.ok) throw new Error(`IMD ingest error: ${res.status}`)
    return res.json()
  },
}
