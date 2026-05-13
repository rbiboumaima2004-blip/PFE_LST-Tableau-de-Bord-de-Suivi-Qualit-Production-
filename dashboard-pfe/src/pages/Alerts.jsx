import React, { useCallback } from 'react'
import { useRealtime } from '../hooks/useRealtime.js'
import { alertService } from '../services/api.js'
import { AlertTriangle, AlertCircle, RefreshCw } from 'lucide-react'

function SectionHeader({ title, right }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:3, height:20, background:'linear-gradient(180deg,#006DB7,#00A651)', borderRadius:2 }} />
        <span style={{ fontSize:11, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:'#6b8aad' }}>{title}</span>
      </div>
      {right}
    </div>
  )
}

export default function Alerts() {
  const fetchAlerts = useCallback(() => alertService.getActive(), [])
  const { data, loading, refresh } = useRealtime(fetchAlerts, 10000)
  const alerts = Array.isArray(data) ? data : []
  const critiques      = alerts.filter(a => a.severity === 'CRITIQUE')
  const avertissements = alerts.filter(a => a.severity === 'AVERTISSEMENT')

  return (
    <div style={{ padding:28, minHeight:'100vh', background:'var(--bg-primary)' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:32, paddingBottom:20, borderBottom:'1px solid rgba(30,58,95,0.6)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#006DB7,#00A651)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:900, color:'#fff', boxShadow:'0 4px 12px rgba(0,109,183,0.35)' }}>O</div>
          <div>
            <h1 style={{ margin:0, fontSize:22, fontWeight:700, color:'#e2eaf4', lineHeight:1 }}>Alertes</h1>
            <div style={{ fontSize:11, color:'#4d9fff', marginTop:3 }}>OCP Group · Surveillance temps réel</div>
          </div>
        </div>
        <button onClick={refresh} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 16px', background:'rgba(77,159,255,0.1)', border:'1px solid rgba(77,159,255,0.3)', borderRadius:10, color:'#4d9fff', fontSize:12, fontWeight:600, cursor:'pointer' }}>
          <RefreshCw size={14} /> Rafraîchir
        </button>
      </div>

      <div style={{ marginBottom:32 }}>
        <SectionHeader title="Résumé" />
        <div className="grid-3">
          {[
            { label:'Critiques',      count:critiques.length,      color:'#f85149', bg:'rgba(248,81,73,0.08)',   border:'rgba(248,81,73,0.25)'   },
            { label:'Avertissements', count:avertissements.length, color:'#f59e0b', bg:'rgba(245,158,11,0.08)', border:'rgba(245,158,11,0.25)' },
            { label:'Total alertes',  count:alerts.length,         color:'#4d9fff', bg:'rgba(77,159,255,0.08)', border:'rgba(77,159,255,0.25)' },
          ].map(({ label, count, color, bg, border }) => (
            <div key={label} style={{ background:bg, border:`1px solid ${border}`, borderRadius:12, padding:24, position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:color }} />
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', color:'#6b8aad', marginBottom:8 }}>{label}</div>
              <div style={{ fontSize:40, fontWeight:700, color, lineHeight:1 }}>{count}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionHeader title={`Alertes actives · ${alerts.length}`} />
        {loading ? (
          <div style={{ textAlign:'center', padding:60, color:'#6b8aad', background:'#0f1f35', borderRadius:12, border:'1px solid #1e3a5f' }}>Chargement...</div>
        ) : alerts.length === 0 ? (
          <div style={{ textAlign:'center', padding:60, background:'rgba(0,201,106,0.05)', borderRadius:12, border:'1px solid rgba(0,201,106,0.2)' }}>
            <div style={{ fontSize:32, marginBottom:12 }}>✅</div>
            <div style={{ color:'#00c96a', fontWeight:600, fontSize:14 }}>Aucune alerte active — Production normale</div>
          </div>
        ) : (
          <div style={{ background:'#0f1f35', border:'1px solid #1e3a5f', borderRadius:12, overflow:'hidden' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'rgba(10,22,40,0.8)' }}>
                  {['Sévérité','Capteur','Ligne','Valeur','Description','Heure'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', color:'#6b8aad', borderBottom:'1px solid #1e3a5f' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {alerts.map((a, i) => {
                  const isCrit = a.severity === 'CRITIQUE'
                  return (
                    <tr key={i} style={{ borderBottom:'1px solid rgba(30,58,95,0.4)' }}>
                      <td style={{ padding:'14px 16px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:6, padding:'4px 10px', borderRadius:20, width:'fit-content', background: isCrit ? 'rgba(248,81,73,0.15)' : 'rgba(245,158,11,0.15)', border:`1px solid ${isCrit ? 'rgba(248,81,73,0.35)' : 'rgba(245,158,11,0.35)'}`, color: isCrit ? '#f85149' : '#f59e0b', fontSize:11, fontWeight:700 }}>
                          {isCrit ? <AlertCircle size={10} /> : <AlertTriangle size={10} />}
                          {a.severity}
                        </div>
                      </td>
                      <td style={{ padding:'14px 16px' }}>
                        <div style={{ fontWeight:600, fontSize:12, color:'#e2eaf4' }}>{a.sensor_id}</div>
                        <div style={{ fontSize:11, color:'#6b8aad', marginTop:2 }}>{a.sensor_name}</div>
                      </td>
                      <td style={{ padding:'14px 16px', color:'#6b8aad', fontSize:12 }}>{a.ligne}</td>
                      <td style={{ padding:'14px 16px', fontFamily:'monospace', fontWeight:700, fontSize:13, color: isCrit ? '#f85149' : '#f59e0b' }}>
                        {a.value} <span style={{ fontSize:10, fontWeight:400 }}>{a.unit}</span>
                      </td>
                      <td style={{ padding:'14px 16px', color:'#94a3b8', fontSize:12, maxWidth:220 }}>{a.description}</td>
                      <td style={{ padding:'14px 16px', color:'#6b8aad', fontSize:11, fontFamily:'monospace' }}>
                        {new Date(a.timestamp).toLocaleTimeString('fr-FR')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  )
}