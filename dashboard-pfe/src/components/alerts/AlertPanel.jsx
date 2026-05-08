import React from 'react'
import { AlertTriangle, AlertCircle } from 'lucide-react'

export default function AlertPanel({ alerts = [] }) {
  if (!alerts.length) {
    return (
      <div className="card flex-center" style={{ height: 120, color: 'var(--accent-green)' }}>
        ✓ Aucune alerte active
      </div>
    )
  }
  return (
    <div className="card" style={{ maxHeight: 300, overflowY: 'auto' }}>
      {alerts.map((a, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0',
          borderBottom: i < alerts.length - 1 ? '1px solid var(--border)' : 'none'
        }}>
          {a.severity === 'CRITIQUE'
            ? <AlertCircle size={16} color="var(--accent-red)" style={{ marginTop: 2, flexShrink: 0 }} />
            : <AlertTriangle size={16} color="var(--accent-orange)" style={{ marginTop: 2, flexShrink: 0 }} />}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
              {a.sensor_name} — {a.ligne}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
              {a.description}
            </div>
          </div>
          <span className={`badge badge-${a.severity === 'CRITIQUE' ? 'critique' : 'avert'}`}>
            {a.severity}
          </span>
        </div>
      ))}
    </div>
  )
}
