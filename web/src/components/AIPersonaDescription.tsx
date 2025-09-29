import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, Sparkles, Volume2, VolumeX, RefreshCw } from 'lucide-react'
import { Persona } from '../utils/dataLoader'
import { AIService, TTSService } from '../services/aiService'

interface AIPersonaDescriptionProps {
  persona: Persona
  onDescriptionGenerated?: (description: string) => void
}

const AIPersonaDescription: React.FC<AIPersonaDescriptionProps> = ({ 
  persona, 
  onDescriptionGenerated 
}) => {
  const [aiDescription, setAiDescription] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [funFacts, setFunFacts] = useState<string[]>([])
  const [showFunFacts, setShowFunFacts] = useState(false)
  const [ttsSupported, setTtsSupported] = useState(false)
  
  const ttsService = TTSService.getInstance()

  useEffect(() => {
    setTtsSupported(ttsService.isSupported())
    generateAIDescription()
  }, [persona])

  const generateAIDescription = async () => {
    setIsGenerating(true)
    try {
      const description = await AIService.generatePersonaDescription(persona)
      setAiDescription(description)
      onDescriptionGenerated?.(description)
    } catch (error) {
      console.error('Error generating AI description:', error)
      setAiDescription(persona.description) // Fallback to original
    } finally {
      setIsGenerating(false)
    }
  }

  const generateFunFacts = async () => {
    try {
      const facts = await AIService.generateFunFacts(persona)
      setFunFacts(facts)
      setShowFunFacts(true)
    } catch (error) {
      console.error('Error generating fun facts:', error)
    }
  }

  const speakDescription = async () => {
    if (!ttsSupported || !aiDescription) return
    
    try {
      setIsPlaying(true)
      await ttsService.speak(aiDescription, {
        rate: 0.8,
        pitch: 1.1,
        volume: 0.9
      })
    } catch (error) {
      console.error('Error with TTS:', error)
    } finally {
      setIsPlaying(false)
    }
  }

  const stopSpeaking = () => {
    ttsService.stop()
    setIsPlaying(false)
  }

  return (
    <div className="space-y-6">
      {/* AI Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="cyberpunk-card"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">AI-Generated Analysis</h3>
              <p className="text-sm text-gray-400">Powered by advanced music psychology AI</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {ttsSupported && (
              <button
                onClick={isPlaying ? stopSpeaking : speakDescription}
                disabled={!aiDescription || isGenerating}
                className="p-2 rounded-lg border border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 transition-all disabled:opacity-50"
              >
                {isPlaying ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
            )}
            
            <button
              onClick={generateAIDescription}
              disabled={isGenerating}
              className="p-2 rounded-lg border border-purple-400 text-purple-400 hover:bg-purple-400/10 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {isGenerating ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-purple-400">AI is analyzing your music DNA...</span>
            </div>
          </div>
        ) : (
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed text-lg">
              {aiDescription}
            </p>
          </div>
        )}
      </motion.div>

      {/* Fun Facts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="cyberpunk-card"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Did You Know?</h3>
              <p className="text-sm text-gray-400">Fascinating facts about your music persona</p>
            </div>
          </div>
          
          <button
            onClick={generateFunFacts}
            className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-lg hover:from-cyan-500 hover:to-blue-600 transition-all"
          >
            Generate Facts
          </button>
        </div>

        {showFunFacts && funFacts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-3"
          >
            {funFacts.map((fact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 border border-cyan-400/20 rounded-lg"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                  <p className="text-gray-300">{fact}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default AIPersonaDescription
