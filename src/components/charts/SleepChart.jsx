import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function SleepChart({ data }) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="sleepFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1A3A63" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#1A3A63" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#E6ECF2" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} domain={[4, 9]} />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: '1px solid #E6ECF2',
            }}
          />
          <Area type="monotone" dataKey="sleep" name="Sleep (hrs)" stroke="#1A3A63" fill="url(#sleepFill)" strokeWidth={2.2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
