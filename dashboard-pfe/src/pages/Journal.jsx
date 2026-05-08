import React, { useState, useCallback } from 'react'
import { useRealtime } from '../hooks/useRealtime.js'
import { incidentService } from '../services/api.js'
import { CheckCircle, Clock } from 'lucide-react'

export default function Journal() {
  const [filterStatus, setFilterStatus] = useState('')
  const [filterLigne, setFilterLigne] = useState('')

  const fetchIncidents = useCallback(
    () => incidentService.list(filterStatus || undefined, filterLigne || undefined),
    [filterStatus, filterLigne]
  )
  const { data: incidents = [], refresh } = useRealtime(fetchIncidents, 15000)

  const handleResolve = async (id) => {
    await incidentService.update(id, 'RESOLU', 'Résolu manuellement par opérateur')
    refresh()
  }

  return (
    <div>
      <div className="flex-between mb-24">
        <h1 className="section-title" style={{ margin: 0 }}>Journal des incidents</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Tous statuts</option>
            <option value="OUVERT">Ouvert</option>
            <option value="RESOLU">Résolu</option>
          </select>
          <select value={filterLigne} onChange={e => setFilterLigne(e.target.value)}>
            <option value="">Toutes lignes</option>
            {['PN', 'Granulateur', 'Lavage', 'Séchage', 'Enrobage', 'PRODUIT FINI'].map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {incidents.length === 0 ? (
          <div className="flex-center" style={{ height: 200, color: 'var(--text-secondary)' }}>
            Aucun incident trouvé
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Ligne</th>
                <th>Capteur</th>
                <th>Sévérité</th>
                <th>Description</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map(inc => (
                <tr key={inc.id}>
                  <td style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                    {new Date(inc.created_at).toLocaleString('fr-FR')}
                  </td>
                  <td style={{ fontSize: 12 }}>{inc.ligne}</td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 12 }}>{inc.sensor_id}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{inc.sensor_name}</div>
                  </td>
                  <td>
                    <span className={`badge badge-${inc.severity === 'CRITIQUE' ? 'critique' : 'avert'}`}>
                      {inc.severity}
                    </span>
                  </td>
                  <td style={{ fontSize: 11, color: 'var(--text-secondary)', maxWidth: 200 }}>{inc.description}</td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                      {inc.status === 'RESOLU'
                        ? <><CheckCircle size={12} color="var(--accent-green)" /> Résolu</>
                        : <><Clock size={12} color="var(--accent-orange)" /> Ouvert</>}
                    </span>
                  </td>
                  <td>
                    {inc.status === 'OUVERT' && (
                      <button className="btn-primary" style={{ padding: '4px 10px', fontSize: 11 }}
                        onClick={() => handleResolve(inc.id)}>
                        Résoudre
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
