import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary

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
  if (!publicId) return null
  
  return cloudinary.url(publicId, {
    resource_type: 'raw',
    secure: true,
    fetch_format: 'auto'
  })
}

// Upload GLB file to Cloudinary
export const uploadAvatarGLB = async (file: File, personaName: string): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'canadian-music-dna-avatars')
  formData.append('public_id', `canadian-music-dna/avatars/${personaName.toLowerCase().replace(/\s+/g, '-')}`)
  formData.append('resource_type', 'raw')

  const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload`, {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    throw new Error('Failed to upload GLB file to Cloudinary')
  }

  const result = await response.json()
  return result.secure_url
}
