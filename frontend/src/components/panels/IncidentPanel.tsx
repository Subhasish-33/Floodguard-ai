/**
 * IncidentPanel.tsx — Incident Management Command Panel
 * Phase-4: Live incident feed with lifecycle management, operator notes,
 * severity color coding, and audit trail viewer.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  useIncidentStore,
  type Incident,
  type IncidentSeverity,
  type IncidentLifecycle,
} from '@/store/useIncidentStore'

const SEVERITY_STYLE: Record<IncidentSeverity, { label: string; color: string; dot: string }> = {
  LOW:      { label: 'LOW',      color: 'text-emerald-700 border-emerald-200 bg-emerald-50', dot: 'bg-emerald-500' },
  MEDIUM:   { label: 'MED',      color: 'text-amber-700   border-amber-200   bg-amber-50',   dot: 'bg-amber-500'   },
  HIGH:     { label: 'HIGH',     color: 'text-orange-700  border-orange-200  bg-orange-50',  dot: 'bg-orange-500'  },
  CRITICAL: { label: 'CRITICAL', color: 'text-red-700     border-red-200     bg-red-50',     dot: 'bg-red-500'     },
}

const LIFECYCLE_ACTIONS: Record<IncidentLifecycle, { next: IncidentLifecycle | null; label: string }> = {
  DETECTED:   { next: 'ESCALATED',  label: 'Escalate' },
  ESCALATED:  { next: 'RESPONDING', label: 'Deploy Response' },
  RESPONDING: { next: 'RESOLVED',   label: 'Resolve' },
  RESOLVED:   { next: null,         label: 'Resolved' },
}

const IncidentCard = ({ incident }: { incident: Incident }) => {
  const [expanded, setExpanded] = useState(false)
  const [noteText, setNoteText] = useState('')

  const { updateLifecycle, addNote, updateSeverity } = useIncidentStore.getState()
  const severityStyle = SEVERITY_STYLE[incident.severity] || SEVERITY_STYLE['HIGH']
  const actionCfg     = LIFECYCLE_ACTIONS[incident.lifecycle] || LIFECYCLE_ACTIONS['DETECTED']

  const handleAdvance = () => {
    if (actionCfg.next) updateLifecycle(incident.incidentId, actionCfg.next)
  }

  const handleAddNote = () => {
    if (!noteText.trim()) return
    addNote(incident.incidentId, noteText.trim())
    setNoteText('')
  }

  return (
    <motion.div
      layout
      className={`rounded-2xl border text-xs shadow-sm backdrop-blur-sm ${
        incident.severity === 'CRITICAL' ? 'border-red-200 bg-red-50/50' : 'border-white/60 bg-white/40'
      }`}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-start gap-2.5 p-3 text-left"
      >
        <div className={`mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full ${severityStyle.dot} ${
          incident.severity === 'CRITICAL' ? 'animate-pulse' : ''
        }`} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={`rounded-md border px-2 py-0.5 text-[9px] tracking-widest uppercase font-medium ${severityStyle.color}`}>
              {severityStyle.label}
            </span>
            <span className="text-[9px] text-slate-500 uppercase tracking-widest">{incident.lifecycle}</span>
          </div>
          <p className="mt-0.5 truncate font-medium text-slate-900">{incident.title}</p>
          {incident.districtId && (
            <p className="text-[10px] capitalize text-slate-500">{incident.districtId}</p>
          )}
        </div>
        <span className="shrink-0 text-slate-400">{expanded ? '▲' : '▼'}</span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 border-t border-slate-200/50 px-3 pb-3 pt-3">
              <p className="text-slate-600 leading-relaxed">{incident.description}</p>

              {/* Lifecycle controls */}
              <div className="flex gap-2">
                {actionCfg.next && (
                  <button
                    type="button"
                    onClick={handleAdvance}
                    className={`flex-1 rounded-lg border py-1.5 text-[10px] uppercase tracking-widest font-medium ${
                      actionCfg.next === 'RESOLVED'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100'
                    }`}
                  >
                    {actionCfg.label}
                  </button>
                )}
                <select
                  value={incident.severity}
                  onChange={(e) => updateSeverity(incident.incidentId, e.target.value as IncidentSeverity)}
                  className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-[10px] text-slate-800"
                >
                  {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as IncidentSeverity[]).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              {incident.notes.length > 0 && (
                <div className="space-y-1.5">
                  {incident.notes.map((n) => (
                    <div key={n.noteId} className="rounded-lg bg-slate-100/80 px-2.5 py-2">
                      <p className="text-[9px] text-slate-400">{new Date(n.timestamp).toLocaleTimeString()}</p>
                      <p className="mt-0.5 text-slate-800">{n.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Note */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                  placeholder="Add operator note…"
                  className="flex-1 rounded-lg border border-slate-300 bg-white/80 px-2.5 py-1.5 text-[11px] text-slate-900 placeholder-slate-400 outline-none focus:border-teal-400"
                />
                <button
                  type="button"
                  onClick={handleAddNote}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-[10px] text-slate-600 hover:bg-slate-100"
                >
                  Add
                </button>
              </div>

              {/* Audit Trail */}
              <div className="space-y-1 border-t border-slate-200/50 pt-3">
                <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-2">Audit Trail</p>
                {incident.auditTrail.slice(-4).map((e) => (
                  <div key={e.entryId} className="flex gap-2 text-[9px]">
                    <span className="text-slate-400">{new Date(e.timestamp).toLocaleTimeString()}</span>
                    <span className="text-slate-600">{e.action}</span>
                    {e.to && <span className="text-teal-600">→ {e.to}</span>}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export const IncidentPanel = () => {
  const incidents    = useIncidentStore((s) => s.incidents)
  const createIncident = useIncidentStore((s) => s.createIncident)
  const exportAuditLog = useIncidentStore((s) => s.exportAuditLog)
  const activeIncidents = incidents.filter((i) => i.lifecycle !== 'RESOLVED')
  const criticalCount   = incidents.filter((i) => i.severity === 'CRITICAL' && i.lifecycle !== 'RESOLVED').length

  const handleExport = () => {
    const log = exportAuditLog()
    const blob = new Blob([log], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url
    a.download = `floodguard-audit-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleQuickCreate = () => {
    createIncident({
      type: 'FLOOD',
      severity: 'MEDIUM',
      title: 'Manual Incident Report',
      description: 'Operator-created incident. Add details below.',
      tags: ['manual'],
    })
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-[9px] uppercase tracking-widest text-slate-500">Incident Management</p>
          <div className="flex items-center gap-2 mt-0.5">
            <h3 className="text-sm font-semibold text-slate-900">Active Incidents</h3>
            {criticalCount > 0 && (
              <motion.span
                className="rounded-md bg-red-100 border border-red-200 px-1.5 py-0.5 text-[9px] font-bold text-red-700"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                {criticalCount} CRITICAL
              </motion.span>
            )}
          </div>
        </div>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={handleExport}
            title="Export audit log"
            className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-[9px] text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          >
            Export
          </button>
          <button
            type="button"
            onClick={handleQuickCreate}
            className="rounded-lg border border-teal-200 bg-teal-50 px-2.5 py-1.5 text-[9px] text-teal-700 hover:bg-teal-100"
          >
            + New
          </button>
        </div>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-3 gap-2 pb-2">
        {[
          { label: 'Total', value: incidents.length, color: 'text-slate-800' },
          { label: 'Active', value: activeIncidents.length, color: 'text-amber-600' },
          { label: 'Critical', value: criticalCount, color: criticalCount > 0 ? 'text-red-600' : 'text-slate-500' },
        ].map((m) => (
          <div key={m.label} className="rounded-2xl border border-white/60 bg-white/40 p-2 text-center shadow-sm backdrop-blur-sm">
            <p className={`text-base font-semibold ${m.color}`}>{m.value}</p>
            <p className="text-[9px] uppercase tracking-widest text-slate-500 mt-0.5">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Incident List */}
      <div className="max-h-72 space-y-2 overflow-y-auto pr-0.5 custom-scrollbar">
        <AnimatePresence>
          {incidents.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500">
              No incidents recorded. Monitoring active.
            </div>
          ) : (
            incidents.slice(0, 12).map((incident) => (
              <IncidentCard key={incident.incidentId} incident={incident} />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
