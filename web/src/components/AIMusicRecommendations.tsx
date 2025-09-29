import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Music, 
  Play, 
  ExternalLink, 
  Heart, 
  RefreshCw, 
  Sparkles,
  TrendingUp,
  Clock
} from 'lucide-react'
import { Persona } from '../utils/dataLoader'
import { AIService, MusicRecommendation } from '../services/aiService'

interface AIMusicRecommendationsProps {
  persona: Persona
}

const AIMusicRecommendations: React.FC<AIMusicRecommendationsProps> = ({ persona }) => {
  const [recommendations, setRecommendations] = useState<MusicRecommendation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [likedSongs, setLikedSongs] = useState<Set<string>>(new Set())
  const [showRecommendations, setShowRecommendations] = useState(false)

  const generateRecommendations = async () => {
    setIsLoading(true)
    try {
      const recs = await AIService.generateMusicRecommendations(persona)
      setRecommendations(recs)
      setShowRecommendations(true)
    } catch (error) {
      console.error('Error generating recommendations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleLike = (title: string) => {
    setLikedSongs(prev => {
      const newSet = new Set(prev)
      if (newSet.has(title)) {
        newSet.delete(title)
      } else {
        newSet.add(title)
      }
      return newSet
    })
  }

  const openSpotify = (url: string) => {
    window.open(url, '_blank')
  }

  const openYouTube = (title: string, artist: string) => {
    const searchQuery = encodeURIComponent(`${title} ${artist}`)
    window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, '_blank')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="cyberpunk-card"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
            <Music className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">AI Music Recommendations</h3>
            <p className="text-gray-400">Curated just for your {persona.name} profile</p>
          </div>
        </div>
        
        <button
          onClick={generateRecommendations}
          disabled={isLoading}
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center space-x-2"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Get Recommendations</span>
            </>
          )}
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-pink-400 text-lg">AI is analyzing your music DNA...</p>
            <p className="text-gray-400 text-sm mt-2">Finding the perfect songs for you</p>
          </div>
        </div>
      )}

      {showRecommendations && recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-white">
              {recommendations.length} songs recommended for you
            </h4>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <TrendingUp className="w-4 h-4" />
              <span>Based on your {persona.name} profile</span>
            </div>
          </div>

          {recommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-600 rounded-xl p-6 hover:border-pink-400/50 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
                      <Music className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h5 className="text-lg font-bold text-white">{rec.title}</h5>
                      <p className="text-gray-400">{rec.artist}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-3">
                    <span className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-sm font-medium">
                      {rec.genre}
                    </span>
                    <div className="flex items-center space-x-1 text-gray-400 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>AI Recommended</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {rec.reason}
                  </p>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleLike(rec.title)}
                      className={`p-2 rounded-lg transition-all ${
                        likedSongs.has(rec.title)
                          ? 'bg-pink-500 text-white'
                          : 'border border-gray-600 text-gray-400 hover:border-pink-400 hover:text-pink-400'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${likedSongs.has(rec.title) ? 'fill-current' : ''}`} />
                    </button>
                    
                    {rec.spotifyUrl && (
                      <button
                        onClick={() => openSpotify(rec.spotifyUrl!)}
                        className="p-2 border border-green-500 text-green-400 rounded-lg hover:bg-green-500/10 transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => openYouTube(rec.title, rec.artist)}
                      className="p-2 border border-red-500 text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center pt-6 border-t border-gray-700"
          >
            <p className="text-gray-400 text-sm">
              Recommendations are generated based on your music DNA profile and listening patterns
            </p>
            <button
              onClick={generateRecommendations}
              className="mt-3 px-4 py-2 text-pink-400 hover:text-pink-300 transition-colors"
            >
              Get Fresh Recommendations
            </button>
          </motion.div>
        </motion.div>
      )}

      {!showRecommendations && !isLoading && (
        <div className="text-center py-12">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-600/20 flex items-center justify-center mx-auto mb-4">
            <Music className="w-10 h-10 text-pink-400" />
          </div>
          <h4 className="text-xl font-semibold text-white mb-2">Discover Your Perfect Music</h4>
          <p className="text-gray-400 mb-6">
            Get personalized music recommendations based on your unique music DNA profile
          </p>
          <button
            onClick={generateRecommendations}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all"
          >
            Start Discovering
          </button>
        </div>
      )}
    </motion.div>
  )
}

export default AIMusicRecommendations


