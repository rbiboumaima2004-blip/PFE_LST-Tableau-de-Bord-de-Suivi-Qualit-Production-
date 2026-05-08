import React, { useCallback } from 'react'
import { useRealtime } from '../hooks/useRealtime.js'
import { alertService } from '../services/api.js'
import { AlertTriangle, AlertCircle, RefreshCw } from 'lucide-react'

export default function Alerts() {
  const fetchAlerts = useCallback(() => alertService.getActive(), [])
  const { data, loading, refresh } = useRealtime(fetchAlerts, 10000)
  const alerts = Array.isArray(data) ? data : []

  const critiques = alerts.filter(a => a.severity === 'CRITIQUE')
  const avertissements = alerts.filter(a => a.severity === 'AVERTISSEMENT')

  return (
    <div>
      <div className="flex-between mb-24">
        <h1 className="section-title" style={{ margin: 0 }}>Alertes actives</h1>
        <button className="btn-secondary flex gap-8" onClick={refresh}>
          <RefreshCw size={14} /> Rafraîchir
        </button>
      </div>

      {/* Stats */}
      <div className="grid-3 mb-24">
        <div className="card" style={{ borderColor: 'var(--accent-red)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6 }}>CRITIQUES</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--accent-red)' }}>{critiques.length}</div>
        </div>
        <div className="card" style={{ borderColor: 'var(--accent-orange)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6 }}>AVERTISSEMENTS</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--accent-orange)' }}>{avertissements.length}</div>
        </div>
        <div className="card">
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6 }}>TOTAL</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--text-primary)' }}>{alerts.length}</div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-secondary)' }}>
          Chargement...
        </div>
      ) : alerts.length === 0 ? (
        <div className="card flex-center" style={{ height: 200, flexDirection: 'column', gap: 12 }}>
          <span style={{ fontSize: 32 }}>✅</span>
          <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>
            Aucune alerte active — Production normale
          </span>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table>
            <thead>
              <tr>
                <th>Sévérité</th>
                <th>Capteur</th>
                <th>Ligne</th>
                <th>Valeur actuelle</th>
                <th>Description</th>
                <th>Heure</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((a, i) => (
                <tr key={i}>
                  <td>
                    <span className={`badge badge-${a.severity === 'CRITIQUE' ? 'critique' : 'avert'}`}>
                      {a.severity === 'CRITIQUE'
                        ? <AlertCircle size={10} />
                        : <AlertTriangle size={10} />}
                      {a.severity}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{a.sensor_id}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{a.sensor_name}</div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{a.ligne}</td>
                  <td style={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: a.severity === 'CRITIQUE' ? 'var(--accent-red)' : 'var(--accent-orange)'
                  }}>
                    {a.value} {a.unit}
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{a.description}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 11, fontFamily: 'monospace' }}>
                    {new Date(a.timestamp).toLocaleTimeString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}