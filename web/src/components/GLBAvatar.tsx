import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, PresentationControls } from '@react-three/drei'
import { Group } from 'three'

interface GLBAvatarProps {
  modelPath: string
  personaColor: string
  className?: string
  autoRotate?: boolean
  enableControls?: boolean
  scale?: number
}

// Component to load and display GLB models
function GLBModel({ 
  modelPath, 
  scale = 1 
}: { 
  modelPath: string
  scale?: number 
}) {
  const groupRef = useRef<Group>(null)
  
  const { scene } = useGLTF(modelPath)
  
  // Clone the scene to avoid issues with multiple instances
  const clonedScene = scene.clone()
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  // Keep original GLB colors - no persona color tinting
  // The GLB models will display in their original colors

  return (
    <group ref={groupRef} scale={scale}>
      <primitive object={clonedScene} />
    </group>
  )
}

// Fallback geometric avatar when GLB model is not available
function FallbackAvatar({ personaId, personaColor }: { personaId: string; personaColor: string }) {
  const groupRef = useRef<Group>(null)
  
  const getAvatarGeometry = (personaId: string) => {
    switch (personaId) {
      case 'digital-explorer':
        return <octahedronGeometry args={[1, 0]} />
      case 'radio-55-plus':
        return <cylinderGeometry args={[0.8, 1.2, 1.5, 8]} />
      case 'social-streamer':
        return <boxGeometry args={[1, 1, 1]} />
      case 'ai-enthusiast':
        return <icosahedronGeometry args={[1, 0]} />
      case 'concert-goer':
        return <sphereGeometry args={[0.8, 16, 16]} />
      default:
        return <sphereGeometry args={[0.8, 16, 16]} />
    }
  }

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, 0]}>
        {getAvatarGeometry(personaId)}
        <meshStandardMaterial 
          color={personaColor}
          metalness={0.7}
          roughness={0.3}
          emissive={personaColor}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Add some ambient glow */}
      <mesh position={[0, 0, 0]} scale={1.1}>
        {getAvatarGeometry(personaId)}
        <meshBasicMaterial 
          color={personaColor}
          transparent
          opacity={0.1}
        />
      </mesh>
    </group>
  )
}

// Loading fallback component
function AvatarLoader() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#666" wireframe />
    </mesh>
  )
}

const GLBAvatar: React.FC<GLBAvatarProps> = ({
  modelPath,
  personaColor,
  className = "",
  autoRotate = true,
  enableControls = true,
  scale = 1
}) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={<AvatarLoader />}>
          {/* Lighting setup */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[-5, -5, -5]} intensity={0.5} color={personaColor} />
          
          {/* Environment for reflections */}
          <Environment preset="city" />
          
          {/* GLB Model or Fallback */}
          {modelPath ? (
          <GLBModel 
            modelPath={modelPath} 
            scale={scale}
          />
          ) : (
            <FallbackAvatar 
              personaId="default" 
              personaColor={personaColor} 
            />
          )}
          
          {/* Camera controls */}
          {enableControls ? (
            <PresentationControls
              global
              rotation={[0, 0, 0]}
              polar={[-Math.PI / 3, Math.PI / 3]}
              azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
            >
              <OrbitControls 
                enableZoom={false}
                autoRotate={autoRotate}
                autoRotateSpeed={2}
                enablePan={false}
              />
            </PresentationControls>
          ) : (
            <OrbitControls 
              enableZoom={false}
              autoRotate={autoRotate}
              autoRotateSpeed={2}
              enablePan={false}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  )
}

export default GLBAvatar
