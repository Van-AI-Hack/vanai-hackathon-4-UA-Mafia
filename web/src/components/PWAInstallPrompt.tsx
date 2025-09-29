import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Download, 
  X, 
  Smartphone, 
  Monitor, 
  Wifi, 
  WifiOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { canInstallPWA, installPWA, getPWAStatus, isPWAInstalled } from '../utils/pwaUtils'

const PWAInstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)
  const [installSuccess, setInstallSuccess] = useState(false)
  const [pwaStatus, setPwaStatus] = useState(getPWAStatus())

  useEffect(() => {
    // Check if we should show the install prompt
    const shouldShowPrompt = canInstallPWA() && !isPWAInstalled()
    
    // Only show after a delay to avoid being too aggressive
    const timer = setTimeout(() => {
      setShowPrompt(shouldShowPrompt)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Update status periodically
    const interval = setInterval(() => {
      setPwaStatus(getPWAStatus())
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleInstall = async () => {
    setIsInstalling(true)
    
    try {
      const success = await installPWA()
      if (success) {
        setInstallSuccess(true)
        setTimeout(() => {
          setShowPrompt(false)
        }, 2000)
      } else {
        setIsInstalling(false)
      }
    } catch (error) {
      console.error('PWA installation failed:', error)
      setIsInstalling(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Don't show again for this session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true')
  }

  // Don't show if already dismissed this session
  if (sessionStorage.getItem('pwa-prompt-dismissed')) {
    return null
  }

  // Don't show if already installed
  if (pwaStatus.isInstalled) {
    return null
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-50"
        >
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-cyan-400/20 rounded-2xl p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Install Music DNA</h3>
                  <p className="text-sm text-gray-400">Get the full app experience</p>
                </div>
              </div>
              
              <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-5 h-5 text-cyan-400" />
                <span className="text-gray-300 text-sm">Access from your home screen</span>
              </div>
              <div className="flex items-center space-x-3">
                <Wifi className="w-5 h-5 text-green-400" />
                <span className="text-gray-300 text-sm">Works offline with cached data</span>
              </div>
              <div className="flex items-center space-x-3">
                <Monitor className="w-5 h-5 text-purple-400" />
                <span className="text-gray-300 text-sm">Native app-like experience</span>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                {pwaStatus.isOnline ? (
                  <>
                    <Wifi className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-xs">Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 text-xs">Offline</span>
                  </>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {pwaStatus.hasServiceWorker ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-xs">PWA Ready</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 text-xs">Limited PWA</span>
                  </>
                )}
              </div>
            </div>

            {/* Install Button */}
            {installSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
                <p className="text-green-400 font-semibold">Installed Successfully!</p>
                <p className="text-gray-400 text-sm">Check your home screen</p>
              </motion.div>
            ) : (
              <button
                onClick={handleInstall}
                disabled={isInstalling}
                className="w-full bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-500 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {isInstalling ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Installing...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Install App</span>
                  </>
                )}
              </button>
            )}

            {/* Footer */}
            <p className="text-xs text-gray-500 text-center mt-4">
              Install to get push notifications and offline access
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PWAInstallPrompt


