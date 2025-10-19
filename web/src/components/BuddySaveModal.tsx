/**
 * Modal for users to save their persona and opt into Music Buddy matching
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Music, Users, Mail, Linkedin, MapPin, Sparkles } from 'lucide-react'
import { Persona } from '../utils/dataLoader'
import { saveBuddyPersona } from '../services/buddyService'

interface BuddySaveModalProps {
  persona: Persona
  isOpen: boolean
  onClose: () => void
  onSuccess: (accessToken: string) => void
}

const BuddySaveModal: React.FC<BuddySaveModalProps> = ({
  persona,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [nickname, setNickname] = useState('')
  const [city, setCity] = useState('')
  const [email, setEmail] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [isDiscoverable, setIsDiscoverable] = useState(true)
  const [showContactsPublicly, setShowContactsPublicly] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!nickname.trim()) {
      setError('Please enter a nickname')
      return
    }
    
    // Validate LinkedIn URL if provided
    if (linkedinUrl && !linkedinUrl.match(/linkedin\.com\/(in|pub)\//)) {
      setError('Please enter a valid LinkedIn URL')
      return
    }
    
    setIsLoading(true)
    
    const result = await saveBuddyPersona({
      persona,
      nickname: nickname.trim(),
      city: city.trim() || undefined,
      email: email.trim() || undefined,
      linkedinUrl: linkedinUrl.trim() || undefined,
      isDiscoverable,
      showContactsPublicly
    })
    
    setIsLoading(false)
    
    if (result.success && result.accessToken) {
      onSuccess(result.accessToken)
      onClose()
    } else {
      setError(result.error || 'Failed to save. Please try again.')
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-lg mx-4 bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-cyan-400 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors z-10"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
          
          {/* Header */}
          <div className="relative p-6 md:p-8 pb-4 md:pb-6 bg-gradient-to-r from-cyan-500/20 to-purple-500/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 md:p-3 bg-cyan-400/20 rounded-xl">
                <Users className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  Find Your Music Twin 🎵
                </h2>
                <p className="text-xs md:text-sm text-gray-400">
                  Connect with others who share your vibe
                </p>
              </div>
            </div>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 md:p-8 pt-4 md:pt-6 space-y-4 md:space-y-6">
            {/* Persona Badge */}
            <div className="flex items-center gap-3 p-3 md:p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl border border-cyan-400/30">
              <Music className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
              <div>
                <p className="text-xs md:text-sm text-gray-400">Your Persona:</p>
                <p className="text-white font-semibold text-sm md:text-base">{persona.name}</p>
              </div>
            </div>
            
            {/* Nickname */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nickname <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g., MusicLover_23"
                maxLength={30}
                className="w-full px-3 md:px-4 py-2 md:py-3 bg-slate-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors text-sm md:text-base"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                This is how others will see you
              </p>
            </div>
            
            {/* City (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                City (Optional)
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g., Vancouver"
                maxLength={50}
                className="w-full px-3 md:px-4 py-2 md:py-3 bg-slate-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors text-sm md:text-base"
              />
            </div>
            
            {/* Contact Info (Optional) */}
            <div className="space-y-3 md:space-y-4">
              <p className="text-sm font-medium text-gray-300">
                Contact Info (Optional)
              </p>
              
              <div>
                <label className="block text-xs text-gray-500 mb-2 flex items-center gap-2">
                  <Mail className="w-3 h-3" />
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-3 md:px-4 py-2 bg-slate-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors text-sm"
                />
              </div>
              
              <div>
                <label className="block text-xs text-gray-500 mb-2 flex items-center gap-2">
                  <Linkedin className="w-3 h-3" />
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="linkedin.com/in/yourname"
                  className="w-full px-3 md:px-4 py-2 bg-slate-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors text-sm"
                />
              </div>
            </div>
            
            {/* Privacy Settings */}
            <div className="space-y-3 p-3 md:p-4 bg-slate-800/30 rounded-xl border border-gray-700">
              <p className="text-sm font-medium text-gray-300 mb-3">
                Privacy Settings
              </p>
              
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDiscoverable}
                  onChange={(e) => setIsDiscoverable(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-600 text-cyan-400 focus:ring-cyan-400 focus:ring-offset-slate-900"
                />
                <div className="flex-1">
                  <p className="text-sm text-white">Allow others to find me</p>
                  <p className="text-xs text-gray-500">
                    Your persona will appear in matching suggestions
                  </p>
                </div>
              </label>
              
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showContactsPublicly}
                  onChange={(e) => setShowContactsPublicly(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-600 text-cyan-400 focus:ring-cyan-400 focus:ring-offset-slate-900"
                />
                <div className="flex-1">
                  <p className="text-sm text-white">Show my contact info publicly</p>
                  <p className="text-xs text-gray-500">
                    Others can see your email/LinkedIn without requesting
                  </p>
                </div>
              </label>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
            
            {/* Info Box */}
            <div className="p-4 bg-cyan-400/10 border border-cyan-400/30 rounded-xl">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-300">
                  <p className="font-medium text-white mb-1">Your data is temporary</p>
                  <p className="text-xs text-gray-400">
                    Personas expire after 90 days. You'll receive a private link to manage or delete your data anytime.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 md:py-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25 text-sm md:text-base"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Users className="w-5 h-5" />
                  Find My Music Twin
                </span>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default BuddySaveModal

