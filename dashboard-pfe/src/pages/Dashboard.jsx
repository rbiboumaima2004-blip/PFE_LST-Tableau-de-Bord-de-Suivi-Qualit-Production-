import React, { useCallback, useState, useEffect } from 'react'
import { useRealtime } from '../hooks/useRealtime.js'
import { sensorService, alertService } from '../services/api.js'
import KPICard from '../components/dashboard/KPICard.jsx'
import SensorGrid from '../components/dashboard/SensorGrid.jsx'
import LineChart from '../components/dashboard/LineChart.jsx'
import AlertPanel from '../components/alerts/AlertPanel.jsx'

const LINES = ['PN', 'Granulateur', 'Lavage', 'Sechage', 'Enrobage', 'PRODUIT FINI']

export default function Dashboard() {
  const [selectedLine, setSelectedLine] = useState('PN')
  const [time, setTime] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t) }, [])
  const fetchSensors = useCallback(() => sensorService.getLive(), [])
  const fetchAlerts  = useCallback(() => alertService.getActive(), [])
  const { data: sensors = [], loading: loadingSensors } = useRealtime(fetchSensors)
  const { data: alerts  = [] }                          = useRealtime(fetchAlerts)
  const safeSensors = Array.isArray(sensors) ? sensors : []
  const safeAlerts  = Array.isArray(alerts)  ? alerts  : []
  const uniqueSensors = Object.values(
    safeSensors.filter(s => s.ligne === selectedLine)
      .reduce((acc, s) => { acc[s.sensor_id] = s; return acc }, {})
  )
  const pf = safeSensors.filter(s => s.ligne === 'PRODUIT FINI')
  const getNPK = (id) => pf.find(s => s.sensor_id === id)?.value
  const critiques = safeAlerts.filter(a => a.severity === 'CRITIQUE').length
  const kpiSensors = [
    { id:'PF-N',    label:'N (Azote)',           unit:'%', target:11.5 },
    { id:'PF-P2O5', label:'P\u2082O\u2085',      unit:'%', target:44   },
    { id:'PF-K2O',  label:'K\u2082O',            unit:'%', target:15   },
    { id:'PF-TG24', label:'Taux Granulométrique', unit:'%', target:88   },
  ]
  return (
    <div style={{ padding:28, minHeight:'100vh', background:'var(--bg-primary)' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:32, paddingBottom:20, borderBottom:'1px solid rgba(30,58,95,0.6)' }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:6 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#006DB7,#00A651)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:900, color:'#fff' }}>O</div>
            <div>
              <h1 style={{ margin:0, fontSize:22, fontWeight:700, color:'#e2eaf4', lineHeight:1 }}>Tableau de Bord</h1>
              <div style={{ fontSize:11, color:'#4d9fff', marginTop:3 }}>OCP Group · Jorf Lasfar · Production NPK</div>
            </div>
          </div>
          <div style={{ fontSize:12, color:'#3d5a7a', marginLeft:48 }}>
            {time.toLocaleDateString('fr-FR',{ weekday:'long', day:'numeric', month:'long', year:'numeric' })}
            {' · '}
            <span style={{ fontFamily:'monospace', color:'#6b8aad' }}>{time.toLocaleTimeString('fr-FR')}</span>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 14px', background: critiques===0 ? 'rgba(0,201,106,0.1)' : 'rgba(248,81,73,0.1)', border:`1px solid ${critiques===0 ? 'rgba(0,201,106,0.3)' : 'rgba(248,81,73,0.3)'}`, borderRadius:20 }}>
          <div style={{ width:7, height:7, borderRadius:'50%', background: critiques===0 ? '#00c96a' : '#f85149' }} />
          <span style={{ fontSize:12, fontWeight:600, color: critiques===0 ? '#00c96a' : '#f85149' }}>
            {critiques===0 ? 'Production normale' : `${critiques} alerte(s) critique(s)`}
          </span>
        </div>
      </div>
      <div style={{ marginBottom:32 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
          <div style={{ width:3, height:20, background:'linear-gradient(180deg,#006DB7,#00A651)', borderRadius:2 }} />
          <span style={{ fontSize:11, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:'#6b8aad' }}>Qualité Produit Fini</span>
          <span style={{ marginLeft:'auto', fontSize:10, color:'#4d9fff', padding:'3px 10px', border:'1px solid rgba(77,159,255,0.3)', borderRadius:12, fontWeight:600 }}>NPK · 15-44-15</span>
        </div>
        <div className="grid-4">
          {kpiSensors.map(({ id, label, unit, target }) => {
            const val = getNPK(id)
            const status = val !== undefined ? Math.abs(val-target)/target > 0.05 ? 'warning' : 'ok' : 'ok'
            return <KPICard key={id} title={label} value={val !== undefined ? val.toFixed(2) : '--'} unit={unit} status={status} subtitle={`Cible : ${target} ${unit}`} />
          })}
        </div>
      </div>
      {safeAlerts.length > 0 && (
        <div style={{ marginBottom:32 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
            <div style={{ width:3, height:20, background:'linear-gradient(180deg,#006DB7,#00A651)', borderRadius:2 }} />
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:'#6b8aad' }}>Alertes actives · {safeAlerts.length}</span>
          </div>
          <AlertPanel alerts={safeAlerts.slice(0,5)} />
        </div>
      )}
      <div style={{ marginBottom:32 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:3, height:20, background:'linear-gradient(180deg,#006DB7,#00A651)', borderRadius:2 }} />
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:'#6b8aad' }}>Capteurs — {selectedLine} ({uniqueSensors.length})</span>
          </div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            {LINES.map(l => (
              <button key={l} onClick={() => setSelectedLine(l)} style={{ padding:'5px 13px', fontSize:11, borderRadius:20, fontWeight: selectedLine===l?700:400, cursor:'pointer', background: selectedLine===l ? 'linear-gradient(135deg,#006DB7,#00A651)' : 'transparent', color: selectedLine===l ? '#fff' : '#6b8aad', border:`1px solid ${selectedLine===l ? 'transparent' : '#1e3a5f'}` }}>{l}</button>
            ))}
          </div>
        </div>
        {loadingSensors ? (
          <div style={{ textAlign:'center', padding:48, color:'#6b8aad', background:'#0f1f35', borderRadius:10 }}>Chargement...</div>
        ) : uniqueSensors.length === 0 ? (
          <div style={{ textAlign:'center', padding:48, color:'#6b8aad', background:'#0f1f35', borderRadius:10 }}>Aucun capteur pour {selectedLine}</div>
        ) : (
          <SensorGrid sensors={uniqueSensors} />
        )}
      </div>
      <div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:3, height:20, background:'linear-gradient(180deg,#006DB7,#00A651)', borderRadius:2 }} />
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:'#6b8aad' }}>Historique Temps Réel</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6, padding:'4px 12px', background:'rgba(0,201,106,0.08)', border:'1px solid rgba(0,201,106,0.2)', borderRadius:12 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#00c96a', boxShadow:'0 0 6px #00c96a' }} />
            <span style={{ fontSize:10, color:'#00c96a', fontWeight:600, letterSpacing:1 }}>EN DIRECT</span>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16 }}>
          {[
            { id:'TI-027',  name:'Température PN',      unit:'°C',   color:'#f85149' },
            { id:'TI-138',  name:'Température Sécheur', unit:'°C',   color:'#d29922' },
            { id:'FIC-001', name:'Débit PN',            unit:'m3/h', color:'#388bfd' },
            { id:'LIC-503', name:'Niveau AD01',         unit:'%',    color:'#3fb950' },
          ].map(({ id, name, unit, color }) => (
            <div key={id} style={{ background:'#0f1f35', border:'1px solid #1e3a5f', borderRadius:12, padding:20, position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:color }} />
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                <span style={{ fontSize:12, fontWeight:600, color:'#94a3b8' }}>{name}</span>
                <span style={{ fontSize:10, padding:'2px 8px', borderRadius:10, fontWeight:600, background:`${color}22`, color, border:`1px solid ${color}44` }}>{unit}</span>
              </div>
              <LineChart sensorId={id} sensorName={name} unit={unit} color={color} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}