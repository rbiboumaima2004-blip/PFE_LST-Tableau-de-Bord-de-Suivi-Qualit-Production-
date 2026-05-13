import React, { useState, useCallback } from 'react'
import { useRealtime } from '../hooks/useRealtime.js'
import { incidentService } from '../services/api.js'
import { CheckCircle, Clock } from 'lucide-react'

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

const LINES = ['PN','Granulateur','Lavage','Séchage','Enrobage','PRODUIT FINI']

export default function Journal() {
  const [filterStatus, setFilterStatus] = useState('')
  const [filterLigne,  setFilterLigne]  = useState('')

  const fetchIncidents = useCallback(
    () => incidentService.list(filterStatus || undefined, filterLigne || undefined),
    [filterStatus, filterLigne]
  )
  const { data: incidents = [], refresh } = useRealtime(fetchIncidents, 15000)

  const handleResolve = async (id) => {
    await incidentService.update(id, 'RESOLU', 'Résolu manuellement par opérateur')
    refresh()
  }

  const ouverts = incidents.filter(i => i.status === 'OUVERT').length
  const resolus = incidents.filter(i => i.status === 'RESOLU').length

  return (
    <div style={{ padding:28, minHeight:'100vh', background:'var(--bg-primary)' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:32, paddingBottom:20, borderBottom:'1px solid rgba(30,58,95,0.6)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#006DB7,#00A651)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:900, color:'#fff', boxShadow:'0 4px 12px rgba(0,109,183,0.35)' }}>O</div>
          <div>
            <h1 style={{ margin:0, fontSize:22, fontWeight:700, color:'#e2eaf4', lineHeight:1 }}>Journal des Incidents</h1>
            <div style={{ fontSize:11, color:'#4d9fff', marginTop:3 }}>OCP Group · Traçabilité complète</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ background:'#0f1f35', border:'1px solid #1e3a5f', borderRadius:8, color:'#e2eaf4', padding:'7px 12px', fontSize:12, outline:'none' }}>
            <option value="">Tous statuts</option>
            <option value="OUVERT">Ouvert</option>
            <option value="RESOLU">Résolu</option>
          </select>
          <select value={filterLigne} onChange={e => setFilterLigne(e.target.value)} style={{ background:'#0f1f35', border:'1px solid #1e3a5f', borderRadius:8, color:'#e2eaf4', padding:'7px 12px', fontSize:12, outline:'none' }}>
            <option value="">Toutes lignes</option>
            {LINES.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginBottom:32 }}>
        <SectionHeader title="Résumé" />
        <div className="grid-3">
          {[
            { label:'Incidents ouverts', count:ouverts,          color:'#f59e0b', bg:'rgba(245,158,11,0.08)', border:'rgba(245,158,11,0.25)' },
            { label:'Incidents résolus', count:resolus,          color:'#00c96a', bg:'rgba(0,201,106,0.08)',  border:'rgba(0,201,106,0.25)'  },
            { label:'Total incidents',   count:incidents.length, color:'#4d9fff', bg:'rgba(77,159,255,0.08)', border:'rgba(77,159,255,0.25)' },
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
        <SectionHeader title={`Historique · ${incidents.length} incidents`} />
        <div style={{ background:'#0f1f35', border:'1px solid #1e3a5f', borderRadius:12, overflow:'hidden' }}>
          {incidents.length === 0 ? (
            <div style={{ textAlign:'center', padding:60, color:'#6b8aad' }}>Aucun incident trouvé</div>
          ) : (
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'rgba(10,22,40,0.8)' }}>
                  {['Date','Ligne','Capteur','Sévérité','Description','Statut','Action'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', color:'#6b8aad', borderBottom:'1px solid #1e3a5f' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {incidents.map(inc => {
                  const isCrit   = inc.severity === 'CRITIQUE'
                  const isResolu = inc.status   === 'RESOLU'
                  return (
                    <tr key={inc.id} style={{ borderBottom:'1px solid rgba(30,58,95,0.4)' }}>
                      <td style={{ padding:'13px 16px', fontSize:11, fontFamily:'monospace', color:'#6b8aad' }}>
                        {new Date(inc.created_at).toLocaleString('fr-FR')}
                      </td>
                      <td style={{ padding:'13px 16px' }}>
                        <span style={{ padding:'3px 10px', borderRadius:12, fontSize:11, fontWeight:600, background:'rgba(77,159,255,0.1)', color:'#4d9fff', border:'1px solid rgba(77,159,255,0.2)' }}>{inc.ligne}</span>
                      </td>
                      <td style={{ padding:'13px 16px' }}>
                        <div style={{ fontWeight:600, fontSize:12, color:'#e2eaf4' }}>{inc.sensor_id}</div>
                        <div style={{ fontSize:10, color:'#6b8aad', marginTop:2 }}>{inc.sensor_name}</div>
                      </td>
                      <td style={{ padding:'13px 16px' }}>
                        <span style={{ padding:'3px 10px', borderRadius:12, fontSize:11, fontWeight:700, background: isCrit ? 'rgba(248,81,73,0.15)' : 'rgba(245,158,11,0.15)', color: isCrit ? '#f85149' : '#f59e0b', border:`1px solid ${isCrit ? 'rgba(248,81,73,0.3)' : 'rgba(245,158,11,0.3)'}` }}>{inc.severity}</span>
                      </td>
                      <td style={{ padding:'13px 16px', fontSize:11, color:'#94a3b8', maxWidth:200 }}>{inc.description}</td>
                      <td style={{ padding:'13px 16px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                          {isResolu
                            ? <><CheckCircle size={13} color="#00c96a" /><span style={{ fontSize:12, color:'#00c96a', fontWeight:600 }}>Résolu</span></>
                            : <><Clock size={13} color="#f59e0b" /><span style={{ fontSize:12, color:'#f59e0b', fontWeight:600 }}>Ouvert</span></>}
                        </div>
                      </td>
                      <td style={{ padding:'13px 16px' }}>
                        {!isResolu && (
                          <button onClick={() => handleResolve(inc.id)} style={{ padding:'5px 12px', fontSize:11, fontWeight:600, borderRadius:8, background:'linear-gradient(135deg,#006DB7,#00A651)', color:'#fff', border:'none', cursor:'pointer' }}>
                            Résoudre
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}