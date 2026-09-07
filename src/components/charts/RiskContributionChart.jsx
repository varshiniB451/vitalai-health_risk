import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function RiskContributionChart({ data }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
          <XAxis type="number" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="label" width={110} tick={{ fill: '#0F172A', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(value) => [`${value > 0 ? '+' : ''}${value}`, 'Contribution']}
            contentStyle={{ borderRadius: 12, border: '1px solid #E6ECF2' }}
          />
          <Bar dataKey="value" radius={[0, 8, 8, 0]} maxBarSize={18}>
            {data.map((entry) => (
              <Cell key={entry.key} fill={entry.value >= 0 ? '#D97706' : '#059669'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
