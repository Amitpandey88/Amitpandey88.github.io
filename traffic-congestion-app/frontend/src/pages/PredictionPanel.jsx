import { useState } from 'react'
import { predictCongestion } from '../services/api'
import { defaultPredictPayload } from '../data/samplePayload'

export default function PredictionPanel() {
  const [payload, setPayload] = useState(defaultPredictPayload)
  const [result, setResult] = useState(null)

  const runPrediction = async () => {
    const res = await predictCongestion(payload)
    setResult(res)
  }

  return (
    <div className="grid xl:grid-cols-2 gap-4">
      <div className="card space-y-3">
        <h3 className="font-semibold">Predict Congestion (30–60 mins)</h3>
        <input className="w-full bg-slate-900 rounded-lg px-3 py-2" value={payload.location} onChange={(e) => setPayload({ ...payload, location: e.target.value })} placeholder="Location" />
        <div className="grid grid-cols-2 gap-2">
          <input className="bg-slate-900 rounded-lg px-3 py-2" type="number" value={payload.traffic_volume} onChange={(e) => setPayload({ ...payload, traffic_volume: Number(e.target.value) })} placeholder="Traffic Volume" />
          <input className="bg-slate-900 rounded-lg px-3 py-2" type="number" value={payload.average_speed_kmh} onChange={(e) => setPayload({ ...payload, average_speed_kmh: Number(e.target.value) })} placeholder="Speed km/h" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input className="bg-slate-900 rounded-lg px-3 py-2" type="number" value={payload.rain_mm} onChange={(e) => setPayload({ ...payload, rain_mm: Number(e.target.value) })} placeholder="Rain (mm)" />
          <select className="bg-slate-900 rounded-lg px-3 py-2" value={payload.weather} onChange={(e) => setPayload({ ...payload, weather: e.target.value })}>
            <option>Clear</option><option>Cloudy</option><option>Rainy</option><option>Storm</option>
          </select>
        </div>
        <button className="px-3 py-2 rounded-lg bg-accent text-black font-semibold" onClick={runPrediction}>Run Prediction</button>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-2">Prediction Result</h3>
        {!result ? <p className="text-slate-400">No prediction yet.</p> : (
          <div className="space-y-2 text-sm">
            <p><strong>Congestion:</strong> {result.predicted_congestion}</p>
            <p><strong>Risk:</strong> {result.risk_level}</p>
            <p><strong>Confidence:</strong> {(result.confidence * 100).toFixed(1)}%</p>
            <p><strong>Key factors:</strong></p>
            <ul className="list-disc ml-5">{result.key_factors.map((f, i) => <li key={i}>{f}</li>)}</ul>
            <p><strong>Recommended actions:</strong></p>
            <ul className="list-disc ml-5">{result.recommended_actions.map((a, i) => <li key={i}>{a}</li>)}</ul>
          </div>
        )}
      </div>
    </div>
  )
}
