import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function HealthTrendChart({ data, dataKey = 'score', color = '#0D9B8A', name = 'Health score' }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid stroke="#E6ECF2" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} domain={['dataMin - 4', 'dataMax + 4']} />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: '1px solid #E6ECF2',
              boxShadow: '0 12px 30px -16px rgba(11,31,58,0.3)',
            }}
          />
          <Line type="monotone" dataKey={dataKey} name={name} stroke={color} strokeWidth={2.6} dot={{ r: 4, fill: color }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
