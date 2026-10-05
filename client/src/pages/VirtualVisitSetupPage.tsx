import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { destinationApi, aiApi, journeyApi } from '../services/api';
import type { Destination } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useAccessibility } from '../context/AccessibilityContext';
import {
  Compass,
  Sparkles,
  HeartHandshake,
  ArrowRight,
  CheckCircle2,
  Zap,
  Volume2,
  FileText,
  Smile,
  Accessibility as AccessibilityIcon,
  Eye,
  Loader2
} from 'lucide-react';

export const VirtualVisitSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialDestination = searchParams.get('destination');
  const { settings, updateSetting } = useAccessibility();

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  // Experience Mood
  const [experienceMood, setExperienceMood] = useState<string>('Peaceful');

  // Comfort Mode
  const [comfortMode, setComfortMode] = useState<string>('Standard');

  // Starting journey loader
  const [isLaunching, setIsLaunching] = useState(false);

  const moodOptions = [
    { label: 'Peaceful', icon: '🌿', desc: 'Tranquil sightlines, gentle soundscapes, zero sensory rush' },
    { label: 'Adventure', icon: '🏔️', desc: 'Expansive vistas, mountain passes, and exploratory quests' },
    { label: 'Culture', icon: '🏛️', desc: 'Deep dive into heritage, architecture, and folklore' },
    { label: 'Photography', icon: '📸', desc: 'Framed golden hour lighting and high-res vantage points' },
    { label: 'Family', icon: '👨‍👩‍👧', desc: 'Engaging, accessible, and delightful for all generations' },
    { label: 'Nature', icon: '🌊', desc: 'Immerse in pristine water, lush groves, and wildlife' },
  ];

  const comfortOptions = [
    { id: 'Standard', name: 'Standard Mode', desc: 'Full dynamic 3D camera controls and visual effects', icon: Zap },
    { id: 'Low Motion', name: 'Low Motion & Vestibular', desc: 'Zero sudden camera turns, eliminates virtual motion sickness', icon: HeartHandshake },
    { id: 'Audio Guided', name: 'Audio Guided Journey', desc: 'Spoken AI narration accompanies every landmark', icon: Volume2 },
    { id: 'Text Guided', name: 'Text Guided Journey', desc: 'Synchronized visual caption cards and high-contrast transcripts', icon: FileText },
    { id: 'Senior Friendly', name: 'Senior Friendly Simplicity', desc: 'Large high-contrast controls, serene pacing', icon: Smile },
    { id: 'Mobility Friendly', name: 'Mobility & Step-Free', desc: 'Focuses strictly on level pathways and accessible viewpoints', icon: AccessibilityIcon },
  ];

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await destinationApi.getAll();
        if (res.data.success) {
          setDestinations(res.data.destinations);
          if (initialDestination) {
            const found = res.data.destinations.find(
              (d) => d.name.toLowerCase() === initialDestination.toLowerCase()
            );
            if (found) setSelectedDestination(found);
          } else if (res.data.destinations.length > 0) {
            setSelectedDestination(res.data.destinations[0]);
          }
        }
      } catch (err) {
        console.warn('Error loading destinations for visit setup');
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, [initialDestination]);

  const handleLaunchExperience = async () => {
    if (!selectedDestination) return;
    setIsLaunching(true);

    try {
      // Sync accessibility comfort mode setting
      if (comfortMode === 'Low Motion') updateSetting('lowMotion', true);
      if (comfortMode === 'Audio Guided') updateSetting('audioGuide', true);
      if (comfortMode === 'Text Guided') updateSetting('textGuide', true);
      if (comfortMode === 'Senior Friendly') updateSetting('seniorFriendly', true);
      if (comfortMode === 'Mobility Friendly') updateSetting('mobilityFriendly', true);

      // Call AI Travel Director to generate personalized itinerary
      await aiApi.travelTwinDirector({
        destination: selectedDestination.name,
        mood: experienceMood.toLowerCase(),
        preferences: [experienceMood, selectedDestination.category],
        comfortMode,
      });

      // Start Journey record in database
      const journeyRes = await journeyApi.start({
        destinationId: selectedDestination._id,
        mode: 'virtual',
        preferences: [experienceMood],
        comfortMode,
      });

      const journeyId = journeyRes.data.journey._id;
      navigate(`/experience/${selectedDestination._id}?journeyId=${journeyId}&mood=${encodeURIComponent(experienceMood)}&comfort=${encodeURIComponent(comfortMode)}`);
    } catch (err) {
      // Even if offline/unauthenticated, navigate cleanly to 3D experience
      navigate(`/experience/${selectedDestination._id}?mood=${encodeURIComponent(experienceMood)}&comfort=${encodeURIComponent(comfortMode)}`);
    } finally {
      setIsLaunching(false);
    }
  };

  if (loading) return <LoadingSpinner label="Preparing Virtual Visit Portal..." />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-xs font-mono font-bold tracking-widest text-tealAccent uppercase">
          Mode 01 • Virtual Immersion
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Where would you like to travel?
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
          Select your destination, customize your experience style, and configure your sensory comfort mode.
        </p>
      </div>

      {/* Step 1: Destination Selection */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-cyanAccent font-mono flex items-center gap-2">
          <span>01</span> Destination Selection
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          {destinations.map((dest) => {
            const isSelected = selectedDestination?._id === dest._id;
            return (
              <button
                key={dest._id}
                onClick={() => setSelectedDestination(dest)}
                className={`relative rounded-2xl overflow-hidden text-left p-3 border transition-all flex flex-col justify-end min-h-[140px] ${
                  isSelected
                    ? 'border-cyanAccent shadow-glow-cyan ring-2 ring-cyanAccent/50'
                    : 'border-white/10 glass-card hover:border-white/30'
                }`}
              >
                <img
                  src={dest.bannerImage}
                  alt={dest.name}
                  className="absolute inset-0 w-full h-full object-cover -z-10"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-black/30 -z-10" />

                <div className="flex items-center justify-between w-full">
                  <div>
                    <h3 className="text-sm font-bold text-white">{dest.name}</h3>
                    <span className="text-[10px] text-tealAccent font-mono">{dest.category}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-cyanAccent" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: How do you want to experience it? */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-tealAccent font-mono flex items-center gap-2">
          <span>02</span> How do you want to experience it?
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {moodOptions.map((mood) => {
            const isSelected = experienceMood === mood.label;
            return (
              <button
                key={mood.label}
                onClick={() => setExperienceMood(mood.label)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-tealAccent/15 border-tealAccent shadow-glow-teal'
                    : 'glass-card border-white/5 hover:border-white/20'
                }`}
              >
                <span className="text-2xl block mb-2">{mood.icon}</span>
                <h3 className="text-sm font-bold text-white">{mood.label}</h3>
                <p className="text-[11px] text-slate-300 mt-1 leading-snug">{mood.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3: Comfort Mode */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-skyAccent font-mono flex items-center gap-2">
            <span>03</span> Accessibility & Comfort Mode
          </h2>
          <span className="text-xs text-slate-400 font-mono">Sensory Calibration</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {comfortOptions.map((opt) => {
            const isSelected = comfortMode === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setComfortMode(opt.id)}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                  isSelected
                    ? 'bg-cyanAccent/15 border-cyanAccent shadow-glow-cyan'
                    : 'glass-card border-white/5 hover:border-white/20'
                }`}
              >
                <div className={`p-2 rounded-xl bg-white/5 mt-0.5 ${isSelected ? 'text-cyanAccent' : 'text-slate-400'}`}>
                  <opt.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">{opt.name}</h3>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{opt.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Launch CTA */}
      <div className="pt-4">
        <button
          onClick={handleLaunchExperience}
          disabled={!selectedDestination || isLaunching}
          className="w-full py-4 glass-button-primary rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-glow-cyan disabled:opacity-50"
        >
          {isLaunching ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>AI Travel Director Preparing 3D Environment...</span>
            </>
          ) : (
            <>
              <Eye className="w-5 h-5" />
              <span>Launch Immersive {selectedDestination?.name || 'Virtual'} Experience</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
