import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls, MeshDistortMaterial } from '@react-three/drei';
import { Maximize2, Minimize2 } from 'lucide-react';
import * as THREE from 'three';
import { useAppStore } from '../store/useAppStore';
import { getFrequencyById } from '../data/frequencies';
import './VisualCanvas.css';

const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));

// Flowing Energy - Animated flowing particles
const FlowingEnergy: React.FC<{ intensity: number }> = ({ intensity }) => {
  const particles = useMemo(() => {
    const count = 1200;
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
  const smoothedIntensityRef = useRef(intensity);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    smoothedIntensityRef.current = THREE.MathUtils.lerp(
      smoothedIntensityRef.current,
      intensity,
      Math.min(1, delta * 2.8)
    );

    const energy = 0.55 + smoothedIntensityRef.current * 1.2;
    const time = state.clock.getElapsedTime();
    const positions = positionsRef.current;
    const velocities = velocitiesRef.current;

    for (let i = 0; i < positions.length / 3; i++) {
      const i3 = i * 3;

      positions[i3] += velocities[i3] * energy + Math.sin(time * (0.8 + energy * 0.4) + i) * 0.0014 * energy;
      positions[i3 + 1] += velocities[i3 + 1] * energy + Math.cos(time * (0.9 + energy * 0.35) + i) * 0.0014 * energy;
      positions[i3 + 2] += velocities[i3 + 2] * energy + Math.sin(time * 0.5 + i) * 0.001 * energy;

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
      <pointsMaterial
        size={0.08 + intensity * 0.1}
        color="#64ffda"
        transparent
        opacity={0.55 + intensity * 0.25}
      />
    </points>
  );
};

// Mandala - Rotating geometric pattern
const Mandala: React.FC<{ intensity: number }> = ({ intensity }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const speed = 0.12 + intensity * 0.35;
      groupRef.current.rotation.y = state.clock.getElapsedTime() * speed;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * (0.08 + intensity * 0.12)) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} rotation={[0, (Math.PI * 2 * i) / 12, 0]} position={[0, 0, 0]}>
          <ringGeometry args={[2 + i * 0.3, 2.2 + i * 0.3, 32]} />
          <meshBasicMaterial
            color={`hsl(${(i * 30 + intensity * 50) % 360}, 70%, ${56 + intensity * 12}%)`}
            side={THREE.DoubleSide}
            transparent
            opacity={0.45 + intensity * 0.28}
          />
        </mesh>
      ))}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.45 + intensity * 0.35} />
      </mesh>
    </group>
  );
};

// Gateway Portal - Swirling portal effect
const GatewayPortal: React.FC<{ intensity: number }> = ({ intensity }) => {
  const groupRef = useRef<THREE.Group>(null);
  const torusRef = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    const energy = 0.6 + intensity * 1.1;

    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.getElapsedTime() * (0.25 + 0.35 * energy);
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * (0.18 + 0.2 * energy)) * 0.3;
    }

    torusRef.current.forEach((torus, i) => {
      if (torus) {
        torus.rotation.x = state.clock.getElapsedTime() * (0.35 + i * 0.08) * energy;
        torus.rotation.y = state.clock.getElapsedTime() * (0.25 + i * 0.05) * energy;
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
            color={`hsl(${200 + i * 20}, 80%, ${58 - i * 4 + intensity * 8}%)`}
            transparent
            opacity={0.65 - i * 0.08 + intensity * 0.14}
          />
        </mesh>
      ))}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#00ffff" />
      </mesh>
      <pointLight position={[0, 0, 0]} color="#00ffff" intensity={1.3 + intensity * 1.6} />
    </group>
  );
};

// Breathing Orb - Pulsing sphere
const BreathingOrb: React.FC<{ intensity: number }> = ({ intensity }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const pulseAmplitude = 0.18 + intensity * 0.24;
      const pulseSpeed = 1.5 + intensity * 1.1;
      const scale = 1 + Math.sin(state.clock.getElapsedTime() * pulseSpeed) * pulseAmplitude;
      meshRef.current.scale.set(scale, scale, scale);
      meshRef.current.rotation.y = state.clock.getElapsedTime() * (0.25 + intensity * 0.65);
    }
  });

  return (
    <>
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <MeshDistortMaterial
          color="#ff6b9d"
          attach="material"
          distort={0.24 + intensity * 0.32}
          speed={1.2 + intensity * 2.2}
          roughness={0}
          transparent
          opacity={0.62 + intensity * 0.24}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshBasicMaterial color="#ff6b9d" transparent opacity={0.12 + intensity * 0.18} side={THREE.BackSide} />
      </mesh>
    </>
  );
};

const VisualScene: React.FC<{ visual: string; intensity: number }> = ({ visual, intensity }) => {
  return (
    <>
      <ambientLight intensity={0.35 + intensity * 0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8 + intensity * 0.6} />
      <pointLight position={[-10, -10, -10]} intensity={0.4 + intensity * 0.45} color="#4a90e2" />

      {visual === 'starlit-void' && (
        <Stars
          radius={300}
          depth={50}
          count={Math.round(4300 + intensity * 2600)}
          factor={3 + intensity * 2.5}
          saturation={0}
          fade
          speed={0.2 + intensity * 0.8}
        />
      )}

      {visual === 'flowing-energy' && <FlowingEnergy intensity={intensity} />}

      {visual === 'mandala' && <Mandala intensity={intensity} />}

      {visual === 'gateway-portal' && <GatewayPortal intensity={intensity} />}

      {visual === 'breathing-orb' && <BreathingOrb intensity={intensity} />}

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={(visual === 'starlit-void' ? 0.35 : 0.2) + intensity * 0.65}
      />
    </>
  );
};

const VisualCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { currentVisual, currentFrequencies, masterVolume, currentBackgroundSounds } = useAppStore();
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Always show the visual canvas - starlit-void is the default background
  // If 'none' is selected, still show starlit-void as the default
  const displayVisual = currentVisual === 'none' ? 'starlit-void' : currentVisual;

  const visualIntensity = useMemo(() => {
    const activeFrequencies = Array.from(currentFrequencies.values()).filter((freq) => freq.enabled);
    const activeBackgroundSounds = Array.from(currentBackgroundSounds.values()).filter((sound) => sound.enabled);

    if (activeFrequencies.length === 0) {
      const base = 0.14 + masterVolume * 0.18;
      return clamp(base + activeBackgroundSounds.length * 0.04, 0.14, 0.7);
    }

    const frequencyScore = activeFrequencies.reduce((sum, activeFreq) => {
      const freq = getFrequencyById(activeFreq.frequencyId);
      const hz = freq?.frequency ?? 10;
      const hzWeight = clamp(Math.log10(hz + 1) / 2, 0.2, 1.2);
      return sum + activeFreq.volume * (0.45 + hzWeight * 0.75);
    }, 0) / activeFrequencies.length;

    const backgroundScore =
      activeBackgroundSounds.length > 0
        ? activeBackgroundSounds.reduce((sum, sound) => sum + sound.volume, 0) / activeBackgroundSounds.length
        : 0;

    const mixComplexityBoost = Math.min(0.35, activeFrequencies.length * 0.07);
    const computed =
      0.18 +
      masterVolume * 0.55 +
      frequencyScore * 0.65 +
      backgroundScore * 0.25 +
      mixComplexityBoost;

    return clamp(computed, 0.16, 1.45);
  }, [currentFrequencies, currentBackgroundSounds, masterVolume]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
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
          <VisualScene visual={displayVisual} intensity={visualIntensity} />
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
