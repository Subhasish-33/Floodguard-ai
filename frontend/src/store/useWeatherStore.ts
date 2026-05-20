/**
 * useWeatherStore.ts — Live Weather Intelligence State
 * Phase-4: Manages OpenWeatherMap district readings, IMD-ingested data,
 * polling lifecycle, and simulation risk multipliers.
 */

import { create } from 'zustand'

export interface DistrictWeather {
  districtId: string
  districtName: string
  rainfallMmHr: number          // current rainfall mm/hr
  rainfallAccumMm: number       // 24-hour accumulation
  windKph: number
  windDirection: number          // degrees
  tempC: number
  humidity: number
  cloudCoverage: number          // 0-100%
  condition: string
  conditionCode: number
  alertLevel: 'NONE' | 'WATCH' | 'WARNING' | 'EXTREME'
  lastUpdated: string            // ISO timestamp
  forecastPeakMm: number         // 24h forecast peak
}

export interface WeatherForecastPoint {
  timestamp: string
  rainfallMm: number
  windKph: number
  condition: string
}

// Simulated weather for Odisha's major coastal districts
const MOCK_DISTRICT_WEATHER: DistrictWeather[] = [
  {
    districtId: 'puri',
    districtName: 'Puri',
    rainfallMmHr: 12.4,
    rainfallAccumMm: 88.2,
    windKph: 34,
    windDirection: 195,
    tempC: 28.5,
    humidity: 94,
    cloudCoverage: 100,
    condition: 'Thunderstorm',
    conditionCode: 200,
    alertLevel: 'WARNING',
    lastUpdated: new Date().toISOString(),
    forecastPeakMm: 140,
  },
  {
    districtId: 'kendrapara',
    districtName: 'Kendrapara',
    rainfallMmHr: 18.7,
    rainfallAccumMm: 110.5,
    windKph: 48,
    windDirection: 210,
    tempC: 27.8,
    humidity: 97,
    cloudCoverage: 100,
    condition: 'Heavy Rain',
    conditionCode: 502,
    alertLevel: 'EXTREME',
    lastUpdated: new Date().toISOString(),
    forecastPeakMm: 190,
  },
  {
    districtId: 'jagatsinghpur',
    districtName: 'Jagatsinghpur',
    rainfallMmHr: 9.2,
    rainfallAccumMm: 64.0,
    windKph: 29,
    windDirection: 185,
    tempC: 29.1,
    humidity: 91,
    cloudCoverage: 95,
    condition: 'Rain',
    conditionCode: 501,
    alertLevel: 'WATCH',
    lastUpdated: new Date().toISOString(),
    forecastPeakMm: 95,
  },
  {
    districtId: 'bhadrak',
    districtName: 'Bhadrak',
    rainfallMmHr: 6.5,
    rainfallAccumMm: 42.0,
    windKph: 22,
    windDirection: 178,
    tempC: 30.2,
    humidity: 88,
    cloudCoverage: 80,
    condition: 'Moderate Rain',
    conditionCode: 501,
    alertLevel: 'WATCH',
    lastUpdated: new Date().toISOString(),
    forecastPeakMm: 72,
  },
  {
    districtId: 'balasore',
    districtName: 'Balasore',
    rainfallMmHr: 3.2,
    rainfallAccumMm: 28.5,
    windKph: 18,
    windDirection: 165,
    tempC: 31.0,
    humidity: 83,
    cloudCoverage: 70,
    condition: 'Light Rain',
    conditionCode: 300,
    alertLevel: 'NONE',
    lastUpdated: new Date().toISOString(),
    forecastPeakMm: 45,
  },
]

interface WeatherState {
  districtWeather: DistrictWeather[]
  weatherByDistrict: Record<string, DistrictWeather>
  lastUpdated: Date | null
  isPolling: boolean
  pollIntervalMs: number
  rainfallRiskMultipliers: Record<string, number>
  apiConnected: boolean

  // Actions
  fetchWeatherData: () => Promise<void>
  startPolling: () => void
  stopPolling: () => void
  ingestIMDBulletin: (bulletin: Partial<DistrictWeather>) => void
  getRiskMultiplier: (districtId: string) => number
}

let pollTimer: ReturnType<typeof setInterval> | null = null

const computeRiskMultiplier = (weather: DistrictWeather): number => {
  const base = Math.min(2.5, 1 + weather.rainfallMmHr / 40)
  const alertBoost = weather.alertLevel === 'EXTREME' ? 0.4 :
                     weather.alertLevel === 'WARNING' ? 0.2 :
                     weather.alertLevel === 'WATCH'   ? 0.1 : 0
  return Math.min(3.0, base + alertBoost)
}

export const useWeatherStore = create<WeatherState>((set, get) => ({
  districtWeather: [],
  weatherByDistrict: {},
  lastUpdated: null,
  isPolling: false,
  pollIntervalMs: Number(import.meta.env.VITE_WEATHER_POLL_INTERVAL_MS ?? 900000),
  rainfallRiskMultipliers: {},
  apiConnected: false,

  fetchWeatherData: async () => {
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'
      const res = await fetch(`${apiBase}/api/weather/current`)

      let data: DistrictWeather[]
      if (res.ok) {
        data = await res.json()
        set({ apiConnected: true })
      } else {
        // Fall back to mock data enriched with slight timestamp variation
        data = MOCK_DISTRICT_WEATHER.map((d) => ({
          ...d,
          rainfallMmHr: d.rainfallMmHr * (0.9 + Math.random() * 0.2),
          lastUpdated: new Date().toISOString(),
        }))
      }

      const byDistrict: Record<string, DistrictWeather> = {}
      const multipliers: Record<string, number> = {}

      data.forEach((d) => {
        byDistrict[d.districtId] = d
        multipliers[d.districtId] = computeRiskMultiplier(d)
      })

      set({
        districtWeather: data,
        weatherByDistrict: byDistrict,
        rainfallRiskMultipliers: multipliers,
        lastUpdated: new Date(),
      })
    } catch {
      // Network unavailable — use mock data
      const data = MOCK_DISTRICT_WEATHER.map((d) => ({
        ...d,
        lastUpdated: new Date().toISOString(),
      }))
      const byDistrict: Record<string, DistrictWeather> = {}
      const multipliers: Record<string, number> = {}
      data.forEach((d) => {
        byDistrict[d.districtId] = d
        multipliers[d.districtId] = computeRiskMultiplier(d)
      })
      set({ districtWeather: data, weatherByDistrict: byDistrict, rainfallRiskMultipliers: multipliers, lastUpdated: new Date() })
    }
  },

  startPolling: () => {
    if (pollTimer) return
    const { fetchWeatherData, pollIntervalMs } = get()
    fetchWeatherData()
    pollTimer = setInterval(fetchWeatherData, pollIntervalMs)
    set({ isPolling: true })
  },

  stopPolling: () => {
    if (pollTimer) {
      clearInterval(pollTimer)
      pollTimer = null
    }
    set({ isPolling: false })
  },

  ingestIMDBulletin: (bulletin) => {
    const { districtWeather, weatherByDistrict } = get()
    if (!bulletin.districtId) return

    const updated = { ...(weatherByDistrict[bulletin.districtId] ?? {}), ...bulletin, lastUpdated: new Date().toISOString() } as DistrictWeather
    const newByDistrict = { ...weatherByDistrict, [bulletin.districtId]: updated }
    const newList = districtWeather.map((d) => (d.districtId === bulletin.districtId ? updated : d))

    const multipliers = { ...get().rainfallRiskMultipliers, [bulletin.districtId]: computeRiskMultiplier(updated) }
    set({ districtWeather: newList, weatherByDistrict: newByDistrict, rainfallRiskMultipliers: multipliers })
  },

  getRiskMultiplier: (districtId) => {
    return get().rainfallRiskMultipliers[districtId] ?? 1.0
  },
}))
