import React, { useState } from 'react'
import {
  Code2,
  Cpu,
  ArrowRight,
  Database,
  Binary,
  Layers,
  CheckCircle2,
  Terminal,
  FileCode,
  Globe,
  Scissors,
  BarChart,
  Brain
} from 'lucide-react'

const HowItWorks = () => {
  const [selectedStage, setSelectedStage] = useState(0)

  const stages = [
    {
      id: 1,
      name: 'Ingestion',
      fullName: '1. Ingestion & Validation',
      type: 'Flask REST API',
      icon: <Globe className="w-5 h-5" />,
      gradient: 'from-blue-500 to-indigo-600',
      glowClass: 'metric-glow-blue',
      badgeColor: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900',
      activeBorder: 'border-blue-400 dark:border-blue-500',
      activeGlow: 'shadow-[0_0_20px_-5px_rgba(37,99,235,0.25)]',
      summary: 'Validates request JSON structure, utf-8 encoding, and enforces 10,000 character safety bounds.',
      codeSnippet: `@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    if not data or 'message' not in data:
        return jsonify({"error": "Missing 'message' field"}), 400
    message = data['message']`
    },
    {
      id: 2,
      name: 'Preprocessing',
      fullName: '2. Text Preprocessing',
      type: 'NLTK Tokenizer & Regex',
      icon: <Scissors className="w-5 h-5" />,
      gradient: 'from-cyan-500 to-teal-600',
      glowClass: 'metric-glow-cyan',
      badgeColor: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-900',
      activeBorder: 'border-cyan-400 dark:border-cyan-500',
      activeGlow: 'shadow-[0_0_20px_-5px_rgba(6,182,212,0.25)]',
      summary: 'Lowercases text, strips non-alphabetical punctuation, tokenizes words, and eliminates English stopwords.',
      codeSnippet: `def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'[^a-zA-Z\\\\s]', '', text)
    tokens = word_tokenize(text)
    tokens = [t for t in tokens if t not in stopwords and len(t) > 2]
    return " ".join(tokens)`
    },
    {
      id: 3,
      name: 'Vectorization',
      fullName: '3. TF-IDF Vectorization',
      type: '5,000 N-Gram Matrix',
      icon: <BarChart className="w-5 h-5" />,
      gradient: 'from-violet-500 to-purple-600',
      glowClass: 'metric-glow-purple',
      badgeColor: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 border-violet-200 dark:border-violet-900',
      activeBorder: 'border-violet-400 dark:border-violet-500',
      activeGlow: 'shadow-[0_0_20px_-5px_rgba(139,92,246,0.25)]',
      summary: 'Transforms preprocessed token stream into a 5,000-dimensional sparse TF-IDF unigram & bigram vector.',
      codeSnippet: `# Transform sample against trained TF-IDF vocabulary
tfidf_sparse_vector = vectorizer.transform([processed_text])
# Shape: (1, 5000) sparse float64 feature matrix`
    },
    {
      id: 4,
      name: 'Inference',
      fullName: '4. Probabilistic Inference',
      type: 'Multinomial Naive Bayes',
      icon: <Brain className="w-5 h-5" />,
      gradient: 'from-emerald-500 to-green-600',
      glowClass: 'metric-glow-emerald',
      badgeColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900',
      activeBorder: 'border-emerald-400 dark:border-emerald-500',
      activeGlow: 'shadow-[0_0_20px_-5px_rgba(16,185,129,0.25)]',
      summary: 'Computes class posteriors using Bayes Rule with Laplace smoothing (alpha=0.1) in <10ms.',
      codeSnippet: `probabilities = model.predict_proba(tfidf_sparse_vector)[0]
spam_prob = float(probabilities[1])
ham_prob = float(probabilities[0])
prediction = "spam" if spam_prob >= 0.5 else "ham"`
    }
  ]

  const activeStage = stages[selectedStage]

  return (
    <section id="how-it-works" className="relative py-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#070b18] overflow-hidden">
      
      {/* Background accents */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-gradient-to-r from-violet-500/5 to-transparent rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-gradient-to-l from-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="reveal-up flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold gradient-text-animated uppercase tracking-wider">
                Architecture
              </span>
              <span className="text-slate-400">/</span>
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
                NLP Pipeline Execution Flow
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
              Step-by-step from HTTP payload → Bayesian probability decision
            </p>
          </div>
        </div>

        {/* Pipeline Stage Selectors with connecting line */}
        <div className="relative mb-8">
          
          {/* Connecting horizontal line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-emerald-500/20 -translate-y-1/2 mx-12 rounded-full" />
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs stagger-children">
            {stages.map((stage, idx) => (
              <div
                key={stage.id}
                onClick={() => setSelectedStage(idx)}
                className={`relative p-4 rounded-2xl border cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 ${stage.glowClass} ${
                  selectedStage === idx
                    ? `bg-white dark:bg-[#0c1222] ${stage.activeBorder} ${stage.activeGlow}`
                    : 'bg-slate-50/60 dark:bg-[#0c1222]/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Stage icon */}
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stage.gradient} text-white flex items-center justify-center mb-3 shadow-lg transition-transform duration-300 ${selectedStage === idx ? 'scale-110' : 'group-hover:scale-105'}`}>
                  {stage.icon}
                </div>

                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {stage.name}
                  </span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${stage.badgeColor}`}>
                    {stage.id}/4
                  </span>
                </div>
                
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans line-clamp-2 leading-relaxed">
                  {stage.type}
                </p>

                {/* Active indicator dot */}
                {selectedStage === idx && (
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 shadow-lg animate-pulse" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stage Code & Details Inspector */}
        <div className="dev-card rounded-2xl overflow-hidden reveal-up">
          
          {/* Inspector Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-indigo-50/30 dark:from-[#0c1222] dark:to-indigo-950/10 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${activeStage.gradient} text-white flex items-center justify-center shadow-md`}>
                {activeStage.icon}
              </div>
              <div>
                <span className="gradient-text-animated font-bold uppercase text-[10px] tracking-wider font-mono">
                  Stage {activeStage.id} Implementation
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {activeStage.fullName}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${activeStage.badgeColor}`}>
                {activeStage.type}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                <code className="text-violet-600 dark:text-violet-400 font-bold">app.py</code>
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <p className="text-slate-600 dark:text-slate-300 text-sm font-sans leading-relaxed">
              {activeStage.summary}
            </p>

            <div className="dev-terminal rounded-xl p-5 text-xs overflow-x-auto text-slate-300 leading-relaxed border border-slate-700/50 shadow-inner">
              <pre className="text-cyan-300 font-mono">
                {activeStage.codeSnippet}
              </pre>
            </div>
          </div>

          {/* Bottom progress indicator */}
          <div className="h-1 bg-slate-100 dark:bg-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 transition-all duration-500 ease-out progress-bar-animated"
              style={{ width: `${((selectedStage + 1) / stages.length) * 100}%` }}
            />
          </div>
        </div>

      </div>
    </section>
  )
}

export default HowItWorks