/**
 * supabaseClient.ts — Supabase Persistence Layer
 * Phase-4: Production Supabase integration with real credentials.
 * Handles village persistence, incident storage, replay logs,
 * and simulation audit trail with PostGIS geometry support.
 */

// ─── Client Initialization ────────────────────────────────────────────────────

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? 'https://kyfyptfpdgstohqdewse.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5ZnlwdGZwZGdzdG9ocWRld3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNzU4MDAsImV4cCI6MjA5NDg1MTgwMH0.IEmzQELmYtqHU6uOn9xfarr_LazhHemMMTJISHxlkeo'

// ─── Type Definitions ─────────────────────────────────────────────────────────

export interface DbVillage {
  id: string
  name: string
  district_id: string
  lat: number
  lon: number
  elevation: number
  population: number
  base_risk: number
  created_at?: string
}

export interface DbIncident {
  id: string
  type: string
  severity: string
  lifecycle: string
  district_id: string | null
  village_name: string | null
  title: string
  description: string
  lat: number | null
  lon: number | null
  metadata: Record<string, unknown>
  created_at?: string
  updated_at?: string
}

export interface DbReplayLog {
  id: string
  scenario_id: string
  session_id: string
  frame_data: Record<string, unknown>
  recorded_at?: string
}

export interface DbSimulationEvent {
  id: string
  session_id: string
  event_type: string
  payload: Record<string, unknown>
  frame_index: number
  ts?: string
}

// ─── REST API Helpers ─────────────────────────────────────────────────────────

const supabaseHeaders = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
}

async function supabaseRequest<T>(
  path: string,
  method = 'GET',
  body?: unknown,
): Promise<T | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}${path}`, {
      method,
      headers: supabaseHeaders,
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!res.ok) {
      const err = await res.text()
      console.warn(`[Supabase] ${method} ${path} → ${res.status}:`, err)
      return null
    }

    if (res.status === 204) return null
    return await res.json() as T
  } catch (err) {
    console.warn('[Supabase] Network error:', err)
    return null
  }
}

// ─── Repository: Incidents ────────────────────────────────────────────────────

export const incidentRepository = {
  async list(filters?: { lifecycle?: string; severity?: string }): Promise<DbIncident[]> {
    let path = '/incidents?order=created_at.desc&limit=100'
    if (filters?.lifecycle) path += `&lifecycle=eq.${filters.lifecycle}`
    if (filters?.severity)  path += `&severity=eq.${filters.severity}`
    return await supabaseRequest<DbIncident[]>(path) ?? []
  },

  async create(incident: Omit<DbIncident, 'created_at' | 'updated_at'>): Promise<DbIncident | null> {
    const result = await supabaseRequest<DbIncident[]>('/incidents', 'POST', incident)
    return result?.[0] ?? null
  },

  async update(id: string, patch: Partial<DbIncident>): Promise<DbIncident | null> {
    const result = await supabaseRequest<DbIncident[]>(`/incidents?id=eq.${id}`, 'PATCH', {
      ...patch,
      updated_at: new Date().toISOString(),
    })
    return result?.[0] ?? null
  },

  async getAuditTrail(id: string): Promise<Record<string, unknown>[]> {
    const result = await supabaseRequest<DbIncident[]>(`/incidents?id=eq.${id}&select=metadata`)
    const incident = result?.[0]
    return (incident?.metadata?.auditTrail as Record<string, unknown>[]) ?? []
  },
}

// ─── Repository: Villages ─────────────────────────────────────────────────────

export const villageRepository = {
  async listByDistrict(districtId: string): Promise<DbVillage[]> {
    return await supabaseRequest<DbVillage[]>(`/villages?district_id=eq.${districtId}&limit=200`) ?? []
  },

  async upsert(villages: DbVillage[]): Promise<void> {
    if (!villages.length) return
    await supabaseRequest('/villages', 'POST', villages)
  },

  async getHighRisk(minRisk = 0.7): Promise<DbVillage[]> {
    return await supabaseRequest<DbVillage[]>(`/villages?base_risk=gte.${minRisk}&order=base_risk.desc&limit=50`) ?? []
  },
}

// ─── Repository: Replay Logs ──────────────────────────────────────────────────

export const replayRepository = {
  async persistFrame(log: Omit<DbReplayLog, 'recorded_at'>): Promise<void> {
    await supabaseRequest('/replay_logs', 'POST', log)
  },

  async listSessions(scenarioId: string): Promise<DbReplayLog[]> {
    return await supabaseRequest<DbReplayLog[]>(`/replay_logs?scenario_id=eq.${scenarioId}&order=recorded_at.desc&limit=20`) ?? []
  },
}

// ─── Repository: Simulation Events ───────────────────────────────────────────

export const simulationEventRepository = {
  async recordBatch(events: Omit<DbSimulationEvent, 'ts'>[]): Promise<void> {
    if (!events.length) return
    await supabaseRequest('/simulation_events', 'POST', events)
  },

  async getBySession(sessionId: string): Promise<DbSimulationEvent[]> {
    return await supabaseRequest<DbSimulationEvent[]>(`/simulation_events?session_id=eq.${sessionId}&order=ts.asc&limit=500`) ?? []
  },
}

// ─── Health Check ─────────────────────────────────────────────────────────────

export const supabaseHealthCheck = async (): Promise<boolean> => {
  const result = await supabaseRequest<unknown[]>('/incidents?limit=1&select=id')
  return result !== null
}

// ─── Export singleton config ──────────────────────────────────────────────────

export const supabaseConfig = {
  url: SUPABASE_URL,
  isConfigured: !!SUPABASE_URL,
}
