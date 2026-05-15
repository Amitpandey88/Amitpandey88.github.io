import { useState } from 'react'
import { chat } from '../services/api'

export default function ChatWidget() {
  const [message, setMessage] = useState('')
  const [history, setHistory] = useState([])

  const send = async () => {
    if (!message.trim()) return
    const user = { role: 'user', text: message }
    setHistory((h) => [...h, user])
    const res = await chat(message)
    setHistory((h) => [...h, { role: 'assistant', text: res.answer }])
    setMessage('')
  }

  return (
    <div className="card h-[380px] flex flex-col">
      <h3 className="font-semibold mb-3">AI Traffic Assistant</h3>
      <div className="flex-1 overflow-y-auto space-y-2 mb-3">
        {history.map((h, i) => (
          <div key={i} className={`p-2 rounded-lg ${h.role === 'user' ? 'bg-accent text-black ml-8' : 'bg-slate-900 mr-8'}`}>
            {h.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 rounded-lg bg-slate-900 px-3 py-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask: Which area will be congested in next 45 mins?"
        />
        <button onClick={send} className="px-3 py-2 rounded-lg bg-accent text-black font-semibold">Send</button>
      </div>
    </div>
  )
}
