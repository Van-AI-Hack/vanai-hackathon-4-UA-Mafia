import React from 'react'
import GLBAvatarLoader from './GLBAvatarLoader'
import GeneratedAvatar from './GeneratedAvatars'
import { getAvatarGLBUrl } from '../services/avatarService'

interface PersonaAvatarProps {
  personaId: string
  personaColor: string
  className?: string
  autoRotate?: boolean
  enableControls?: boolean
  useGenerated?: boolean // New prop to choose between GLB and generated
}

// Get Cloudinary GLB URL for persona
const getAvatarModelPath = (personaId: string | number): string | null => {
  return getAvatarGLBUrl(personaId as string)
}

const PersonaAvatar: React.FC<PersonaAvatarProps> = ({
  personaId,
  personaColor,
  className = "",
  autoRotate = true,
  enableControls = true,
  useGenerated = true // Default to generated avatars until GLB files are fixed
}) => {
  const modelPath = getAvatarModelPath(personaId)
  
  // Use GLB models if available, fallback to generated avatars
  if (modelPath && !useGenerated) {
    return (
      <GLBAvatarLoader
        modelPath={modelPath}
        personaColor={personaColor}
        personaId={personaId}
        className={className}
        autoRotate={autoRotate}
        enableControls={enableControls}
        scale={1}
      />
    )
  }
  
  // Fallback to generated avatars
  return (
    <GeneratedAvatar
      personaId={personaId}
      personaColor={personaColor}
      className={className}
    />
  )
}

export default PersonaAvatar
