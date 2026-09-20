import React, { useState } from 'react'
import { X, Copy, Check, Code2, Server, Terminal } from 'lucide-react'

const ApiSpecsModal = ({ isOpen, onClose }) => {
  const [activeEndpoint, setActiveEndpoint] = useState('predict')
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const endpoints = [
    {
      id: 'predict',
      method: 'POST',
      path: '/predict',
      title: 'Classify Message Payload',
      desc: 'Performs NLP preprocessing, TF-IDF vectorization, and returns Spam vs. Ham probabilities.',
      headers: { 'Content-Type': 'application/json' },
      requestBody: {
        message: 'Congratulations! You won a $1,000 gift card.'
      },
      responseBody: {
        prediction: 'spam',
        spam_probability: 0.9412,
        ham_probability: 0.0588,
        confidence: 0.9412
      },
      errors: [
        { code: 400, reason: 'Missing or empty "message" field / exceeding 10,000 chars' },
        { code: 503, reason: 'Model artifacts not loaded (run train_model.py first)' }
      ]
    },
    {
      id: 'health',
      method: 'GET',
      path: '/health',
      title: 'Backend Health & Readiness',
      desc: 'Checks if Flask server is responsive and whether spam_model.pkl is loaded in memory.',
      responseBody: {
        status: 'ok',
        model_loaded: true
      },
      errors: [
        { code: 500, reason: 'Internal server error' }
      ]
    },
    {
      id: 'metrics',
      method: 'GET',
      path: '/metrics',
      title: 'Model Benchmark Statistics',
      desc: 'Returns test accuracy, precision, recall, F1 score, and 2x2 confusion matrix.',
      responseBody: {
        accuracy: 0.9729,
        precision: 0.9328,
        recall: 0.8473,
        f1_score: 0.8880,
        model_name: 'MultinomialNB',
        test_size: 1034,
        confusion_matrix: [[895, 8], [20, 111]]
      },
      errors: [
        { code: 503, reason: 'Metrics JSON not found on disk' }
      ]
    }
  ]

  const selected = endpoints.find(e => e.id === activeEndpoint) || endpoints[0]

  const handleCopy = (data) => {
    navigator.clipboard.writeText(typeof data === 'string' ? data : JSON.stringify(data, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs font-mono">
      <div className="relative w-full max-w-3xl dev-card rounded-xl shadow-2xl overflow-hidden text-xs max-h-[90vh] flex flex-col border border-slate-800">
        
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-[#0a1020] border-b border-slate-800 flex items-center justify-between text-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <Code2 className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-sm text-white">REST API Specifications</span>
            <span className="text-[11px] text-cyan-400 font-mono">http://localhost:5000</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 bg-white dark:bg-[#070b18] text-slate-900 dark:text-slate-100 flex-1">
          
          {/* Endpoint Tabs */}
          <div className="flex flex-wrap gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
            {endpoints.map((ep) => (
              <button
                key={ep.id}
                onClick={() => setActiveEndpoint(ep.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  activeEndpoint === ep.id
                    ? 'bg-blue-50 dark:bg-blue-950/60 border border-cyan-400 dark:border-cyan-500 text-blue-700 dark:text-cyan-300 font-bold shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                  ep.method === 'POST' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
                }`}>
                  {ep.method}
                </span>
                <span>{ep.path}</span>
              </button>
            ))}
          </div>

          {/* Endpoint Info */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {selected.method} {selected.path}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-sans text-xs">
                {selected.desc}
              </p>
            </div>

            {/* Request Schema */}
            {selected.requestBody && (
              <div>
                <div className="flex items-center justify-between text-slate-500 mb-1.5">
                  <span className="font-bold">Request Body (JSON):</span>
                  <button
                    onClick={() => handleCopy(selected.requestBody)}
                    className="text-[10px] text-cyan-600 dark:text-cyan-400 hover:underline font-bold"
                  >
                    Copy JSON
                  </button>
                </div>
                <div className="dev-terminal rounded-lg p-3 text-cyan-300 text-xs overflow-x-auto border border-slate-800">
                  <pre>{JSON.stringify(selected.requestBody, null, 2)}</pre>
                </div>
              </div>
            )}

            {/* Response Schema */}
            <div>
              <div className="flex items-center justify-between text-slate-500 mb-1.5">
                <span className="font-bold">Response 200 OK (JSON):</span>
                <button
                  onClick={() => handleCopy(selected.responseBody)}
                  className="text-[10px] text-cyan-600 dark:text-cyan-400 hover:underline font-bold"
                >
                  Copy JSON
                </button>
              </div>
              <div className="dev-terminal rounded-lg p-3 text-emerald-400 text-xs overflow-x-auto border border-slate-800">
                <pre>{JSON.stringify(selected.responseBody, null, 2)}</pre>
              </div>
            </div>

            {/* HTTP Status Codes */}
            {selected.errors && (
              <div>
                <span className="font-bold text-slate-500 block mb-1">Status Codes:</span>
                <div className="space-y-1 text-[11px]">
                  <div className="flex gap-2">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">200 OK:</span>
                    <span className="text-slate-600 dark:text-slate-400 font-sans">Successful inference or metrics payload</span>
                  </div>
                  {selected.errors.map((err, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="font-bold text-rose-500">{err.code}:</span>
                      <span className="text-slate-600 dark:text-slate-400 font-sans">{err.reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-[#0a1020] border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-slate-500 text-[11px]">
          <span>CORS Enabled on all routes</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 font-bold"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  )
}

export default ApiSpecsModal
