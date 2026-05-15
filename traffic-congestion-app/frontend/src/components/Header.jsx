export default function Header({ dark, setDark }) {
  return (
    <header className="card flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold">AI-Powered Smart Traffic Congestion Predictor</h2>
        <p className="text-sm text-slate-400">Predict congestion, optimize routes, and enable smart-city actions.</p>
      </div>
      <button
        onClick={() => setDark(!dark)}
        className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700"
      >
        {dark ? 'Light Mode' : 'Dark Mode'}
      </button>
    </header>
  )
}
