export default function AlertsList({ alerts }) {
  const color = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500'
  }

  return (
    <div className="card">
      <h3 className="font-semibold mb-3">Real-time Alerts</h3>
      <div className="space-y-3">
        {(alerts || []).map((a) => (
          <div key={a.id} className="p-3 rounded-lg bg-slate-900/60">
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-2 h-2 rounded-full ${color[a.severity] || 'bg-slate-500'}`}></span>
              <span className="text-xs uppercase text-slate-400">{a.severity}</span>
            </div>
            <p className="font-medium">{a.title}</p>
            <p className="text-sm text-slate-300">{a.message}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
