import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Stars, Float } from '@react-three/drei'
import * as THREE from 'three'

function OrbCore({ isThinking }) {
  const meshRef = useRef()
  const innerRef = useRef()
  const ringRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.15
      meshRef.current.rotation.y = t * 0.2
      meshRef.current.material.distort = isThinking
        ? 0.5 + Math.sin(t * 3) * 0.15
        : 0.25 + Math.sin(t * 0.8) * 0.05
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.4
      innerRef.current.rotation.z = t * 0.15
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.3
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.5) * 0.1
    }
  })

  const color1 = isThinking ? '#7b61ff' : '#00d4ff'
  const color2 = isThinking ? '#ff61d8' : '#00ffcc'

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      {/* Outer glow sphere */}
      <Sphere ref={meshRef} args={[1.2, 128, 128]}>
        <MeshDistortMaterial
          color={color1}
          emissive={color1}
          emissiveIntensity={0.3}
          roughness={0.1}
          metalness={0.8}
          distort={0.3}
          speed={isThinking ? 4 : 1.5}
          transparent
          opacity={0.85}
          wireframe={false}
        />
      </Sphere>

      {/* Inner core */}
      <Sphere ref={innerRef} args={[0.75, 64, 64]}>
        <MeshDistortMaterial
          color={color2}
          emissive={color2}
          emissiveIntensity={0.6}
          roughness={0}
          metalness={1}
          distort={0.2}
          speed={2}
          transparent
          opacity={0.9}
        />
      </Sphere>

      {/* Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.6, 0.03, 16, 100]} />
        <meshStandardMaterial
          color={color1}
          emissive={color1}
          emissiveIntensity={1}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Second ring */}
      <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[1.9, 0.015, 16, 100]} />
        <meshStandardMaterial
          color={color2}
          emissive={color2}
          emissiveIntensity={0.8}
          transparent
          opacity={0.35}
        />
      </mesh>
    </Float>
  )
}

function ParticleField() {
  const count = 200
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    return pos
  }, [])

  const pointsRef = useRef()
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.03
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#00d4ff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

export default function AIOrb({ isThinking = false }) {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.1} />
        <pointLight position={[5, 5, 5]} color="#00d4ff" intensity={2} />
        <pointLight position={[-5, -3, -5]} color="#7b61ff" intensity={1.5} />
        <pointLight position={[0, -5, 2]} color="#00ffcc" intensity={1} />

        <Stars
          radius={80}
          depth={50}
          count={3000}
          factor={3}
          saturation={0.5}
          fade
          speed={0.5}
        />

        <OrbCore isThinking={isThinking} />
        <ParticleField />
      </Canvas>
    </div>
  )
}
