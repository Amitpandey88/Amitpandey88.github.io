import { useEffect, useMemo, useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import KpiCards from './components/KpiCards'
import TrendChart from './components/TrendChart'
import DistributionChart from './components/DistributionChart'
import HeatmapView from './components/HeatmapView'
import AlertsList from './components/AlertsList'
import ChatWidget from './components/ChatWidget'
import PredictionPanel from './pages/PredictionPanel'
import RouteAndTollPage from './pages/RouteAndTollPage'
import EmergencyRoutingPage from './pages/EmergencyRoutingPage'
import AnalyticsPage from './pages/AnalyticsPage'
import { getAlerts, getHeatmap, getRiskZones, getSummary } from './services/api'

export default function App() {
  const [active, setActive] = useState('Overview Dashboard')
  const [dark, setDark] = useState(true)
  const [summary, setSummary] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [heatmap, setHeatmap] = useState([])
  const [zones, setZones] = useState([])

  useEffect(() => {
    const load = async () => {
      const [s, a, h, z] = await Promise.all([getSummary(), getAlerts(), getHeatmap(), getRiskZones()])
      setSummary(s)
      setAlerts(a)
      setHeatmap(h)
      setZones(z)
    }
    load()
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('light', !dark)
  }, [dark])

  const content = useMemo(() => {
    if (active === 'Prediction Panel') return <PredictionPanel />
    if (active === 'Live Map / Heatmap') return <HeatmapView points={heatmap} />
    if (active === 'Route & Toll Comparison') return <RouteAndTollPage />
    if (active === 'Alerts Center') return <AlertsList alerts={alerts} />
    if (active === 'Emergency Routing') return <EmergencyRoutingPage />
    if (active === 'AI Assistant') return <ChatWidget />
    if (active === 'Analytics / History') return <AnalyticsPage distribution={summary?.congestion_distribution || {}} />

    return (
      <div className="space-y-4">
        <KpiCards summary={summary} />
        <div className="grid xl:grid-cols-2 gap-4">
          <TrendChart data={summary?.trend_points || []} />
          <DistributionChart distribution={summary?.congestion_distribution || {}} />
        </div>
        <div className="grid xl:grid-cols-3 gap-4">
          <HeatmapView points={heatmap.slice(0, 80)} />
          <div className="card xl:col-span-1">
            <h3 className="font-semibold mb-2">High-Risk Zones</h3>
            <div className="space-y-2 text-sm">
              {zones.map((z, i) => (
                <div key={i} className="p-2 rounded bg-slate-900/70">
                  <p className="font-medium">{z.Location}</p>
                  <p className="text-slate-400">Risk frequency: {z.risk_count} • Avg speed: {Number(z.avg_speed).toFixed(1)} km/h</p>
                </div>
              ))}
            </div>
          </div>
          <AlertsList alerts={alerts} />
        </div>
      </div>
    )
  }, [active, alerts, heatmap, summary, zones])

  return (
    <div className="min-h-screen p-3 md:p-5">
      <div className="grid md:grid-cols-[260px_1fr] gap-4">
        <Sidebar active={active} onChange={setActive} />
        <main className="space-y-4">
          <Header dark={dark} setDark={setDark} />
          {content}
        </main>
      </div>
    </div>
  )
}
