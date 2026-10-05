import React, { useState } from 'react';
import {
  Hotel,
  Car,
  Compass,
  Users2,
  CloudSun,
  Activity as ActivityIcon,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  ThermometerSun,
  Clock
} from 'lucide-react';

interface SimulationInteractiveStageProps {
  destinationName: string;
  simulationResults: any;
  onProceedToPlan: () => void;
}

export const SimulationInteractiveStage: React.FC<SimulationInteractiveStageProps> = ({
  destinationName,
  simulationResults,
  onProceedToPlan,
}) => {
  const [activeStage, setActiveStage] = useState<number>(0);
  const [simulatedCrowd, setSimulatedCrowd] = useState<number>(simulationResults.crowdScenario?.percentage || 42);
  const [weatherTimeOfDay, setWeatherTimeOfDay] = useState<'morning' | 'afternoon' | 'evening'>('morning');

  const stages = [
    { title: 'Hotel & Stay', icon: Hotel, color: 'text-skyAccent' },
    { title: 'Transit & Roads', icon: Car, color: 'text-tealAccent' },
    { title: 'Tourist Landmarks', icon: Compass, color: 'text-amber-400' },
    { title: 'Crowd Dynamics', icon: Users2, color: 'text-indigo-400' },
    { title: 'Weather Forecast', icon: CloudSun, color: 'text-cyanAccent' },
    { title: 'Activity Schedule', icon: ActivityIcon, color: 'text-emerald-400' },
  ];

  return (
    <div className="glass-panel rounded-3xl border border-white/10 p-6 sm:p-8 space-y-6">
      {/* Top stage stepper tabs */}
      <div className="flex items-center justify-between overflow-x-auto pb-3 border-b border-white/10 gap-2 no-scrollbar">
        {stages.map((stage, idx) => {
          const isActive = idx === activeStage;
          return (
            <button
              key={stage.title}
              onClick={() => setActiveStage(idx)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-cyanAccent/20 text-cyanAccent border border-cyanAccent/40 shadow-glow-cyan'
                  : 'glass-card border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <stage.icon className={`w-3.5 h-3.5 ${stage.color}`} />
              <span>
                0{idx + 1} {stage.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Stage Detail Panel */}
      <div className="min-h-[280px]">
        {/* Stage 0: Hotel */}
        {activeStage === 0 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-cyanAccent uppercase">
                  Stage 1: Accommodation Simulation
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  {simulationResults.hotelScenario?.name || `${destinationName} Heritage Boutique Resort`}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 font-mono">Estimated Cost</span>
                <p className="text-lg font-bold text-tealAccent-light font-mono">
                  ${simulationResults.hotelScenario?.costEstimate || 240} total
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {simulationResults.hotelScenario?.previewDescription ||
                'Verified calm sanctuary featuring step-free level entry, acoustic noise isolation, and scenic balcony sightlines.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl glass-card border-white/5">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Accessibility Score</span>
                <p className="text-base font-bold text-tealAccent font-mono mt-0.5">
                  {simulationResults.hotelScenario?.accessibilityScore || 92}/100
                </p>
                <span className="text-[10px] text-slate-400">Step-free ramp certified</span>
              </div>
              <div className="p-3.5 rounded-xl glass-card border-white/5">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Guest Comfort Rating</span>
                <p className="text-base font-bold text-amber-400 font-mono mt-0.5">
                  ⭐ {simulationResults.hotelScenario?.rating || 4.8} / 5.0
                </p>
                <span className="text-[10px] text-slate-400">Quiet sensory rooms available</span>
              </div>
              <div className="p-3.5 rounded-xl glass-card border-white/5">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Proximity to Sites</span>
                <p className="text-base font-bold text-skyAccent font-mono mt-0.5">
                  12 mins transit
                </p>
                <span className="text-[10px] text-slate-400">Low congestion corridor</span>
              </div>
            </div>
          </div>
        )}

        {/* Stage 1: Transit & Roads */}
        {activeStage === 1 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <span className="text-[11px] font-mono text-tealAccent uppercase">
                Stage 2: Transit & Roadway Simulation
              </span>
              <h3 className="text-xl font-bold text-white mt-0.5">
                {simulationResults.transportScenario?.mode || 'Flight + Scenic Mountain Cab'}
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {simulationResults.transportScenario?.accessibilityNotes ||
                'Transit routes feature climate-controlled low-vibration vehicles with wide doors and step-assist boarding.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl glass-card border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Average Transit Duration:</span>
                  <span className="font-mono text-white font-semibold">
                    {simulationResults.transportScenario?.travelTimeHours || 3.5} hours
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Scenic Rating:</span>
                  <span className="font-mono text-amber-400 font-semibold">
                    ⭐ {simulationResults.transportScenario?.scenicRating || 4.9} / 5
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Rest Stop Intervals:</span>
                  <span className="font-mono text-tealAccent font-semibold">Every 45 mins</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-tealAccent/10 border border-tealAccent/20 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-tealAccent text-xs font-semibold mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Vestibular Motion Protection</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Smooth virtual simulation tested: road gradients do not exceed 6% incline on primary traveler paths.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stage 2: Tourist Landmarks */}
        {activeStage === 2 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <span className="text-[11px] font-mono text-amber-400 uppercase">
                Stage 3: Landmark Access & Sightseeing
              </span>
              <h3 className="text-xl font-bold text-white mt-0.5">
                Key Scenic Attractions at {destinationName}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(simulationResults.touristPlaceScenario?.highlights || ['Dal Lake', 'Gulmarg Meadow', 'Shalimar Gardens']).map((item: string, idx: number) => (
                <div key={idx} className="p-4 rounded-xl glass-card border-white/5 space-y-2">
                  <span className="text-[10px] font-mono text-cyanAccent uppercase">Landmark 0{idx + 1}</span>
                  <h4 className="text-sm font-bold text-white">{item}</h4>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-tealAccent" />
                    <span>Best: {simulationResults.touristPlaceScenario?.bestTimeOfDay || '08:00 AM - 10:30 AM'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stage 3: Crowd Dynamics (Interactive) */}
        {activeStage === 3 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-indigo-400 uppercase">
                  Stage 4: Dynamic Crowd Scenario Simulator
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  Density Impact: {simulatedCrowd < 30 ? 'Low (Tranquil)' : simulatedCrowd < 65 ? 'Moderate (Comfortable)' : 'Peak (Busy)'}
                </h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                simulatedCrowd < 30 ? 'bg-emerald-500/20 text-emerald-300' : simulatedCrowd < 65 ? 'bg-sky-500/20 text-sky-300' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {simulatedCrowd}% Capacity
              </span>
            </div>

            {/* Interactive Slider */}
            <div className="p-4 rounded-xl glass-card border-white/10 space-y-2">
              <label className="flex items-center justify-between text-xs text-slate-300 font-medium">
                <span>Adjust Simulated Visitor Volume:</span>
                <span className="font-mono text-cyanAccent">{simulatedCrowd}% Occupancy</span>
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={simulatedCrowd}
                onChange={(e) => setSimulatedCrowd(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyanAccent"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Serene Morning (10%)</span>
                <span>Standard Afternoon (50%)</span>
                <span>Holiday Peak (100%)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-cyanAccent/10 border border-cyanAccent/20 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-cyanAccent flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-200 leading-relaxed">
                {simulatedCrowd > 60
                  ? 'AI Recommendation: Schedule monument tours during early dawn (7:30 AM) to avoid dense queues and secure quiet photo viewpoints.'
                  : 'AI Recommendation: Optimal serenity projected! Paved walkways and observation decks will have minimal wait times.'}
              </p>
            </div>
          </div>
        )}

        {/* Stage 4: Weather Forecast */}
        {activeStage === 4 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-cyanAccent uppercase">
                  Stage 5: Microclimate & Thermal Scenario
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  {simulationResults.weatherScenario?.forecast || 'Crisp & Serene Alpine Atmosphere'}
                </h3>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-sm font-bold">
                <ThermometerSun className="w-4 h-4" />
                <span>{simulationResults.weatherScenario?.tempCelsius || 18}°C</span>
              </div>
            </div>

            {/* Time of day toggle */}
            <div className="flex gap-2">
              {(['morning', 'afternoon', 'evening'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setWeatherTimeOfDay(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs capitalize transition-all ${
                    weatherTimeOfDay === t
                      ? 'bg-cyanAccent/20 text-cyanAccent border border-cyanAccent/40'
                      : 'glass-card text-slate-400 hover:text-white'
                  }`}
                >
                  {t} Simulation
                </button>
              ))}
            </div>

            <div className="p-4 rounded-xl glass-card border-white/5 space-y-2">
              <span className="text-xs font-semibold text-white block">Recommended Packing Protocol:</span>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-300">
                {(simulationResults.weatherScenario?.packingTips || ['Thermal fleece layer', 'Walking boots', 'UV sunglasses']).map((tip: string, i: number) => (
                  <li key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                    <CheckCircle className="w-3.5 h-3.5 text-tealAccent" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Stage 5: Activity Schedule */}
        {activeStage === 5 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <span className="text-[11px] font-mono text-emerald-400 uppercase">
                Stage 6: Activity Feasibility Review
              </span>
              <h3 className="text-xl font-bold text-white mt-0.5">
                Pacing & Energy Balance
              </h3>
            </div>

            <div className="space-y-2.5">
              {(simulationResults.activitiesScenario || [
                { title: 'Shikara Sunset Cruise', estimatedTime: '1.5 hrs', budgetImpact: 'Complimentary / Included' },
                { title: 'Mughal Terraced Garden Walk', estimatedTime: '2 hrs', budgetImpact: 'Entry pass verified' },
                { title: 'Artisan Pashmina Workshop', estimatedTime: '1 hr', budgetImpact: 'Complimentary demonstration' },
              ]).map((act: any, i: number) => (
                <div key={i} className="p-3.5 rounded-xl glass-card border-white/5 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">{act.title}</h4>
                    <span className="text-[11px] text-slate-400 font-mono">Estimated: {act.estimatedTime}</span>
                  </div>
                  <span className="text-[11px] font-mono text-tealAccent bg-tealAccent/10 px-2.5 py-1 rounded-full">
                    {act.budgetImpact}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stepper Footer Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <button
          disabled={activeStage === 0}
          onClick={() => setActiveStage((prev) => Math.max(0, prev - 1))}
          className="px-4 py-2 glass-button-secondary rounded-xl text-xs font-semibold disabled:opacity-30"
        >
          Previous Stage
        </button>

        {activeStage < stages.length - 1 ? (
          <button
            onClick={() => setActiveStage((prev) => Math.min(stages.length - 1, prev + 1))}
            className="px-5 py-2.5 glass-button-primary rounded-xl text-xs font-bold shadow-glow-cyan"
          >
            Next Simulation Stage →
          </button>
        ) : (
          <button
            onClick={onProceedToPlan}
            className="px-6 py-2.5 glass-button-primary rounded-xl text-xs font-bold shadow-glow-teal flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Review Full AI Travel Plan</span>
          </button>
        )}
      </div>
    </div>
  );
};
