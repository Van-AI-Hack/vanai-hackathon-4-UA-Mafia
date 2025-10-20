import React, { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

interface Logo3DModelProps {
  animate?: boolean
  rotationSpeed?: number
}

function Logo3DModel({ animate = true, rotationSpeed = 0.5 }: Logo3DModelProps) {
  const meshRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/logo/Main_Logo_neon+dna+leaf+3d+model.glb')
  
  // Clone the scene to avoid issues with multiple instances
  const clonedScene = React.useMemo(() => scene.clone(), [scene])

  useFrame((state, delta) => {
    if (meshRef.current && animate) {
      // Smooth rotation
      meshRef.current.rotation.y += delta * rotationSpeed
      // Gentle floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <primitive 
      ref={meshRef} 
      object={clonedScene} 
      scale={3.5}
      position={[0, 0, 0]}
    />
  )
}

// Preload the model
useGLTF.preload('/logo/Main_Logo_neon+dna+leaf+3d+model.glb')

interface Logo3DProps {
  className?: string
  animate?: boolean
  rotationSpeed?: number
  enableOrbitControls?: boolean
}

const Logo3D: React.FC<Logo3DProps> = ({ 
  className = '', 
  animate = true, 
  rotationSpeed = 0.5,
  enableOrbitControls = false
}) => {
  return (
    <div className={className}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        
        {/* Lighting setup for neon effect */}
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={2.5} color="#00f0ff" />
        <pointLight position={[-10, -10, -10]} intensity={2} color="#a855f7" />
        <pointLight position={[0, 10, 0]} intensity={1.5} color="#ffffff" />
        <spotLight 
          position={[0, 5, 5]} 
          intensity={2.5} 
          angle={0.5}
          penumbra={1}
          color="#ffffff"
        />
        
        <Suspense fallback={null}>
          <Logo3DModel animate={animate} rotationSpeed={rotationSpeed} />
        </Suspense>
        
        {enableOrbitControls && (
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
          />
        )}
      </Canvas>
    </div>
  )
}

export default Logo3D

