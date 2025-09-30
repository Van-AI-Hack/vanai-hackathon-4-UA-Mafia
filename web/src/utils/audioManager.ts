/**
 * Audio Manager for Canadian Music DNA Platform
 * Handles background music, sound effects, and persona-specific audio
 */

// Persona-specific music themes (placeholders for AI-generated music)
// In production, these would be replaced with Suno/Udio generated tracks
export const personaMusicThemes: Record<number, string> = {
  0: '/audio/ambient/nostalgic-waves.mp3',
  1: '/audio/ambient/digital-discovery.mp3',
  2: '/audio/ambient/traditional-harmony.mp3',
  3: '/audio/ambient/future-beats.mp3',
  4: '/audio/ambient/social-vibes.mp3',
  // Add more as needed
}

// Sound effects URLs
export const soundEffects = {
  click: '/audio/sfx/click.mp3',
  hover: '/audio/sfx/hover.mp3',
  success: '/audio/sfx/success.mp3',
  transition: '/audio/sfx/transition.mp3',
  personaReveal: '/audio/sfx/persona-reveal.mp3',
  notification: '/audio/sfx/notification.mp3',
}

class AudioManager {
  private backgroundMusic: HTMLAudioElement | null = null
  private soundEffects: Map<string, HTMLAudioElement> = new Map()
  private isMuted: boolean = false
  private volume: number = 0.5
  private sfxVolume: number = 0.7
  private audioContext: AudioContext | null = null
  private masterGain: GainNode | null = null
  private isAudioContextPlaying: boolean = false
  private currentPersonaId: number | null = null
  private activeOscillators: OscillatorNode[] = []
  private activeGains: GainNode[] = []
  
  constructor() {
    // ALWAYS start unmuted for hackathon demo
    // Users can mute if they want, but default is always unmuted
    this.isMuted = false
    localStorage.setItem('audioMuted', 'false')
    console.log('🔊 Audio initialized - ALWAYS unmuted by default')
    
    const savedVolume = localStorage.getItem('audioVolume')
    if (savedVolume) {
      this.volume = parseFloat(savedVolume)
    } else {
      // Default to 50% volume on first visit
      this.volume = 0.5
      localStorage.setItem('audioVolume', '0.5')
    }
    
    console.log(`🎵 Audio Manager ready - Volume: ${Math.round(this.volume * 100)}%, Muted: ${this.isMuted}`)
  }

  /**
   * Play background ambient music for a persona
   */
  playPersonaMusic(personaId: number) {
    console.log('🎵 playPersonaMusic called for persona:', personaId)
    
    // Stop current music if playing
    this.stopBackgroundMusic()

    // Always use Web Audio API for consistent behavior
    // (Audio files don't exist, so skip trying to load them)
    console.log('🎵 Using Web Audio API for soundscape generation')
    this.generateAmbientTone(personaId)
  }

  /**
   * Generate beautiful ambient soundscape using Web Audio API
   */
  private generateAmbientTone(personaId: number) {
    if (this.isMuted) return

    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      this.audioContext = new AudioContext()
      this.currentPersonaId = personaId
      
      // Create master gain for volume control
      this.masterGain = this.audioContext.createGain()
      this.masterGain.connect(this.audioContext.destination)
      this.masterGain.gain.setValueAtTime(0, this.audioContext.currentTime)
      // Increased volume multiplier from 0.15 to 0.35 for louder output
      this.masterGain.gain.linearRampToValueAtTime(this.volume * 0.35, this.audioContext.currentTime + 4)
      
      // Professional soundscape configurations with rich musical progressions
      const soundscapes = [
        // Persona 0: Nostalgic Waves - Warm vintage with evolving harmonies
        { 
          name: 'Nostalgic Waves', 
          chords: [
            [220, 275, 330, 165],   // Am7 (nostalgic)
            [196, 247, 294, 147],   // G7 (resolution)
          ],
          harmonics: [55, 110, 220, 440, 880],  // Rich harmonic series
          waveTypes: ['sine', 'triangle', 'sine', 'sine'] as OscillatorType[],
          filterFreq: 700,
          filterQ: 2.0,
          reverbMix: 0.5,
          lfoRates: [0.08, 0.12, 0.10, 0.06],
          chordChangeTime: 16  // Slow, meditative changes
        },
        // Persona 1: Digital Discovery - Bright, shimmering with movement
        { 
          name: 'Digital Discovery', 
          chords: [
            [440, 554, 659, 330],   // A major 9 (bright)
            [494, 622, 740, 370],   // B major 9 (lift)
          ],
          harmonics: [220, 440, 880, 1760],
          waveTypes: ['triangle', 'sine', 'triangle', 'sine'] as OscillatorType[],
          filterFreq: 1500,
          filterQ: 1.5,
          reverbMix: 0.4,
          lfoRates: [0.2, 0.3, 0.25, 0.15],
          chordChangeTime: 12
        },
        // Persona 2: Traditional Harmony - Deep, warm, organic
        { 
          name: 'Traditional Harmony', 
          chords: [
            [196, 246, 293, 147],   // G major 7
            [175, 220, 262, 131],   // F major 7
          ],
          harmonics: [49, 98, 196, 392, 784],
          waveTypes: ['sine', 'sine', 'triangle', 'sine'] as OscillatorType[],
          filterFreq: 550,
          filterQ: 2.5,
          reverbMix: 0.6,
          lfoRates: [0.05, 0.08, 0.06, 0.04],
          chordChangeTime: 20
        },
        // Persona 3: Future Beats - Ethereal, spacious, evolving
        { 
          name: 'Future Beats', 
          chords: [
            [523, 659, 784, 392],   // C major 9 (open)
            [587, 740, 880, 440],   // D major 9 (uplifting)
          ],
          harmonics: [131, 261, 523, 1046, 2093],
          waveTypes: ['triangle', 'sine', 'sawtooth', 'sine'] as OscillatorType[],
          filterFreq: 2000,
          filterQ: 1.0,
          reverbMix: 0.7,
          lfoRates: [0.3, 0.4, 0.35, 0.25],
          chordChangeTime: 10
        },
        // Persona 4: Social Vibes - Uplifting, energetic
        { 
          name: 'Social Vibes', 
          chords: [
            [349, 440, 523, 262],   // F major 9
            [392, 494, 587, 294],   // G major 9
          ],
          harmonics: [87, 174, 349, 698, 1396],
          waveTypes: ['triangle', 'sine', 'triangle', 'sine'] as OscillatorType[],
          filterFreq: 1200,
          filterQ: 1.8,
          reverbMix: 0.45,
          lfoRates: [0.25, 0.35, 0.30, 0.20],
          chordChangeTime: 14
        },
      ]
      
      const config = soundscapes[personaId % soundscapes.length]
      let currentChordIndex = 0
      
      // Create delay node for lush reverb
      const delay = this.audioContext.createDelay(2.0)
      delay.delayTime.value = 0.4
      const delayGain = this.audioContext.createGain()
      delayGain.gain.value = config.reverbMix * 0.35
      const delayFilter = this.audioContext.createBiquadFilter()
      delayFilter.type = 'lowpass'
      delayFilter.frequency.value = config.filterFreq * 0.8
      
      delay.connect(delayFilter)
      delayFilter.connect(delayGain)
      delayGain.connect(delay) // Feedback for reverb
      delayGain.connect(this.masterGain!)
      
      // Create oscillators for chord progression
      const oscillators: OscillatorNode[] = []
      const gains: GainNode[] = []
      
      // Main chord voices with evolving frequencies
      config.chords[0].forEach((freq, index) => {
        // Main oscillator
        const osc = this.audioContext!.createOscillator()
        osc.type = config.waveTypes[index]
        osc.frequency.setValueAtTime(freq, this.audioContext!.currentTime)
        
        // Individual gain with smooth envelope
        const oscGain = this.audioContext!.createGain()
        oscGain.gain.setValueAtTime(0, this.audioContext!.currentTime)
        oscGain.gain.linearRampToValueAtTime(0.06 / config.chords[0].length, this.audioContext!.currentTime + 2)
        
        // LFO for organic movement
        const lfo = this.audioContext!.createOscillator()
        lfo.frequency.value = config.lfoRates[index]
        const lfoGain = this.audioContext!.createGain()
        lfoGain.gain.value = 2 + (index * 0.5)
        
        lfo.connect(lfoGain)
        lfoGain.connect(osc.frequency)
        
        // Rich filter with resonance
        const filter = this.audioContext!.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.value = config.filterFreq
        filter.Q.value = config.filterQ
        
        // Connect chain with reverb send
        osc.connect(oscGain)
        oscGain.connect(filter)
        filter.connect(this.masterGain!)
        filter.connect(delay) // Send to reverb
        
        osc.start()
        lfo.start()
        
        // Store for chord changes
        oscillators.push(osc)
        gains.push(oscGain)
      })
      
      // Chord progression automation
      const changeChord = () => {
        currentChordIndex = (currentChordIndex + 1) % config.chords.length
        const newChord = config.chords[currentChordIndex]
        const now = this.audioContext!.currentTime
        
        // Smooth frequency transitions
        oscillators.forEach((osc, i) => {
          if (newChord[i]) {
            osc.frequency.linearRampToValueAtTime(newChord[i], now + 3)
          }
        })
      }
      
      // Set up chord changes
      setInterval(changeChord, config.chordChangeTime * 1000)
      
      // Rich harmonic pad layer
      config.harmonics.forEach((freq, index) => {
        const osc1 = this.audioContext!.createOscillator()
        const osc2 = this.audioContext!.createOscillator()
        osc1.type = 'sine'
        osc2.type = 'sine'
        osc1.frequency.value = freq
        osc2.frequency.value = freq + (1.5 + index * 0.5) // Detuning for chorus
        
        const gain = this.audioContext!.createGain()
        gain.gain.value = 0.02 / (index + 1) // Lower harmonics louder
        
        const filter = this.audioContext!.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.value = config.filterFreq * 0.7
        filter.Q.value = 0.7
        
        osc1.connect(gain)
        osc2.connect(gain)
        gain.connect(filter)
        filter.connect(this.masterGain!)
        filter.connect(delay) // Send to reverb
        
        osc1.start()
        osc2.start()
      })
      
      // Subtle sub-bass for depth
      const subBass = this.audioContext.createOscillator()
      subBass.type = 'sine'
      subBass.frequency.value = config.chords[0][0] * 0.5
      const subGain = this.audioContext.createGain()
      subGain.gain.value = 0.015
      
      subBass.connect(subGain)
      subGain.connect(this.masterGain!)
      subBass.start()
      
      this.isAudioContextPlaying = true
      console.log(`🎵 Playing ${config.name} soundscape`)
      
    } catch (err) {
      console.log('Web Audio API not supported:', err)
    }
  }

  /**
   * Pause background music (can be resumed)
   */
  pauseBackgroundMusic() {
    console.log('🔧 pauseBackgroundMusic called')
    console.log('  - Has masterGain:', !!this.masterGain)
    
    if (this.backgroundMusic && !this.backgroundMusic.paused) {
      this.backgroundMusic.pause()
    }

    // Mute the master gain to silence all audio instantly
    if (this.masterGain && this.audioContext) {
      const currentTime = this.audioContext.currentTime
      this.masterGain.gain.cancelScheduledValues(currentTime)
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, currentTime)
      this.masterGain.gain.linearRampToValueAtTime(0, currentTime + 0.05)
      this.isAudioContextPlaying = false
      console.log('✅ Music PAUSED - Master gain set to 0')
    } else {
      console.log('⚠️ No masterGain to pause')
    }
  }

  /**
   * Resume background music
   */
  resumeBackgroundMusic() {
    console.log('🔧 resumeBackgroundMusic called')
    console.log('  - Has masterGain:', !!this.masterGain)
    console.log('  - Current volume:', this.volume)
    
    if (this.backgroundMusic && this.backgroundMusic.paused) {
      this.backgroundMusic.play().catch(err => console.log('HTML Audio resume failed:', err))
    }

    // Restore master gain to resume audio
    if (this.masterGain && this.audioContext) {
      const currentTime = this.audioContext.currentTime
      const targetVolume = this.isMuted ? 0 : this.volume * 0.35
      this.masterGain.gain.cancelScheduledValues(currentTime)
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, currentTime)
      this.masterGain.gain.linearRampToValueAtTime(targetVolume, currentTime + 0.3)
      this.isAudioContextPlaying = true
      console.log(`✅ Music RESUMED - Master gain restored to ${targetVolume.toFixed(3)}`)
    } else if (!this.audioContext && this.currentPersonaId !== null) {
      // If context was closed, regenerate
      console.log('🔄 Regenerating audio (context was closed)')
      this.generateAmbientTone(this.currentPersonaId)
      this.isAudioContextPlaying = true
    } else {
      console.log('⚠️ Cannot resume - no valid audio state')
    }
  }

  /**
   * Stop background music completely
   */
  stopBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause()
      this.backgroundMusic.currentTime = 0
      this.backgroundMusic = null
    }

    // Close Web Audio API context completely
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
      this.masterGain = null
      this.isAudioContextPlaying = false
      console.log('🎵 Music stopped')
    }
  }

  /**
   * Check if music is currently playing
   */
  isPlaying(): boolean {
    if (this.backgroundMusic && !this.backgroundMusic.paused) {
      return true
    }
    return this.isAudioContextPlaying
  }

  /**
   * Play a sound effect
   */
  playSoundEffect(effectName: keyof typeof soundEffects) {
    if (this.isMuted) {
      return
    }

    // Always use beep for sound effects (audio files don't exist)
    this.playBeep(effectName)
  }

  /**
   * Generate a simple beep sound (fallback)
   */
  private playBeep(effectName: string) {
    if (this.isMuted) return

    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      const audioContext = new AudioContext()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      // Different frequencies for different effects
      const frequencies: Record<string, number> = {
        click: 1200,
        hover: 900,
        success: 1500,
        transition: 800,
        personaReveal: 1800,
        notification: 1100,
      }

      // Different durations for different effects
      const durations: Record<string, number> = {
        click: 0.08,
        hover: 0.05,
        success: 0.15,
        transition: 0.12,
        personaReveal: 0.3,
        notification: 0.2,
      }

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = frequencies[effectName] || 1000
      oscillator.type = 'sine'

      const duration = durations[effectName] || 0.1
      const volume = this.sfxVolume * 0.5  // Increased from 0.3 to 0.5

      gainNode.gain.setValueAtTime(volume, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration)

      console.log(`🔊 Playing ${effectName} sound effect (${frequencies[effectName]}Hz, ${duration}s)`)
    } catch (err) {
      console.error('Sound effect error:', err)
    }
  }

  /**
   * Set volume level
   */
  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume))
    localStorage.setItem('audioVolume', this.volume.toString())
    
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = this.isMuted ? 0 : this.volume
    }

    // Update Web Audio API master gain with increased multiplier
    if (this.masterGain && this.audioContext) {
      const targetVolume = this.isMuted ? 0 : this.volume * 0.35
      this.masterGain.gain.cancelScheduledValues(this.audioContext.currentTime)
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.audioContext.currentTime)
      this.masterGain.gain.linearRampToValueAtTime(
        targetVolume,
        this.audioContext.currentTime + 0.1
      )
      console.log(`🔊 Volume set to ${Math.round(this.volume * 100)}% (${targetVolume.toFixed(3)})`)
    }
  }

  /**
   * Set sound effects volume
   */
  setSfxVolume(volume: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volume))
  }

  /**
   * Toggle mute
   */
  toggleMute(): boolean {
    this.isMuted = !this.isMuted
    localStorage.setItem('audioMuted', this.isMuted.toString())
    
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = this.isMuted ? 0 : this.volume
    }

    // Update Web Audio API master gain
    if (this.masterGain && this.audioContext) {
      const targetVolume = this.isMuted ? 0 : this.volume * 0.35
      this.masterGain.gain.cancelScheduledValues(this.audioContext.currentTime)
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.audioContext.currentTime)
      this.masterGain.gain.linearRampToValueAtTime(
        targetVolume,
        this.audioContext.currentTime + 0.1
      )
      console.log(`🔇 Mute toggled: ${this.isMuted}`)
    }
    
    return this.isMuted
  }

  /**
   * Get current mute state
   */
  isMutedState(): boolean {
    return this.isMuted
  }

  /**
   * Get current volume
   */
  getVolume(): number {
    return this.volume
  }

  /**
   * Fade out background music
   */
  fadeOut(duration: number = 1000) {
    if (!this.backgroundMusic) return

    const steps = 20
    const volumeStep = this.volume / steps
    const timeStep = duration / steps
    let currentStep = 0

    const fadeInterval = setInterval(() => {
      currentStep++
      const newVolume = Math.max(0, this.volume - volumeStep * currentStep)
      if (this.backgroundMusic) {
        this.backgroundMusic.volume = this.isMuted ? 0 : newVolume
      }

      if (currentStep >= steps) {
        clearInterval(fadeInterval)
        this.stopBackgroundMusic()
      }
    }, timeStep)
  }

  /**
   * Cleanup
   */
  cleanup() {
    this.stopBackgroundMusic()
    this.soundEffects.clear()
  }
}

// Export singleton instance
export const audioManager = new AudioManager()

// Export for React components
export default audioManager
