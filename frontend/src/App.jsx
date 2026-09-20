import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import MessageAnalyzer from './components/MessageAnalyzer'
import ModelPerformance from './components/ModelPerformance'
import HowItWorks from './components/HowItWorks'
import ApiSpecsModal from './components/ApiSpecsModal'
import { Terminal, Code2, Server, ArrowUp, Cpu, Heart, Sparkles } from 'lucide-react'

const App = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [selectedPresetText, setSelectedPresetText] = useState('')
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [isApiModalOpen, setIsApiModalOpen] = useState(false)

  // Check localStorage for dark mode preference
  useEffect(() => {
    const saved = localStorage.getItem('spam-detector-dark-mode')
    if (saved === 'true' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    } else {
      setDarkMode(false)
      document.documentElement.classList.remove('dark')
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('spam-detector-dark-mode', newMode.toString())
    if (newMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSelectPreset = (text) => {
    setSelectedPresetText(text)
  }

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-white text-slate-800'}`}>
      
      {/* Top Navbar */}
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        onOpenApiModal={() => setIsApiModalOpen(true)}
      />

      {/* Main Content */}
      <main>
        <HeroSection onSelectPreset={handleSelectPreset} />
        <MessageAnalyzer initialMessage={selectedPresetText} />
        <ModelPerformance />
        <HowItWorks />
      </main>

      {/* Developer Engineering Footer */}
      <footer className="relative py-14 border-t border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-[#070b18] font-mono text-xs overflow-hidden">
        
        {/* Subtle background accents */}
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[200px] bg-gradient-to-t from-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[200px] bg-gradient-to-t from-violet-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            
            {/* System Specs */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5 font-bold text-slate-900 dark:text-white">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 text-white flex items-center justify-center shadow-md shadow-violet-500/20">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-sm">spam-detector / NLP Engine v1.2.0</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-sans text-xs leading-relaxed max-w-md">
                Deterministic text classification service powered by scikit-learn, NLTK stopwords filtering, and TF-IDF feature extraction.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {['React 18', 'Vite 5', 'Flask 3.1', 'scikit-learn 1.8'].map((tech, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-[11px] backdrop-blur-sm hover:border-violet-400 dark:hover:border-violet-600 transition-colors cursor-default">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Endpoints */}
            <div>
              <span className="font-bold text-slate-900 dark:text-white block mb-3 uppercase text-[11px] tracking-wider">
                REST Endpoints
              </span>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-[11px]">
                <li className="flex items-center gap-2 group">
                  <span className="px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 font-bold text-[9px]">GET</span>
                  <a href="#analyzer" className="group-hover:text-cyan-500 transition-colors">/health</a>
                </li>
                <li className="flex items-center gap-2 group">
                  <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 font-bold text-[9px]">POST</span>
                  <a href="#analyzer" className="group-hover:text-cyan-500 transition-colors">/predict</a>
                </li>
                <li className="flex items-center gap-2 group">
                  <span className="px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 font-bold text-[9px]">GET</span>
                  <a href="#model-performance" className="group-hover:text-cyan-500 transition-colors">/metrics</a>
                </li>
              </ul>
            </div>

            {/* Quick Actions */}
            <div>
              <span className="font-bold text-slate-900 dark:text-white block mb-3 uppercase text-[11px] tracking-wider">
                Developer Tools
              </span>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-[11px]">
                <li>
                  <button
                    onClick={() => setIsApiModalOpen(true)}
                    className="hover:text-violet-500 transition-colors font-medium"
                  >
                    View API Schemas →
                  </button>
                </li>
                <li>
                  <a href="#model-performance" className="hover:text-violet-500 transition-colors">
                    Confusion Matrix Data →
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-violet-500 transition-colors">
                    Pipeline Python Logic →
                  </a>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 animate-pulse" />
              Local Environment: 127.0.0.1:3000 (UI) ↔ 127.0.0.1:5000 (API)
            </span>
            <span className="flex items-center gap-1">
              Built with <Heart className="w-3 h-3 text-rose-500 mx-0.5" /> · Zero Telemetry · 100% Client/Local
            </span>
          </div>

        </div>
      </footer>

      {/* Floating Scroll-to-Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-40 p-3 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:scale-110 hover:shadow-indigo-500/50 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-4 h-4" />
      </button>

      {/* API Specs Modal */}
      <ApiSpecsModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
      />

    </div>
  )
}

export default App