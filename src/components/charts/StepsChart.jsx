import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function StepsChart({ data }) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid stroke="#E6ECF2" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: '1px solid #E6ECF2',
            }}
          />
          <Bar dataKey="steps" name="Steps" fill="#14B8A6" radius={[8, 8, 4, 4]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
