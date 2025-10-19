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
const getPersonaImagePath = (personaId: string | number, personaName: string): { webp: string; png: string } => {
  // Convert persona name to match filename format
  // Example: "The Radio Traditionalist" -> "Persona 0 The Radio Traditionalist.webp"
  const id = typeof personaId === 'string' ? personaId.replace('persona_', '') : personaId
  const basePath = `/images/personas/Persona ${id} ${personaName}`
  
  return {
    webp: `/images/personas/webp/Persona ${id} ${personaName}.webp`,
    png: `${basePath}.png`
  }
}

const ImageAvatar: React.FC<ImageAvatarProps> = ({
  personaId,
  personaName,
  personaColor,
  className = "",
  animate = true
}) => {
  const imagePaths = getPersonaImagePath(personaId, personaName)

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
      
      {/* Main image - WebP with PNG fallback */}
      <picture>
        <source srcSet={imagePaths.webp} type="image/webp" />
        <img
          src={imagePaths.png}
          alt={`${personaName} persona avatar`}
          className="relative w-full h-full object-contain rounded-2xl"
          onError={(e) => {
            console.error(`Failed to load persona image: ${imagePaths.webp} or ${imagePaths.png}`)
            e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>'
          }}
        />
      </picture>
      
      {/* Decorative border */}
      <div 
        className="absolute inset-0 rounded-2xl border-2 opacity-50"
        style={{ borderColor: personaColor }}
      />
    </motion.div>
  )
}

export default ImageAvatar






