import React, { useCallback, useState } from 'react'
import { useRealtime } from '../hooks/useRealtime.js'
import { sensorService, alertService } from '../services/api.js'
import KPICard from '../components/dashboard/KPICard.jsx'
import SensorGrid from '../components/dashboard/SensorGrid.jsx'
import LineChart from '../components/dashboard/LineChart.jsx'
import AlertPanel from '../components/alerts/AlertPanel.jsx'

const LINES = ['PN', 'Granulateur', 'Lavage', 'Séchage', 'Enrobage', 'PRODUIT FINI']

export default function Dashboard() {
  const [selectedLine, setSelectedLine] = useState('PN')

  // API calls
  const fetchSensors = useCallback(() => sensorService.getLive(), [])
  const fetchAlerts = useCallback(() => alertService.getActive(), [])

  const { data: sensors = [], loading: loadingSensors } = useRealtime(fetchSensors)
  const { data: alerts = [] } = useRealtime(fetchAlerts)

  const safeSensors = sensors || []
  const safeAlerts = alerts || []

  // ✅ 1. Filter by selected line
  const filteredSensors = safeSensors.filter(s => s.ligne === selectedLine)

  // ✅ 2. Remove duplicates (keep last value per sensor_id)
  const uniqueSensors = Object.values(
    filteredSensors.reduce((acc, sensor) => {
      acc[sensor.sensor_id] = sensor
      return acc
    }, {})
  )

  // KPI Produit fini
  const pf = safeSensors.filter(s => s.ligne === 'PRODUIT FINI')
  const getNPK = (id) => pf.find(s => s.sensor_id === id)?.value

  const kpiSensors = [
    { id: 'PF-N', label: 'N (Azote)', unit: '%', target: 11.5 },
    { id: 'PF-P2O5', label: 'P₂O₅', unit: '%', target: 44 },
    { id: 'PF-K2O', label: 'K₂O', unit: '%', target: 15 },
    { id: 'PF-TG24', label: 'Taux Granulométrique', unit: '%', target: 88 },
  ]

  const critiques = safeAlerts.filter(a => a.severity === 'CRITIQUE').length

  return (
    <div>

      {/* HEADER */}
      <div className="flex-between mb-24">
        <h1 className="section-title" style={{ margin: 0 }}>
          Tableau de bord
        </h1>

        <span
          className="badge"
          style={{
            background: critiques > 0 ? 'rgba(248,81,73,0.2)' : 'rgba(63,185,80,0.2)',
            color: critiques > 0 ? 'var(--accent-red)' : 'var(--accent-green)',
            fontSize: 12
          }}
        >
          {critiques > 0
            ? `⚠ ${critiques} alerte(s) critique(s)`
            : '✓ Production normale'}
        </span>
      </div>

      {/* KPI */}
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
        QUALITÉ PRODUIT FINI
      </div>

      <div className="grid-4 mb-24">
        {kpiSensors.map(({ id, label, unit, target }) => {
          const val = getNPK(id)
          const status =
            val !== undefined
              ? Math.abs(val - target) / target > 0.05
                ? 'warning'
                : 'ok'
              : 'ok'

          return (
            <KPICard
              key={id}
              title={label}
              value={val !== undefined ? val.toFixed(2) : '--'}
              unit={unit}
              status={status}
              subtitle={`Cible: ${target} ${unit}`}
            />
          )
        })}
      </div>

      {/* ALERTS */}
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
        ALERTES ACTIVES ({safeAlerts.length})
      </div>

      <div className="mb-24">
        <AlertPanel alerts={safeAlerts.slice(0, 5)} />
      </div>

      {/* LINE SELECTOR */}
      <div className="flex-between mb-16">
        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          CAPTEURS PAR LIGNE
          <span style={{ marginLeft: 8 }}>
            ({uniqueSensors.length})
          </span>
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {LINES.map(l => (
            <button
              key={l}
              onClick={() => setSelectedLine(l)}
              style={{
                padding: '4px 10px',
                fontSize: 11,
                borderRadius: 4,
                background: selectedLine === l ? 'var(--ocp-green)' : 'var(--bg-secondary)',
                color: selectedLine === l ? 'white' : 'var(--text-secondary)',
                border: '1px solid var(--border)',
                fontWeight: selectedLine === l ? 600 : 400
              }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* SENSOR GRID */}
      {loadingSensors ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          Chargement...
        </div>
      ) : uniqueSensors.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          Aucun capteur pour {selectedLine}
        </div>
      ) : (
        <SensorGrid sensors={uniqueSensors} />
      )}

      {/* CHARTS */}
      <div style={{ marginTop: 32, fontSize: 12, marginBottom: 8 }}>
        HISTORIQUE TEMPS RÉEL
      </div>

      <div className="grid-2">
        <LineChart sensorId="TI-027" sensorName="Temp PN" unit="°C" color="#f85149" />
        <LineChart sensorId="TI-138" sensorName="Temp Sécheur" unit="°C" color="#d29922" />
        <LineChart sensorId="FIC-001" sensorName="Débit PN" unit="m3/h" color="#388bfd" />
        <LineChart sensorId="LIC-503" sensorName="Niveau" unit="%" color="#3fb950" />
      </div>

    </div>
  )
}