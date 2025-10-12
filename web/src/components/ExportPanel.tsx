import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Download, 
  Image, 
  FileText, 
  Check,
  X,
  Copy,
  Twitter,
  Facebook,
  Linkedin
} from 'lucide-react'
import { Persona } from '../utils/dataLoader'
import { 
  downloadAsPNG, 
  downloadAsSVG, 
  shareToSocial, 
  ExportOptions 
} from '../utils/exportUtils'

interface ExportPanelProps {
  persona: Persona
  onClose: () => void
}

const ExportPanel: React.FC<ExportPanelProps> = ({ persona, onClose }) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'png',
    size: 'medium',
    includeStats: true,
    includeDescription: true
  })
  const [isExporting, setIsExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState<string | null>(null)

  const handleExport = async () => {
    setIsExporting(true)
    setExportSuccess(null)
    
    try {
      if (exportOptions.format === 'png') {
        await downloadAsPNG(persona, exportOptions)
      } else if (exportOptions.format === 'svg') {
        downloadAsSVG(persona, exportOptions)
      }
      
      setExportSuccess(`${exportOptions.format.toUpperCase()} exported successfully!`)
      setTimeout(() => setExportSuccess(null), 3000)
    } catch (error) {
      console.error('Export failed:', error)
      setExportSuccess('Export failed. Please try again.')
      setTimeout(() => setExportSuccess(null), 3000)
    } finally {
      setIsExporting(false)
    }
  }

  const handleSocialShare = (platform: 'twitter' | 'facebook' | 'linkedin' | 'copy') => {
    shareToSocial(persona, platform)
  }

  const formatOptions = [
    { value: 'png', label: 'PNG Image', icon: Image },
    { value: 'svg', label: 'SVG Vector', icon: FileText }
  ]

  const sizeOptions = [
    { value: 'small', label: 'Small (320x384)', description: 'Perfect for social media' },
    { value: 'medium', label: 'Medium (384x448)', description: 'Great for sharing' },
    { value: 'large', label: 'Large (448x512)', description: 'High quality print' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 border border-cyan-400/20 rounded-2xl p-6 w-full max-w-md"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Export Your Music DNA</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Export Options */}
        <div className="space-y-6">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Export Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              {formatOptions.map((option) => {
                const Icon = option.icon
                return (
                  <button
                    key={option.value}
                    onClick={() => setExportOptions(prev => ({ ...prev, format: option.value as 'png' | 'svg' }))}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      exportOptions.format === option.value
                        ? 'border-cyan-400 bg-cyan-400/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <Icon size={20} className="text-cyan-400 mx-auto mb-2" />
                    <div className="text-sm text-white font-medium">{option.label}</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Card Size
            </label>
            <div className="space-y-2">
              {sizeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setExportOptions(prev => ({ ...prev, size: option.value as 'small' | 'medium' | 'large' }))}
                  className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                    exportOptions.size === option.value
                      ? 'border-cyan-400 bg-cyan-400/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="text-sm text-white font-medium">{option.label}</div>
                  <div className="text-xs text-gray-400">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Additional Options */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
              Include in Card
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={exportOptions.includeDescription}
                onChange={(e) => setExportOptions(prev => ({ ...prev, includeDescription: e.target.checked }))}
                className="w-4 h-4 text-cyan-400 bg-gray-700 border-gray-600 rounded focus:ring-cyan-400"
              />
              <span className="text-sm text-gray-300">Persona description</span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={exportOptions.includeStats}
                onChange={(e) => setExportOptions(prev => ({ ...prev, includeStats: e.target.checked }))}
                className="w-4 h-4 text-cyan-400 bg-gray-700 border-gray-600 rounded focus:ring-cyan-400"
              />
              <span className="text-sm text-gray-300">Music DNA statistics</span>
            </label>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-500 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {isExporting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download size={20} />
                <span>Export {exportOptions.format.toUpperCase()}</span>
              </>
            )}
          </button>

          {/* Success Message */}
          {exportSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center space-x-2"
            >
              <Check size={16} className="text-green-400" />
              <span className="text-green-400 text-sm">{exportSuccess}</span>
            </motion.div>
          )}

          {/* Social Sharing */}
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Share Your Results</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSocialShare('twitter')}
                className="flex items-center justify-center space-x-2 p-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg transition-all"
              >
                <Twitter size={16} className="text-blue-400" />
                <span className="text-blue-400 text-sm">Twitter</span>
              </button>
              
              <button
                onClick={() => handleSocialShare('facebook')}
                className="flex items-center justify-center space-x-2 p-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/50 rounded-lg transition-all"
              >
                <Facebook size={16} className="text-blue-500" />
                <span className="text-blue-500 text-sm">Facebook</span>
              </button>
              
              <button
                onClick={() => handleSocialShare('linkedin')}
                className="flex items-center justify-center space-x-2 p-3 bg-blue-700/20 hover:bg-blue-700/30 border border-blue-700/50 rounded-lg transition-all"
              >
                <Linkedin size={16} className="text-blue-600" />
                <span className="text-blue-600 text-sm">LinkedIn</span>
              </button>
              
              <button
                onClick={() => handleSocialShare('copy')}
                className="flex items-center justify-center space-x-2 p-3 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-600/50 rounded-lg transition-all"
              >
                <Copy size={16} className="text-gray-400" />
                <span className="text-gray-400 text-sm">Copy Link</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ExportPanel

