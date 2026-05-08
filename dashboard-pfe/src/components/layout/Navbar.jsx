import React, { useEffect, useState } from 'react'
import { RefreshCw, Activity } from 'lucide-react'

export default function Navbar() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <header style={{
      background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)',
      padding: '12px 24px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Activity size={14} color="var(--accent-green)" />
        <span style={{ fontSize: 12, color: 'var(--accent-green)', fontWeight: 600 }}>LIVE</span>
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
        {time.toLocaleString('fr-FR')}
      </div>
    </header>
  )
}
