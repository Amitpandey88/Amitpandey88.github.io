const tabs = [
  'Overview Dashboard',
  'Prediction Panel',
  'Live Map / Heatmap',
  'Route & Toll Comparison',
  'Alerts Center',
  'Emergency Routing',
  'AI Assistant',
  'Analytics / History'
]

export default function Sidebar({ active, onChange }) {
  return (
    <aside className="w-full md:w-64 card md:min-h-[90vh]">
      <h1 className="text-xl font-bold text-accent mb-4">Smart Mobility AI</h1>
      <div className="space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`w-full text-left px-3 py-2 rounded-lg ${active === tab ? 'bg-accent text-black font-semibold' : 'bg-slate-900/50 hover:bg-slate-800'}`}
          >
            {tab}
          </button>
        ))}
      </div>
    </aside>
  )
}
