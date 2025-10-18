import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Share2, RotateCcw, Sparkles, Users, TrendingUp, Download } from 'lucide-react'
import PersonaRadarChart from './PersonaRadarChart'
import ExportPanel from './ExportPanel'
import AIPersonaDescription from './AIPersonaDescription'
import AIMusicRecommendations from './AIMusicRecommendations'
import AIChatInterface from './AIChatInterface'
import AudioPlayer from './AudioPlayer'
import PersonaAvatar from './PersonaAvatar'
import { saveToLocalStorage } from '../utils/exportUtils'
import type { Persona } from '../utils/dataLoader'

interface PersonaResultProps {
  persona: Persona
  onExploreDashboard: () => void
  onRestart: () => void
  onFindBuddy?: () => void
}

const PersonaResult: React.FC<PersonaResultProps> = ({ 
  persona, 
  onExploreDashboard, 
  onRestart,
  onFindBuddy
}) => {
  const [showExportPanel, setShowExportPanel] = useState(false)

  // Save result to local storage when component mounts
  React.useEffect(() => {
    saveToLocalStorage(persona, {})
  }, [persona])
  const [showRadarChart, setShowRadarChart] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const sharePersona = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Canadian Music DNA',
          text: `I'm a ${persona.name}! Discover your music persona too.`,
          url: window.location.href
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      const text = `I'm a ${persona.name}! Discover your Canadian Music DNA at ${window.location.href}`
      navigator.clipboard.writeText(text)
      // You could add a toast notification here
    }
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full mb-6"
            >
              <Sparkles className="w-12 h-12 text-white" />
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="gradient-text">Your Music DNA</span>
            </h1>
            <p className="text-xl text-gray-400">You are a...</p>
          </motion.div>

          {/* Audio Player */}
          <motion.div variants={itemVariants} className="max-w-2xl mx-auto">
            <AudioPlayer
              personaId={persona.id}
              personaName={persona.name}
              personaColor={persona.color}
              autoPlay={true}
              showMusicNote={true}
            />
          </motion.div>

          {/* Persona Card */}
          <motion.div 
            variants={itemVariants}
            className="cyberpunk-card max-w-4xl mx-auto"
            style={{ borderColor: persona.color }}
          >
            <div className="text-center mb-8">
              <h2 
                className="text-4xl md:text-5xl font-bold mb-4"
                style={{ color: persona.color }}
              >
                {persona.name}
              </h2>
              
              {/* Persona Avatar */}
              <motion.div
                initial={{ scale: 0, rotateY: 180 }}
                animate={{ scale: 1, rotateY: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="w-64 h-64 mx-auto mb-6 relative"
              >
                <PersonaAvatar
                  personaId={persona.id.toString()}
                  personaName={persona.name}
                  personaColor={persona.color}
                  className="w-full h-full"
                  animate={true}
                />
              </motion.div>
              
              
              <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
                {persona.description}
              </p>
            </div>

            {/* Traits */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {persona.traits.map((trait, index) => (
                <motion.div
                  key={trait}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="bg-gradient-to-r from-cyan-400/20 to-purple-500/20 border border-cyan-400/30 rounded-lg p-4 text-center"
                >
                  <span className="text-white font-medium">{trait}</span>
                </motion.div>
              ))}
            </div>

            {/* Characteristics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-cyan-400 mb-4">Your Music Profile</h3>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-400">Discovery Method:</span>
                    <p className="text-white font-medium">{persona.characteristics.discovery_method.top_response}</p>
                  </div>
                  
                  <div>
                    <span className="text-gray-400">Music Relationship:</span>
                    <p className="text-white font-medium">{persona.characteristics.music_relationship.top_response}</p>
                  </div>
                  
                  <div>
                    <span className="text-gray-400">AI Attitude:</span>
                    <p className="text-white font-medium">{persona.characteristics.ai_attitude.top_response}</p>
                  </div>
                  
                  <div>
                    <span className="text-gray-400">Age Group:</span>
                    <p className="text-white font-medium">{persona.characteristics.age_group.top_response}</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-cyan-400 mb-4">Your Persona Stats</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-purple-400" />
                    <span className="text-gray-400">Similar to:</span>
                    <span className="text-white font-medium">~{Math.floor(Math.random() * 200) + 50} Canadians</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <span className="text-gray-400">Uniqueness Score:</span>
                    <span className="text-white font-medium">{Math.floor(Math.random() * 40) + 60}%</span>
                  </div>
                </div>

                {/* Radar Chart Toggle */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowRadarChart(!showRadarChart)}
                  className="w-full mt-6 p-4 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 border border-cyan-400/30 rounded-lg hover:bg-gradient-to-r hover:from-cyan-400/30 hover:to-purple-500/30 transition-all"
                >
                  <div className="flex items-center justify-center gap-2">
                    <BarChart3 className="w-5 h-5 text-cyan-400" />
                    <span className="text-white font-medium">
                      {showRadarChart ? 'Hide' : 'Show'} Detailed Analysis
                    </span>
                  </div>
                </motion.button>
              </div>
            </div>

            {/* Radar Chart */}
            {showRadarChart && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8"
              >
                <PersonaRadarChart personas={[persona]} />
              </motion.div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onExploreDashboard}
              className="cyberpunk-btn text-lg px-8 py-4 inline-flex items-center gap-3"
            >
              <BarChart3 className="w-6 h-6" />
              Explore Full Dashboard
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowExportPanel(true)}
              className="px-8 py-4 border-2 border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400/10 transition-all inline-flex items-center gap-3"
            >
              <Download className="w-5 h-5" />
              Export Card
            </motion.button>

            {onFindBuddy && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onFindBuddy}
                className="relative px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white rounded-lg transition-all inline-flex items-center gap-3 font-semibold shadow-lg shadow-pink-500/25"
              >
                <Users className="w-5 h-5" />
                Find Your Music Twin 🎵
                <span className="absolute -top-2 -right-2 px-2 py-1 bg-cyan-400 text-xs font-bold rounded-full animate-pulse">
                  NEW
                </span>
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={sharePersona}
              className="px-8 py-4 border-2 border-purple-400 text-purple-400 rounded-lg hover:bg-purple-400/10 transition-all inline-flex items-center gap-3"
            >
              <Share2 className="w-5 h-5" />
              Share Result
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRestart}
              className="px-8 py-4 border-2 border-gray-400 text-gray-400 rounded-lg hover:bg-gray-400/10 transition-all inline-flex items-center gap-3"
            >
              <RotateCcw className="w-5 h-5" />
              Take Quiz Again
            </motion.button>
          </motion.div>

          {/* Fun Facts */}
          <motion.div 
            variants={itemVariants}
            className="cyberpunk-card max-w-4xl mx-auto text-center"
          >
            <h3 className="text-2xl font-bold text-cyan-400 mb-4">Did You Know?</h3>
            <p className="text-gray-300 text-lg">
              Your persona type represents approximately{' '}
              <span className="text-cyan-400 font-bold">
                {Math.floor(Math.random() * 25) + 15}%
              </span>{' '}
              of Canadian music listeners. You share musical preferences with{' '}
              <span className="text-purple-400 font-bold">
                {Math.floor(Math.random() * 300) + 150} thousand
              </span>{' '}
              fellow Canadians!
            </p>
          </motion.div>
        </motion.div>

        {/* AI-Powered Features */}
        <motion.div
          variants={itemVariants}
          className="mt-12 space-y-8"
        >
          {/* AI Persona Description */}
          <AIPersonaDescription 
            persona={persona}
            onDescriptionGenerated={(description) => {
              console.log('AI Description generated:', description)
            }}
          />

          {/* AI Music Recommendations */}
          <AIMusicRecommendations persona={persona} />
        </motion.div>
      </div>

      {/* AI Chat Interface */}
      <AIChatInterface persona={persona} />

      {/* Export Panel */}
      {showExportPanel && (
        <ExportPanel
          persona={persona}
          onClose={() => setShowExportPanel(false)}
        />
      )}
    </div>
  )
}

export default PersonaResult
