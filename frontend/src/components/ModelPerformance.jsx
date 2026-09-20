import React, { useState, useEffect } from 'react'
import {
  Activity,
  Cpu,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Database,
  SlidersHorizontal,
  Info,
  ShieldCheck,
  TrendingUp,
  Zap,
  Target,
  Award
} from 'lucide-react'
import { getMetrics } from '../services/api'

const ModelPerformance = () => {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [hoveredCell, setHoveredCell] = useState(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getMetrics()
        setMetrics(data)
      } catch (err) {
        setError(err.message || 'Failed to load model metrics')
      } finally {
        setLoading(false)
      }
    }
    fetchMetrics()
  }, [])

  if (loading) {
    return (
      <section id="model-performance" className="py-14 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#080d1a]/50 font-mono text-xs text-center">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Activity className="w-6 h-6 text-cyan-500 animate-pulse mx-auto mb-2" />
          <p className="text-slate-500 dark:text-slate-400">GET /metrics — Fetching model verification metrics...</p>
        </div>
      </section>
    )
  }

  if (error || !metrics) {
    return (
      <section id="model-performance" className="py-14 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#080d1a]/50 font-mono text-xs">
        <div className="max-w-3xl mx-auto px-4 p-4 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300">
          Error loading /metrics: {error || 'No payload received'}
        </div>
      </section>
    )
  }

  const accuracy = (metrics.accuracy * 100).toFixed(2)
  const precision = (metrics.precision * 100).toFixed(2)
  const recall = (metrics.recall * 100).toFixed(2)
  const f1 = (metrics.f1_score * 100).toFixed(2)

  const cm = metrics.confusion_matrix || [[895, 8], [20, 111]]
  const tn = cm[0] ? cm[0][0] : 895
  const fp = cm[0] ? cm[0][1] : 8
  const fn = cm[1] ? cm[1][0] : 20
  const tp = cm[1] ? cm[1][1] : 111
  const totalTest = tn + fp + fn + tp

  const metricCards = [
    {
      name: 'Accuracy',
      value: `${accuracy}%`,
      detail: `${tn + tp} / ${totalTest} correct`,
      formula: '(TP + TN) / Total',
      icon: <TrendingUp className="w-5 h-5" />,
      gradient: 'from-blue-500 to-indigo-600',
      glowClass: 'metric-glow-blue',
      cardStyle: 'bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/50 dark:from-blue-950/30 dark:via-slate-900/50 dark:to-indigo-950/30 border-blue-200/80 dark:border-blue-800/60',
      iconBg: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400',
      valueColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      name: 'Precision',
      value: `${precision}%`,
      detail: `${tp} / ${tp + fp} true spam`,
      formula: 'TP / (TP + FP)',
      icon: <Target className="w-5 h-5" />,
      gradient: 'from-emerald-500 to-teal-600',
      glowClass: 'metric-glow-emerald',
      cardStyle: 'bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/50 dark:from-emerald-950/30 dark:via-slate-900/50 dark:to-teal-950/30 border-emerald-200/80 dark:border-emerald-800/60',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400',
      valueColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      name: 'Recall',
      value: `${recall}%`,
      detail: `${tp} / ${tp + fn} caught`,
      formula: 'TP / (TP + FN)',
      icon: <Zap className="w-5 h-5" />,
      gradient: 'from-violet-500 to-purple-600',
      glowClass: 'metric-glow-purple',
      cardStyle: 'bg-gradient-to-br from-violet-50/80 via-white to-purple-50/50 dark:from-violet-950/30 dark:via-slate-900/50 dark:to-purple-950/30 border-violet-200/80 dark:border-violet-800/60',
      iconBg: 'bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400',
      valueColor: 'text-violet-600 dark:text-violet-400'
    },
    {
      name: 'F1 Score',
      value: `${f1}%`,
      detail: 'Harmonic mean',
      formula: '2·(P·R) / (P+R)',
      icon: <Award className="w-5 h-5" />,
      gradient: 'from-amber-500 to-orange-600',
      glowClass: 'metric-glow-amber',
      cardStyle: 'bg-gradient-to-br from-amber-50/80 via-white to-orange-50/50 dark:from-amber-950/30 dark:via-slate-900/50 dark:to-orange-950/30 border-amber-200/80 dark:border-amber-800/60',
      iconBg: 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400',
      valueColor: 'text-amber-600 dark:text-amber-400'
    },
  ]

  const cmCells = [
    {
      label: 'True Negative (TN)',
      value: tn,
      desc: `Correctly identified safe messages`,
      gradient: 'from-emerald-500/15 to-teal-500/5',
      border: 'border-emerald-300/80 dark:border-emerald-800/60',
      labelColor: 'text-emerald-700 dark:text-emerald-400',
      valueColor: 'text-emerald-600 dark:text-emerald-400',
      glow: 'hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.25)]'
    },
    {
      label: 'False Positive (FP)',
      value: fp,
      desc: `Safe messages flagged as spam`,
      gradient: 'from-rose-500/15 to-pink-500/5',
      border: 'border-rose-300/80 dark:border-rose-800/60',
      labelColor: 'text-rose-700 dark:text-rose-400',
      valueColor: 'text-rose-600 dark:text-rose-400',
      glow: 'hover:shadow-[0_0_25px_-5px_rgba(244,63,94,0.25)]'
    },
    {
      label: 'False Negative (FN)',
      value: fn,
      desc: `Spam that slipped through as safe`,
      gradient: 'from-amber-500/15 to-orange-500/5',
      border: 'border-amber-300/80 dark:border-amber-800/60',
      labelColor: 'text-amber-700 dark:text-amber-400',
      valueColor: 'text-amber-600 dark:text-amber-400',
      glow: 'hover:shadow-[0_0_25px_-5px_rgba(245,158,11,0.25)]'
    },
    {
      label: 'True Positive (TP)',
      value: tp,
      desc: `Spam correctly intercepted`,
      gradient: 'from-emerald-500/15 to-cyan-500/5',
      border: 'border-emerald-300/80 dark:border-emerald-800/60',
      labelColor: 'text-emerald-700 dark:text-emerald-400',
      valueColor: 'text-emerald-600 dark:text-emerald-400',
      glow: 'hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.25)]'
    },
  ]

  return (
    <section id="model-performance" className="relative py-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#080d1a]/50 overflow-hidden">
      
      {/* Subtle background accent */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-violet-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="reveal-up flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold gradient-text-animated uppercase tracking-wider">
                Benchmarks
              </span>
              <span className="text-slate-400">/</span>
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
                Holdout Evaluation & Performance
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
              Evaluated on {metrics.test_size || totalTest} test samples · Stratified 80/20 train-test split
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-full glass text-slate-700 dark:text-slate-300 font-bold">
              Model: <strong className="gradient-text-animated">{metrics.model_name || 'MultinomialNB'}</strong>
            </span>
          </div>
        </div>

        {/* 4 Metric Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 font-mono stagger-children">
          {metricCards.map((card, idx) => (
            <div key={idx} className={`dev-card rounded-2xl p-5 border ${card.cardStyle} ${card.glowClass} group cursor-default`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  {card.icon}
                </div>
                <span className="text-[10px] text-slate-400 font-mono font-normal bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{card.formula}</span>
              </div>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                {card.name}
              </div>
              <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${card.valueColor} my-1`}>
                {card.value}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {card.detail}
              </div>
            </div>
          ))}
        </div>

        {/* Confusion Matrix & Specs Grid */}
        <div className="grid lg:grid-cols-12 gap-6">
          
          {/* Left: Confusion Matrix (7 cols) */}
          <div className="lg:col-span-7 dev-card rounded-2xl p-6 font-mono text-xs space-y-5 reveal-up">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-cyan-500/20">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  Confusion Matrix
                </span>
                <span className="text-[11px] text-slate-400 font-normal">({totalTest} samples)</span>
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
                FPR: {((fp / (tn + fp)) * 100).toFixed(2)}%
              </span>
            </div>

            {/* Matrix 2x2 Grid */}
            <div className="grid grid-cols-2 gap-3">
              {cmCells.map((cell, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border ${cell.border} bg-gradient-to-br ${cell.gradient} transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5 cursor-default ${cell.glow}`}
                  onMouseEnter={() => setHoveredCell(idx)}
                  onMouseLeave={() => setHoveredCell(null)}
                >
                  <div className={`text-[10px] font-bold ${cell.labelColor} uppercase tracking-wider`}>
                    {cell.label}
                  </div>
                  <div className={`text-3xl font-extrabold ${cell.valueColor} my-2 transition-transform duration-300 ${hoveredCell === idx ? 'scale-110' : ''}`}>
                    {cell.value}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
                    {cell.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 font-sans flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-violet-500" />
              <span><strong>Goal:</strong> Maximizing Precision (&gt;93%) keeps legitimate emails safe from false spam flags.</span>
            </div>
          </div>

          {/* Right: Pipeline Specs (5 cols) */}
          <div className="lg:col-span-5 dev-card rounded-2xl p-6 font-mono text-xs space-y-5 reveal-up reveal-up-delay-2">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white flex items-center justify-center shadow-md shadow-violet-500/20">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  Pipeline Config
                </span>
              </div>
              <span className="text-[10px] gradient-text-animated font-bold">scikit-learn 1.8.0</span>
            </div>

            <div className="space-y-0.5">
              {[
                { label: 'Vectorizer', value: 'TfidfVectorizer', color: 'text-cyan-600 dark:text-cyan-400' },
                { label: 'N-gram Range', value: '(1, 2) Uni + Bigram', color: 'text-violet-600 dark:text-violet-400' },
                { label: 'Max Features', value: '5,000 vocabulary', color: 'text-blue-600 dark:text-blue-400' },
                { label: 'Smoothing (α)', value: '0.1 (Laplace)', color: 'text-amber-600 dark:text-amber-400' },
                { label: 'Dataset Volume', value: '5,169 samples', color: 'text-emerald-600 dark:text-emerald-400' },
                { label: 'Class Ratio', value: '87.4% Ham / 12.6% Spam', color: 'text-pink-600 dark:text-pink-400' },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between py-2.5 border-b border-slate-100 dark:border-slate-800/60 last:border-0 group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 px-2 rounded-lg transition-colors">
                  <span className="text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">{item.label}</span>
                  <span className={`font-bold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-gradient-to-r from-slate-50 to-indigo-50/50 dark:from-slate-900/50 dark:to-indigo-950/30 border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 font-sans flex items-center gap-2">
              <Database className="w-4 h-4 text-violet-500 flex-shrink-0" />
              <span>Model binaries stored in <code className="gradient-text-animated font-bold font-mono">backend/model/spam_model.pkl</code></span>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}

export default ModelPerformance