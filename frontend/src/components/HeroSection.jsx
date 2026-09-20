import React, { useState } from 'react'
import { Terminal, Copy, Check, ArrowRight, Sparkles, Cpu, ShieldCheck, Zap, TrendingUp } from 'lucide-react'

const HeroSection = ({ onSelectPreset }) => {
  const [copiedCurl, setCopiedCurl] = useState(false)
  const [hoveredMetric, setHoveredMetric] = useState(null)

  const curlCommand = `curl -X POST http://localhost:5000/predict \\
  -H "Content-Type: application/json" \\
  -d '{"message": "URGENT: Verify your account immediately."}'`

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlCommand)
    setCopiedCurl(true)
    setTimeout(() => setCopiedCurl(false), 2000)
  }

  const quickSamples = [
    { label: '🚨 Phishing Alert', text: 'URGENT: Your bank account is locked. Verify details immediately at http://secure-bank-login.xyz to avoid suspension.', color: 'from-rose-500 to-pink-600', hoverBorder: 'hover:border-rose-400 dark:hover:border-rose-500' },
    { label: '🎁 $1,000 Gift Card', text: 'Congratulations! You won a $1,000 Walmart Gift Card. Call 1-800-555-0199 now with claim code WIN99.', color: 'from-amber-500 to-orange-600', hoverBorder: 'hover:border-amber-400 dark:hover:border-amber-500' },
    { label: '💼 Team Standup', text: 'Hi team, the daily standup is moved to 11:30 AM today. Please update Jira tickets before the call.', color: 'from-emerald-500 to-teal-600', hoverBorder: 'hover:border-emerald-400 dark:hover:border-emerald-500' },
    { label: '🔑 2FA Security Code', text: 'Your verification code is 849201. Valid for 10 minutes. Google will never ask for this code over phone.', color: 'from-blue-500 to-indigo-600', hoverBorder: 'hover:border-blue-400 dark:hover:border-blue-500' },
  ]

  const metrics = [
    { label: 'Accuracy', value: '97.29%', icon: <TrendingUp className="w-4 h-4" />, glowClass: 'metric-glow-emerald', gradient: 'from-emerald-400 to-teal-500', bg: 'bg-emerald-50/70 dark:bg-emerald-950/30', border: 'border-emerald-200/80 dark:border-emerald-800/60', text: 'text-emerald-700 dark:text-emerald-300', labelText: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Precision', value: '93.28%', icon: <Zap className="w-4 h-4" />, glowClass: 'metric-glow-cyan', gradient: 'from-cyan-400 to-blue-500', bg: 'bg-cyan-50/70 dark:bg-cyan-950/30', border: 'border-cyan-200/80 dark:border-cyan-800/60', text: 'text-cyan-700 dark:text-cyan-300', labelText: 'text-cyan-600 dark:text-cyan-400' },
    { label: 'Vocabulary', value: '5,000', icon: <Cpu className="w-4 h-4" />, glowClass: 'metric-glow-purple', gradient: 'from-purple-400 to-violet-500', bg: 'bg-purple-50/70 dark:bg-purple-950/30', border: 'border-purple-200/80 dark:border-purple-800/60', text: 'text-purple-700 dark:text-purple-300', labelText: 'text-purple-600 dark:text-purple-400' },
    { label: 'Inference', value: '< 15ms', icon: <Sparkles className="w-4 h-4" />, glowClass: 'metric-glow-amber', gradient: 'from-amber-400 to-orange-500', bg: 'bg-amber-50/70 dark:bg-amber-950/30', border: 'border-amber-200/80 dark:border-amber-800/60', text: 'text-amber-700 dark:text-amber-300', labelText: 'text-amber-600 dark:text-amber-400' },
  ]

  return (
    <section id="hero" className="relative py-16 md:py-20 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#080d1a]/50 dev-dot-pattern ambient-glow overflow-hidden">
      
      {/* Floating aurora blobs */}
      <div className="aurora-blob aurora-blob-1" />
      <div className="aurora-blob aurora-blob-2" />
      <div className="aurora-blob aurora-blob-3" />

      {/* Sparkle particles */}
      <div className="sparkle-container">
        <div className="sparkle" />
        <div className="sparkle" />
        <div className="sparkle" />
        <div className="sparkle" />
        <div className="sparkle" />
        <div className="sparkle" />
        <div className="sparkle" />
        <div className="sparkle" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-7">
            
            {/* Top Chip with animated border */}
            <div className="reveal-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-indigo-200/80 dark:border-indigo-800/60 text-xs font-mono text-indigo-700 dark:text-cyan-400 shadow-sm backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 animate-pulse pulse-ring" />
              <span>Multinomial Naive Bayes + TF-IDF Vectorizer</span>
            </div>

            {/* Headline with animated gradient */}
            <h1 className="reveal-up reveal-up-delay-1 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans leading-[1.12]">
              Real-Time NLP Spam &{' '}
              <span className="gradient-text-animated">
                Phishing Classifier
              </span>
            </h1>

            <p className="reveal-up reveal-up-delay-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl font-normal">
              High-accuracy machine learning engine evaluated across 5,169 SMS & email benchmark records. Delivers sub-15ms deterministic inference with NLTK tokenization and TF-IDF feature extraction.
            </p>

            {/* Dynamic Metrics Grid */}
            <div className="reveal-up reveal-up-delay-3 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs stagger-children">
              {metrics.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl ${m.bg} border ${m.border} ${m.text} ${m.glowClass} transition-all duration-300 cursor-default group hover:scale-[1.04] hover:-translate-y-1`}
                  onMouseEnter={() => setHoveredMetric(idx)}
                  onMouseLeave={() => setHoveredMetric(null)}
                >
                  <div className={`text-[10px] ${m.labelText} uppercase font-bold flex items-center gap-1.5 mb-1`}>
                    <span className={`transition-transform duration-300 ${hoveredMetric === idx ? 'scale-125' : ''}`}>
                      {m.icon}
                    </span>
                    <span>{m.label}</span>
                  </div>
                  <div className="text-xl font-extrabold mt-0.5 tracking-tight">
                    {m.value}
                  </div>
                  {m.label === 'Vocabulary' && (
                    <span className="text-[10px] opacity-70 font-normal">N-Grams</span>
                  )}
                </div>
              ))}
            </div>

            {/* Interactive Sample Selector */}
            <div className="reveal-up reveal-up-delay-4 pt-1">
              <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-2.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-violet-500" />
                  <span>Load Sample Payloads:</span>
                </span>
                <span className="text-[11px] text-violet-600 dark:text-violet-400">Click to fill inspector ↓</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickSamples.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (onSelectPreset) onSelectPreset(sample.text)
                      document.querySelector('#analyzer')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className={`group px-3.5 py-2 text-xs font-mono rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 shadow-sm backdrop-blur-sm ${sample.hoverBorder}`}
                  >
                    <span className="relative z-10">{sample.label}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Terminal cURL Snippet */}
          <div className="lg:col-span-5 reveal-scale">
            <div className="dev-terminal rounded-2xl shadow-2xl shadow-indigo-500/10 overflow-hidden text-xs border border-slate-700/50 float-slow">
              
              {/* Terminal Title Bar */}
              <div className="px-4 py-3 bg-[#0a1020] border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500 shadow-inner shadow-rose-300/30 hover:scale-110 transition-transform cursor-pointer" />
                    <div className="w-3 h-3 rounded-full bg-amber-500 shadow-inner shadow-amber-300/30 hover:scale-110 transition-transform cursor-pointer" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-inner shadow-emerald-300/30 hover:scale-110 transition-transform cursor-pointer" />
                  </div>
                  <span className="text-slate-400 text-[11px] font-mono ml-2">
                    bash — REST API Demo
                  </span>
                </div>
                <button
                  onClick={handleCopyCurl}
                  className="flex items-center gap-1.5 text-[11px] text-cyan-400 hover:text-cyan-300 transition-all hover:scale-105"
                  title="Copy cURL command"
                >
                  {copiedCurl ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy cURL</span>
                    </>
                  )}
                </button>
              </div>

              {/* Terminal Code Body */}
              <div className="p-4 overflow-x-auto text-slate-300 space-y-2.5 font-mono leading-relaxed">
                <div>
                  <span className="text-cyan-400 font-bold">$ </span>
                  <span className="text-blue-400">curl</span> -X POST http://localhost:5000/predict \
                </div>
                <div className="pl-4 text-slate-400">
                  -H <span className="text-amber-300">"Content-Type: application/json"</span> \
                </div>
                <div className="pl-4 text-slate-400">
                  -d <span className="text-emerald-300">'&#123;"message": "Congratulations! You won $1000."&#125;'</span>
                </div>
                <div className="pt-3 border-t border-slate-800/90 space-y-1">
                  <div className="text-slate-400 text-[11px]">// HTTP 200 OK — JSON Response:</div>
                  <div className="text-emerald-400">
                    &#123;
                  </div>
                  <div className="pl-4 text-slate-300">
                    <span className="text-cyan-300">"prediction"</span>: <span className="text-rose-400 font-bold">"spam"</span>,
                  </div>
                  <div className="pl-4 text-slate-300">
                    <span className="text-cyan-300">"spam_probability"</span>: <span className="text-amber-300 font-bold">0.9412</span>,
                  </div>
                  <div className="pl-4 text-slate-300">
                    <span className="text-cyan-300">"confidence"</span>: <span className="text-emerald-300 font-bold">0.9412</span>
                  </div>
                  <div className="text-emerald-400">
                    &#125;
                  </div>
                </div>
              </div>

              {/* Terminal Footer */}
              <div className="px-4 py-2.5 bg-[#0a1020] border-t border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Ready on localhost:5000</span>
                </span>
                <a href="#analyzer" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold group">
                  <span>Open Inspector</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  )
}

export default HeroSection