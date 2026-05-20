/**
 * useIncidentStore.ts — Incident Management Lifecycle State
 * Phase-4: Full CRUD incident management with lifecycle state machine,
 * operator notes, escalation audit trail, and simulation event recording.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type IncidentLifecycle = 'DETECTED' | 'ESCALATED' | 'RESPONDING' | 'RESOLVED'
export type IncidentType = 'FLOOD' | 'SURGE' | 'EMBANKMENT_BREACH' | 'ROAD_BLOCKED' | 'EVACUATION_BLOCKED' | 'COMMUNICATION_LOSS' | 'STRUCTURAL_DAMAGE'

export interface OperatorNote {
  noteId: string
  operatorId: string
  content: string
  timestamp: string
}

export interface AuditEntry {
  entryId: string
  action: string
  from?: string
  to?: string
  timestamp: string
  operatorId: string
}

export interface Incident {
  incidentId: string
  type: IncidentType
  severity: IncidentSeverity
  lifecycle: IncidentLifecycle
  districtId: string | null
  villageName: string | null
  title: string
  description: string
  lat: number | null
  lon: number | null
  createdAt: string
  updatedAt: string
  notes: OperatorNote[]
  auditTrail: AuditEntry[]
  simulationFrame: number | null
  tags: string[]
}

export interface SimulationEvent {
  eventId: string
  sessionId: string
  eventType: 'FRAME_ADVANCE' | 'HOTSPOT_CHANGE' | 'ESCALATION_CHANGE' | 'REPLAY_START' | 'REPLAY_STOP' | 'WEATHER_ALERT'
  payload: Record<string, unknown>
  frameIndex: number
  timestamp: string
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const SESSION_ID = generateId()

interface IncidentState {
  incidents: Incident[]
  simulationEvents: SimulationEvent[]
  activeIncidentId: string | null

  // Actions
  createIncident: (data: Partial<Incident>) => Incident
  updateLifecycle: (incidentId: string, lifecycle: IncidentLifecycle, operatorId?: string) => void
  addNote: (incidentId: string, content: string, operatorId?: string) => void
  updateSeverity: (incidentId: string, severity: IncidentSeverity) => void
  resolveIncident: (incidentId: string) => void
  setActiveIncident: (id: string | null) => void
  recordSimulationEvent: (type: SimulationEvent['eventType'], payload: Record<string, unknown>, frame: number) => void
  exportAuditLog: () => string
  getActiveIncidents: () => Incident[]
  getCriticalIncidents: () => Incident[]
}

export const useIncidentStore = create<IncidentState>()(
  persist(
    (set, get) => ({
      incidents: [],
      simulationEvents: [],
      activeIncidentId: null,

      createIncident: (data) => {
        const now = new Date().toISOString()
        const incident: Incident = {
          incidentId: generateId(),
          type: data.type ?? 'FLOOD',
          severity: data.severity ?? 'MEDIUM',
          lifecycle: 'DETECTED',
          districtId: data.districtId ?? null,
          villageName: data.villageName ?? null,
          title: data.title ?? 'Untitled Incident',
          description: data.description ?? '',
          lat: data.lat ?? null,
          lon: data.lon ?? null,
          createdAt: now,
          updatedAt: now,
          notes: [],
          auditTrail: [{
            entryId: generateId(),
            action: 'INCIDENT_CREATED',
            to: 'DETECTED',
            timestamp: now,
            operatorId: 'system',
          }],
          simulationFrame: data.simulationFrame ?? null,
          tags: data.tags ?? [],
        }

        set((s) => ({ incidents: [incident, ...s.incidents] }))
        return incident
      },

      updateLifecycle: (incidentId, lifecycle, operatorId = 'operator') => {
        set((s) => ({
          incidents: s.incidents.map((inc) => {
            if (inc.incidentId !== incidentId) return inc
            const now = new Date().toISOString()
            return {
              ...inc,
              lifecycle,
              updatedAt: now,
              auditTrail: [
                ...inc.auditTrail,
                {
                  entryId: generateId(),
                  action: 'LIFECYCLE_CHANGE',
                  from: inc.lifecycle,
                  to: lifecycle,
                  timestamp: now,
                  operatorId,
                },
              ],
            }
          }),
        }))
      },

      addNote: (incidentId, content, operatorId = 'operator') => {
        const note: OperatorNote = {
          noteId: generateId(),
          operatorId,
          content,
          timestamp: new Date().toISOString(),
        }
        set((s) => ({
          incidents: s.incidents.map((inc) =>
            inc.incidentId === incidentId
              ? { ...inc, notes: [...inc.notes, note], updatedAt: new Date().toISOString() }
              : inc,
          ),
        }))
      },

      updateSeverity: (incidentId, severity) => {
        set((s) => ({
          incidents: s.incidents.map((inc) => {
            if (inc.incidentId !== incidentId) return inc
            const now = new Date().toISOString()
            return {
              ...inc,
              severity,
              updatedAt: now,
              auditTrail: [
                ...inc.auditTrail,
                { entryId: generateId(), action: 'SEVERITY_CHANGE', from: inc.severity, to: severity, timestamp: now, operatorId: 'operator' },
              ],
            }
          }),
        }))
      },

      resolveIncident: (incidentId) => {
        get().updateLifecycle(incidentId, 'RESOLVED', 'operator')
      },

      setActiveIncident: (id) => set({ activeIncidentId: id }),

      recordSimulationEvent: (eventType, payload, frameIndex) => {
        const event: SimulationEvent = {
          eventId: generateId(),
          sessionId: SESSION_ID,
          eventType,
          payload,
          frameIndex,
          timestamp: new Date().toISOString(),
        }
        set((s) => ({
          simulationEvents: [...s.simulationEvents.slice(-999), event], // Keep last 1000
        }))
      },

      exportAuditLog: () => {
        const { incidents, simulationEvents } = get()
        return JSON.stringify({ incidents, simulationEvents, exportedAt: new Date().toISOString(), sessionId: SESSION_ID }, null, 2)
      },

      getActiveIncidents: () =>
        get().incidents.filter((i) => i.lifecycle !== 'RESOLVED'),

      getCriticalIncidents: () =>
        get().incidents.filter((i) => i.severity === 'CRITICAL' && i.lifecycle !== 'RESOLVED'),
    }),
    {
      name: 'floodguard-incidents',
      partialize: (s) => ({ incidents: s.incidents, simulationEvents: s.simulationEvents.slice(-200) }),
    },
  ),
)
