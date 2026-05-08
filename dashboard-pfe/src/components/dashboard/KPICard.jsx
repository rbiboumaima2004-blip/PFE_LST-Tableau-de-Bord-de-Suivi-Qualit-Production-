import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function KPICard({ title, value, unit, trend, status = 'ok', subtitle }) {
  const colors = {
    ok: 'var(--accent-green)',
    warning: 'var(--accent-orange)',
    critical: 'var(--accent-red)'
  }
  const color = colors[status] || colors.ok

  return (
    <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: color, borderRadius: '8px 8px 0 0'
      }} />
      <div style={{ color: 'var(--text-secondary)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
        {title}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontSize: 28, fontWeight: 700, color, fontFamily: 'monospace' }}>
          {value ?? '—'}
        </span>
        {unit && <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{unit}</span>}
      </div>
      {subtitle && <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>{subtitle}</div>}
      {trend !== undefined && (
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
          {trend > 0 ? <TrendingUp size={12} color={color} /> :
           trend < 0 ? <TrendingDown size={12} color={color} /> :
           <Minus size={12} color="var(--text-secondary)" />}
          <span style={{ color }}>{trend > 0 ? '+' : ''}{trend}%</span>
        </div>
      )}
    </div>
  )
}
