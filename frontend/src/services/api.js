const API_BASE = '/api'

export async function healthCheck() {
  const res = await fetch(`${API_BASE}/health`)
  if (!res.ok) throw new Error('Backend unavailable')
  return res.json()
}

export async function predict(message) {
  const res = await fetch(`${API_BASE}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Prediction failed')
  }
  return res.json()
}

export async function getMetrics() {
  const res = await fetch(`${API_BASE}/metrics`)
  if (!res.ok) throw new Error('Failed to load metrics')
  return res.json()
}
