/**
 * Dashboard Audio Service
 * Manages contextual audio for Discovery Method Flow based on user demographics and hover states
 */

export interface UserContext {
  ageGroup?: '18-34' | '35-54' | '55+'
  musicRelationship?: 'Casual Listener' | 'Strong Connection'
  discoveryMethod?: string
}

export interface AudioTrack {
  path: string
  title: string
  discoveryMethod: string
  ageGroup: string
  musicRelationship: string
}

// Audio mapping based on file structure
export const DISCOVERY_METHOD_SONGS: Record<string, Record<string, Record<string, AudioTrack>>> = {
  'Radio': {
    '18-34': {
      'Casual Listener': {
        path: '/audio/dashboard-playlist/Radio → 18-34 → Casual Listener Song Turn It Up.mp3',
        title: 'Turn It Up',
        discoveryMethod: 'Radio',
        ageGroup: '18-34',
        musicRelationship: 'Casual Listener'
      },
      'Strong Connection': {
        path: '/audio/dashboard-playlist/Radio → 18-34 → Strong Connection Song Turn the Dial.mp3',
        title: 'Turn the Dial',
        discoveryMethod: 'Radio',
        ageGroup: '18-34',
        musicRelationship: 'Strong Connection'
      }
    },
    '35-54': {
      'Casual Listener': {
        path: '/audio/dashboard-playlist/Radio → 35-54 → Casual Listener Song Static Heartbeats.mp3',
        title: 'Static Heartbeats',
        discoveryMethod: 'Radio',
        ageGroup: '35-54',
        musicRelationship: 'Casual Listener'
      },
      'Strong Connection': {
        path: '/audio/dashboard-playlist/Radio → 35-54 → Strong Connection Song Frequency Love.mp3',
        title: 'Frequency Love',
        discoveryMethod: 'Radio',
        ageGroup: '35-54',
        musicRelationship: 'Strong Connection'
      }
    },
    '55+': {
      'Casual Listener': {
        path: '/audio/dashboard-playlist/Radio → 55+ → Casual Listener Song On The Air.mp3',
        title: 'On The Air',
        discoveryMethod: 'Radio',
        ageGroup: '55+',
        musicRelationship: 'Casual Listener'
      },
      'Strong Connection': {
        path: '/audio/dashboard-playlist/Radio → 55+ → Strong Connection Song Golden Frequencies.mp3',
        title: 'Golden Frequencies',
        discoveryMethod: 'Radio',
        ageGroup: '55+',
        musicRelationship: 'Strong Connection'
      }
    }
  },
  'Friends and family recommendations': {
    '18-34': {
      'Casual Listener': {
        path: '/audio/dashboard-playlist/Friends → 18-34 → Casual Listener Song Friendship in Stereo.mp3',
        title: 'Friendship in Stereo',
        discoveryMethod: 'Friends',
        ageGroup: '18-34',
        musicRelationship: 'Casual Listener'
      },
      'Strong Connection': {
        path: '/audio/dashboard-playlist/Friends → 18-34 → Strong Connection Song All My Friends Are the Stars.mp3',
        title: 'All My Friends Are the Stars',
        discoveryMethod: 'Friends',
        ageGroup: '18-34',
        musicRelationship: 'Strong Connection'
      }
    },
    '35-54': {
      'Casual Listener': {
        path: '/audio/dashboard-playlist/Friends → 35-54 → Casual Listener Song Echoes in the Hallway.mp3',
        title: 'Echoes in the Hallway',
        discoveryMethod: 'Friends',
        ageGroup: '35-54',
        musicRelationship: 'Casual Listener'
      },
      'Strong Connection': {
        path: '/audio/dashboard-playlist/Friends → 35-54 → Strong Connection Song Echoes of Us.mp3',
        title: 'Echoes of Us',
        discoveryMethod: 'Friends',
        ageGroup: '35-54',
        musicRelationship: 'Strong Connection'
      }
    },
    '55+': {
      'Casual Listener': {
        path: '/audio/dashboard-playlist/Friends → 55+ → Casual Listener Song Golden Years Groove.mp3',
        title: 'Golden Years Groove',
        discoveryMethod: 'Friends',
        ageGroup: '55+',
        musicRelationship: 'Casual Listener'
      },
      'Strong Connection': {
        path: '/audio/dashboard-playlist/Friends → 55+ → Strong Connection Song Golden Days.mp3',
        title: 'Golden Days',
        discoveryMethod: 'Friends',
        ageGroup: '55+',
        musicRelationship: 'Strong Connection'
      }
    }
  },
  'Streaming service recommendations': {
    '18-34': {
      'Casual Listener': {
        path: '/audio/dashboard-playlist/Streaming → 18-34 → Casual Listener Song Background Noise.mp3',
        title: 'Background Noise',
        discoveryMethod: 'Streaming',
        ageGroup: '18-34',
        musicRelationship: 'Casual Listener'
      },
      'Strong Connection': {
        path: '/audio/dashboard-playlist/Streaming → 18-34 → Strong Connection Song Deep Dive.mp3',
        title: 'Deep Dive',
        discoveryMethod: 'Streaming',
        ageGroup: '18-34',
        musicRelationship: 'Strong Connection'
      }
    },
    '35-54': {
      'Casual Listener': {
        path: '/audio/dashboard-playlist/Streaming → 35-54 → Casual Listener Song Easy Living.mp3',
        title: 'Easy Living',
        discoveryMethod: 'Streaming',
        ageGroup: '35-54',
        musicRelationship: 'Casual Listener'
      },
      'Strong Connection': {
        path: '/audio/dashboard-playlist/Streaming → 35-54 → Strong Connection Song Waves of Discovery.mp3',
        title: 'Waves of Discovery',
        discoveryMethod: 'Streaming',
        ageGroup: '35-54',
        musicRelationship: 'Strong Connection'
      }
    },
    '55+': {
      'Casual Listener': {
        path: '/audio/dashboard-playlist/Streaming → 55+ → Casual Listener Song Golden Days.mp3',
        title: 'Golden Days',
        discoveryMethod: 'Streaming',
        ageGroup: '55+',
        musicRelationship: 'Casual Listener'
      },
      'Strong Connection': {
        path: '/audio/dashboard-playlist/Streaming → 55+ → Strong Connection Song Golden Tides.mp3',
        title: 'Golden Tides',
        discoveryMethod: 'Streaming',
        ageGroup: '55+',
        musicRelationship: 'Strong Connection'
      }
    }
  },
  'Social media': {
    '18-34': {
      'Casual Listener': {
        path: '/audio/dashboard-playlist/Social Media → 18-34 → Casual Listener Song Digital Glow.mp3',
        title: 'Digital Glow',
        discoveryMethod: 'Social Media',
        ageGroup: '18-34',
        musicRelationship: 'Casual Listener'
      },
      'Strong Connection': {
        path: '/audio/dashboard-playlist/Social Media → 18-34 → Strong Connection Song Viral Harmony.mp3',
        title: 'Viral Harmony',
        discoveryMethod: 'Social Media',
        ageGroup: '18-34',
        musicRelationship: 'Strong Connection'
      }
    },
    '35-54': {
      'Casual Listener': {
        path: '/audio/dashboard-playlist/Social Media → 35-54 → Casual Listener Song Middle of the Feed.mp3',
        title: 'Middle of the Feed',
        discoveryMethod: 'Social Media',
        ageGroup: '35-54',
        musicRelationship: 'Casual Listener'
      },
      'Strong Connection': {
        path: '/audio/dashboard-playlist/Social Media → 35-54 → Strong Connection Song Echoes in the Feed.mp3',
        title: 'Echoes in the Feed',
        discoveryMethod: 'Social Media',
        ageGroup: '35-54',
        musicRelationship: 'Strong Connection'
      }
    },
    '55+': {
      'Casual Listener': {
        path: '/audio/dashboard-playlist/Social Media → 55+ → Casual Listener Song Golden Hours.mp3',
        title: 'Golden Hours',
        discoveryMethod: 'Social Media',
        ageGroup: '55+',
        musicRelationship: 'Casual Listener'
      },
      'Strong Connection': {
        path: '/audio/dashboard-playlist/Social Media → 55+ → Strong Connection Song Echoes in the Scroll.mp3',
        title: 'Echoes in the Scroll',
        discoveryMethod: 'Social Media',
        ageGroup: '55+',
        musicRelationship: 'Strong Connection'
      }
    }
  },
  'Live events and concerts': {
    '18-34': {
      'Casual Listener': {
        path: '/audio/dashboard-playlist/Concerts → 18-34 → Casual Listener Song Under the Neon Lights.mp3',
        title: 'Under the Neon Lights',
        discoveryMethod: 'Concerts',
        ageGroup: '18-34',
        musicRelationship: 'Casual Listener'
      },
      'Strong Connection': {
        path: '/audio/dashboard-playlist/Concerts → 18-34 → Strong Connection Song Rare Sparks.mp3',
        title: 'Rare Sparks',
        discoveryMethod: 'Concerts',
        ageGroup: '18-34',
        musicRelationship: 'Strong Connection'
      }
    },
    '35-54': {
      'Casual Listener': {
        path: '/audio/dashboard-playlist/Concerts → 35-54 → Casual Listener Song Dancing in the Dark.mp3',
        title: 'Dancing in the Dark',
        discoveryMethod: 'Concerts',
        ageGroup: '35-54',
        musicRelationship: 'Casual Listener'
      },
      'Strong Connection': {
        path: '/audio/dashboard-playlist/Concerts → 35-54 → Strong Connection Song Live Sparks.mp3',
        title: 'Live Sparks',
        discoveryMethod: 'Concerts',
        ageGroup: '35-54',
        musicRelationship: 'Strong Connection'
      }
    },
    '55+': {
      'Casual Listener': {
        path: '/audio/dashboard-playlist/Concerts → 55+ → Casual Listener Song Silver Echoes.mp3',
        title: 'Silver Echoes',
        discoveryMethod: 'Concerts',
        ageGroup: '55+',
        musicRelationship: 'Casual Listener'
      },
      'Strong Connection': {
        path: '/audio/dashboard-playlist/Concerts → 55+ → Strong Connection Song Echoes of the Night.mp3',
        title: 'Echoes of the Night',
        discoveryMethod: 'Concerts',
        ageGroup: '55+',
        musicRelationship: 'Strong Connection'
      }
    }
  }
}

// Music Videos mapping (for future use)
export const MUSIC_VIDEOS_SONGS: Record<string, Record<string, Record<string, AudioTrack>>> = {
  'Music Videos': {
    '18-34': {
      'Casual Listener': {
        path: '/audio/dashboard-playlist/Music Videos → 18-34 → Casual Listener Song Video Dreams.mp3',
        title: 'Video Dreams',
        discoveryMethod: 'Music Videos',
        ageGroup: '18-34',
        musicRelationship: 'Casual Listener'
      },
      'Strong Connection': {
        path: '/audio/dashboard-playlist/Music Videos → 18-34 → Strong Connection Song Neon Frames.mp3',
        title: 'Neon Frames',
        discoveryMethod: 'Music Videos',
        ageGroup: '18-34',
        musicRelationship: 'Strong Connection'
      }
    },
    '35-54': {
      'Casual Listener': {
        path: '/audio/dashboard-playlist/Music Videos → 35-54 → Casual Listener Song Middle of the Road.mp3',
        title: 'Middle of the Road',
        discoveryMethod: 'Music Videos',
        ageGroup: '35-54',
        musicRelationship: 'Casual Listener'
      },
      'Strong Connection': {
        path: '/audio/dashboard-playlist/Music Videos → 35-54 → Strong Connection Song Living Through the Lens.mp3',
        title: 'Living Through the Lens',
        discoveryMethod: 'Music Videos',
        ageGroup: '35-54',
        musicRelationship: 'Strong Connection'
      }
    },
    '55+': {
      'Casual Listener': {
        path: '/audio/dashboard-playlist/Music Videos → 55+ → Casual Listener Song No Influence.mp3',
        title: 'No Influence',
        discoveryMethod: 'Music Videos',
        ageGroup: '55+',
        musicRelationship: 'Casual Listener'
      },
      'Strong Connection': {
        path: '/audio/dashboard-playlist/Music Videos → 55+ → Strong Connection Song Golden Hours.mp3',
        title: 'Golden Hours',
        discoveryMethod: 'Music Videos',
        ageGroup: '55+',
        musicRelationship: 'Strong Connection'
      }
    }
  }
}

class DashboardAudioManager {
  private currentAudio: HTMLAudioElement | null = null
  private isPlaying: boolean = false
  private currentTrack: AudioTrack | null = null
  private userContext: UserContext = {}
  private volume: number = 0.3
  private fadeTimeout: number | null = null
  private fadeInterval: number | null = null

  constructor() {
    console.log('🎵 Dashboard Audio Manager initialized')
  }

  /**
   * Set user context from quiz results
   */
  setUserContext(context: UserContext) {
    this.userContext = context
    console.log('👤 User context set:', context)
  }

  /**
   * Get the best matching track for a discovery method and user context
   */
  getTrackForDiscoveryMethod(discoveryMethod: string): AudioTrack | null {
    // Normalize discovery method names
    const normalizedMethod = this.normalizeDiscoveryMethod(discoveryMethod)
    
    // Get user's age group and music relationship, or use defaults
    const ageGroup = this.userContext.ageGroup || this.getRandomAgeGroup()
    const musicRelationship = this.userContext.musicRelationship || this.getRandomMusicRelationship()
    
    // Try to find exact match
    let track = DISCOVERY_METHOD_SONGS[normalizedMethod]?.[ageGroup]?.[musicRelationship]
    
    // Fallback to any age group if exact match not found
    if (!track) {
      const ageGroups = Object.keys(DISCOVERY_METHOD_SONGS[normalizedMethod] || {})
      if (ageGroups.length > 0) {
        const fallbackAgeGroup = ageGroups[0]
        track = DISCOVERY_METHOD_SONGS[normalizedMethod][fallbackAgeGroup]?.[musicRelationship]
      }
    }
    
    // Final fallback to any music relationship
    if (!track) {
      const ageGroups = Object.keys(DISCOVERY_METHOD_SONGS[normalizedMethod] || {})
      const musicRelationships = Object.keys(DISCOVERY_METHOD_SONGS[normalizedMethod]?.[ageGroups[0]] || {})
      if (ageGroups.length > 0 && musicRelationships.length > 0) {
        track = DISCOVERY_METHOD_SONGS[normalizedMethod][ageGroups[0]][musicRelationships[0]]
      }
    }
    
    console.log(`🎵 Track for ${discoveryMethod}:`, track?.title || 'Not found')
    return track
  }

  /**
   * Play audio for a specific discovery method with smooth transitions
   */
  async playDiscoveryMethod(discoveryMethod: string): Promise<void> {
    const track = this.getTrackForDiscoveryMethod(discoveryMethod)
    if (!track) {
      console.warn(`🎵 No track found for discovery method: ${discoveryMethod}`)
      return
    }

    // If already playing the same track, don't restart
    if (this.currentTrack?.path === track.path && this.isPlaying) {
      console.log(`🎵 Already playing: ${track.title}`)
      return
    }

    // Store reference to old audio to stop it AFTER new one starts
    const oldAudio = this.currentAudio
    this.currentAudio = null
    
    // Clear any fade intervals
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval)
      this.fadeInterval = null
    }

    try {
      // URL encode the path to handle special characters like →
      const encodedPath = track.path.split('/').map((segment, index) => {
        // Don't encode the protocol or empty segments
        if (index === 0 || segment === '') return segment
        return encodeURIComponent(segment)
      }).join('/')
      
      console.log(`📂 Loading audio file: ${track.path}`)
      console.log(`🔗 Encoded path: ${encodedPath}`)
      
      this.currentAudio = new Audio(encodedPath)
      
      // Now stop the old audio BEFORE we start playing the new one
      if (oldAudio) {
        console.log('🛑 Stopping previous audio')
        try {
          oldAudio.pause()
          oldAudio.src = ''
          oldAudio.load()
        } catch (err) {
          console.warn('⚠️ Error stopping old audio (ignored):', err)
        }
      }
      this.currentAudio.volume = 0 // Start at 0 for fade in
      this.currentAudio.loop = true
      this.currentTrack = track
      
      // Add error handler with detailed logging
      this.currentAudio.addEventListener('error', (e) => {
        const audio = e.target as HTMLAudioElement
        console.error('❌ Audio element error:', {
          error: audio.error,
          code: audio.error?.code,
          message: audio.error?.message,
          src: audio.src,
          networkState: audio.networkState,
          readyState: audio.readyState
        })
        
        // Network state meanings:
        // 0 = NETWORK_EMPTY, 1 = NETWORK_IDLE, 2 = NETWORK_LOADING, 3 = NETWORK_NO_SOURCE
        
        if (audio.error?.code === 4) {
          console.error('❌ Media not supported or file not found:', track.path)
        } else if (audio.error?.code === 2) {
          console.error('❌ Network error loading audio:', track.path)
        } else if (audio.error?.code === 3) {
          console.error('❌ Decode error:', track.path)
        } else if (audio.error?.code === 1) {
          console.error('❌ Audio loading aborted:', track.path)
        }
        
        this.stop()
      })

      // Add abort handler
      this.currentAudio.addEventListener('abort', () => {
        console.log('⚠️ Audio loading aborted for:', track.path)
        this.isPlaying = false
      })

      await this.currentAudio.play()
      this.isPlaying = true
      
      // Fade in the new audio
      this.fadeIn(500) // 500ms fade in (faster)
      
      console.log(`🎵 Playing: ${track.title} (${track.discoveryMethod} - ${track.ageGroup} - ${track.musicRelationship})`)
    } catch (error) {
      console.error('❌ Audio play failed:', error)
      this.isPlaying = false
      this.currentTrack = null
      // Clean up the failed audio element
      if (this.currentAudio) {
        try {
          this.currentAudio.pause()
          this.currentAudio.src = ''
          this.currentAudio.load()
        } catch (cleanupErr) {
          console.warn('⚠️ Error cleaning up failed audio:', cleanupErr)
        }
        this.currentAudio = null
      }
    }
  }

  /**
   * Stop current audio immediately and completely with robust error handling
   */
  stop(): void {
    // Clear any active fade intervals first
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval)
      this.fadeInterval = null
    }
    
    if (this.fadeTimeout) {
      clearTimeout(this.fadeTimeout)
      this.fadeTimeout = null
    }
    
    if (this.currentAudio) {
      console.log('🛑 Stopping audio - pausing, resetting, removing reference')
      try {
        // First, pause if possible
        if (!this.currentAudio.paused) {
          this.currentAudio.pause()
        }
      } catch (pauseErr) {
        console.warn('⚠️ Error pausing audio (continuing):', pauseErr)
      }
      
      try {
        // Then reset time if loaded enough
        if (this.currentAudio.readyState >= 1) {
          this.currentAudio.currentTime = 0
        }
      } catch (timeErr) {
        console.warn('⚠️ Error resetting time (continuing):', timeErr)
      }
      
      try {
        // Disable loop
        this.currentAudio.loop = false
      } catch (loopErr) {
        console.warn('⚠️ Error disabling loop (continuing):', loopErr)
      }
      
      try {
        // Force remove the audio source - this is the most important part
        this.currentAudio.src = ''
        this.currentAudio.load()
      } catch (srcErr) {
        console.warn('⚠️ Error removing source (continuing):', srcErr)
      }
      
      // Always clear the reference
      this.currentAudio = null
    }
    
    this.isPlaying = false
    this.currentTrack = null
    
    console.log('✅ Dashboard audio stopped completely')
  }

  /**
   * Fade out current audio smoothly
   */
  fadeOut(duration: number = 1000): Promise<void> {
    return new Promise((resolve) => {
      if (!this.currentAudio) {
        resolve()
        return
      }

      const steps = 20
      const volumeStep = this.volume / steps
      const timeStep = duration / steps
      let currentStep = 0

      const fadeInterval = setInterval(() => {
        currentStep++
        const newVolume = Math.max(0, this.volume - volumeStep * currentStep)
        if (this.currentAudio) {
          this.currentAudio.volume = newVolume
        }

        if (currentStep >= steps) {
          clearInterval(fadeInterval)
          this.stop()
          resolve()
        }
      }, timeStep)
    })
  }

  /**
   * Fade in current audio smoothly
   */
  fadeIn(duration: number = 1000): void {
    if (!this.currentAudio) return

    // Clear any existing fade interval
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval)
      this.fadeInterval = null
    }

    const steps = 20
    const volumeStep = this.volume / steps
    const timeStep = duration / steps
    let currentStep = 0

    this.fadeInterval = window.setInterval(() => {
      currentStep++
      const newVolume = Math.min(this.volume, volumeStep * currentStep)
      if (this.currentAudio) {
        this.currentAudio.volume = newVolume
      }

      if (currentStep >= steps) {
        if (this.fadeInterval) {
          clearInterval(this.fadeInterval)
          this.fadeInterval = null
        }
      }
    }, timeStep)
  }

  /**
   * Set volume
   */
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume))
    if (this.currentAudio) {
      this.currentAudio.volume = this.volume
    }
  }

  /**
   * Get current playing track info
   */
  getCurrentTrack(): AudioTrack | null {
    return this.currentTrack
  }

  /**
   * Check if audio is playing
   */
  isCurrentlyPlaying(): boolean {
    return this.isPlaying
  }

  /**
   * Normalize discovery method names to match our mapping
   */
  private normalizeDiscoveryMethod(method: string): string {
    const mapping: Record<string, string> = {
      'Radio': 'Radio',
      'Friends and family recommendations': 'Friends and family recommendations',
      'Streaming service recommendations': 'Streaming service recommendations',
      'Social media': 'Social media',
      'Live events and concerts': 'Live events and concerts',
      'Music Videos': 'Music Videos'
    }
    
    return mapping[method] || method
  }

  /**
   * Get random age group for fallback
   */
  private getRandomAgeGroup(): '18-34' | '35-54' | '55+' {
    const ageGroups: ('18-34' | '35-54' | '55+')[] = ['18-34', '35-54', '55+']
    return ageGroups[Math.floor(Math.random() * ageGroups.length)]
  }

  /**
   * Get random music relationship for fallback
   */
  private getRandomMusicRelationship(): 'Casual Listener' | 'Strong Connection' {
    const relationships: ('Casual Listener' | 'Strong Connection')[] = ['Casual Listener', 'Strong Connection']
    return relationships[Math.floor(Math.random() * relationships.length)]
  }

  /**
   * Cleanup
   */
  cleanup(): void {
    this.stop()
  }
}

// Export singleton instance
export const dashboardAudioManager = new DashboardAudioManager()

// Add global audio killer for emergency stops
if (typeof window !== 'undefined') {
  (window as any).__forceStopDashboardAudio = () => {
    console.log('🚨 FORCE STOP called from global')
    dashboardAudioManager.stop()
  }
}

export default dashboardAudioManager
