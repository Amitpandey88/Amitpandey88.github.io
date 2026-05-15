export default function RouteTable({ data }) {
  return (
    <div className="card overflow-x-auto">
      <h3 className="font-semibold mb-3">Route & Toll Comparison</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-slate-300 border-b border-slate-700">
            <th className="text-left py-2">Route</th>
            <th className="text-left">ETA</th>
            <th className="text-left">Distance</th>
            <th className="text-left">Toll</th>
            <th className="text-left">Traffic</th>
            <th className="text-left">Fuel Score</th>
            <th className="text-left">Tag</th>
          </tr>
        </thead>
        <tbody>
          {(data?.routes || []).map((r) => (
            <tr key={r.name} className="border-b border-slate-800">
              <td className="py-2 font-medium">{r.name}</td>
              <td>{r.eta_minutes} min</td>
              <td>{r.distance_km} km</td>
              <td>₹{r.toll_fee}</td>
              <td>{r.traffic_level}</td>
              <td>{Math.round(r.fuel_efficiency_score * 100)}%</td>
              <td>
                <span className={`px-2 py-1 rounded ${r.name === data?.best_route ? 'bg-accent text-black' : 'bg-slate-700'}`}>
                  {r.recommendation_tag}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
