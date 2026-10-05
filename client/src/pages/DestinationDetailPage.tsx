import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { destinationApi } from '../services/api';
import type { Destination } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorState } from '../components/common/ErrorState';
import { AiGuideDrawer } from '../components/experience/AiGuideDrawer';
import {
  Eye,
  Sliders,
  Sparkles,
  BookmarkCheck,
  Check,
  MapPin,
  Utensils,
  Compass,
  Calendar,
  Accessibility as AccessibilityIcon,
  ShieldCheck,
  Bot
} from 'lucide-react';

export const DestinationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await destinationApi.getById(id);
        if (res.data.success) {
          setDestination(res.data.destination);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <LoadingSpinner label="Retrieving high-fidelity destination data..." />;
  if (error || !destination) return <ErrorState title="Destination Not Found" onRetry={() => window.location.reload()} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Banner */}
      <div className="relative h-[380px] sm:h-[460px] rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl">
        <img
          src={destination.bannerImage}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-black/30" />

        <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyanAccent/20 text-cyanAccent border border-cyanAccent/30 backdrop-blur-md">
                {destination.category}
              </span>
              <span className="text-xs text-slate-300 font-mono flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-tealAccent" />
                {destination.state}, {destination.country}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              {destination.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-sans">
              {destination.shortDescription}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={`/virtual-visit?destination=${encodeURIComponent(destination.name)}`}
              className="px-6 py-3 rounded-xl glass-button-primary text-xs font-bold flex items-center gap-2 shadow-glow-cyan"
            >
              <Eye className="w-4 h-4" />
              <span>Start Virtual Visit</span>
            </Link>

            <Link
              to={`/simulate?destination=${encodeURIComponent(destination.name)}`}
              className="px-6 py-3 rounded-xl glass-button-secondary text-xs font-semibold flex items-center gap-2 hover:border-cyanAccent"
            >
              <Sliders className="w-4 h-4 text-cyanAccent" />
              <span>Simulate Trip</span>
            </Link>

            <button
              onClick={() => setIsGuideOpen(true)}
              className="p-3 rounded-xl glass-button-secondary text-cyanAccent hover:text-white"
              title="Ask AI Guide"
            >
              <Bot className="w-4 h-4" />
            </button>

            <button
              onClick={() => setSaved(!saved)}
              className={`p-3 rounded-xl transition-all ${
                saved ? 'bg-tealAccent/20 text-tealAccent border border-tealAccent/30' : 'glass-button-secondary text-slate-400'
              }`}
              title="Save Destination"
            >
              {saved ? <Check className="w-4 h-4" /> : <BookmarkCheck className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Overview, Attractions, Culture, Cuisine */}
        <div className="lg:col-span-2 space-y-10">
          {/* Overview */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyanAccent" />
              About {destination.name}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              {destination.description}
            </p>
          </div>

          {/* Key Attractions */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-tealAccent" />
              Signature Landmarks & Scenic Points
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {destination.attractions?.map((a, i) => (
                <div key={i} className="glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between">
                  <div className="h-36 overflow-hidden">
                    <img
                      src={a.image || destination.bannerImage}
                      alt={a.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-1.5">
                    <h4 className="text-xs font-bold text-white">{a.name}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-3 leading-snug">{a.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Culture & Heritage */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Living Culture & Etiquette
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-white/5 space-y-1">
                <span className="font-mono text-cyanAccent font-semibold block">Traditions:</span>
                <p className="text-slate-300 leading-relaxed">{destination.culture?.traditions}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 space-y-1">
                <span className="font-mono text-tealAccent font-semibold block">Visiting Etiquette:</span>
                <p className="text-slate-300 leading-relaxed">{destination.culture?.etiquette}</p>
              </div>
            </div>
          </div>

          {/* Iconic Cuisine */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Utensils className="w-5 h-5 text-orange-400" />
              Iconic Culinary Heritage
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {destination.food?.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl glass-card border-white/5 flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">{item.description}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono flex-shrink-0 ${
                    item.veg ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {item.veg ? 'Vegetarian' : 'Regional'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Accessibility Information & Simulation Defaults */}
        <div className="space-y-6">
          {/* Accessibility Specs Card */}
          <div className="glass-panel p-6 rounded-3xl border border-tealAccent/30 shadow-glass space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
              <AccessibilityIcon className="w-5 h-5 text-tealAccent" />
              <h3 className="text-base font-bold text-white">Accessibility & Comfort Specs</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5 font-mono">
                <span className="text-slate-400">Step-Free / Ramp Access:</span>
                <span className={destination.accessibility?.wheelchairAccessible ? 'text-tealAccent font-bold' : 'text-amber-400'}>
                  {destination.accessibility?.wheelchairAccessible ? 'Verified Accessible' : 'Partial Assistance'}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-white/5 font-mono">
                <span className="text-slate-400">Mobility Ease Rating:</span>
                <span className="text-cyanAccent font-bold">{destination.accessibility?.mobilityRating || 4} / 5</span>
              </div>

              <div className="flex justify-between py-1 border-b border-white/5 font-mono">
                <span className="text-slate-400">Terrain Level:</span>
                <span className="text-white font-bold">{destination.accessibility?.terrainDifficulty || 'Moderate'}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-white/5 font-mono">
                <span className="text-slate-400">Audio Narration:</span>
                <span className="text-tealAccent font-bold">Enabled & Captioned</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-tealAccent/10 border border-tealAccent/20">
              <span className="text-[11px] font-mono text-tealAccent block font-semibold mb-1">
                Virtual Accessibility Note:
              </span>
              <ul className="space-y-1 text-[11px] text-slate-300">
                {destination.accessibility?.notes?.map((n, i) => (
                  <li key={i}>• {n}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Simulation Planning Specs */}
          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyanAccent" />
              Travel Simulation Metrics
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between font-mono">
                <span className="text-slate-400">Best Season:</span>
                <span className="text-white font-semibold">{destination.simulationDefaults?.bestSeason}</span>
              </div>

              <div className="flex justify-between font-mono">
                <span className="text-slate-400">Avg Daily Hotel:</span>
                <span className="text-tealAccent font-semibold font-mono">${destination.simulationDefaults?.avgHotelPrice} / night</span>
              </div>

              <div className="flex justify-between font-mono">
                <span className="text-slate-400">Avg Daily Budget:</span>
                <span className="text-skyAccent font-semibold font-mono">${destination.simulationDefaults?.avgDailyBudget} / day</span>
              </div>
            </div>

            <Link
              to={`/simulate?destination=${encodeURIComponent(destination.name)}`}
              className="w-full py-2.5 glass-button-primary rounded-xl text-xs font-bold text-center block shadow-glow-cyan"
            >
              Simulate Real Journey
            </Link>
          </div>
        </div>
      </div>

      {/* AI Guide Drawer */}
      <AiGuideDrawer
        destinationName={destination.name}
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        audioGuideEnabled={destination.accessibility?.audioSupportAvailable}
      />
    </div>
  );
};
