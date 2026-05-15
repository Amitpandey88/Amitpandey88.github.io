export default function KpiCards({ summary }) {
  const cards = [
    { label: 'Active Alerts', value: summary?.active_alerts ?? 0 },
    { label: 'High-Risk Zones', value: summary?.high_risk_zones ?? 0 },
    { label: 'Avg City Speed (km/h)', value: summary?.avg_city_speed ?? 0 },
    { label: 'Top Hotspot', value: summary?.predicted_hotspot ?? '-' }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="kpi">
          <span className="text-sm text-slate-400">{card.label}</span>
          <span className="text-2xl font-bold text-accent">{card.value}</span>
        </div>
      ))}
    </div>
  )
}
