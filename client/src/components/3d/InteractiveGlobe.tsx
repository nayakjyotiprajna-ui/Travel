import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Compass, Eye, Sliders, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Pin {
  id: string;
  name: string;
  state: string;
  category: string;
  lat: number;
  lng: number;
  image: string;
  description: string;
}

const pinsData: Pin[] = [
  {
    id: 'kashmir',
    name: 'Kashmir',
    state: 'Jammu & Kashmir',
    category: 'Mountains',
    lat: 34.08,
    lng: 74.8,
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=600&q=80',
    description: 'Paradise on Earth: Mirror-still Dal Lake, floating markets, and alpine pine solace.',
  },
  {
    id: 'goa',
    name: 'Goa',
    state: 'Goa',
    category: 'Beaches',
    lat: 15.3,
    lng: 74.12,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
    description: 'Golden sandy shores, Portuguese Latin quarters, and serene coastal susegad.',
  },
  {
    id: 'konark',
    name: 'Konark',
    state: 'Odisha',
    category: 'Heritage',
    lat: 19.89,
    lng: 86.09,
    image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=600&q=80',
    description: 'UNESCO Sun Temple chariot, astronomical sundials, and classical Odissi heritage.',
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    state: 'Rajasthan',
    category: 'Heritage',
    lat: 26.91,
    lng: 75.79,
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80',
    description: 'Hilltop palaces, Thar desert dunes, mirrored Sheesh Mahal, and royal folklore.',
  },
  {
    id: 'kerala',
    name: 'Kerala',
    state: 'Kerala',
    category: 'Nature',
    lat: 9.93,
    lng: 76.27,
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80',
    description: 'Emerald backwaters, thatched kettuvallam houseboats, and Ayurvedic spice hills.',
  },
  {
    id: 'ladakh',
    name: 'Ladakh',
    state: 'Ladakh',
    category: 'Adventure',
    lat: 34.15,
    lng: 77.58,
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80',
    description: 'High-altitude cold desert, cobalt Pangong Lake, and cliffside monasteries.',
  },
];

// Helper to convert Lat/Lng to Vector3 on sphere
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

// 3D Globe Mesh & Atmosphere
const GlobeMesh: React.FC<{
  onSelectPin: (pin: Pin) => void;
  selectedPinId: string | null;
}> = ({ onSelectPin, selectedPinId }) => {
  const { settings } = useAccessibility();
  const globeGroupRef = useRef<THREE.Group>(null);
  const radius = 2.4;

  // Gentle rotation if lowMotion is not enabled
  useFrame((_, delta) => {
    if (globeGroupRef.current && !settings.lowMotion) {
      globeGroupRef.current.rotation.y += delta * 0.08;
    }
  });

  // Procedural canvas texture for continents and grid
  const globeTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Ocean gradient
      const grad = ctx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, '#0a1636');
      grad.addColorStop(0.5, '#0e2352');
      grad.addColorStop(1, '#071026');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 512);

      // Lat / Long grid lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 1024; i += 64) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 512);
        ctx.stroke();
      }
      for (let j = 0; j <= 512; j += 64) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(1024, j);
        ctx.stroke();
      }

      // Stylized landmass dots
      ctx.fillStyle = '#14b8a6';
      for (let k = 0; k < 600; k++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        const r = Math.random() * 2 + 1;
        ctx.globalAlpha = Math.random() * 0.4 + 0.1;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <group ref={globeGroupRef}>
      {/* Main Earth Sphere */}
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          map={globeTexture}
          roughness={0.65}
          metalness={0.2}
          color="#15264f"
          emissive="#061c3d"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Atmospheric Glow Sphere */}
      <mesh>
        <sphereGeometry args={[radius * 1.025, 32, 32]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Destination Markers */}
      {pinsData.map((pin) => {
        const pos = latLngToVector3(pin.lat, pin.lng, radius * 1.02);
        const isSelected = selectedPinId === pin.id;

        return (
          <group key={pin.id} position={pos}>
            {/* 3D Pin Beacon */}
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                onSelectPin(pin);
              }}
            >
              <sphereGeometry args={[isSelected ? 0.09 : 0.06, 16, 16]} />
              <meshBasicMaterial color={isSelected ? '#f59e0b' : '#06b6d4'} />
            </mesh>

            {/* Glowing Ring around Marker */}
            <mesh>
              <ringGeometry args={[0.07, 0.11, 24]} />
              <meshBasicMaterial
                color={isSelected ? '#fbbf24' : '#14b8a6'}
                transparent
                opacity={0.7}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Floating 3D label */}
            <Html distanceFactor={8} position={[0, 0.16, 0]} center>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPin(pin);
                }}
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono whitespace-nowrap transition-all shadow-md flex items-center gap-1 ${
                  isSelected
                    ? 'bg-amber-500 text-black font-bold ring-2 ring-white scale-110'
                    : 'bg-navy-900/90 text-cyanAccent-light border border-cyanAccent/40 hover:bg-cyanAccent/20'
                }`}
              >
                <MapPin className="w-2.5 h-2.5" />
                {pin.name}
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
};

export const InteractiveGlobe: React.FC<{ onSelectDestination?: (name: string) => void }> = ({
  onSelectDestination,
}) => {
  const [selectedPin, setSelectedPin] = useState<Pin | null>(pinsData[0]);

  const handlePinSelect = (pin: Pin) => {
    setSelectedPin(pin);
    if (onSelectDestination) {
      onSelectDestination(pin.name);
    }
  };

  return (
    <div className="relative w-full h-[460px] sm:h-[540px] lg:h-[600px] rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl flex items-center justify-center">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 1.2, 5.5], fov: 45 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 3, 5]} intensity={2.2} color="#ffffff" />
        <pointLight position={[-5, -3, -5]} intensity={0.6} color="#06b6d4" />

        <GlobeMesh onSelectPin={handlePinSelect} selectedPinId={selectedPin?.id || null} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.5}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI - Math.PI / 4}
        />
      </Canvas>

      {/* Floating Active Destination Card Overlay */}
      {selectedPin && (
        <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-sm glass-panel p-4 rounded-2xl border border-cyanAccent/30 shadow-glass animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-3">
            <img
              src={selectedPin.image}
              alt={selectedPin.name}
              className="w-16 h-16 rounded-xl object-cover border border-cyanAccent/30 flex-shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyanAccent/10 text-cyanAccent border border-cyanAccent/20">
                  {selectedPin.category}
                </span>
                <span className="text-[11px] text-slate-400 font-sans">{selectedPin.state}</span>
              </div>
              <h4 className="text-base font-bold text-white tracking-tight mt-0.5 truncate">
                {selectedPin.name}
              </h4>
              <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5">
                {selectedPin.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/10">
            <Link
              to={`/virtual-visit?destination=${encodeURIComponent(selectedPin.name)}`}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl glass-button-primary text-xs font-semibold text-center"
            >
              <Eye className="w-3.5 h-3.5" />
              Virtual Visit
            </Link>
            <Link
              to={`/simulate?destination=${encodeURIComponent(selectedPin.name)}`}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl glass-button-secondary text-xs font-medium text-center"
            >
              <Sliders className="w-3.5 h-3.5 text-cyanAccent" />
              Simulate Trip
            </Link>
          </div>
        </div>
      )}

      {/* Hint Badge */}
      <div className="absolute top-4 right-4 bg-navy-950/70 border border-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] text-slate-300 flex items-center gap-1.5 pointer-events-none font-mono">
        <Compass className="w-3.5 h-3.5 text-tealAccent animate-spin-slow" />
        <span>Click pins or drag to rotate</span>
      </div>
    </div>
  );
};
