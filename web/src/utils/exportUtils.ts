// Export utilities for Canadian Music DNA platform
// Generates downloadable persona cards and social sharing

import { Persona } from './dataLoader'

export interface ExportOptions {
  format: 'png' | 'svg' | 'pdf'
  size: 'small' | 'medium' | 'large'
  includeStats: boolean
  includeDescription: boolean
}

export const generatePersonaCardHTML = (persona: Persona, options: ExportOptions): string => {
  const sizeClasses = {
    small: 'w-80 h-96',
    medium: 'w-96 h-[28rem]',
    large: 'w-[28rem] h-[32rem]'
  }

  const cardSize = sizeClasses[options.size]

  return `
    <div class="${cardSize} bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-${persona.color.replace('#', '')} rounded-2xl p-8 font-sans" style="font-family: 'Inter', sans-serif;">
      <!-- Header -->
      <div class="text-center mb-6">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl font-bold text-white" style="background: ${persona.color};">
          ${persona.name.charAt(0)}
        </div>
        <h1 class="text-2xl font-bold text-white mb-2">${persona.name}</h1>
        <div class="w-24 h-1 mx-auto rounded-full" style="background: ${persona.color};"></div>
      </div>

      <!-- Description -->
      ${options.includeDescription ? `
        <div class="mb-6">
          <p class="text-gray-300 text-sm leading-relaxed text-center">
            ${persona.description}
          </p>
        </div>
      ` : ''}

      <!-- Traits -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-white mb-3 text-center">Key Traits</h3>
        <div class="flex flex-wrap gap-2 justify-center">
          ${persona.traits.map(trait => `
            <span class="px-3 py-1 rounded-full text-xs font-medium text-white" style="background: ${persona.color}40; border: 1px solid ${persona.color};">
              ${trait}
            </span>
          `).join('')}
        </div>
      </div>

      <!-- Stats -->
      ${options.includeStats ? `
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-white mb-3 text-center">Your Music DNA</h3>
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-gray-400 text-sm">Discovery Method</span>
              <span class="text-white text-sm font-medium">${persona.characteristics.discovery_method.top_response}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-400 text-sm">AI Attitude</span>
              <span class="text-white text-sm font-medium">${persona.characteristics.ai_attitude.top_response}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-400 text-sm">Music Relationship</span>
              <span class="text-white text-sm font-medium">${persona.characteristics.music_relationship.top_response}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-400 text-sm">Age Group</span>
              <span class="text-white text-sm font-medium">${persona.characteristics.age_group.top_response}</span>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Footer -->
      <div class="text-center">
        <div class="text-xs text-gray-500 mb-2">Canadian Music DNA</div>
        <div class="text-xs text-gray-600">Generated on ${new Date().toLocaleDateString()}</div>
      </div>
    </div>
  `
}

export const downloadAsPNG = async (persona: Persona, options: ExportOptions): Promise<void> => {
  try {
    // Create a temporary container
    const container = document.createElement('div')
    container.innerHTML = generatePersonaCardHTML(persona, options)
    container.style.position = 'absolute'
    container.style.left = '-9999px'
    container.style.top = '-9999px'
    document.body.appendChild(container)

    // Use html2canvas if available, otherwise fallback to canvas
    if (typeof window !== 'undefined' && (window as any).html2canvas) {
      const canvas = await (window as any).html2canvas(container.firstElementChild, {
        backgroundColor: null,
        scale: 2,
        useCORS: true
      })
      
      const link = document.createElement('a')
      link.download = `canadian-music-dna-${persona.name.toLowerCase().replace(/\s+/g, '-')}.png`
      link.href = canvas.toDataURL()
      link.click()
    } else {
      // Fallback: Create a simple canvas-based export
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      if (!ctx) throw new Error('Canvas context not available')
      
      // Set canvas size based on options
      const sizes = { small: [320, 384], medium: [384, 448], large: [448, 512] }
      const [width, height] = sizes[options.size]
      canvas.width = width
      canvas.height = height
      
      // Draw background
      ctx.fillStyle = '#1a1a2e'
      ctx.fillRect(0, 0, width, height)
      
      // Draw border
      ctx.strokeStyle = persona.color
      ctx.lineWidth = 4
      ctx.strokeRect(2, 2, width - 4, height - 4)
      
      // Draw title
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 24px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(persona.name, width / 2, 60)
      
      // Draw traits
      ctx.font = '16px Inter, sans-serif'
      let y = 120
      persona.traits.forEach((trait, index) => {
        if (y < height - 50) {
          ctx.fillText(trait, width / 2, y)
          y += 30
        }
      })
      
      // Draw footer
      ctx.font = '12px Inter, sans-serif'
      ctx.fillStyle = '#888888'
      ctx.fillText('Canadian Music DNA', width / 2, height - 20)
      
      // Download
      const link = document.createElement('a')
      link.download = `canadian-music-dna-${persona.name.toLowerCase().replace(/\s+/g, '-')}.png`
      link.href = canvas.toDataURL()
      link.click()
    }
    
    document.body.removeChild(container)
  } catch (error) {
    console.error('Error generating PNG:', error)
    throw new Error('Failed to generate PNG. Please try again.')
  }
}

export const downloadAsSVG = (persona: Persona, options: ExportOptions): void => {
  try {
    const svgContent = generatePersonaCardSVG(persona, options)
    const blob = new Blob([svgContent], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.download = `canadian-music-dna-${persona.name.toLowerCase().replace(/\s+/g, '-')}.svg`
    link.href = url
    link.click()
    
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error generating SVG:', error)
    throw new Error('Failed to generate SVG. Please try again.')
  }
}

const generatePersonaCardSVG = (persona: Persona, options: ExportOptions): string => {
  const sizes = { small: [320, 384], medium: [384, 448], large: [448, 512] }
  const [width, height] = sizes[options.size]
  
  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="${width}" height="${height}" fill="url(#bg)" stroke="${persona.color}" stroke-width="4" rx="16"/>
      
      <!-- Title -->
      <text x="${width/2}" y="60" text-anchor="middle" fill="white" font-family="Inter, sans-serif" font-size="24" font-weight="bold">
        ${persona.name}
      </text>
      
      <!-- Divider -->
      <rect x="${width/2 - 48}" y="70" width="96" height="4" fill="${persona.color}" rx="2"/>
      
      <!-- Traits -->
      <text x="${width/2}" y="120" text-anchor="middle" fill="white" font-family="Inter, sans-serif" font-size="16" font-weight="600">
        Key Traits
      </text>
      
      ${persona.traits.map((trait, index) => `
        <rect x="${width/2 - 60}" y="${130 + index * 35}" width="120" height="25" fill="${persona.color}40" stroke="${persona.color}" stroke-width="1" rx="12"/>
        <text x="${width/2}" y="${145 + index * 35}" text-anchor="middle" fill="white" font-family="Inter, sans-serif" font-size="12" font-weight="500">
          ${trait}
        </text>
      `).join('')}
      
      <!-- Footer -->
      <text x="${width/2}" y="${height - 20}" text-anchor="middle" fill="#888888" font-family="Inter, sans-serif" font-size="12">
        Canadian Music DNA
      </text>
    </svg>
  `
}

export const shareToSocial = (persona: Persona, platform: 'twitter' | 'facebook' | 'linkedin' | 'copy'): void => {
  const baseUrl = window.location.origin
  const shareText = `I just discovered my Canadian Music DNA! I'm a "${persona.name}" - ${persona.description.substring(0, 100)}...`
  const shareUrl = `${baseUrl}?persona=${persona.id}`
  
  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    copy: ''
  }
  
  if (platform === 'copy') {
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`).then(() => {
      // You might want to show a toast notification here
      console.log('Copied to clipboard!')
    }).catch(err => {
      console.error('Failed to copy to clipboard:', err)
    })
  } else {
    window.open(shareUrls[platform], '_blank', 'width=600,height=400')
  }
}

export const saveToLocalStorage = (persona: Persona, quizAnswers: any): void => {
  try {
    const userData = {
      persona,
      quizAnswers,
      timestamp: new Date().toISOString(),
      version: '1.0'
    }
    
    localStorage.setItem('canadian-music-dna-result', JSON.stringify(userData))
    console.log('Result saved to local storage')
  } catch (error) {
    console.error('Failed to save to local storage:', error)
  }
}

export const loadFromLocalStorage = (): any => {
  try {
    const data = localStorage.getItem('canadian-music-dna-result')
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Failed to load from local storage:', error)
    return null
  }
}


