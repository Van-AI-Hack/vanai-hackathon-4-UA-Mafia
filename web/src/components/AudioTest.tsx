import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Volume2, VolumeX, Play } from 'lucide-react'
import audioManager from '../utils/audioManager'

const AudioTest: React.FC = () => {
  const [isMuted, setIsMuted] = useState(audioManager.isMutedState())

  const soundEffects = ['click', 'hover', 'success', 'transition', 'personaReveal', 'notification']

  const testSound = (effect: string) => {
    console.log(`Testing ${effect}...`)
    audioManager.playSoundEffect(effect as any)
  }

  const toggleMute = () => {
    const newState = audioManager.toggleMute()
    setIsMuted(newState)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed bottom-4 right-4 z-50 p-4 bg-slate-900/95 border-2 border-cyan-400 rounded-lg shadow-2xl max-w-xs"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-bold">🔊 Audio Test</h3>
        <button
          onClick={toggleMute}
          className="p-2 rounded hover:bg-white/10"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-gray-400" />
          ) : (
            <Volume2 className="w-5 h-5 text-cyan-400" />
          )}
        </button>
      </div>

      <p className="text-gray-400 text-xs mb-3">
        Click buttons to test sound effects
      </p>

      <div className="grid grid-cols-2 gap-2">
        {soundEffects.map((effect) => (
          <button
            key={effect}
            onClick={() => testSound(effect)}
            className="flex items-center gap-2 px-3 py-2 bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/30 rounded text-white text-sm transition-all"
          >
            <Play className="w-3 h-3" />
            {effect}
          </button>
        ))}
      </div>

      <p className="text-gray-400 text-xs mt-3">
        Open DevTools Console (F12) to see debug logs
      </p>
    </motion.div>
  )
}

export default AudioTest
