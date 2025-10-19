/**
 * Simple Audio Manager for Discovery Method Flows
 * Clean, reliable implementation focused on hover-play, unhover-stop
 */

export class SimpleAudioManager {
  private audio: HTMLAudioElement | null = null
  private currentMethod: string | null = null

  /**
   * Play audio for a discovery method
   */
  play(discoveryMethod: string, ageGroup: string): void {
    console.log(`🎵 Play requested: ${discoveryMethod} - ${ageGroup}`)
    
    // If already playing the same method, don't restart
    if (this.audio && this.currentMethod === discoveryMethod) {
      console.log(`✅ Already playing ${discoveryMethod}`)
      return
    }
    
    // Store old audio to stop it AFTER new one starts
    const oldAudio = this.audio
    this.audio = null
    
    // Build the file path
    let fileName = this.getFileName(discoveryMethod, ageGroup)
    if (!fileName) {
      console.warn(`⚠️ No specific audio file, using random: ${discoveryMethod} - ${ageGroup}`)
      // Use a random file as fallback
      fileName = this.getRandomFileName(discoveryMethod)
    }
    
    if (!fileName) {
      console.error(`❌ No audio file available for: ${discoveryMethod}`)
      return
    }
    
    // Build path - no encoding needed for simple filenames
    const audioPath = `/audio/dashboard-playlist/${fileName}`
    console.log(`📂 Loading audio: ${audioPath}`)
    
    try {
      this.audio = new Audio(audioPath)
      this.audio.volume = 0.3
      this.audio.loop = true
      this.audio.preload = 'auto' // Preload the audio
      this.currentMethod = discoveryMethod
      
      // Stop old audio now that new one is created
      if (oldAudio) {
        try {
          oldAudio.pause()
          oldAudio.src = ''
          oldAudio.load()
        } catch (e) {
          // Ignore errors
        }
      }
      
      // Error handler
      this.audio.onerror = (e) => {
        const audio = e.target as HTMLAudioElement
        console.error(`❌ Failed to load audio:`, {
          path: audioPath,
          error: audio.error?.message,
          code: audio.error?.code
        })
        this.stop()
      }
      
      // Wait for audio to be ready, then play
      this.audio.addEventListener('canplay', () => {
        if (this.audio) {
          console.log(`🎵 Audio ready, starting playback: ${fileName}`)
          this.audio.play().catch(err => {
            console.error(`❌ Play failed:`, err.message)
            this.stop()
          })
        }
      }, { once: true })
      
      // Manually trigger load
      this.audio.load()
      
      console.log(`⏳ Loading: ${fileName}`)
    } catch (err) {
      console.error(`❌ Audio setup failed:`, err)
      this.stop()
    }
  }

  /**
   * Stop all audio safely
   */
  stop(): void {
    if (this.audio) {
      try {
        // Only try to pause if audio has started
        if (this.audio.readyState > 0) {
          this.audio.pause()
          this.audio.currentTime = 0
        }
        // Always clear the source
        this.audio.src = ''
        this.audio.load()
        this.audio = null
      } catch (err) {
        // Silently ignore errors and just clear the reference
        this.audio = null
      }
    }
    this.currentMethod = null
    console.log('🔇 Audio stopped')
  }

  /**
   * Get the currently playing method
   */
  getCurrentMethod(): string | null {
    return this.currentMethod
  }

  /**
   * Check if audio is playing
   */
  isPlaying(): boolean {
    return this.audio !== null && !this.audio.paused
  }

  /**
   * Get audio filename based on discovery method and age group
   * Files are named: [method]-[number].mp3
   * Sorted alphabetically, so we can map by age group (1-2: 18-34, 3-4: 35-54, 5-6: 55+)
   */
  private getFileName(discoveryMethod: string, ageGroup: string): string | null {
    // Map discovery methods to simple prefixes
    const methodMap: Record<string, string> = {
      'Radio': 'radio',
      'Friends and family recommendations': 'friends',
      'Streaming service recommendations': 'streaming',
      'Social media': 'social',
      'Live events and concerts': 'concerts'
    }
    
    const prefix = methodMap[discoveryMethod]
    if (!prefix) return null
    
    // Map age groups to file numbers (alphabetically sorted)
    // Files are sorted: 18-34 Casual, 18-34 Strong, 35-54 Casual, 35-54 Strong, 55+ Casual, 55+ Strong
    const ageMap: Record<string, number> = {
      '18-34': 2, // Use Strong Connection variant (file 2)
      '35-54': 4, // Use Strong Connection variant (file 4)
      '55+': 6    // Use Strong Connection variant (file 6)
    }
    
    const fileNum = ageMap[ageGroup]
    if (!fileNum) return null
    
    return `${prefix}-${fileNum}.mp3`
  }

  /**
   * Get a random audio file for a discovery method (fallback)
   */
  private getRandomFileName(discoveryMethod: string): string | null {
    const methodMap: Record<string, string> = {
      'Radio': 'radio',
      'Friends and family recommendations': 'friends',
      'Streaming service recommendations': 'streaming',
      'Social media': 'social',
      'Live events and concerts': 'concerts'
    }
    
    const prefix = methodMap[discoveryMethod]
    if (!prefix) return null
    
    // Pick a random file (1-6)
    const randomNum = Math.floor(Math.random() * 6) + 1
    return `${prefix}-${randomNum}.mp3`
  }
}

// Export singleton
export const simpleAudioManager = new SimpleAudioManager()

