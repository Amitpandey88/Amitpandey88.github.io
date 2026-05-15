import DistributionChart from '../components/DistributionChart'

export default function AnalyticsPage({ distribution }) {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <DistributionChart distribution={distribution} />
      <div className="card">
        <h3 className="font-semibold mb-2">High-Risk Zone Frequency Widget</h3>
        <p className="text-sm text-slate-300">Use this panel to rank hotspots by repeated high/very-high congestion flags and track preventive action impact over time.</p>
      </div>
    </div>
  )
}
