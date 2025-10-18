import React from 'react'
import { motion } from 'framer-motion'

interface ImageAvatarProps {
  personaId: string | number
  personaName: string
  personaColor: string
  className?: string
  animate?: boolean
}

// Map persona names to image filenames
const getPersonaImagePath = (personaId: string | number, personaName: string): string => {
  // Convert persona name to match filename format
  // Example: "The Radio Traditionalist" -> "Persona 0 The Radio Traditionalist.png"
  const id = typeof personaId === 'string' ? personaId.replace('persona_', '') : personaId
  return `/images/personas/Persona ${id} ${personaName}.png`
}

const ImageAvatar: React.FC<ImageAvatarProps> = ({
  personaId,
  personaName,
  personaColor,
  className = "",
  animate = true
}) => {
  const imagePath = getPersonaImagePath(personaId, personaName)

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  }

  return (
    <motion.div
      className={`relative w-full h-full flex items-center justify-center ${className}`}
      initial={animate ? "hidden" : "visible"}
      animate="visible"
      whileHover={animate ? "hover" : undefined}
      variants={imageVariants}
    >
      {/* Glow effect behind image */}
      <div 
        className="absolute inset-0 rounded-2xl blur-2xl opacity-30"
        style={{ backgroundColor: personaColor }}
      />
      
      {/* Main image */}
      <img
        src={imagePath}
        alt={`${personaName} persona avatar`}
        className="relative w-full h-full object-contain rounded-2xl"
        onError={(e) => {
          console.error(`Failed to load persona image: ${imagePath}`)
          e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>'
        }}
      />
      
      {/* Decorative border */}
      <div 
        className="absolute inset-0 rounded-2xl border-2 opacity-50"
        style={{ borderColor: personaColor }}
      />
    </motion.div>
  )
}

export default ImageAvatar


