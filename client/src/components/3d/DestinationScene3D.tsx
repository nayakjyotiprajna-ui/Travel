import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Destination, Attraction } from '../../types';
import { MapPin, Info, Sparkles } from 'lucide-react';

interface DestinationScene3DProps {
  destination: Destination;
  activeAttractionIndex: number;
  onSelectAttraction: (index: number) => void;
  lowMotion?: boolean;
}

const LandmarkHotspot: React.FC<{
  attraction: Attraction;
  index: number;
  isActive: boolean;
  onSelect: () => void;
}> = ({ attraction, index, isActive, onSelect }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const pos = attraction.hotspotPosition || [index * 3 - 3, 1.2, -index * 1.5 - 2];

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = pos[1] + Math.sin(clock.getElapsedTime() * 2 + index) * 0.12;
    }
  });

  return (
    <group position={pos as [number, number, number]}>
      {/* 3D Floating Beacon */}
      <mesh ref={meshRef} onClick={onSelect}>
        <octahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial
          color={isActive ? '#f59e0b' : '#06b6d4'}
          emissive={isActive ? '#d97706' : '#0891b2'}
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Pulsing Base Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.9, 0]}>
        <ringGeometry args={[0.4, 0.6, 32]} />
        <meshBasicMaterial
          color={isActive ? '#fbbf24' : '#14b8a6'}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Floating 3D HTML Overlay Pin */}
      <Html distanceFactor={10} position={[0, 0.8, 0]} center>
        <button
          onClick={onSelect}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap shadow-glass transition-all ${
            isActive
              ? 'bg-amber-500 text-black ring-2 ring-white scale-110'
              : 'bg-navy-900/90 text-cyanAccent-light border border-cyanAccent/40 hover:bg-cyanAccent/20'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>{attraction.name}</span>
        </button>
      </Html>
    </group>
  );
};

// Procedural 3D Environment Ground & Horizon
const ScenicEnvironment: React.FC<{ category: string }> = ({ category }) => {
  const groundColor =
    category === 'Mountains'
      ? '#1e293b' // Mountain slate
      : category === 'Beaches'
      ? '#d4a373' // Warm sandy
      : category === 'Heritage'
      ? '#b08968' // Ancient stone
      : '#134e4a'; // Emerald grove

  return (
    <group>
      {/* Ground Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 80, 40, 40]} />
        <meshStandardMaterial
          color={groundColor}
          roughness={0.8}
          metalness={0.1}
          wireframe={false}
        />
      </mesh>

      {/* Water Mirror Plane for Lakes / Beaches */}
      {(category === 'Mountains' || category === 'Beaches' || category === 'Nature') && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
          <planeGeometry args={[70, 70]} />
          <meshStandardMaterial
            color="#083344"
            roughness={0.1}
            metalness={0.9}
            transparent
            opacity={0.65}
          />
        </mesh>
      )}

      {/* Distant Mountain Peaks or Monolithic Pillars */}
      {category === 'Mountains' && (
        <group>
          <mesh position={[-15, 6, -30]}>
            <coneGeometry args={[14, 18, 5]} />
            <meshStandardMaterial color="#334155" roughness={0.9} />
          </mesh>
          <mesh position={[12, 7, -35]}>
            <coneGeometry args={[16, 22, 6]} />
            <meshStandardMaterial color="#475569" roughness={0.9} />
          </mesh>
          <mesh position={[0, 5, -28]}>
            <coneGeometry args={[10, 14, 5]} />
            <meshStandardMaterial color="#1e293b" roughness={0.9} />
          </mesh>
        </group>
      )}

      {/* Distant Temple Towers or Pillars for Heritage */}
      {category === 'Heritage' && (
        <group>
          <mesh position={[-10, 4, -20]}>
            <cylinderGeometry args={[1.5, 2.5, 10, 8]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} />
          </mesh>
          <mesh position={[10, 5, -22]}>
            <cylinderGeometry args={[2, 3, 12, 8]} />
            <meshStandardMaterial color="#92400e" roughness={0.8} />
          </mesh>
        </group>
      )}
    </group>
  );
};

export const DestinationScene3D: React.FC<DestinationScene3DProps> = ({
  destination,
  activeAttractionIndex,
  onSelectAttraction,
  lowMotion = false,
}) => {
  return (
    <div className="relative w-full h-full bg-navy-950 overflow-hidden">
      <Canvas
        camera={{ position: [0, 2.2, 6], fov: 50 }}
        shadows
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.9} />
        <directionalLight
          position={[10, 15, 10]}
          intensity={1.8}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          color="#fef08a"
        />
        <pointLight position={[0, 4, -5]} intensity={1.2} color="#06b6d4" />

        {/* Fog for depth and gentle atmosphere */}
        <fog attach="fog" args={['#070c1b', 12, 45]} />

        {/* Scenic Procedural 3D Environment */}
        <ScenicEnvironment category={destination.category} />

        {/* Hotspots */}
        {destination.attractions.map((attraction, idx) => (
          <LandmarkHotspot
            key={attraction.name + idx}
            attraction={attraction}
            index={idx}
            isActive={idx === activeAttractionIndex}
            onSelect={() => onSelectAttraction(idx)}
          />
        ))}

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          maxDistance={14}
          minDistance={2}
          maxPolarAngle={Math.PI / 2 - 0.05} // Keep camera above ground
          minPolarAngle={0.2}
          autoRotate={!lowMotion}
          autoRotateSpeed={0.4}
        />
      </Canvas>
    </div>
  );
};
