import { useState } from 'react'
import { getRoutes } from '../services/api'
import RouteTable from '../components/RouteTable'

export default function RouteAndTollPage() {
  const [source, setSource] = useState('Downtown')
  const [destination, setDestination] = useState('Airport Road')
  const [mode, setMode] = useState('balanced')
  const [data, setData] = useState(null)

  const run = async () => {
    const res = await getRoutes({ source, destination, departure_time: new Date().toISOString(), mode })
    setData(res)
  }

  return (
    <div className="space-y-4">
      <div className="card grid md:grid-cols-4 gap-2">
        <input className="bg-slate-900 rounded-lg px-3 py-2" value={source} onChange={(e) => setSource(e.target.value)} placeholder="Source" />
        <input className="bg-slate-900 rounded-lg px-3 py-2" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Destination" />
        <select className="bg-slate-900 rounded-lg px-3 py-2" value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="balanced">Balanced Mode</option>
          <option value="budget">Commuter Budget Mode</option>
          <option value="time-saving">Time Saving Mode</option>
          <option value="emergency">Emergency Mode</option>
        </select>
        <button className="px-3 py-2 rounded-lg bg-accent text-black font-semibold" onClick={run}>Compare Routes</button>
      </div>
      <RouteTable data={data} />
    </div>
  )
}
