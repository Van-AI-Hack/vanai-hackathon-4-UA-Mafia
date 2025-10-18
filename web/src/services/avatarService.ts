// Avatar service for Cloudinary GLB file management

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME

// Avatar model mapping for Cloudinary
export const AVATAR_MODELS = {
  'The Digital Explorer': 'canadian-music-dna/avatars/digital-explorer-tech-savvy-youth-3d-model',
  'The Radio Traditionalist': 'canadian-music-dna/avatars/radio-traditionalist-steampunk-music-machine-3d-model',
  'The Casual Listener': 'canadian-music-dna/avatars/casual-listener-3d-model',
  'The AI Skeptic': 'canadian-music-dna/avatars/ai-skeptic-acoustic-guitar-3d-model',
  'The Music Obsessive': 'canadian-music-dna/avatars/music-obsessive-musician-studio-3d-model'
} as const

// Get GLB file URL from Cloudinary
export const getAvatarGLBUrl = (personaName: string): string | null => {
  const publicId = AVATAR_MODELS[personaName as keyof typeof AVATAR_MODELS]
  if (!publicId || !CLOUDINARY_CLOUD_NAME) return null
  
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/raw/upload/${publicId}.glb`
}

// Check if GLB file exists in Cloudinary
export const checkAvatarExists = async (personaName: string): Promise<boolean> => {
  const url = getAvatarGLBUrl(personaName)
  if (!url) return false

  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok
  } catch (error) {
    console.error('Error checking avatar existence:', error)
    return false
  }
}

// Upload GLB file to Cloudinary (for admin use)
export const uploadAvatarGLB = async (file: File, personaName: string): Promise<string> => {
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  if (!uploadPreset) {
    throw new Error('Cloudinary upload preset not configured')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  formData.append('public_id', `canadian-music-dna/avatars/${personaName.toLowerCase().replace(/\s+/g, '-')}`)
  formData.append('resource_type', 'raw')

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`, {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    throw new Error('Failed to upload GLB file to Cloudinary')
  }

  const result = await response.json()
  return result.secure_url
}

// Get all available avatars
export const getAvailableAvatars = async (): Promise<string[]> => {
  const avatars: string[] = []
  
  for (const personaName of Object.keys(AVATAR_MODELS)) {
    const exists = await checkAvatarExists(personaName)
    if (exists) {
      avatars.push(personaName)
    }
  }
  
  return avatars
}




