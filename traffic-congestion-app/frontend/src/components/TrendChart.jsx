import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

export default function TrendChart({ data }) {
  return (
    <div className="card h-72">
      <h3 className="font-semibold mb-3">Traffic Volume Trend</h3>
      <ResponsiveContainer width="100%" height="88%">
        <LineChart data={data || []}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2a44" />
          <XAxis dataKey="time" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Line type="monotone" dataKey="volume" stroke="#00d4ff" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
