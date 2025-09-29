import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Zap, 
  Clock, 
  Database, 
  Wifi, 
  WifiOff,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react'

interface PerformanceMetrics {
  loadTime: number
  memoryUsage: number
  isOnline: boolean
  cacheSize: number
  lighthouseScore: number
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    memoryUsage: 0,
    isOnline: navigator.onLine,
    cacheSize: 0,
    lighthouseScore: 0
  })
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Measure performance metrics
    const measurePerformance = () => {
      // Load time
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart
      
      // Memory usage (if available)
      const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0
      
      // Online status
      const isOnline = navigator.onLine
      
      // Cache size (estimate)
      const cacheSize = estimateCacheSize()
      
      // Lighthouse score (simulated based on performance)
      const lighthouseScore = calculateLighthouseScore(loadTime, memoryUsage)
      
      setMetrics({
        loadTime,
        memoryUsage,
        isOnline,
        cacheSize,
        lighthouseScore
      })
    }

    // Initial measurement
    measurePerformance()

    // Listen for online/offline changes
    const handleOnline = () => setMetrics(prev => ({ ...prev, isOnline: true }))
    const handleOffline = () => setMetrics(prev => ({ ...prev, isOnline: false }))

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Update metrics periodically
    const interval = setInterval(measurePerformance, 10000)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(interval)
    }
  }, [])

  const estimateCacheSize = (): number => {
    // Estimate cache size based on localStorage and sessionStorage
    let size = 0
    
    // localStorage
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        size += localStorage[key].length
      }
    }
    
    // sessionStorage
    for (let key in sessionStorage) {
      if (sessionStorage.hasOwnProperty(key)) {
        size += sessionStorage[key].length
      }
    }
    
    return size
  }

  const calculateLighthouseScore = (loadTime: number, memoryUsage: number): number => {
    // Simulate Lighthouse score based on performance metrics
    let score = 100
    
    // Deduct points for slow load time
    if (loadTime > 3000) score -= 20
    else if (loadTime > 2000) score -= 10
    else if (loadTime > 1000) score -= 5
    
    // Deduct points for high memory usage
    if (memoryUsage > 50 * 1024 * 1024) score -= 15 // 50MB
    else if (memoryUsage > 25 * 1024 * 1024) score -= 10 // 25MB
    else if (memoryUsage > 10 * 1024 * 1024) score -= 5 // 10MB
    
    return Math.max(0, score)
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatTime = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-400'
    if (score >= 70) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="w-4 h-4" />
    if (score >= 70) return <AlertTriangle className="w-4 h-4" />
    return <AlertTriangle className="w-4 h-4" />
  }

  if (!showDetails) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowDetails(true)}
        className="fixed top-4 right-4 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-40"
        title="Performance Monitor"
      >
        <Zap className="w-6 h-6 text-white" />
      </motion.button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed top-4 right-4 w-80 bg-gray-900 border border-purple-400/20 rounded-2xl shadow-2xl z-50 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Performance Monitor</h3>
            <p className="text-sm text-gray-400">Real-time metrics</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowDetails(false)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ×
        </button>
      </div>

      {/* Metrics */}
      <div className="space-y-4">
        {/* Lighthouse Score */}
        <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-3">
            {getScoreIcon(metrics.lighthouseScore)}
            <span className="text-white font-medium">Lighthouse Score</span>
          </div>
          <span className={`font-bold ${getScoreColor(metrics.lighthouseScore)}`}>
            {metrics.lighthouseScore}
          </span>
        </div>

        {/* Load Time */}
        <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-3">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="text-white font-medium">Load Time</span>
          </div>
          <span className="text-cyan-400 font-mono">
            {formatTime(metrics.loadTime)}
          </span>
        </div>

        {/* Memory Usage */}
        <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-3">
            <Database className="w-4 h-4 text-green-400" />
            <span className="text-white font-medium">Memory Usage</span>
          </div>
          <span className="text-green-400 font-mono">
            {formatBytes(metrics.memoryUsage)}
          </span>
        </div>

        {/* Cache Size */}
        <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-3">
            <Database className="w-4 h-4 text-blue-400" />
            <span className="text-white font-medium">Cache Size</span>
          </div>
          <span className="text-blue-400 font-mono">
            {formatBytes(metrics.cacheSize)}
          </span>
        </div>

        {/* Online Status */}
        <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-3">
            {metrics.isOnline ? (
              <Wifi className="w-4 h-4 text-green-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-400" />
            )}
            <span className="text-white font-medium">Connection</span>
          </div>
          <span className={metrics.isOnline ? 'text-green-400' : 'text-red-400'}>
            {metrics.isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Performance Tips */}
      <div className="mt-4 p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg">
        <div className="flex items-start space-x-2">
          <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-gray-300">
            <p className="font-medium text-blue-400 mb-1">Performance Tips:</p>
            <ul className="space-y-1 text-xs">
              <li>• Close unused tabs to free memory</li>
              <li>• Use a stable internet connection</li>
              <li>• Clear browser cache if needed</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default PerformanceMonitor
