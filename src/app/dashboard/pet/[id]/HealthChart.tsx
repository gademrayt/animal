'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useMemo } from 'react'

export default function HealthChart({ metrics }: { metrics: any[] }) {
  const data = useMemo(() => {
    if (!metrics) return []
    return [...metrics].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(m => ({
        ...m,
        dateFormatted: new Date(m.date).toLocaleDateString()
      }))
  }, [metrics])

  if (!data || data.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.6 }}>No data points available yet. Add some metrics!</div>
  }

  // Filter out metrics without weight
  const validData = data.filter(d => d.weight !== null && d.weight !== undefined);

  if (validData.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.6 }}>No weight recorded in existing metrics to show in chart.</div>
  }

  return (
    <div style={{ width: '100%', height: '300px', marginTop: '1rem' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={validData}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
          <XAxis dataKey="dateFormatted" stroke="var(--text-color)" opacity={0.6} tick={{ fontSize: 12 }} />
          <YAxis stroke="var(--text-color)" opacity={0.6} tick={{ fontSize: 12 }} />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-color)', backdropFilter: 'blur(8px)' }}
            itemStyle={{ color: 'var(--primary-color)', fontWeight: 'bold' }}
          />
          <Line type="monotone" dataKey="weight" stroke="var(--primary-color)" strokeWidth={3} dot={{ r: 5, fill: 'var(--primary-color)' }} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
