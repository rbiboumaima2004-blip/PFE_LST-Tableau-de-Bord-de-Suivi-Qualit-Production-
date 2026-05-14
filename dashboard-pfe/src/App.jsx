import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import Alerts from './pages/Alerts.jsx'
import Journal from './pages/Journal.jsx'
import AIAssistant from './pages/AIAssistant.jsx'
import Settings from './pages/Settings.jsx'

function IconGrid()     { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> }
function IconAlert()    { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> }
function IconJournal()  { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> }
function IconAI()       { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg> }
function IconSettings() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M2 12h2M20 12h2M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41"/></svg> }
function IconMenu()     { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg> }
function IconClose()    { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> }

const MENU = [
  { path: '/',           label: 'Tableau de Bord',  Icon: IconGrid     },
  { path: '/alertes',    label: 'Alertes',           Icon: IconAlert    },
  { path: '/journal',    label: 'Journal Incidents', Icon: IconJournal  },
  { path: '/ai',         label: 'Assistant IA',      Icon: IconAI       },
  { path: '/parametres', label: 'Parametres',        Icon: IconSettings },
]

function Sidebar({ open, setOpen }) {
  const nav = useNavigate()
  const loc = useLocation()
  const W = open ? 250 : 64

  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            display: 'none',
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)', zIndex: 99,
          }}
        />
      )}

      <div style={{
        width: W,
        minHeight: '100vh',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100,
        background: 'linear-gradient(180deg,#080f1f 0%,#091626 60%,#0a1a2e 100%)',
        borderRight: '1px solid #162840',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
      }}>

        {/* ── HEADER ── */}
        <div style={{
          padding: open ? '20px 16px 16px' : '16px 8px',
          borderBottom: '1px solid #162840',
          display: 'flex', alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          gap: 8, minHeight: open ? 100 : 60,
          transition: 'all 0.3s',
        }}>
          {open && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
              <img
                src="/logo-ocp.jpeg"
                alt="OCP"
                style={{
                  width: 42, height: 42, borderRadius: 10,
                  objectFit: 'contain', background: '#fff',
                  padding: 3, flexShrink: 0,
                }}
              />
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', whiteSpace: 'nowrap' }}>
                  OCP Group
                </div>
                <div style={{
                  fontSize: 9, color: '#4d9fff', fontWeight: 700,
                  letterSpacing: 1.5, textTransform: 'uppercase', whiteSpace: 'nowrap',
                }}>
                  Digit All Manufacturing
                </div>
              </div>
            </div>
          )}

          {/* ── Bouton toggle (un seul) ── */}
          <button
            onClick={() => setOpen(!open)}
            style={{
              width: 30, height: 30, borderRadius: 8, flexShrink: 0,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid #162840',
              color: '#5a7fa0', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s', padding: 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(0,109,183,0.2)'
              e.currentTarget.style.color = '#4d9fff'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
              e.currentTarget.style.color = '#5a7fa0'
            }}
          >
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </div>

        {/* ── STATUS ── */}
        {open && (
          <div style={{ padding: '10px 16px', borderBottom: '1px solid #162840' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '7px 12px', borderRadius: 8,
              background: 'rgba(0,166,81,0.12)', border: '1px solid rgba(0,166,81,0.25)',
            }}>
              <div style={{
                width: 7, height: 7, borderRadius: '50%',
                background: '#00c96a', boxShadow: '0 0 8px #00c96a',
                flexShrink: 0,
              }} />
              <span style={{ fontSize: 11, color: '#00c96a', fontWeight: 600, whiteSpace: 'nowrap' }}>
                Systeme operationnel
              </span>
            </div>
          </div>
        )}

        {/* ── NAV ── */}
        <div style={{
          padding: open ? '14px 10px' : '14px 8px',
          flex: 1, overflowY: 'auto', overflowX: 'hidden',
        }}>
          {open && (
            <div style={{
              fontSize: 9, color: '#2E5472', fontWeight: 700,
              letterSpacing: 2, textTransform: 'uppercase',
              padding: '0 6px', marginBottom: 8,
            }}>
              Navigation
            </div>
          )}

          {MENU.map(({ path, label, Icon }) => {
            const active = loc.pathname === path
            return (
              <div
                key={path}
                onClick={() => nav(path)}
                title={!open ? label : ''}
                style={{
                  display: 'flex', alignItems: 'center',
                  gap: open ? 12 : 0,
                  padding: open ? '11px 12px' : '11px 0',
                  justifyContent: open ? 'flex-start' : 'center',
                  borderRadius: 10, marginBottom: 3, cursor: 'pointer',
                  background: active
                    ? 'linear-gradient(135deg,rgba(0,109,183,0.28),rgba(0,166,81,0.12))'
                    : 'transparent',
                  border: active ? '1px solid rgba(0,109,183,0.35)' : '1px solid transparent',
                  color: active ? '#fff' : '#5a7fa0',
                  transition: 'all 0.2s',
                  position: 'relative',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                    e.currentTarget.style.color = '#9ab8d4'
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = '#5a7fa0'
                  }
                }}
              >
                <div style={{
                  width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                  background: active ? 'rgba(0,109,183,0.35)' : 'rgba(255,255,255,0.04)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: active ? '#4d9fff' : '#5a7fa0',
                }}>
                  <Icon />
                </div>

                {open && (
                  <>
                    <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, flex: 1, whiteSpace: 'nowrap' }}>
                      {label}
                    </span>
                    {active && (
                      <div style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: '#4d9fff', boxShadow: '0 0 8px #4d9fff', flexShrink: 0,
                      }} />
                    )}
                  </>
                )}

                {/* Tooltip quand sidebar fermée */}
                {!open && active && (
                  <div style={{
                    position: 'absolute', left: '100%', top: '50%',
                    transform: 'translateY(-50%)', marginLeft: 8,
                    background: '#0a1628', border: '1px solid #162840',
                    borderRadius: 6, padding: '4px 10px',
                    fontSize: 11, fontWeight: 600, color: '#fff',
                    whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 200,
                  }}>
                    {label}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* ── FOOTER ── */}
        <div style={{ padding: open ? '14px 16px' : '14px 8px', borderTop: '1px solid #162840' }}>
          {open ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg,#006DB7,#00A651)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 800, color: '#fff',
                }}>OP</div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#dce8f5', whiteSpace: 'nowrap' }}>
                    Operateur OCP
                  </div>
                  <div style={{ fontSize: 10, color: '#2E5472', whiteSpace: 'nowrap' }}>
                    Jorf Lasfar, El Jadida
                  </div>
                </div>
              </div>
              <div style={{
                padding: '6px 10px', borderRadius: 7, textAlign: 'center',
                background: 'rgba(0,109,183,0.08)', border: '1px solid rgba(0,109,183,0.18)',
                fontSize: 10, color: '#4d9fff',
              }}>
                PFE 2024-2025 · FST Mohammadia
              </div>
            </>
          ) : (
            <div style={{
              width: 36, height: 36, borderRadius: '50%', margin: '0 auto',
              background: 'linear-gradient(135deg,#006DB7,#00A651)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 800, color: '#fff',
            }}>OP</div>
          )}
        </div>

      </div>
    </>
  )
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const sidebarW = sidebarOpen ? 250 : 64

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#060c18' }}>
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <div style={{
          marginLeft: sidebarW, flex: 1, minHeight: '100vh',
          transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}>
          <Routes>
            <Route path="/"           element={<Dashboard   />} />
            <Route path="/alertes"    element={<Alerts      />} />
            <Route path="/journal"    element={<Journal     />} />
            <Route path="/ai"         element={<AIAssistant />} />
            <Route path="/parametres" element={<Settings    />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}