import React from 'react';
import type { Attraction } from '../../types';
import { MapPin, Navigation } from 'lucide-react';

interface MiniMapProps {
  attractions: Attraction[];
  activeIndex: number;
  onSelect: (index: number) => void;
  destinationName: string;
}

export const MiniMap: React.FC<MiniMapProps> = ({
  attractions,
  activeIndex,
  onSelect,
  destinationName,
}) => {
  return (
    <div className="glass-panel p-3 rounded-2xl border border-cyanAccent/30 shadow-glass w-64 max-w-full">
      <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
        <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
          <Navigation className="w-3.5 h-3.5 text-cyanAccent" />
          Radar: {destinationName}
        </span>
        <span className="text-[10px] font-mono text-tealAccent">Live GPS</span>
      </div>

      {/* Radar Grid View */}
      <div className="relative w-full h-36 bg-navy-950/80 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center">
        {/* Radar concentric circles */}
        <div className="absolute w-28 h-28 rounded-full border border-cyanAccent/15" />
        <div className="absolute w-20 h-20 rounded-full border border-cyanAccent/20" />
        <div className="absolute w-10 h-10 rounded-full border border-cyanAccent/25" />
        <div className="absolute w-full h-[1px] bg-cyanAccent/10" />
        <div className="absolute h-full w-[1px] bg-cyanAccent/10" />

        {/* Player Center Marker */}
        <div className="absolute w-3 h-3 rounded-full bg-cyanAccent shadow-glow-cyan flex items-center justify-center animate-ping" />
        <div className="absolute w-2.5 h-2.5 rounded-full bg-white z-10" />

        {/* Attraction dots */}
        {attractions.map((attraction, idx) => {
          // Calculate stylized offsets around center
          const angle = (idx / attractions.length) * Math.PI * 2;
          const radius = 42;
          const left = 50 + (Math.cos(angle) * radius);
          const top = 50 + (Math.sin(angle) * radius);
          const isActive = idx === activeIndex;

          return (
            <button
              key={attraction.name + idx}
              onClick={() => onSelect(idx)}
              style={{ left: `${left}%`, top: `${top}%` }}
              title={attraction.name}
              className={`absolute -translate-x-1/2 -translate-y-1/2 p-1 rounded-full transition-transform ${
                isActive
                  ? 'bg-amber-500 text-black scale-125 z-20 shadow-glow-teal ring-2 ring-white'
                  : 'bg-tealAccent/80 text-white hover:scale-110 z-10'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-current" />
            </button>
          );
        })}
      </div>

      {/* Current location label */}
      <div className="mt-2 text-[11px] text-slate-300 truncate flex items-center gap-1 font-mono">
        <MapPin className="w-3 h-3 text-amber-400 flex-shrink-0" />
        <span className="truncate">{attractions[activeIndex]?.name || destinationName}</span>
      </div>
    </div>
  );
};
