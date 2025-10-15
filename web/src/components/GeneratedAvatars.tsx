import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { Group, Mesh } from 'three'
import * as THREE from 'three'

interface GeneratedAvatarProps {
  personaId: string
  personaColor: string
  className?: string
}

// Generate different avatar types based on persona
function GeneratedAvatarModel({ personaId, personaColor }: { personaId: string; personaColor: string }) {
  const groupRef = useRef<Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  const getAvatarShape = (personaId: string) => {
    switch (personaId) {
      case 'digital-explorer':
        return (
          <group>
            {/* Main body - octahedron */}
            <mesh position={[0, 0, 0]}>
              <octahedronGeometry args={[1, 0]} />
              <meshStandardMaterial 
                color={personaColor}
                metalness={0.8}
                roughness={0.2}
                emissive={personaColor}
                emissiveIntensity={0.3}
              />
            </mesh>
            {/* Digital elements */}
            <mesh position={[0, 0.5, 0]}>
              <boxGeometry args={[0.3, 0.1, 0.3]} />
              <meshBasicMaterial color="#00ffff" />
            </mesh>
            <mesh position={[0, -0.5, 0]}>
              <boxGeometry args={[0.2, 0.1, 0.2]} />
              <meshBasicMaterial color="#00ffff" />
            </mesh>
          </group>
        )
      
      case 'radio-55-plus':
        return (
          <group>
            {/* Main body - cylinder */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.8, 1.2, 1.5, 8]} />
              <meshStandardMaterial 
                color={personaColor}
                metalness={0.6}
                roughness={0.4}
                emissive={personaColor}
                emissiveIntensity={0.2}
              />
            </mesh>
            {/* Radio elements */}
            <mesh position={[0, 0.3, 0.6]}>
              <circleGeometry args={[0.3, 16]} />
              <meshBasicMaterial color="#333" />
            </mesh>
            <mesh position={[0, 0.3, 0.7]}>
              <circleGeometry args={[0.1, 16]} />
              <meshBasicMaterial color="#666" />
            </mesh>
          </group>
        )
      
      case 'social-streamer':
        return (
          <group>
            {/* Main body - cube */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial 
                color={personaColor}
                metalness={0.5}
                roughness={0.3}
                emissive={personaColor}
                emissiveIntensity={0.25}
              />
            </mesh>
            {/* Social elements */}
            <mesh position={[0.6, 0.3, 0]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshBasicMaterial color="#ff6b6b" />
            </mesh>
            <mesh position={[0.6, -0.3, 0]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshBasicMaterial color="#4ecdc4" />
            </mesh>
            <mesh position={[0.6, 0, 0.3]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshBasicMaterial color="#45b7d1" />
            </mesh>
          </group>
        )
      
      case 'ai-enthusiast':
        return (
          <group>
            {/* Main body - icosahedron */}
            <mesh position={[0, 0, 0]}>
              <icosahedronGeometry args={[1, 0]} />
              <meshStandardMaterial 
                color={personaColor}
                metalness={0.9}
                roughness={0.1}
                emissive={personaColor}
                emissiveIntensity={0.4}
              />
            </mesh>
            {/* AI elements */}
            <mesh position={[0, 0, 0]}>
              <octahedronGeometry args={[0.3, 0]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <octahedronGeometry args={[0.1, 0]} />
              <meshBasicMaterial color="#00ff00" />
            </mesh>
          </group>
        )
      
      case 'concert-goer':
        return (
          <group>
            {/* Main body - sphere */}
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.8, 16, 16]} />
              <meshStandardMaterial 
                color={personaColor}
                metalness={0.4}
                roughness={0.6}
                emissive={personaColor}
                emissiveIntensity={0.2}
              />
            </mesh>
            {/* Concert elements */}
            <mesh position={[0, 0.5, 0]}>
              <coneGeometry args={[0.2, 0.5, 8]} />
              <meshBasicMaterial color="#ffd700" />
            </mesh>
            <mesh position={[0, -0.5, 0]}>
              <coneGeometry args={[0.2, 0.5, 8]} />
              <meshBasicMaterial color="#ffd700" />
            </mesh>
          </group>
        )
      
      default:
        return (
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.8, 16, 16]} />
            <meshStandardMaterial 
              color={personaColor}
              metalness={0.7}
              roughness={0.3}
              emissive={personaColor}
              emissiveIntensity={0.2}
            />
          </mesh>
        )
    }
  }

  return (
    <group ref={groupRef}>
      {getAvatarShape(personaId)}
      
      {/* Add ambient glow */}
      <mesh position={[0, 0, 0]} scale={1.2}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial 
          color={personaColor}
          transparent
          opacity={0.1}
        />
      </mesh>
    </group>
  )
}

const GeneratedAvatar: React.FC<GeneratedAvatarProps> = ({
  personaId,
  personaColor,
  className = ""
}) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        {/* Lighting setup */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color={personaColor} />
        
        {/* Environment for reflections */}
        <Environment preset="city" />
        
        {/* Generated avatar */}
        <GeneratedAvatarModel personaId={personaId} personaColor={personaColor} />
        
        {/* Camera controls */}
        <OrbitControls 
          enableZoom={false}
          autoRotate={true}
          autoRotateSpeed={2}
          enablePan={false}
        />
      </Canvas>
    </div>
  )
}

export default GeneratedAvatar
