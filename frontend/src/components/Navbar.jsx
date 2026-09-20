import React, { useState, useEffect } from 'react'
import { Menu, X, Sun, Moon, Terminal, Activity, Code2, Cpu, Shield, Sparkles } from 'lucide-react'
import { healthCheck } from '../services/api'

const Navbar = ({ darkMode, toggleDarkMode, onOpenApiModal }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [serverOnline, setServerOnline] = useState(null)
  const [pingMs, setPingMs] = useState(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const checkServer = async () => {
      const start = performance.now()
      try {
        const res = await healthCheck()
        const latency = Math.round(performance.now() - start)
        setServerOnline(res.model_loaded === true)
        setPingMs(latency)
      } catch (e) {
        setServerOnline(false)
        setPingMs(null)
      }
    }
    checkServer()
    const interval = setInterval(checkServer, 8000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Inspector', href: '#analyzer' },
    { name: 'Benchmarks', href: '#model-performance' },
    { name: 'Architecture', href: '#how-it-works' },
  ]

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 dark:bg-[#080d1a]/95 backdrop-blur-xl shadow-lg shadow-indigo-500/5 dark:shadow-indigo-500/10 border-b border-slate-200/50 dark:border-slate-800/50'
        : 'bg-white/80 dark:bg-[#080d1a]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80'
    }`}>
      
      {/* Animated top accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 opacity-60" 
        style={{ backgroundSize: '200% 100%', animation: 'shimmerBorder 4s linear infinite' }} 
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-6">
            <a href="#hero" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 text-white flex items-center justify-center font-mono font-bold text-xs shadow-lg shadow-blue-500/30 group-hover:scale-110 group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:rotate-3">
                <Shield className="w-4.5 h-4.5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-sans font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                  Spam<span className="gradient-text-animated">Guard</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-md bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/80 dark:to-violet-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/60">
                  ML v1.2
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-slate-200 dark:border-slate-800">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="nav-link-animated px-3 py-1.5 text-xs font-semibold rounded-md text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-cyan-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Right Controls */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Live Backend Heartbeat Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-mono">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${serverOnline ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${serverOnline ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.6)]'}`} />
              </span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                {serverOnline ? 'API Online' : 'Connecting...'}
              </span>
              {pingMs !== null && (
                <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold px-1.5 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/60">
                  {pingMs}ms
                </span>
              )}
            </div>

            {/* API Specs Button */}
            <button
              onClick={onOpenApiModal}
              className="btn-glow flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 hover:from-indigo-100 hover:to-violet-100 dark:from-indigo-950/50 dark:to-violet-950/50 dark:hover:from-indigo-900/50 dark:hover:to-violet-900/50 text-indigo-600 dark:text-cyan-300 border border-indigo-200/80 dark:border-indigo-800/60 transition-all hover:scale-105 hover:shadow-md hover:shadow-indigo-500/15"
            >
              <Code2 className="w-3.5 h-3.5 text-violet-500" />
              <span>API Specs</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:scale-110 hover:rotate-12"
              title="Toggle theme"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-slate-600" />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#080d1a]/95 backdrop-blur-xl px-4 py-3 space-y-2 font-mono text-xs animate-fadeInUp">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block py-2 px-3 rounded-lg text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between px-3">
            <span className="text-slate-500 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${serverOnline ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              {serverOnline ? 'Online' : 'Connecting'}
            </span>
            <button
              onClick={() => {
                setIsOpen(false)
                onOpenApiModal()
              }}
              className="text-violet-500 font-bold"
            >
              API Specs
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar