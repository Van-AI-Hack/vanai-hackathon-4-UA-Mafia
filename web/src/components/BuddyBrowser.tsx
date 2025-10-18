/**
 * Music Buddy Browser - Browse and discover matching personas
 */

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Music, MapPin, Mail, Linkedin, Lock, Sparkles, ArrowLeft, Share2, Calendar } from 'lucide-react'
import { BuddyPersona } from '../lib/supabase'
import { getSuggestedMatches, getMyPersona, revealContact } from '../services/buddyService'
import BuddySaveModal from './BuddySaveModal'
import { EventBrowser } from './EventBrowser'
import { PersonaComparisonModal } from './PersonaComparisonModal'
import { Persona } from '../utils/dataLoader'

interface BuddyBrowserProps {
  currentPersona?: Persona
  onBack: () => void
}

const BuddyBrowser: React.FC<BuddyBrowserProps> = ({ currentPersona, onBack }) => {
  const [myPersona, setMyPersona] = useState<BuddyPersona | null>(null)
  const [matches, setMatches] = useState<Array<{
    persona: BuddyPersona
    similarity: number
    sharedTags: string[]
  }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [revealedContacts, setRevealedContacts] = useState<Record<string, any>>({})
  const [currentView, setCurrentView] = useState<'matches' | 'events'>('matches')
  const [showComparison, setShowComparison] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<{
    persona: BuddyPersona
    similarity: number
    sharedTags: string[]
  } | null>(null)

  useEffect(() => {
    loadMyPersonaAndMatches()
  }, [])

  const loadMyPersonaAndMatches = async () => {
    setIsLoading(true)
    setError('')
    
    const result = await getMyPersona()
    
    if (result.success && result.persona) {
      setMyPersona(result.persona)
      await loadMatches(result.persona)
    } else {
      // User hasn't saved their persona yet
      setShowSaveModal(true)
      setIsLoading(false)
    }
  }

  const loadMatches = async (persona: BuddyPersona) => {
    const result = await getSuggestedMatches(persona, 10)
    
    if (result.success && result.matches) {
      setMatches(result.matches)
    } else {
      setError(result.error || 'Failed to load matches')
    }
    
    setIsLoading(false)
  }

  const handleRevealContact = async (personaId: string) => {
    const result = await revealContact(personaId)
    
    if (result.success && result.contact) {
      setRevealedContacts(prev => ({
        ...prev,
        [personaId]: result.contact
      }))
    } else {
      alert(result.error || 'Cannot reveal contact info')
    }
  }

  const handleSaveSuccess = () => {
    loadMyPersonaAndMatches()
  }

  const handleCompare = (match: { persona: BuddyPersona; similarity: number; sharedTags: string[] }) => {
    setSelectedMatch(match)
    setShowComparison(true)
  }

  if (showSaveModal && currentPersona) {
    return (
      <BuddySaveModal
        persona={currentPersona}
        isOpen={true}
        onClose={onBack}
        onSuccess={handleSaveSuccess}
      />
    )
  }

  // Show EventBrowser when events view is selected
  if (currentView === 'events') {
    return (
      <EventBrowser
        userAccessToken={myPersona?.access_token || ''}
        onBack={() => setCurrentView('matches')}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Results
          </button>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl">
                <Users className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">
                  <span className="gradient-text">Find Your Music Twin</span>
                </h1>
                <p className="text-gray-400">
                  Discover people with similar (or complementary) music DNA
                </p>
              </div>
            </div>
            
            {/* View Toggle */}
            <div className="flex gap-2 p-1 bg-gray-800 rounded-lg">
              <button
                onClick={() => setCurrentView('matches')}
                className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
                  currentView === 'matches'
                    ? 'bg-cyan-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                Matches
              </button>
              <button
                onClick={() => setCurrentView('events')}
                className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
                  (currentView as string) === 'events'
                    ? 'bg-cyan-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Calendar className="w-4 h-4" />
                Events
              </button>
            </div>
          </div>
          
          {/* My Persona Badge */}
          {myPersona && (
            <div className="mt-6 p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl border border-cyan-400/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Music className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-sm text-gray-400">Your Persona:</p>
                    <p className="font-semibold">{myPersona.persona_name}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {myPersona.vibe_tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-cyan-400/20 text-cyan-300 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto" />
            <p className="mt-4 text-gray-400">Finding your music twins...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Matches Grid */}
        {!isLoading && matches.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              Top {matches.length} Matches
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {matches.map(({ persona, similarity, sharedTags }) => (
                <motion.div
                  key={persona.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="cyberpunk-card p-6 hover:shadow-xl hover:shadow-cyan-500/10 transition-all"
                >
                  {/* Match Score Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center font-bold text-white">
                        {similarity}%
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Match</p>
                        <p className="font-semibold">{persona.nickname}</p>
                      </div>
                    </div>
                  </div>

                  {/* Persona Info */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Music className="w-4 h-4 text-cyan-400" />
                      <span className="text-gray-300">{persona.persona_name}</span>
                    </div>
                    
                    {persona.city && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-cyan-400" />
                        <span className="text-gray-300">{persona.city}</span>
                      </div>
                    )}
                  </div>

                  {/* Shared Tags */}
                  {sharedTags.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">Shared vibes:</p>
                      <div className="flex flex-wrap gap-2">
                        {sharedTags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-cyan-400/20 text-cyan-300 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contact Info */}
                  {persona.show_contacts_publicly ? (
                    <div className="space-y-2 pt-4 border-t border-gray-700">
                      {revealedContacts[persona.id] ? (
                        <>
                          {revealedContacts[persona.id].email && (
                            <a
                              href={`mailto:${revealedContacts[persona.id].email}`}
                              className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                            >
                              <Mail className="w-4 h-4" />
                              {revealedContacts[persona.id].email}
                            </a>
                          )}
                          {revealedContacts[persona.id].linkedin_url && (
                            <a
                              href={revealedContacts[persona.id].linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                            >
                              <Linkedin className="w-4 h-4" />
                              LinkedIn Profile
                            </a>
                          )}
                        </>
                      ) : (
                        <button
                          onClick={() => handleRevealContact(persona.id)}
                          className="w-full py-2 px-4 bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-300 rounded-lg transition-colors text-sm font-medium"
                        >
                          Show Contact Info
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="pt-4 border-t border-gray-700">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Lock className="w-4 h-4" />
                        <span>Contact info not shared</span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t border-gray-700 flex gap-2">
                    <button 
                      onClick={() => handleCompare({ persona, similarity, sharedTags })}
                      className="flex-1 py-2 px-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      Compare
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && matches.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
              <Users className="w-12 h-12 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No matches yet</h3>
            <p className="text-gray-400 mb-6">
              Be the first! More music twins will appear as others join.
            </p>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white rounded-xl font-semibold transition-all"
            >
              Back to Results
            </button>
          </div>
        )}

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-6 bg-cyan-400/10 border border-cyan-400/30 rounded-xl"
        >
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
            <div className="text-sm text-gray-300">
              <p className="font-medium text-white mb-2">How matching works:</p>
              <ul className="space-y-1 text-gray-400">
                <li>• Same persona type: +50% match score</li>
                <li>• Shared music vibes: +30% match score</li>
                <li>• Same city: +20% match score</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Comparison Modal */}
        {showComparison && selectedMatch && myPersona && (
          <PersonaComparisonModal
            isOpen={showComparison}
            onClose={() => setShowComparison(false)}
            myPersona={myPersona}
            otherPersona={selectedMatch.persona}
            similarity={selectedMatch.similarity}
            sharedTags={selectedMatch.sharedTags}
          />
        )}
      </div>
    </div>
  )
}

export default BuddyBrowser

