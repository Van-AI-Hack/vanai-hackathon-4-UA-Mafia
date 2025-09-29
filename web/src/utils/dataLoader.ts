// Data loader for Canadian Music DNA platform
// Loads real survey data and ML personas

export interface Persona {
  id: number
  name: string
  description: string
  traits: string[]
  color: string
  characteristics: {
    music_relationship: { top_response: string; distribution: Record<string, number> }
    discovery_method: { top_response: string; distribution: Record<string, number> }
    age_group: { top_response: string; distribution: Record<string, number> }
    ai_attitude: { top_response: string; distribution: Record<string, number> }
    music_preference: { top_response: string; distribution: Record<string, number> }
  }
  size: number
  percentage: number
}

export interface SurveyData {
  total_responses: number
  demographics: {
    age_groups: Record<string, number>
    provinces: Record<string, number>
    gender: Record<string, number>
    education: Record<string, number>
  }
  music_relationship: Record<string, number>
  discovery_methods: Record<string, number>
  ai_attitudes: Record<string, number>
  listening_habits: Record<string, number>
  format_evolution: Record<string, number>
}

export interface ChartData {
  demographics_heatmap: {
    z: number[][]
    x: string[]
    y: string[]
  }
  discovery_sunburst: {
    ids: string[]
    labels: string[]
    parents: string[]
    values: number[]
  }
  ai_attitudes_timeline: {
    age_groups: string[]
    attitudes: Record<string, number[]>
  }
  format_evolution_sankey: {
    sources: number[]
    targets: number[]
    values: number[]
    labels: string[]
  }
}

// Mock data for now - will be replaced with real data loading
const mockPersonas: Persona[] = [
  {
    id: 0,
    name: 'The Radio Traditionalist',
    description: 'Discovered music through radio and traditional means. Prefers human-made music and is skeptical of AI-generated content. Values authenticity and personal connection to music.',
    traits: ['Traditional', 'Authentic', 'Skeptical of AI', 'Radio-focused'],
    color: '#FF6B6B',
    size: 255,
    percentage: 25.4,
    characteristics: {
      music_relationship: { 
        top_response: 'I like it but don\'t keep up with new releases',
        distribution: { 'I like it but don\'t keep up with new releases': 180, 'I\'m obsessed with music': 50, 'Music is background noise': 25 }
      },
      discovery_method: { 
        top_response: 'Radio',
        distribution: { 'Radio': 200, 'Friends and family': 30, 'Streaming recommendations': 25 }
      },
      age_group: { 
        top_response: '55+',
        distribution: { '55+': 180, '35-54': 60, '18-34': 15 }
      },
      ai_attitude: { 
        top_response: 'I prefer human-made music',
        distribution: { 'I prefer human-made music': 220, 'I\'m neutral about AI music': 25, 'I\'m open to AI-generated music': 10 }
      },
      music_preference: { 
        top_response: 'Classic rock and pop',
        distribution: { 'Classic rock and pop': 150, 'Country': 60, 'Jazz': 45 }
      }
    }
  },
  {
    id: 1,
    name: 'The Digital Explorer',
    description: 'Embraces new music discovery methods and is open to AI-generated music. Tech-savvy and curious about emerging technologies in music.',
    traits: ['Tech-forward', 'Curious', 'Open to AI', 'Digital-native'],
    color: '#4ECDC4',
    size: 224,
    percentage: 22.3,
    characteristics: {
      music_relationship: { 
        top_response: 'I\'m obsessed with music',
        distribution: { 'I\'m obsessed with music': 150, 'I like it but don\'t keep up with new releases': 50, 'Music is an important part of my identity': 24 }
      },
      discovery_method: { 
        top_response: 'Streaming service recommendations',
        distribution: { 'Streaming service recommendations': 120, 'Social media': 60, 'Friends and family': 44 }
      },
      age_group: { 
        top_response: '18-34',
        distribution: { '18-34': 180, '35-54': 40, '55+': 4 }
      },
      ai_attitude: { 
        top_response: 'I\'m open to AI-generated music',
        distribution: { 'I\'m open to AI-generated music': 140, 'I\'m excited about AI possibilities': 50, 'I\'m neutral about AI music': 34 }
      },
      music_preference: { 
        top_response: 'Electronic and experimental',
        distribution: { 'Electronic and experimental': 100, 'Hip-hop': 60, 'Indie': 64 }
      }
    }
  },
  {
    id: 2,
    name: 'The Casual Listener',
    description: 'Enjoys music but doesn\'t actively seek out new content. Listens for relaxation and background ambiance. Moderate views on AI music.',
    traits: ['Relaxed', 'Background listener', 'Moderate views', 'Easy-going'],
    color: '#45B7D1',
    size: 202,
    percentage: 20.1,
    characteristics: {
      music_relationship: { 
        top_response: 'I like it but don\'t keep up with new releases',
        distribution: { 'I like it but don\'t keep up with new releases': 120, 'Music is background noise': 50, 'I enjoy music casually': 32 }
      },
      discovery_method: { 
        top_response: 'Friends and family recommendations',
        distribution: { 'Friends and family recommendations': 80, 'Radio': 60, 'Streaming service recommendations': 62 }
      },
      age_group: { 
        top_response: '35-54',
        distribution: { '35-54': 100, '55+': 60, '18-34': 42 }
      },
      ai_attitude: { 
        top_response: 'I\'m neutral about AI music',
        distribution: { 'I\'m neutral about AI music': 100, 'I prefer human-made music': 60, 'I\'m open to AI-generated music': 42 }
      },
      music_preference: { 
        top_response: 'Pop and easy listening',
        distribution: { 'Pop and easy listening': 80, 'Country': 60, 'Classic rock and pop': 62 }
      }
    }
  },
  {
    id: 3,
    name: 'The Music Obsessive',
    description: 'Passionate about music and actively seeks new discoveries. Uses music for emotional regulation and personal expression. Strong opinions on music quality.',
    traits: ['Passionate', 'Emotionally connected', 'Quality-focused', 'Expressive'],
    color: '#96CEB4',
    size: 188,
    percentage: 18.7,
    characteristics: {
      music_relationship: { 
        top_response: 'I\'m obsessed with music',
        distribution: { 'I\'m obsessed with music': 120, 'Music is an important part of my identity': 50, 'I like it but don\'t keep up with new releases': 18 }
      },
      discovery_method: { 
        top_response: 'Social media',
        distribution: { 'Social media': 80, 'Live events and concerts': 60, 'Streaming service recommendations': 48 }
      },
      age_group: { 
        top_response: '18-34',
        distribution: { '18-34': 100, '35-54': 60, '55+': 28 }
      },
      ai_attitude: { 
        top_response: 'I prefer human-made music',
        distribution: { 'I prefer human-made music': 100, 'I\'m neutral about AI music': 50, 'I\'m open to AI-generated music': 38 }
      },
      music_preference: { 
        top_response: 'Indie and alternative',
        distribution: { 'Indie and alternative': 80, 'Electronic and experimental': 60, 'Hip-hop': 48 }
      }
    }
  },
  {
    id: 4,
    name: 'The AI Skeptic',
    description: 'Strongly prefers human-made music and is uncomfortable with AI using deceased artists\' voices. Values human creativity and authenticity.',
    traits: ['Human-focused', 'Authenticity-driven', 'AI-resistant', 'Creative'],
    color: '#FFEAA7',
    size: 136,
    percentage: 13.5,
    characteristics: {
      music_relationship: { 
        top_response: 'I\'m obsessed with music',
        distribution: { 'I\'m obsessed with music': 80, 'Music is an important part of my identity': 40, 'I like it but don\'t keep up with new releases': 16 }
      },
      discovery_method: { 
        top_response: 'Live events and concerts',
        distribution: { 'Live events and concerts': 60, 'Radio': 40, 'Friends and family recommendations': 36 }
      },
      age_group: { 
        top_response: '35-54',
        distribution: { '35-54': 80, '55+': 40, '18-34': 16 }
      },
      ai_attitude: { 
        top_response: 'I strongly prefer human-made music',
        distribution: { 'I strongly prefer human-made music': 100, 'I prefer human-made music': 30, 'I\'m neutral about AI music': 6 }
      },
      music_preference: { 
        top_response: 'Classical and jazz',
        distribution: { 'Classical and jazz': 60, 'Classic rock and pop': 40, 'Indie and alternative': 36 }
      }
    }
  }
]

const mockSurveyData: SurveyData = {
  total_responses: 1006,
  demographics: {
    age_groups: { '18-34': 264, '35-54': 331, '55+': 411 },
    provinces: { 'Ontario': 486, 'British Columbia': 167, 'Alberta': 127, 'Quebec': 82, 'Other': 144 },
    gender: { 'Female': 520, 'Male': 450, 'Non-binary': 36 },
    education: { 'University': 400, 'College': 350, 'High School': 200, 'Graduate': 56 }
  },
  music_relationship: {
    'I\'m obsessed with music': 303,
    'I like it but don\'t keep up with new releases': 438,
    'Music is background noise for me': 183,
    'I enjoy music casually': 82
  },
  discovery_methods: {
    'Radio': 571,
    'Friends and family recommendations': 161,
    'Streaming service recommendations': 124,
    'Social media': 90,
    'Live events and concerts': 60
  },
  ai_attitudes: {
    'I prefer human-made music': 646,
    'I\'m open to AI-generated music': 186,
    'I\'m neutral about AI music': 124,
    'I\'m excited about AI possibilities': 50
  },
  listening_habits: {
    'Commuting': 784,
    'Working/Studying': 655,
    'Working out': 453,
    'Cooking': 382,
    'Cleaning': 423,
    'Unwinding': 896
  },
  format_evolution: {
    'Vinyl/Records': 200,
    'Cassette Tapes': 150,
    'CDs': 300,
    'Digital Downloads': 200,
    'Streaming': 156
  }
}

// Data loading functions
export const loadPersonas = async (): Promise<Persona[]> => {
  // In a real app, this would fetch from an API
  // For now, return mock data
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockPersonas), 500)
  })
}

export const loadSurveyData = async (): Promise<SurveyData> => {
  // In a real app, this would fetch from an API
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockSurveyData), 300)
  })
}

export const loadChartData = async (): Promise<ChartData> => {
  // In a real app, this would fetch from an API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        demographics_heatmap: {
          z: [
            [120, 80, 60, 40, 20],
            [100, 70, 50, 30, 15],
            [80, 60, 40, 25, 10]
          ],
          x: ['Ontario', 'BC', 'Alberta', 'Quebec', 'Other'],
          y: ['18-34', '35-54', '55+']
        },
        discovery_sunburst: {
          ids: ['root', 'age_18-34', 'age_35-54', 'age_55+', 'age_18-34_radio', 'age_18-34_streaming', 'age_35-54_radio', 'age_35-54_friends', 'age_55+_radio', 'age_55+_streaming'],
          labels: ['Music Discovery', '18-34', '35-54', '55+', 'Radio', 'Streaming', 'Radio', 'Friends', 'Radio', 'Streaming'],
          parents: ['', 'root', 'root', 'root', 'age_18-34', 'age_18-34', 'age_35-54', 'age_35-54', 'age_55+', 'age_55+'],
          values: [1006, 264, 331, 411, 120, 80, 200, 100, 250, 50]
        },
        ai_attitudes_timeline: {
          age_groups: ['18-34', '35-54', '55+'],
          attitudes: {
            'I prefer human-made music': [120, 200, 326],
            'I\'m open to AI-generated music': [100, 60, 26],
            'I\'m neutral about AI music': [30, 50, 44],
            'I\'m excited about AI possibilities': [14, 21, 15]
          }
        },
        format_evolution_sankey: {
          sources: [0, 0, 1, 1, 2, 2, 3, 3],
          targets: [1, 2, 2, 3, 3, 4, 4, 0],
          values: [50, 30, 40, 20, 60, 30, 40, 25],
          labels: ['Vinyl', 'Cassette', 'CD', 'Digital', 'Streaming']
        }
      })
    }, 400)
  })
}

// ML Classification function
export const classifyPersona = (answers: Record<string, string>, personas: Persona[]): Persona => {
  let bestMatch = personas[0]
  let bestScore = 0

  personas.forEach(persona => {
    let score = 0
    
    // Score based on discovery method
    if (persona.characteristics.discovery_method.top_response === answers.discovery_method) score += 3
    else if (persona.characteristics.discovery_method.distribution[answers.discovery_method]) score += 1
    
    // Score based on AI attitude
    if (persona.characteristics.ai_attitude.top_response === answers.ai_attitude) score += 3
    else if (persona.characteristics.ai_attitude.distribution[answers.ai_attitude]) score += 1
    
    // Score based on music relationship
    if (persona.characteristics.music_relationship.top_response === answers.music_relationship) score += 2
    else if (persona.characteristics.music_relationship.distribution[answers.music_relationship]) score += 1
    
    // Score based on age group
    if (persona.characteristics.age_group.top_response === answers.age_group) score += 2
    else if (persona.characteristics.age_group.distribution[answers.age_group]) score += 1
    
    if (score > bestScore) {
      bestScore = score
      bestMatch = persona
    }
  })

  return bestMatch
}
