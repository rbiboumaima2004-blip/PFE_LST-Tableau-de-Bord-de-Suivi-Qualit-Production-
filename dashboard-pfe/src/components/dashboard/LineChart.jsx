import React, { useState, useEffect } from 'react'
import { LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { sensorService } from '../../services/api.js'
import { format } from 'date-fns'

export default function LineChart({ sensorId, sensorName, unit, color = '#388bfd' }) {
  const [data, setData] = useState([])

  useEffect(() => {
    if (!sensorId) return
    sensorService.getHistory(sensorId, 50).then(rows => {
      setData(rows.reverse().map(r => ({
        time: format(new Date(r.timestamp), 'HH:mm'),
        value: r.value
      })))
    }).catch(() => {})
  }, [sensorId])

  return (
    <div className="card">
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>
        {sensorName} <span style={{ color: 'var(--text-secondary)' }}>({unit})</span>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <ReLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="time" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
          <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
          <Tooltip
            contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6 }}
            labelStyle={{ color: 'var(--text-secondary)' }}
            itemStyle={{ color }}
          />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  )
}
