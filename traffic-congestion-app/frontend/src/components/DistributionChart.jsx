import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const colors = ['#34d399', '#fbbf24', '#fb923c', '#f87171']

export default function DistributionChart({ distribution }) {
  const data = Object.entries(distribution || {}).map(([name, value]) => ({ name, value }))

  return (
    <div className="card h-72">
      <h3 className="font-semibold mb-3">Congestion Distribution</h3>
      <ResponsiveContainer width="100%" height="88%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={92}>
            {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
