import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export default function HeatmapView({ points }) {
  const colorByWeight = (w) => (w >= 0.9 ? '#ef4444' : w >= 0.7 ? '#f97316' : w >= 0.5 ? '#fbbf24' : '#34d399')

  return (
    <div className="card h-[420px]">
      <h3 className="font-semibold mb-3">Live Map / Heat Zones</h3>
      <MapContainer center={[28.6139, 77.209]} zoom={11} className="h-[350px] rounded-xl">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {(points || []).map((p, idx) => (
          <CircleMarker key={idx} center={[p.Latitude, p.Longitude]} radius={8 + p.weight * 8} pathOptions={{ color: colorByWeight(p.weight) }}>
            <Popup>
              <div>
                <strong>{p.Location}</strong><br />
                Congestion: {p['Congestion Level']}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  )
}
