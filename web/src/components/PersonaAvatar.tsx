import React from 'react'
import ImageAvatar from './ImageAvatar'

interface PersonaAvatarProps {
  personaId: string
  personaName: string
  personaColor: string
  className?: string
  animate?: boolean
}

const PersonaAvatar: React.FC<PersonaAvatarProps> = ({
  personaId,
  personaName,
  personaColor,
  className = "",
  animate = true
}) => {
  return (
    <ImageAvatar
      personaId={personaId}
      personaName={personaName}
      personaColor={personaColor}
      className={className}
      animate={animate}
    />
  )
}

export default PersonaAvatar
