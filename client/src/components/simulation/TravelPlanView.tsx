import React, { useState } from 'react';
import {
  Calendar,
  Sun,
  Sunset,
  Moon,
  Clock,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Download,
  Printer,
  BookmarkCheck,
  RefreshCw,
  Sparkles,
  Info
} from 'lucide-react';

interface TravelPlanViewProps {
  plan: any;
  destinationName: string;
  onSave?: () => void;
  onRegenerate?: () => void;
}

export const TravelPlanView: React.FC<TravelPlanViewProps> = ({
  plan,
  destinationName,
  onSave,
  onRegenerate,
}) => {
  const [saved, setSaved] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleSavePlan = () => {
    setSaved(true);
    if (onSave) onSave();
  };

  return (
    <div className="space-y-6">
      {/* Simulation Notice Disclaimer as per Prompt Specs */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3 text-xs text-amber-200">
        <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
        <span>
          <strong>Simulation estimate:</strong> All itineraries, timing calculations, and costs are projected based on simulated preferences and verified historical accessibility logs.
        </span>
      </div>

      {/* Plan Header Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-cyanAccent uppercase tracking-wider block mb-1">
            Personalized AI Itinerary Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {plan.title || `${destinationName} Tailored Journey`}
          </h2>
          <p className="text-xs text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
            {plan.summary}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              className="p-2.5 rounded-xl glass-button-secondary text-slate-300 hover:text-white"
              title="Regenerate Plan"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handlePrint}
            className="p-2.5 rounded-xl glass-button-secondary text-slate-300 hover:text-white"
            title="Print or Export Itinerary"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={handleSavePlan}
            disabled={saved}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              saved
                ? 'bg-tealAccent/20 text-tealAccent border border-tealAccent/30'
                : 'glass-button-primary shadow-glow-cyan'
            }`}
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>{saved ? 'Plan Saved to Trips' : 'Save Plan'}</span>
          </button>
        </div>
      </div>

      {/* Day by Day Cards */}
      <div className="space-y-6">
        {plan.days?.map((day: any) => (
          <div
            key={day.dayNumber}
            className="glass-card rounded-2xl border border-white/10 p-6 sm:p-7 space-y-5"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyanAccent/20 border border-cyanAccent/30 flex items-center justify-center text-cyanAccent font-mono font-bold">
                  D{day.dayNumber}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Day {day.dayNumber}: {day.theme}
                  </h3>
                  <span className="text-xs text-slate-400 font-sans">
                    Detailed morning, afternoon, and evening timeline
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Morning */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider font-mono">
                  <Sun className="w-4 h-4" />
                  <span>Morning Session</span>
                </div>
                <h4 className="text-xs font-bold text-white leading-snug">
                  {day.morning.activity}
                </h4>
                <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                  <MapPin className="w-3 h-3 text-cyanAccent" />
                  <span>{day.morning.place}</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-tealAccent" />
                  <span>{day.morning.duration}</span>
                </div>
                <p className="text-[11px] text-slate-300 pt-1 leading-relaxed border-t border-white/5">
                  {day.morning.notes}
                </p>
              </div>

              {/* Afternoon */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-skyAccent text-xs font-bold uppercase tracking-wider font-mono">
                  <Sunset className="w-4 h-4" />
                  <span>Afternoon Session</span>
                </div>
                <h4 className="text-xs font-bold text-white leading-snug">
                  {day.afternoon.activity}
                </h4>
                <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                  <MapPin className="w-3 h-3 text-cyanAccent" />
                  <span>{day.afternoon.place}</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-tealAccent" />
                  <span>{day.afternoon.duration}</span>
                </div>
                <p className="text-[11px] text-slate-300 pt-1 leading-relaxed border-t border-white/5">
                  {day.afternoon.notes}
                </p>
              </div>

              {/* Evening */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider font-mono">
                  <Moon className="w-4 h-4" />
                  <span>Evening Session</span>
                </div>
                <h4 className="text-xs font-bold text-white leading-snug">
                  {day.evening.activity}
                </h4>
                <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                  <MapPin className="w-3 h-3 text-cyanAccent" />
                  <span>{day.evening.place}</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-tealAccent" />
                  <span>{day.evening.duration}</span>
                </div>
                <p className="text-[11px] text-slate-300 pt-1 leading-relaxed border-t border-white/5">
                  {day.evening.notes}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Challenges & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase font-mono">
            <AlertTriangle className="w-4 h-4" />
            <span>Potential Challenges to Anticipate</span>
          </div>
          <ul className="space-y-2">
            {plan.potentialChallenges?.map((c: string, i: number) => (
              <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">•</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-tealAccent text-xs font-bold uppercase font-mono">
            <Sparkles className="w-4 h-4" />
            <span>AI Travel Director Tips</span>
          </div>
          <ul className="space-y-2">
            {plan.personalizedRecommendations?.map((r: string, i: number) => (
              <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="text-tealAccent mt-0.5">✓</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
