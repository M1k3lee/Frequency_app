import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls, MeshDistortMaterial } from '@react-three/drei';
import { Maximize2, Minimize2 } from 'lucide-react';
import * as THREE from 'three';
import { useAppStore } from '../store/useAppStore';
import './VisualCanvas.css';

// Flowing Energy - Animated flowing particles
const FlowingEnergy: React.FC = () => {
  const particles = useMemo(() => {
    const count = 1000;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    
    return { positions, velocities };
  }, []);

  const meshRef = useRef<THREE.Points>(null);
  const positionsRef = useRef(particles.positions);
  const velocitiesRef = useRef(particles.velocities);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const positions = positionsRef.current;
    const velocities = velocitiesRef.current;
    
    for (let i = 0; i < positions.length / 3; i++) {
      const i3 = i * 3;
      
      // Update position
      positions[i3] += velocities[i3] + Math.sin(time + i) * 0.001;
      positions[i3 + 1] += velocities[i3 + 1] + Math.cos(time + i) * 0.001;
      positions[i3 + 2] += velocities[i3 + 2] + Math.sin(time * 0.5 + i) * 0.001;
      
      // Wrap around
      if (Math.abs(positions[i3]) > 10) positions[i3] *= -1;
      if (Math.abs(positions[i3 + 1]) > 10) positions[i3 + 1] *= -1;
      if (Math.abs(positions[i3 + 2]) > 10) positions[i3 + 2] *= -1;
    }
    
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={positionsRef.current}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#64ffda" transparent opacity={0.8} />
    </points>
  );
};

// Mandala - Rotating geometric pattern
const Mandala: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} rotation={[0, (Math.PI * 2 * i) / 12, 0]} position={[0, 0, 0]}>
          <ringGeometry args={[2 + i * 0.3, 2.2 + i * 0.3, 32]} />
          <meshBasicMaterial color={`hsl(${(i * 30) % 360}, 70%, 60%)`} side={THREE.DoubleSide} />
        </mesh>
      ))}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.6} />
      </mesh>
    </group>
  );
};

// Gateway Portal - Swirling portal effect
const GatewayPortal: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const torusRef = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.getElapsedTime() * 0.5;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.3;
    }
    
    torusRef.current.forEach((torus, i) => {
      if (torus) {
        torus.rotation.x = state.clock.getElapsedTime() * (0.5 + i * 0.1);
        torus.rotation.y = state.clock.getElapsedTime() * (0.3 + i * 0.05);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) torusRef.current[i] = el;
          }}
          position={[0, 0, -i * 0.5]}
        >
          <torusGeometry args={[3 - i * 0.3, 0.1, 16, 100]} />
          <meshBasicMaterial
            color={`hsl(${200 + i * 20}, 80%, ${60 - i * 5}%)`}
            transparent
            opacity={0.8 - i * 0.1}
          />
        </mesh>
      ))}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#00ffff" />
      </mesh>
      <pointLight position={[0, 0, 0]} color="#00ffff" intensity={2} />
    </group>
  );
};

// Breathing Orb - Pulsing sphere
const BreathingOrb: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.getElapsedTime() * 2) * 0.3;
      meshRef.current.scale.set(scale, scale, scale);
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <>
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <MeshDistortMaterial
          color="#ff6b9d"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0}
          transparent
          opacity={0.8}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshBasicMaterial color="#ff6b9d" transparent opacity={0.2} side={THREE.BackSide} />
      </mesh>
    </>
  );
};

const VisualScene: React.FC<{ visual: string }> = ({ visual }) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4a90e2" />
      
      {visual === 'starlit-void' && (
        <Stars
          radius={300}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={0.5}
        />
      )}
      
      {visual === 'flowing-energy' && <FlowingEnergy />}
      
      {visual === 'mandala' && <Mandala />}
      
      {visual === 'gateway-portal' && <GatewayPortal />}
      
      {visual === 'breathing-orb' && <BreathingOrb />}
      
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={visual === 'starlit-void' ? 0.5 : 0.3}
      />
    </>
  );
};

const VisualCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { currentVisual } = useAppStore();
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Always show the visual canvas - starlit-void is the default background
  // If 'none' is selected, still show starlit-void as the default
  const displayVisual = currentVisual === 'none' ? 'starlit-void' : currentVisual;

  // Debug: Log visual changes
  React.useEffect(() => {
    console.log('VisualCanvas: Current visual changed to:', displayVisual);
  }, [displayVisual]);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      setIsFullscreen(true);
    } else {
      setIsFullscreen(false);
    }
  };

  return (
    <>
      <div ref={canvasRef} className={`visual-canvas ${isFullscreen ? 'fullscreen' : ''}`}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          gl={{ 
            alpha: true, 
            antialias: true,
            preserveDrawingBuffer: false,
            powerPreference: 'high-performance'
          }}
          dpr={[1, 2]}
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <VisualScene visual={displayVisual} />
        </Canvas>
        {isFullscreen && (
          <button
            className="fullscreen-toggle"
            onClick={toggleFullscreen}
            aria-label="Exit fullscreen"
          >
            <Minimize2 size={24} />
          </button>
        )}
      </div>
      {!isFullscreen && (
        <button
          className="fullscreen-toggle-btn"
          onClick={toggleFullscreen}
          aria-label="Fullscreen visual"
          title="Fullscreen visual"
        >
          <Maximize2 size={18} />
        </button>
      )}
    </>
  );
};

export default VisualCanvas;
