import React, { useState, useEffect, useRef } from 'react'
import {
  Terminal,
  Play,
  RotateCcw,
  Clipboard,
  Code2,
  FileJson,
  Check,
  Copy,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  History,
  Layers,
  FileText,
  Download,
  Info,
  Sliders,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react'
import { predict } from '../services/api'

const COMMON_SPAM_TRIGGERS = [
  'urgent', 'congratulations', 'won', 'winner', 'prize', 'claim', 'cash', 'free',
  'selected', 'limited time', 'offer', 'exclusive', 'suspended', 'verify', 'password',
  'security alert', 'bank', 'lottery', 'compromised', 'click here', 'guaranteed',
  '100%', 'risk-free', 'bonus', 'act now', 'expires', 'deposit', 'reward', 'alert'
]

const SAMPLE_PAYLOADS = [
  {
    category: 'Phishing Alert',
    title: 'PayPal Restriction Alert',
    type: 'spam',
    tagColor: 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900',
    text: 'URGENT: Your PayPal account has been restricted due to suspicious login attempts. Verify your identity now at http://secure-auth-paypal.xyz to prevent permanent suspension.'
  },
  {
    category: 'Lottery Scam',
    title: '$1,000 Walmart Gift Card',
    type: 'spam',
    tagColor: 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900',
    text: 'Congratulations! You have been selected as our lucky winner of a $1,000 Walmart Gift Card. Call 1-800-555-0199 or click http://gift-rewards.promo/claim now! Code: WIN99'
  },
  {
    category: 'Engineering / Work',
    title: 'Sprint Architecture Sync',
    type: 'ham',
    tagColor: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
    text: 'Hi team, please find attached the revised architecture document and task estimations for Sprint 24. Let us review the blockers during tomorrow’s 10:00 AM sync.'
  },
  {
    category: 'Security / 2FA',
    title: 'Authentication Code (OTP)',
    type: 'ham',
    tagColor: 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900',
    text: 'Your security verification code is 489210. Valid for 10 minutes. Google will never ask for this code over phone or SMS.'
  }
]

const MessageAnalyzer = ({ initialMessage = '' }) => {
  const [activeTab, setActiveTab] = useState('single')
  const [message, setMessage] = useState(initialMessage)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [resultView, setResultView] = useState('visual')
  const [codeLang, setCodeLang] = useState('curl')
  const [history, setHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [copied, setCopied] = useState(false)
  const [latency, setLatency] = useState(null)

  const [batchInput, setBatchInput] = useState('')
  const [batchResults, setBatchResults] = useState([])
  const [isBatchRunning, setIsBatchRunning] = useState(false)

  const textareaRef = useRef(null)

  useEffect(() => {
    if (initialMessage) {
      setMessage(initialMessage)
      setResult(null)
      setError('')
    }
  }, [initialMessage])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('spam_console_history')
      if (saved) setHistory(JSON.parse(saved))
    } catch (e) {}
  }, [])

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleAnalyze()
    }
  }

  const handleAnalyze = async () => {
    if (!message.trim()) {
      setError('Input string cannot be empty.')
      return
    }

    if (message.length > 10000) {
      setError('Payload length exceeds maximum allowed limit of 10,000 characters.')
      return
    }

    setError('')
    setIsAnalyzing(true)
    const startTime = performance.now()

    try {
      const data = await predict(message)
      const duration = Math.round(performance.now() - startTime)
      setLatency(duration)
      setResult(data)

      const record = {
        id: Date.now(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        text: message,
        result: data,
        latency: duration
      }
      const updated = [record, ...history.slice(0, 19)]
      setHistory(updated)
      try {
        localStorage.setItem('spam_console_history', JSON.stringify(updated))
      } catch (e) {}
    } catch (err) {
      setError(err.message || 'REST API invocation failed. Verify that Flask is running on port 5000.')
      setResult(null)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) {
        setMessage(text)
        setResult(null)
        setError('')
      }
    } catch (err) {
      setError('Clipboard access denied. Paste manually into the editor.')
    }
  }

  const handleCopyJSON = () => {
    if (!result) return
    navigator.clipboard.writeText(JSON.stringify(result, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getPreprocessedTokens = (text) => {
    if (!text) return []
    const cleaned = text.toLowerCase().replace(/[^a-zA-Z\s]/g, ' ')
    const words = cleaned.split(/\s+/).filter(w => w.length > 2)
    const stopWords = new Set(['the', 'and', 'for', 'are', 'with', 'you', 'this', 'that', 'from', 'have', 'your', 'was', 'were', 'our', 'all'])
    return words.filter(w => !stopWords.has(w))
  }

  const detectedTriggers = message
    ? COMMON_SPAM_TRIGGERS.filter(t => message.toLowerCase().includes(t))
    : []

  const tokens = getPreprocessedTokens(message)

  const getIntegrationCode = () => {
    const escapedMsg = message.replace(/"/g, '\\"').replace(/\n/g, ' ') || 'Test payload message'
    if (codeLang === 'curl') {
      return `curl -X POST http://localhost:5000/predict \\
  -H "Content-Type: application/json" \\
  -d '{"message": "${escapedMsg}"}'`
    }
    if (codeLang === 'python') {
      return `import requests

url = "http://localhost:5000/predict"
payload = {"message": "${escapedMsg}"}
headers = {"Content-Type": "application/json"}

response = requests.post(url, json=payload, headers=headers)
data = response.json()

print(f"Prediction: {data['prediction'].upper()}")
print(f"Spam Probability: {data['spam_probability'] * 100:.2f}%")
print(f"Confidence: {data['confidence'] * 100:.2f}%")`
    }
    if (codeLang === 'javascript') {
      return `const response = await fetch('http://localhost:5000/predict', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: "${escapedMsg}" })
});

const data = await response.json();
console.log('Prediction:', data.prediction);
console.log('Spam Score:', data.spam_probability);`
    }
  }

  const handleRunBatch = async () => {
    const lines = batchInput.split('\n').map(l => l.trim()).filter(Boolean)
    if (lines.length === 0) {
      setError('Please enter at least one message per line.')
      return
    }
    setIsBatchRunning(true)
    setError('')
    setBatchResults([])

    const list = []
    for (const line of lines) {
      const t0 = performance.now()
      try {
        const res = await predict(line)
        const t1 = Math.round(performance.now() - t0)
        list.push({ text: line, ...res, latency: t1, status: 200 })
      } catch (err) {
        list.push({ text: line, error: err.message, status: 500 })
      }
    }
    setBatchResults(list)
    setIsBatchRunning(false)
  }

  return (
    <section id="analyzer" className="relative py-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#070b18] overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-1/3 w-[400px] h-[300px] bg-gradient-to-b from-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[350px] h-[250px] bg-gradient-to-t from-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold gradient-text-animated uppercase tracking-wider">
                Inspector
              </span>
              <span className="text-slate-400">/</span>
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
                Interactive Text Classifier Console
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
              Live tokenization, TF-IDF feature extraction, and Bayesian probability estimation.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-xl bg-white/80 dark:bg-slate-900/80 p-0.5 border border-slate-200 dark:border-slate-800 text-xs font-mono backdrop-blur-sm shadow-sm">
              <button
                onClick={() => setActiveTab('single')}
                className={`px-3.5 py-1.5 rounded-lg transition-all duration-300 ${
                  activeTab === 'single'
                    ? 'bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/60 dark:to-violet-950/60 text-indigo-600 dark:text-cyan-400 shadow-sm font-bold border border-indigo-200/50 dark:border-indigo-800/50'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Single Payload
              </button>
              <button
                onClick={() => setActiveTab('batch')}
                className={`px-3.5 py-1.5 rounded-lg transition-all duration-300 ${
                  activeTab === 'batch'
                    ? 'bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/60 dark:to-violet-950/60 text-indigo-600 dark:text-cyan-400 shadow-sm font-bold border border-indigo-200/50 dark:border-indigo-800/50'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Batch Queue
              </button>
            </div>

            {history.length > 0 && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg border transition-colors ${
                  showHistory
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-400 dark:border-blue-700 text-blue-700 dark:text-cyan-300 font-bold'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <History className="w-3.5 h-3.5 text-cyan-500" />
                <span>Logs ({history.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* History Drawer */}
        {showHistory && history.length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 animate-fadeInUp shadow-md">
            <div className="flex items-center justify-between mb-3 text-xs font-mono">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Session History ({history.length} executions)
              </span>
              <button
                onClick={() => {
                  setHistory([])
                  localStorage.removeItem('spam_console_history')
                }}
                className="text-rose-500 hover:underline font-semibold"
              >
                Clear History
              </button>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {history.map((h) => (
                <div
                  key={h.id}
                  onClick={() => {
                    setMessage(h.text)
                    setResult(h.result)
                    setLatency(h.latency)
                    setShowHistory(false)
                  }}
                  className="p-2.5 rounded-lg bg-white dark:bg-[#070b18] border border-slate-200 dark:border-slate-800 hover:border-cyan-400 dark:hover:border-cyan-500 cursor-pointer flex items-center justify-between gap-3 text-xs font-mono transition-all hover:translate-x-0.5"
                >
                  <div className="flex items-center gap-2 truncate flex-1">
                    <span className="text-slate-400 text-[11px]">{h.time}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        h.result.prediction === 'spam'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {h.result.prediction}
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 truncate font-sans text-[11px]">
                      {h.text}
                    </span>
                  </div>
                  <div className="text-[11px] text-cyan-600 dark:text-cyan-400 font-bold flex-shrink-0">
                    {h.latency}ms · {(h.result.confidence * 100).toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SINGLE PAYLOAD MODE */}
        {activeTab === 'single' && (
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Workbench Editor (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              
              <div className="dev-card rounded-2xl overflow-hidden">
                
                {/* Editor Header */}
                <div className="px-4 py-2.5 bg-slate-50 dark:bg-[#0c1222] border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      Input Payload
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      ({message.length} chars · {message.trim().split(/\s+/).filter(Boolean).length} words)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePaste}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors"
                      title="Paste from clipboard"
                    >
                      <Clipboard className="w-3 h-3 text-cyan-500" />
                      <span>Paste</span>
                    </button>
                    {message && (
                      <button
                        onClick={() => {
                          setMessage('')
                          setResult(null)
                          setError('')
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-rose-500 hover:text-rose-600 transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Clear</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Editor Text Area */}
                <div className="p-3 bg-white dark:bg-[#070b18]">
                  <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value)
                      if (error) setError('')
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Type or paste SMS/email text here. Press Ctrl+Enter to run classification..."
                    rows={8}
                    maxLength={10000}
                    className="w-full bg-transparent text-slate-900 dark:text-slate-100 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none resize-none placeholder-slate-400"
                  />
                </div>

                {/* Editor Footer */}
                <div className="px-4 py-3 bg-slate-50 dark:bg-[#0c1222] border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-slate-400 text-[11px]">Tokens: {tokens.length}</span>
                    {detectedTriggers.length > 0 && (
                      <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-[10px] font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{detectedTriggers.length} Triggers: {detectedTriggers.slice(0, 3).join(', ')}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline text-slate-400 text-[11px]">
                      <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">Enter</kbd>
                    </span>
                    <button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || !message.trim()}
                      className="btn-glow flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-mono font-bold text-xs text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-500 hover:via-violet-500 hover:to-purple-500 shadow-lg shadow-violet-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 hover:shadow-violet-500/40 active:scale-95"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Run Predict</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>

              </div>

              {error && (
                <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-mono flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Sample Payloads Library */}
              <div className="dev-card rounded-2xl p-5">
                <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                    <span>Quick Test Scenarios</span>
                  </span>
                  <span className="text-[11px] text-cyan-600 dark:text-cyan-400 normal-case">Click to auto-fill</span>
                </div>

                <div className="grid sm:grid-cols-2 gap-2.5">
                  {SAMPLE_PAYLOADS.map((sample, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setMessage(sample.text)
                        setResult(null)
                        setError('')
                      }}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#0c1222] hover:border-violet-400 dark:hover:border-violet-500 cursor-pointer text-xs font-mono transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:shadow-violet-500/10 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="font-bold text-slate-900 dark:text-slate-100 truncate">
                          {sample.title}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase border ${sample.tagColor}`}>
                          {sample.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-sans">
                        {sample.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right: Response Inspector (5 cols) */}
            <div className="lg:col-span-5">
              <div className="dev-card rounded-2xl overflow-hidden flex flex-col min-h-[460px]">
                
                {/* Response Header */}
                <div className="px-4 py-2.5 bg-slate-50 dark:bg-[#0c1222] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
                  
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      Inference Output
                    </span>
                    {latency !== null && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80 text-[10px] font-bold">
                        200 OK ({latency}ms)
                      </span>
                    )}
                  </div>

                  {/* Tabs */}
                  <div className="inline-flex rounded-md bg-slate-200 dark:bg-slate-800 p-0.5 text-[11px]">
                    <button
                      onClick={() => setResultView('visual')}
                      className={`px-2.5 py-0.5 rounded transition-all ${
                        resultView === 'visual'
                          ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-cyan-400 font-bold shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Report
                    </button>
                    <button
                      onClick={() => setResultView('json')}
                      className={`px-2.5 py-0.5 rounded transition-all ${
                        resultView === 'json'
                          ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-cyan-400 font-bold shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      JSON
                    </button>
                    <button
                      onClick={() => setResultView('code')}
                      className={`px-2.5 py-0.5 rounded transition-all ${
                        resultView === 'code'
                          ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-cyan-400 font-bold shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      API Code
                    </button>
                  </div>

                </div>

                {/* State 1: Idle */}
                {!result && !isAnalyzing && (
                  <div className="my-auto p-8 text-center text-xs font-mono text-slate-400">
                    <Terminal className="w-10 h-10 mx-auto mb-3 text-cyan-500/40" />
                    <p className="font-bold text-slate-700 dark:text-slate-300 text-sm mb-1">
                      Awaiting Payload Execution
                    </p>
                    <p className="text-[11px] text-slate-400 max-w-xs mx-auto font-sans leading-relaxed">
                      Click <strong>Run Predict</strong> or press <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">Ctrl+Enter</kbd> to inspect tokens and probabilities.
                    </p>
                  </div>
                )}

                {/* State 2: Analyzing */}
                {isAnalyzing && (
                  <div className="my-auto p-8 text-center text-xs font-mono">
                    <Loader2 className="w-10 h-10 mx-auto mb-3 text-cyan-500 animate-spin" />
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                      Running ML Model Inference...
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1 font-mono">
                      POST http://localhost:5000/predict
                    </p>
                  </div>
                )}

                {/* State 3: Active Response */}
                {result && !isAnalyzing && (
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                    
                    {/* View A: Formatted Visual */}
                    {resultView === 'visual' && (
                      <div className="space-y-4 text-xs font-mono animate-fadeInUp">
                        
                        {/* Verdict Header Block */}
                        <div
                          className={`p-5 rounded-2xl border transition-all duration-500 ${
                            result.prediction === 'spam'
                              ? 'bg-gradient-to-r from-rose-500/15 via-pink-500/5 to-transparent border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 shadow-lg shadow-rose-500/10'
                              : 'bg-gradient-to-r from-emerald-500/15 via-teal-500/5 to-transparent border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 shadow-lg shadow-emerald-500/10'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-extrabold text-base uppercase tracking-tight flex items-center gap-2">
                              {result.prediction === 'spam' ? (
                                <ShieldAlert className="w-5 h-5 text-rose-500" />
                              ) : (
                                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                              )}
                              <span>VERDICT: {result.prediction.toUpperCase()}</span>
                            </span>
                            <span className="font-bold text-xs px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-current shadow-2xs">
                              {(result.confidence * 100).toFixed(2)}% Confident
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                            {result.prediction === 'spam'
                              ? 'Model detected strong statistical markers of fraudulent, urgent, or unsolicited solicitation.'
                              : 'Vocabulary distribution and structure match authentic interpersonal communications.'}
                          </p>
                        </div>

                        {/* Radiant Probability Meters */}
                        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#0c1222] space-y-3">
                          
                          {/* Spam Meter */}
                          <div>
                            <div className="flex justify-between text-[11px] mb-1.5 font-bold">
                              <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-rose-500" />
                                <span>Spam Probability:</span>
                              </span>
                              <span className="text-rose-600 dark:text-rose-400 font-mono">
                                {(result.spam_probability * 100).toFixed(2)}%
                              </span>
                            </div>
                            <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 rounded-full transition-all duration-700 ease-out progress-bar-animated"
                                style={{ width: `${Math.max(result.spam_probability * 100, 2)}%` }}
                              />
                            </div>
                          </div>

                          {/* Ham Meter */}
                          <div>
                            <div className="flex justify-between text-[11px] mb-1.5 font-bold">
                              <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span>Safe (Ham) Probability:</span>
                              </span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                                {(result.ham_probability * 100).toFixed(2)}%
                              </span>
                            </div>
                            <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 rounded-full transition-all duration-700 ease-out progress-bar-animated"
                                style={{ width: `${Math.max(result.ham_probability * 100, 2)}%` }}
                              />
                            </div>
                          </div>

                        </div>

                        {/* Extracted Token Stream */}
                        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b18] space-y-2">
                          <div className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                            Extracted Tokens ({tokens.length})
                          </div>
                          <div className="text-[11px] leading-relaxed font-mono">
                            {tokens.length > 0 ? (
                              tokens.slice(0, 16).map((t, idx) => (
                                <span
                                  key={idx}
                                  className={`inline-block mr-1 mb-1 px-1.5 py-0.5 rounded text-[10px] border ${
                                    COMMON_SPAM_TRIGGERS.includes(t)
                                      ? 'bg-rose-50 dark:bg-rose-950/80 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-bold'
                                      : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                                  }`}
                                >
                                  {t}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-400 text-[10px]">No alpha tokens detected</span>
                            )}
                          </div>
                        </div>

                      </div>
                    )}

                    {/* View B: Raw JSON */}
                    {resultView === 'json' && (
                      <div className="relative font-mono text-xs text-slate-300 bg-[#080d1a] rounded-lg p-3.5 overflow-x-auto border border-slate-800">
                        <button
                          onClick={handleCopyJSON}
                          className="absolute top-2.5 right-2.5 flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 bg-slate-800/80 px-2 py-1 rounded border border-slate-700"
                        >
                          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copied ? 'Copied' : 'Copy'}</span>
                        </button>
                        <pre className="text-emerald-400 leading-relaxed font-mono">
                          {JSON.stringify(result, null, 2)}
                        </pre>
                      </div>
                    )}

                    {/* View C: API Code Snippet */}
                    {resultView === 'code' && (
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-1.5 text-xs font-mono">
                          {['curl', 'python', 'javascript'].map((lang) => (
                            <button
                              key={lang}
                              onClick={() => setCodeLang(lang)}
                              className={`px-2.5 py-1 rounded uppercase text-[10px] font-bold transition-colors ${
                                codeLang === lang
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                              }`}
                            >
                              {lang}
                            </button>
                          ))}
                        </div>
                        <div className="relative font-mono text-xs bg-[#080d1a] rounded-lg p-3.5 overflow-x-auto text-slate-300 border border-slate-800">
                          <pre className="text-cyan-300 leading-relaxed font-mono text-[11px]">
                            {getIntegrationCode()}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Algorithm: MultinomialNB</span>
                      <button
                        onClick={handleCopyJSON}
                        className="text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-bold"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy JSON Result</span>
                      </button>
                    </div>

                  </div>
                )}

              </div>
            </div>

          </div>
        )}

        {/* BATCH QUEUE MODE */}
        {activeTab === 'batch' && (
          <div className="dev-card rounded-xl p-6 font-mono text-xs space-y-4 shadow-sm">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Batch Inference Queue
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                Paste one raw text message per line to evaluate the entire batch in sequential REST calls.
              </p>
            </div>

            <textarea
              value={batchInput}
              onChange={(e) => setBatchInput(e.target.value)}
              placeholder="Congratulations! You won $10,000. Claim now.&#10;Hey, let's meet at 3 PM for coffee.&#10;URGENT: Your bank account is locked. Verify at http://scam.xyz&#10;Please find attached the report for review."
              rows={6}
              className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070b18] text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:border-cyan-500 resize-none"
            />

            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[11px]">
                {batchInput.split('\n').filter(l => l.trim()).length} records ready
              </span>
              <button
                onClick={handleRunBatch}
                disabled={isBatchRunning || !batchInput.trim()}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold disabled:opacity-50 transition-all shadow-md shadow-blue-500/20"
              >
                {isBatchRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>Execute Batch ({batchInput.split('\n').filter(l => l.trim()).length})</span>
              </button>
            </div>

            {batchResults.length > 0 && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-800 dark:text-slate-200">Results ({batchResults.length} records)</span>
                  <div className="flex gap-3 text-[11px]">
                    <span className="text-rose-500 font-bold">
                      Spam: {batchResults.filter(r => r.prediction === 'spam').length}
                    </span>
                    <span className="text-emerald-500 font-bold">
                      Ham: {batchResults.filter(r => r.prediction === 'ham').length}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                  {batchResults.map((b, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-[11px]"
                    >
                      <span className="text-slate-700 dark:text-slate-300 truncate font-mono flex-1">
                        {b.text}
                      </span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className={`font-bold px-1.5 py-0.5 rounded uppercase text-[10px] ${
                            b.prediction === 'spam'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                          }`}
                        >
                          {b.prediction}
                        </span>
                        <span className="text-cyan-600 dark:text-cyan-400 font-bold">{b.latency}ms</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  )
}

export default MessageAnalyzer