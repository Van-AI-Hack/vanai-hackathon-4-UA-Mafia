import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Home, Brain, BarChart3, RotateCcw, Music4, Users } from 'lucide-react'

type AppState = 'intro' | 'quiz' | 'result' | 'dashboard' | 'lyrics' | 'welcome-back' | 'buddy'

interface FloatingNavigationProps {
  currentState: AppState
  onNavigate: (state: AppState) => void
  onRestart: () => void
}

const FloatingNavigation: React.FC<FloatingNavigationProps> = ({ 
  currentState, 
  onNavigate, 
  onRestart 
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { id: 'intro', label: 'Home', icon: Home },
    { id: 'quiz', label: 'Quiz', icon: Brain },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'lyrics', label: 'AI Studio', icon: Music4 },
    { id: 'buddy', label: 'Find Twin 🎵', icon: Users, badge: 'NEW' }
  ]

  const handleNavigation = (state: AppState) => {
    onNavigate(state)
    setIsOpen(false)
  }

  const handleRestart = () => {
    onRestart()
    setIsOpen(false)
  }

  // Don't show navigation on intro screen
  if (currentState === 'intro') {
    return null
  }

  return (
    <>
      {/* Desktop Navigation - Traditional Header */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-sm border-b border-cyan-500/20">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.button
              onClick={() => onNavigate('intro')}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 text-xl font-bold gradient-text"
            >
              🎵 Canadian Music DNA
            </motion.button>

            {/* Navigation Items */}
            <div className="flex items-center gap-6">
              {menuItems.map((item) => {
                const isActive = currentState === item.id
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => handleNavigation(item.id as AppState)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-[10px] font-bold rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </motion.button>
                )
              })}
              
              {/* Restart Button */}
              <motion.button
                onClick={handleRestart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Restart
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Floating Hamburger Menu */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        {!isOpen ? (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center border-2 border-cyan-400/30"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6 text-white" />
          </motion.button>
        ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="bg-black/95 backdrop-blur-sm border border-cyan-400/30 rounded-2xl shadow-2xl p-4 min-w-[280px]"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
                <Menu className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Navigation</h3>
                <p className="text-xs text-gray-400">Quick access</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Menu Items */}
          <div className="space-y-2 mb-4">
            {menuItems.map((item) => {
              const isActive = currentState === item.id
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavigation(item.id as AppState)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold rounded-full">
                      {item.badge}
                    </span>
                  )}
                </motion.button>
              )
            })}
          </div>
          
          {/* Restart Button */}
          <motion.button
            onClick={handleRestart}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all border-t border-gray-700 pt-4"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Restart Quiz</span>
          </motion.button>
        </motion.div>
      )}
    </div>

      {/* Spacer for desktop navigation */}
      <div className="hidden md:block h-20" />
    </>
  )
}

export default FloatingNavigation
