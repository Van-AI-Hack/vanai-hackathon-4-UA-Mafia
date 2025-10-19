import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Home, Brain, BarChart3, RotateCcw, Music4, Users } from 'lucide-react'

type AppState = 'intro' | 'quiz' | 'result' | 'dashboard' | 'lyrics' | 'welcome-back' | 'buddy'

interface NavigationMenuProps {
  currentState: AppState
  onNavigate: (state: AppState) => void
  onRestart: () => void
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ 
  currentState, 
  onNavigate, 
  onRestart 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const menuItems = [
    { id: 'intro', label: 'Home', icon: Home },
    { id: 'quiz', label: 'Quiz', icon: Brain },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'lyrics', label: 'AI Studio', icon: Music4 },
    { id: 'buddy', label: 'Find Twin 🎵', icon: Users, badge: 'NEW' }
  ]

  const handleNavigation = (state: AppState) => {
    onNavigate(state)
    setIsMobileMenuOpen(false)
  }

  const handleRestart = () => {
    onRestart()
    setIsMobileMenuOpen(false)
  }

  // Don't show navigation on intro screen
  if (currentState === 'intro') {
    return null
  }

  return (
    <>
      {/* Desktop Navigation */}
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

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-sm border-b border-cyan-500/20">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.button
              onClick={() => onNavigate('intro')}
              whileHover={{ scale: 1.05 }}
              className="text-base font-bold gradient-text"
            >
              🎵 Music DNA
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-cyan-400/20 hover:bg-cyan-400/30 rounded-lg border border-cyan-400/30 transition-all"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-cyan-400" />
              ) : (
                <Menu className="w-5 h-5 text-cyan-400" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-black/95 backdrop-blur-sm border-t border-cyan-500/20 shadow-lg"
            >
              <div className="px-4 py-4 space-y-2">
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
                      {item.label}
                    </motion.button>
                  )
                })}
                
                {/* Restart Button */}
                <motion.button
                  onClick={handleRestart}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all"
                >
                  <RotateCcw className="w-5 h-5" />
                  Restart
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer for fixed navigation */}
      <div className="h-16 md:h-20" />
    </>
  )
}

export default NavigationMenu
