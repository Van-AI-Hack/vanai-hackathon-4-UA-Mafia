import React from 'react'
import GLBAvatar from './GLBAvatar'
import GeneratedAvatar from './GeneratedAvatars'

interface PersonaAvatarProps {
  personaId: string
  personaColor: string
  className?: string
  autoRotate?: boolean
  enableControls?: boolean
  useGenerated?: boolean // New prop to choose between GLB and generated
}

// Avatar model mapping - using your actual GLB files
const getAvatarModelPath = (personaId: string | number): string | null => {
  // Map by persona name since that's what we're using in the component
  const avatarModels: Record<string, string> = {
    'The Digital Explorer': '/avatars/The Digital Explorer tech-savvy+youth+3d+model.glb',
    'The Radio Traditionalist': '/avatars/The Radio Traditionalist steampunk+music+machine+3d+model.glb',
    'The Casual Listener': '/avatars/The Casual Listener casual+listener+3d+model.glb',
    'The AI Skeptic': '/avatars/The AI Skeptic acoustic+guitar+3d+model.glb',
    'The Music Obsessive': '/avatars/The Music Obsessive musician+in+studio+3d+model.glb'
  }
  
  return avatarModels[personaId] || null
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
      <GLBAvatar
        modelPath={modelPath}
        personaColor={personaColor}
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
