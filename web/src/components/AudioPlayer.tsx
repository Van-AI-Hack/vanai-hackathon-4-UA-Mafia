import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, Music, Sparkles } from 'lucide-react'
import audioManager from '../utils/audioManager'

interface AudioPlayerProps {
  personaId?: number
  personaName?: string
  personaColor?: string
  autoPlay?: boolean
  showMusicNote?: boolean
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  personaId, 
  personaName,
  personaColor = '#00d4ff',
  autoPlay = false,
  showMusicNote = true
}) => {
  const [isMuted, setIsMuted] = useState(audioManager.isMutedState())
  const [volume, setVolume] = useState(audioManager.getVolume())
  const [isPlaying, setIsPlaying] = useState(false)
  const [showControls, setShowControls] = useState(false)

  useEffect(() => {
    // Check if audio is muted on load
    const savedMuteState = localStorage.getItem('audioMuted')
    if (savedMuteState === 'true') {
      console.log('⚠️ Audio was previously muted. Click the speaker icon to unmute.')
      setIsMuted(true)
    }

    // Auto-play ambient music for persona if enabled
    if (autoPlay && personaId !== undefined) {
      setTimeout(() => {
        if (!audioManager.isMutedState()) {
          audioManager.playPersonaMusic(personaId)
          setIsPlaying(true)
          audioManager.playSoundEffect('personaReveal')
          console.log('🎵 Auto-playing music for persona', personaId)
        } else {
          console.log('🔇 Audio is muted. Click the speaker icon to hear the soundscape.')
        }
      }, 500)
    }

    return () => {
      // Cleanup on unmount
      if (autoPlay) {
        audioManager.fadeOut(1000)
      }
    }
  }, [personaId, autoPlay])

  const handleToggleMute = () => {
    const newMuteState = audioManager.toggleMute()
    setIsMuted(newMuteState)
    audioManager.playSoundEffect('click')
    
    // If unmuting and persona exists, start music
    if (!newMuteState && personaId !== undefined && !isPlaying) {
      audioManager.playPersonaMusic(personaId)
      setIsPlaying(true)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    audioManager.setVolume(newVolume)
    console.log('🔊 Volume changed to:', newVolume)
    
    // Unmute if adjusting volume
    if (isMuted && newVolume > 0) {
      const newMuteState = audioManager.toggleMute()
      setIsMuted(newMuteState)
    }
  }

  const handleToggleMusic = () => {
    if (personaId === undefined) return

    console.log('🎵 Button clicked, current isPlaying:', isPlaying)

    if (isPlaying) {
      // Pause the music
      console.log('🎵 Attempting to PAUSE music...')
      setIsPlaying(false)
      audioManager.pauseBackgroundMusic()
      audioManager.playSoundEffect('click')
    } else {
      // Resume or start music
      console.log('🎵 Attempting to RESUME/START music...')
      setIsPlaying(true)
      audioManager.resumeBackgroundMusic()
      audioManager.playSoundEffect('success')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Compact Button */}
      <motion.div
        className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-cyan-400/30 backdrop-blur-sm relative z-10"
        style={{ borderColor: `${personaColor}40` }}
      >
        {/* Music Note Animation */}
        {showMusicNote && isPlaying && !isMuted && (
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [-5, 5, -5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Music className="w-6 h-6" style={{ color: personaColor }} />
          </motion.div>
        )}

        {/* Mute Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleMute}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6 text-gray-400" />
          ) : (
            <Volume2 className="w-6 h-6" style={{ color: personaColor }} />
          )}
        </motion.button>

        {/* Persona Music Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {isPlaying && !isMuted ? (
              <>
                <Sparkles className="w-3 h-3 inline mr-1" style={{ color: personaColor }} />
                {personaName ? `${personaName} Ambient` : 'Ambient Music'}
              </>
            ) : (
              'Audio Off'
            )}
          </p>
          <p className="text-xs text-gray-400">
            {isPlaying && !isMuted ? 'AI-Generated Soundscape' : 'Click to enable audio'}
          </p>
        </div>

        {/* Play/Pause Toggle */}
        {personaId !== undefined && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleMusic}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            style={{ color: personaColor }}
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </motion.button>
        )}

        {/* Expanded Controls */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="flex items-center gap-2 overflow-hidden"
            >
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 accent-cyan-400 cursor-pointer"
                style={{ accentColor: personaColor }}
              />
              <span className="text-xs text-gray-400 w-8">
                {Math.round(volume * 100)}%
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Audio Visualizer Effect */}
      {isPlaying && !isMuted && (
        <motion.div
          className="absolute -inset-1 rounded-lg opacity-50 blur-xl pointer-events-none -z-10"
          animate={{
            background: [
              `radial-gradient(circle, ${personaColor}20 0%, transparent 70%)`,
              `radial-gradient(circle, ${personaColor}40 0%, transparent 70%)`,
              `radial-gradient(circle, ${personaColor}20 0%, transparent 70%)`,
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.div>
  )
}

export default AudioPlayer
