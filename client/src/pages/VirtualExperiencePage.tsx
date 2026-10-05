import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { destinationApi, journeyApi, aiApi } from '../services/api';
import type { Destination, ActivityEmbedded } from '../types';
import { DestinationScene3D } from '../components/3d/DestinationScene3D';
import { AudioAmbiance } from '../components/3d/AudioAmbiance';
import { MiniMap } from '../components/3d/MiniMap';
import { AiGuideDrawer } from '../components/experience/AiGuideDrawer';
import { ActivitiesModal } from '../components/experience/ActivitiesModal';
import { CaptureMemoryModal } from '../components/experience/CaptureMemoryModal';
import { JourneyCompleteModal } from '../components/experience/JourneyCompleteModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useAccessibility } from '../context/AccessibilityContext';
import {
  Compass,
  Bot,
  Map,
  Trophy,
  Camera,
  LogOut,
  Maximize2,
  CheckCircle,
  Sparkles,
  Info,
  ChevronRight,
  Glasses
} from 'lucide-react';

export const VirtualExperiencePage: React.FC = () => {
  const { destinationId } = useParams<{ destinationId: string }>();
  const [searchParams] = useSearchParams();
  const journeyId = searchParams.get('journeyId');
  const mood = searchParams.get('mood') || 'Peaceful';
  const comfort = searchParams.get('comfort') || 'Standard';
  const navigate = useNavigate();
  const { settings } = useAccessibility();

  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);

  // Experience State
  const [activeAttractionIdx, setActiveAttractionIdx] = useState<number>(0);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [completedStops, setCompletedStops] = useState<string[]>([]);
  const [earnedXp, setEarnedXp] = useState<number>(0);

  // Modals & Drawers
  const [showAiGuide, setShowAiGuide] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showActivities, setShowActivities] = useState(false);
  const [showCaptureMemory, setShowCaptureMemory] = useState(false);
  const [showJourneyComplete, setShowJourneyComplete] = useState(false);
  const [stampData, setStampData] = useState<any>(null);

  useEffect(() => {
    const fetchDest = async () => {
      if (!destinationId) return;
      try {
        const res = await destinationApi.getById(destinationId);
        if (res.data.success) {
          setDestination(res.data.destination);
          if (res.data.destination.attractions?.length > 0) {
            setCompletedStops([res.data.destination.attractions[0].name]);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch destination:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDest();
  }, [destinationId]);

  const handleSelectAttraction = (idx: number) => {
    setActiveAttractionIdx(idx);
    if (destination?.attractions[idx]) {
      const name = destination.attractions[idx].name;
      if (!completedStops.includes(name)) {
        setCompletedStops((prev) => [...prev, name]);
      }
    }
  };

  const handleCompleteActivity = (activity: ActivityEmbedded, xp: number) => {
    setCompletedActivities((prev) => [...prev, activity.id]);
    setEarnedXp((prev) => prev + xp);
  };

  const handleFinishJourney = async () => {
    if (!destination) return;
    try {
      if (journeyId) {
        const res = await journeyApi.complete(journeyId, {
          stopsCompleted: completedStops,
        });
        setStampData(res.data.passportEntry);
      }
    } catch (e) {
      console.warn('Could not persist journey completion to server');
    }
    setShowJourneyComplete(true);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  if (loading || !destination) {
    return (
      <div className="h-screen flex items-center justify-center bg-navy-950">
        <LoadingSpinner label="Calibrating 3D Virtual Destination Space..." />
      </div>
    );
  }

  const currentAttraction = destination.attractions[activeAttractionIdx] || {
    name: destination.name,
    description: destination.shortDescription,
  };

  const totalSteps = (destination.attractions.length || 3) + (destination.activities.length || 2);
  const currentStepProgress = Math.min(
    100,
    Math.round(((completedStops.length + completedActivities.length) / totalSteps) * 100)
  );

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-navy-950 select-none">
      {/* 3D Virtual Environment Canvas */}
      <div className="absolute inset-0 z-0">
        <DestinationScene3D
          destination={destination}
          activeAttractionIndex={activeAttractionIdx}
          onSelectAttraction={handleSelectAttraction}
          lowMotion={settings.lowMotion}
        />
      </div>

      {/* ================= TOP HUD OVERLAY ================= */}
      <header className="absolute top-0 inset-x-0 z-20 p-4 sm:p-6 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Destination info pill */}
          <div className="glass-panel px-4 py-2.5 rounded-2xl border border-white/10 shadow-glass pointer-events-auto flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-tealAccent/20 border border-tealAccent/30 flex items-center justify-center text-tealAccent font-bold">
              {destination.category === 'Mountains' ? '🏔️' : destination.category === 'Beaches' ? '🏖️' : '🏛️'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-white leading-none">{destination.name}</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyanAccent/10 text-cyanAccent border border-cyanAccent/20">
                  {mood}
                </span>
              </div>
              <p className="text-[11px] text-tealAccent font-mono mt-1">
                Active: {currentAttraction.name}
              </p>
            </div>
          </div>

          {/* Progress & Controls */}
          <div className="flex items-center gap-3 pointer-events-auto">
            {/* Journey Progress Bar */}
            <div className="hidden md:flex flex-col items-end glass-panel px-4 py-2 rounded-xl border border-white/10 shadow-glass">
              <span className="text-[10px] font-mono text-slate-300">
                Immersion Progress: {currentStepProgress}%
              </span>
              <div className="w-32 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-tealAccent to-cyanAccent rounded-full transition-all duration-500"
                  style={{ width: `${currentStepProgress}%` }}
                />
              </div>
            </div>

            {/* Ambient Sound Scape */}
            <div className="glass-panel p-1 rounded-full border border-white/10 shadow-glass">
              <AudioAmbiance destinationCategory={destination.category} autoPlay={true} />
            </div>

            {/* WebXR Simulator Toggle */}
            <button
              onClick={() => alert('WebXR Headset Display Mode: Render stereoscopic perspective ready. Use connected Oculus/HTC or mobile cardboard glasses.')}
              className="p-2.5 rounded-full glass-button-secondary text-cyanAccent hover:text-white"
              title="WebXR / VR Mode"
            >
              <Glasses className="w-4 h-4" />
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-2.5 rounded-full glass-button-secondary text-slate-300 hover:text-white"
              title="Toggle Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Complete Journey Milestone Button */}
            <button
              onClick={handleFinishJourney}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl glass-button-primary text-xs font-bold shadow-glow-cyan"
            >
              <CheckCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Complete Journey</span>
            </button>
          </div>
        </div>
      </header>

      {/* Current Landmark Context Card Overlay */}
      <div className="absolute top-24 left-4 sm:left-6 z-10 max-w-sm glass-panel p-4 rounded-2xl border border-cyanAccent/30 shadow-glass pointer-events-auto animate-in fade-in duration-200">
        <div className="flex items-center justify-between text-[10px] font-mono text-cyanAccent uppercase mb-1">
          <span>Observation Landmark</span>
          <span>
            {activeAttractionIdx + 1} of {destination.attractions.length}
          </span>
        </div>
        <h2 className="text-sm font-bold text-white">{currentAttraction.name}</h2>
        <p className="text-xs text-slate-300 mt-1 line-clamp-3 leading-relaxed font-sans">
          {currentAttraction.description}
        </p>

        {destination.attractions.length > 1 && (
          <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/10 text-xs">
            <span className="text-[10px] text-slate-400 font-mono">Next Landmark:</span>
            <button
              onClick={() => handleSelectAttraction((activeAttractionIdx + 1) % destination.attractions.length)}
              className="text-cyanAccent hover:text-white font-semibold flex items-center gap-1 text-[11px]"
            >
              <span>Travel Forward</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Floating MiniMap Radar */}
      {showMap && (
        <div className="absolute bottom-28 right-6 z-20 animate-in fade-in zoom-in-95 duration-150">
          <MiniMap
            attractions={destination.attractions}
            activeIndex={activeAttractionIdx}
            onSelect={handleSelectAttraction}
            destinationName={destination.name}
          />
        </div>
      )}

      {/* ================= BOTTOM CONTROL DOCK ================= */}
      <footer className="absolute bottom-6 inset-x-0 z-20 flex justify-center px-4 pointer-events-none">
        <nav
          className="glass-panel p-2 rounded-2xl border border-white/15 shadow-glass flex items-center gap-1.5 sm:gap-3 pointer-events-auto"
          aria-label="Experience controls"
        >
          {/* Explore Waypoints */}
          <button
            onClick={() => handleSelectAttraction((activeAttractionIdx + 1) % destination.attractions.length)}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl glass-button-secondary text-xs font-semibold hover:border-cyanAccent"
          >
            <Compass className="w-4 h-4 text-cyanAccent" />
            <span className="hidden sm:inline">Explore Next</span>
          </button>

          {/* AI Guide */}
          <button
            onClick={() => setShowAiGuide(true)}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl glass-button-secondary text-xs font-semibold text-tealAccent-light hover:border-tealAccent"
          >
            <Bot className="w-4 h-4 text-tealAccent" />
            <span>AI Guide</span>
          </button>

          {/* Radar Map Toggle */}
          <button
            onClick={() => setShowMap(!showMap)}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              showMap
                ? 'bg-cyanAccent/20 text-cyanAccent border border-cyanAccent shadow-glow-cyan'
                : 'glass-button-secondary text-slate-300'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Radar</span>
          </button>

          {/* Activities */}
          <button
            onClick={() => setShowActivities(true)}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl glass-button-secondary text-xs font-semibold text-amber-300 hover:border-amber-400"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Activities</span>
          </button>

          {/* Capture Memory */}
          <button
            onClick={() => setShowCaptureMemory(true)}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl glass-button-primary text-xs font-bold shadow-glow-cyan"
          >
            <Camera className="w-4 h-4" />
            <span className="hidden sm:inline">Capture Memory</span>
          </button>

          {/* Exit */}
          <button
            onClick={() => navigate('/explore')}
            className="p-2.5 rounded-xl glass-button-secondary text-slate-400 hover:text-red-400 hover:bg-red-500/10"
            title="Exit Virtual Experience"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </nav>
      </footer>

      {/* AI Guide Drawer */}
      <AiGuideDrawer
        destinationName={destination.name}
        currentAttractionName={currentAttraction.name}
        isOpen={showAiGuide}
        onClose={() => setShowAiGuide(false)}
        audioGuideEnabled={settings.audioGuide}
      />

      {/* Activities Modal */}
      <ActivitiesModal
        activities={destination.activities}
        completedActivityIds={completedActivities}
        isOpen={showActivities}
        onClose={() => setShowActivities(false)}
        onCompleteActivity={handleCompleteActivity}
      />

      {/* Capture Memory Modal */}
      <CaptureMemoryModal
        destination={destination}
        currentAttractionName={currentAttraction.name}
        isOpen={showCaptureMemory}
        onClose={() => setShowCaptureMemory(false)}
      />

      {/* Journey Complete Modal */}
      <JourneyCompleteModal
        destinationName={destination.name}
        xpAwarded={300 + earnedXp}
        isOpen={showJourneyComplete}
        onClose={() => setShowJourneyComplete(false)}
        stampData={stampData}
      />
    </div>
  );
};
