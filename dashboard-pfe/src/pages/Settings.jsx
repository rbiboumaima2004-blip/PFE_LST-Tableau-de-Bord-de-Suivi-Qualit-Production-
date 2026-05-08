import React, { useState, useEffect } from 'react'
import { thresholdService } from '../services/api.js'
import { Plus, Save } from 'lucide-react'

export default function Settings() {
  const [thresholds, setThresholds] = useState([])
  const [form, setForm] = useState({ sensor_id: '', sensor_name: '', ligne: 'PN', min_value: '', max_value: '', unit: '' })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    thresholdService.list().then(setThresholds).catch(() => {})
  }, [])

  const handleSubmit = async () => {
    await thresholdService.create({
      ...form,
      min_value: form.min_value !== '' ? parseFloat(form.min_value) : null,
      max_value: form.max_value !== '' ? parseFloat(form.max_value) : null,
    })
    const updated = await thresholdService.list()
    setThresholds(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    setForm({ sensor_id: '', sensor_name: '', ligne: 'PN', min_value: '', max_value: '', unit: '' })
  }

  const LINES = ['PN', 'Granulateur', 'Lavage', 'Séchage', 'Enrobage', 'PRODUIT FINI']

  return (
    <div>
      <h1 className="section-title mb-24">Paramètres — Seuils d'alerte</h1>

      {/* Form */}
      <div className="card mb-24">
        <div style={{ fontWeight: 600, marginBottom: 16, fontSize: 13 }}>Ajouter / Modifier un seuil</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>ID Capteur</label>
            <input value={form.sensor_id} onChange={e => setForm(f => ({ ...f, sensor_id: e.target.value }))} placeholder="ex: TI-027" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Nom capteur</label>
            <input value={form.sensor_name} onChange={e => setForm(f => ({ ...f, sensor_name: e.target.value }))} placeholder="ex: Temp Bouille" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Ligne</label>
            <select value={form.ligne} onChange={e => setForm(f => ({ ...f, ligne: e.target.value }))} style={{ width: '100%' }}>
              {LINES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Seuil minimum</label>
            <input type="number" value={form.min_value} onChange={e => setForm(f => ({ ...f, min_value: e.target.value }))} placeholder="Optionnel" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Seuil maximum</label>
            <input type="number" value={form.max_value} onChange={e => setForm(f => ({ ...f, max_value: e.target.value }))} placeholder="Optionnel" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Unité</label>
            <input value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} placeholder="ex: °C" style={{ width: '100%' }} />
          </div>
        </div>
        <button className="btn-primary" onClick={handleSubmit} style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Save size={14} /> {saved ? '✓ Enregistré !' : 'Enregistrer le seuil'}
        </button>
      </div>

      {/* Existing thresholds */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontWeight: 600, fontSize: 13 }}>
          Seuils configurés ({thresholds.length})
        </div>
        {thresholds.length === 0 ? (
          <div className="flex-center" style={{ height: 120, color: 'var(--text-secondary)' }}>
            Aucun seuil configuré
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID Capteur</th>
                <th>Nom</th>
                <th>Ligne</th>
                <th>Min</th>
                <th>Max</th>
                <th>Unité</th>
              </tr>
            </thead>
            <tbody>
              {thresholds.map(t => (
                <tr key={t.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{t.sensor_id}</td>
                  <td>{t.sensor_name}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{t.ligne}</td>
                  <td style={{ color: 'var(--accent-orange)' }}>{t.min_value ?? '—'}</td>
                  <td style={{ color: 'var(--accent-red)' }}>{t.max_value ?? '—'}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{t.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
