import React, { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment } from '@react-three/drei'
import { Group } from 'three'
import GeneratedAvatar from './GeneratedAvatars'

interface GLBAvatarLoaderProps {
  modelPath: string
  personaColor: string
  personaId: string
  className?: string
  autoRotate?: boolean
  enableControls?: boolean
  scale?: number
}

function GLBModel({ 
  modelPath, 
  scale = 1
}: { 
  modelPath: string
  scale?: number 
}) {
  const groupRef = React.useRef<Group>(null)
  
  const { scene } = useGLTF(modelPath)
  
  // Clone the scene to avoid issues with multiple instances
  const clonedScene = scene.clone()
  
  React.useEffect(() => {
    const animate = () => {
      if (groupRef.current) {
        groupRef.current.rotation.y += 0.01
      }
      requestAnimationFrame(animate)
    }
    animate()
  }, [])

  return (
    <group ref={groupRef} scale={scale}>
      <primitive object={clonedScene} />
    </group>
  )
}

const GLBAvatarLoader: React.FC<GLBAvatarLoaderProps> = ({
  modelPath,
  personaColor,
  personaId,
  className = "",
  autoRotate = true,
  enableControls = true,
  scale = 1
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [useFallback, setUseFallback] = useState(false)

  useEffect(() => {
    // Test if the GLB file is accessible
    const testGLBLoad = async () => {
      try {
        const response = await fetch(modelPath, { method: 'HEAD' })
        if (!response.ok) {
          throw new Error('GLB file not accessible')
        }
        setIsLoading(false)
      } catch (error) {
        console.log('GLB file not accessible, using fallback:', error)
        setHasError(true)
        setUseFallback(true)
        setIsLoading(false)
      }
    }

    if (modelPath) {
      testGLBLoad()
    } else {
      setUseFallback(true)
      setIsLoading(false)
    }
  }, [modelPath])

  if (isLoading) {
    return (
      <div className={`w-full h-full ${className} flex items-center justify-center`}>
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (useFallback || hasError) {
    return (
      <GeneratedAvatar
        personaId={personaId}
        personaColor={personaColor}
        className={className}
      />
    )
  }

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color={personaColor} />
        
        <Environment preset="city" />
        
        <GLBModel modelPath={modelPath} scale={scale} />
        
        <OrbitControls 
          enableZoom={false}
          autoRotate={autoRotate}
          autoRotateSpeed={2}
          enablePan={false}
        />
      </Canvas>
    </div>
  )
}

export default GLBAvatarLoader
