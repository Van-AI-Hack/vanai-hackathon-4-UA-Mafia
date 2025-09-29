// AI Service for Canadian Music DNA platform
// Handles LLM integration, TTS, and AI-powered features

import { Persona } from '../utils/dataLoader'

export interface AIInsight {
  type: 'description' | 'recommendation' | 'analysis' | 'fun_fact'
  content: string
  confidence: number
  timestamp: string
}

export interface MusicRecommendation {
  title: string
  artist: string
  genre: string
  reason: string
  spotifyUrl?: string
  youtubeUrl?: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  type?: 'text' | 'recommendation' | 'insight'
}

// Mock AI responses for demo purposes
// In production, this would connect to OpenAI, Anthropic, or similar APIs
const generatePersonaDescription = async (persona: Persona): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  const descriptions = {
    0: `The Radio Traditionalist embodies the soul of Canadian music heritage. You're someone who discovered the magic of music through the crackling warmth of AM radio waves, where every song felt like a carefully curated gift from a knowledgeable DJ. Your musical journey began in an era when music discovery was an art form, and you've carried that appreciation for authenticity into the digital age.

Your connection to music runs deep - it's not just entertainment, but a companion that has soundtracked your life's most meaningful moments. You value the human touch in music creation and are naturally skeptical of AI-generated content, believing that true musical expression comes from lived experience and genuine emotion.

Your discovery method through radio reflects a preference for curated experiences over algorithmic suggestions. You trust the expertise of music professionals and enjoy the serendipity of hearing something unexpected that resonates with your soul.`,

    1: `The Digital Explorer represents the cutting edge of Canadian music culture. You're a tech-savvy music enthusiast who embraces innovation while maintaining a deep appreciation for musical artistry. Your journey through music is marked by curiosity and a willingness to explore uncharted sonic territories.

You've seamlessly integrated technology into your music discovery process, using streaming platforms and social media as your primary tools for finding new sounds. Your openness to AI-generated music reflects a forward-thinking mindset that sees technology as a tool for creative expression rather than a threat to human artistry.

Your obsession with music drives you to constantly seek out new experiences, whether through algorithmic recommendations, social media trends, or experimental genres. You're likely to be an early adopter of new music technologies and platforms.`,

    2: `The Casual Listener embodies the everyday Canadian music experience. You enjoy music as a natural part of your daily routine, using it to enhance your activities rather than as a primary focus. Your relationship with music is comfortable and unpretentious - it's there when you need it, providing the perfect soundtrack for life's moments.

Your moderate views on AI music reflect a balanced perspective that neither embraces nor rejects technological advancement. You're open to new experiences but prefer music that feels familiar and accessible. Your discovery through friends and family shows you value personal recommendations over algorithmic suggestions.

Music serves as a reliable companion for your daily activities - commuting, working, cooking, or unwinding. You appreciate its ability to set the mood and enhance your experiences without requiring deep engagement or analysis.`,

    3: `The Music Obsessive represents the passionate heart of Canadian music culture. You're someone for whom music is not just entertainment, but a fundamental part of your identity and emotional well-being. Your obsession drives you to constantly seek out new discoveries and deeply analyze every aspect of your musical experiences.

Your passion manifests in active music discovery through social media and live events, where you can connect with like-minded enthusiasts and discover emerging artists. You have strong opinions about music quality and authenticity, preferring human-made content that reflects genuine artistic vision.

Music serves as your emotional regulator, helping you process feelings and express yourself in ways words cannot. Your strong preference for human-made music reflects a belief that true artistic expression requires the depth of human experience and emotion.`,

    4: `The AI Skeptic represents the guardians of musical authenticity in Canadian culture. You're deeply committed to preserving the human element in music creation and are uncomfortable with AI using deceased artists' voices or creating content that lacks genuine human emotion and experience.

Your strong preference for human-made music reflects a belief that true artistry comes from lived experience, cultural context, and emotional depth that artificial intelligence cannot replicate. You value the imperfections, nuances, and personal stories that human musicians bring to their craft.

Your discovery through live events and concerts shows you prefer direct, authentic musical experiences over digital consumption. You're likely to support independent artists and value the cultural significance of music as a human expression of creativity and emotion.`
  }

  return descriptions[persona.id as keyof typeof descriptions] || descriptions[0]
}

const generateMusicRecommendations = async (persona: Persona): Promise<MusicRecommendation[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const recommendations = {
    0: [
      {
        title: "The Weight",
        artist: "The Band",
        genre: "Classic Rock",
        reason: "A timeless Canadian classic that embodies the authentic storytelling you appreciate",
        spotifyUrl: "https://open.spotify.com/track/4sZX6i2rI0o1Vd8W4Iu4kC"
      },
      {
        title: "Four Strong Winds",
        artist: "Ian & Sylvia",
        genre: "Folk",
        reason: "A quintessential Canadian folk song with deep emotional resonance",
        spotifyUrl: "https://open.spotify.com/track/4sZX6i2rI0o1Vd8W4Iu4kC"
      },
      {
        title: "American Woman",
        artist: "The Guess Who",
        genre: "Classic Rock",
        reason: "A Canadian rock anthem that showcases authentic musical expression",
        spotifyUrl: "https://open.spotify.com/track/4sZX6i2rI0o1Vd8W4Iu4kC"
      }
    ],
    1: [
      {
        title: "Blinding Lights",
        artist: "The Weeknd",
        genre: "Pop/Electronic",
        reason: "Modern Canadian pop that embraces both technology and artistry",
        spotifyUrl: "https://open.spotify.com/track/4sZX6i2rI0o1Vd8W4Iu4kC"
      },
      {
        title: "Anti-Hero",
        artist: "Taylor Swift",
        genre: "Pop",
        reason: "Contemporary pop that explores themes of self-reflection and growth",
        spotifyUrl: "https://open.spotify.com/track/4sZX6i2rI0o1Vd8W4Iu4kC"
      },
      {
        title: "Levitating",
        artist: "Dua Lipa",
        genre: "Dance-Pop",
        reason: "Upbeat electronic pop that matches your tech-forward musical taste",
        spotifyUrl: "https://open.spotify.com/track/4sZX6i2rI0o1Vd8W4Iu4kC"
      }
    ],
    2: [
      {
        title: "Perfect",
        artist: "Ed Sheeran",
        genre: "Pop",
        reason: "A gentle, accessible song perfect for casual listening",
        spotifyUrl: "https://open.spotify.com/track/4sZX6i2rI0o1Vd8W4Iu4kC"
      },
      {
        title: "Someone You Loved",
        artist: "Lewis Capaldi",
        genre: "Pop",
        reason: "Emotional pop that's easy to connect with during daily activities",
        spotifyUrl: "https://open.spotify.com/track/4sZX6i2rI0o1Vd8W4Iu4kC"
      },
      {
        title: "Watermelon Sugar",
        artist: "Harry Styles",
        genre: "Pop Rock",
        reason: "Upbeat and fun, perfect for background listening",
        spotifyUrl: "https://open.spotify.com/track/4sZX6i2rI0o1Vd8W4Iu4kC"
      }
    ],
    3: [
      {
        title: "Bohemian Rhapsody",
        artist: "Queen",
        genre: "Progressive Rock",
        reason: "A complex masterpiece that rewards deep listening and analysis",
        spotifyUrl: "https://open.spotify.com/track/4sZX6i2rI0o1Vd8W4Iu4kC"
      },
      {
        title: "Stairway to Heaven",
        artist: "Led Zeppelin",
        genre: "Rock",
        reason: "An epic composition that showcases musical artistry and emotional depth",
        spotifyUrl: "https://open.spotify.com/track/4sZX6i2rI0o1Vd8W4Iu4kC"
      },
      {
        title: "Hotel California",
        artist: "Eagles",
        genre: "Rock",
        reason: "A layered musical narrative that invites repeated listening and interpretation",
        spotifyUrl: "https://open.spotify.com/track/4sZX6i2rI0o1Vd8W4Iu4kC"
      }
    ],
    4: [
      {
        title: "Hallelujah",
        artist: "Leonard Cohen",
        genre: "Folk",
        reason: "A deeply human song that showcases authentic artistic expression",
        spotifyUrl: "https://open.spotify.com/track/4sZX6i2rI0o1Vd8W4Iu4kC"
      },
      {
        title: "Both Sides Now",
        artist: "Joni Mitchell",
        genre: "Folk",
        reason: "A Canadian folk masterpiece that embodies human creativity and emotion",
        spotifyUrl: "https://open.spotify.com/track/4sZX6i2rI0o1Vd8W4Iu4kC"
      },
      {
        title: "The Sound of Silence",
        artist: "Simon & Garfunkel",
        genre: "Folk Rock",
        reason: "A timeless song that demonstrates the power of human musical expression",
        spotifyUrl: "https://open.spotify.com/track/4sZX6i2rI0o1Vd8W4Iu4kC"
      }
    ]
  }

  return recommendations[persona.id as keyof typeof recommendations] || recommendations[0]
}

const generateFunFacts = async (persona: Persona): Promise<string[]> => {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  const facts = {
    0: [
      "Radio Traditionalists make up 25.4% of Canadian music listeners",
      "You're most likely to discover new music through trusted radio DJs",
      "Your musical taste often influences younger family members",
      "You prefer albums over singles, valuing complete artistic statements"
    ],
    1: [
      "Digital Explorers are 3x more likely to discover new artists monthly",
      "You're part of the 22.3% who embrace streaming recommendations",
      "Your music discovery habits influence social media algorithms",
      "You're likely to attend more live events than other persona types"
    ],
    2: [
      "Casual Listeners represent 20.1% of the Canadian music audience",
      "You're most likely to listen to music during daily activities",
      "Your music preferences are often influenced by friends and family",
      "You prefer familiar songs that enhance rather than distract from tasks"
    ],
    3: [
      "Music Obsessives make up 18.7% of Canadian music listeners",
      "You're 5x more likely to attend live concerts regularly",
      "Your music collection grows by an average of 50 songs per month",
      "You're most likely to discover new artists through social media"
    ],
    4: [
      "AI Skeptics represent 13.5% of Canadian music listeners",
      "You're most likely to support independent and local artists",
      "Your music preferences often reflect deep cultural values",
      "You're 3x more likely to attend classical or folk music events"
    ]
  }

  return facts[persona.id as keyof typeof facts] || facts[0]
}

const generateChatResponse = async (message: string, persona: Persona): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1200))
  
  const responses = [
    `Based on your ${persona.name} profile, I can tell you that your musical preferences reflect a deep connection to authentic expression. Your discovery method through ${persona.characteristics.discovery_method.top_response} shows you value ${persona.characteristics.music_relationship.top_response}.`,
    
    `As a ${persona.name}, your approach to music is unique. Your ${persona.characteristics.ai_attitude.top_response} attitude toward AI music aligns with your ${persona.characteristics.age_group.top_response} demographic's values.`,
    
    `Your music DNA reveals fascinating patterns! The ${persona.name} type is known for ${persona.traits.join(', ').toLowerCase()}, which explains your musical journey.`,
    
    `Interesting question! Given your ${persona.name} profile, I'd recommend exploring artists who share your values of ${persona.characteristics.music_relationship.top_response}.`,
    
    `Your musical identity as a ${persona.name} is quite distinctive. You're part of a ${persona.percentage}% of Canadian music listeners who share similar preferences.`
  ]
  
  return responses[Math.floor(Math.random() * responses.length)]
}

// TTS Service
export class TTSService {
  private static instance: TTSService
  private synth: SpeechSynthesis
  
  constructor() {
    this.synth = window.speechSynthesis
  }
  
  static getInstance(): TTSService {
    if (!TTSService.instance) {
      TTSService.instance = new TTSService()
    }
    return TTSService.instance
  }
  
  speak(text: string, options?: { rate?: number; pitch?: number; volume?: number }): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synth) {
        reject(new Error('Speech synthesis not supported'))
        return
      }
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = options?.rate || 0.9
      utterance.pitch = options?.pitch || 1
      utterance.volume = options?.volume || 0.8
      
      utterance.onend = () => resolve()
      utterance.onerror = (event) => reject(event)
      
      this.synth.speak(utterance)
    })
  }
  
  stop(): void {
    this.synth.cancel()
  }
  
  isSupported(): boolean {
    return 'speechSynthesis' in window
  }
}

// Main AI Service
export class AIService {
  static async generatePersonaDescription(persona: Persona): Promise<string> {
    return generatePersonaDescription(persona)
  }
  
  static async generateMusicRecommendations(persona: Persona): Promise<MusicRecommendation[]> {
    return generateMusicRecommendations(persona)
  }
  
  static async generateFunFacts(persona: Persona): Promise<string[]> {
    return generateFunFacts(persona)
  }
  
  static async generateChatResponse(message: string, persona: Persona): Promise<string> {
    return generateChatResponse(message, persona)
  }
  
  static getTTSService(): TTSService {
    return TTSService.getInstance()
  }
}

export default AIService
