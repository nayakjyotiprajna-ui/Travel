import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import {
  Sparkles,
  CheckCircle,
  Compass,
  ArrowRight,
  ShieldCheck,
  Bot,
  HeartHandshake,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AiTravelTwinPage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { updateSetting } = useAccessibility();
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(1);
  const [travellerType, setTravellerType] = useState<string>(user?.travellerType || 'Explorer');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    user?.travelPreferences?.length ? user.travelPreferences : ['Mountains', 'Culture', 'Photography']
  );
  const [accessibilityChoices, setAccessibilityChoices] = useState<any>({
    lowMotion: user?.accessibilityPreferences?.lowMotion || false,
    audioGuide: user?.accessibilityPreferences?.audioGuide || false,
    textGuide: user?.accessibilityPreferences?.textGuide ?? true,
    seniorFriendly: user?.accessibilityPreferences?.seniorFriendly || false,
    mobilityFriendly: user?.accessibilityPreferences?.mobilityFriendly || false,
    enhancedVisuals: user?.accessibilityPreferences?.enhancedVisuals ?? true,
  });

  const [generatedTwin, setGeneratedTwin] = useState<boolean>(false);

  const travellerTypes = [
    { type: 'Explorer', icon: '🧭', desc: 'Curious wanderer seeking hidden local gems and architectural marvels' },
    { type: 'Peaceful Traveller', icon: '🌿', desc: 'Seeking tranquility, slow reflection, and scenic water and mountain vistas' },
    { type: 'Culture Lover', icon: '🏛️', desc: 'Enchanted by living traditions, classical folklore, and historic monument archives' },
    { type: 'Adventure Seeker', icon: '🏔️', desc: 'Thriving on alpine climbs, cold desert expanses, and high-altitude trails' },
    { type: 'Photographer', icon: '📸', desc: 'Framing golden hour sunrises, intricate carvings, and panoramic horizons' },
    { type: 'Family Traveller', icon: '👨‍👩‍👧', desc: 'Accessible, serene journeys designed for safety, comfort, and multigenerational joy' },
  ];

  const interestList = [
    'Mountains',
    'Beaches',
    'Heritage',
    'Food',
    'Wildlife',
    'Architecture',
    'Local Culture',
    'Adventure',
    'Photography',
  ];

  const toggleInterest = (item: string) => {
    setSelectedInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleFinish = async () => {
    // Sync accessibility
    Object.keys(accessibilityChoices).forEach((k) => {
      updateSetting(k as any, accessibilityChoices[k]);
    });

    if (user) {
      await updateProfile({
        travellerType,
        travelPreferences: selectedInterests,
        accessibilityPreferences: accessibilityChoices,
      });
    }

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    setGeneratedTwin(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-cyanAccent to-tealAccent flex items-center justify-center text-3xl shadow-glow-cyan mb-3">
          🤖
        </div>
        <span className="text-xs font-mono font-bold tracking-widest text-tealAccent uppercase">
          Neural Personalization
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Meet Your Travel Twin
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto font-sans">
          Configure your digital travel persona so our AI Travel Director crafts journeys suited to your personality and accessibility needs.
        </p>
      </div>

      {!generatedTwin ? (
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 space-y-8 shadow-glass">
          {/* Step 1: Traveller Archetype */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <span className="text-xs font-mono text-cyanAccent uppercase font-bold">
                Step 01 • Traveller Archetype
              </span>
              <h2 className="text-lg font-bold text-white">What kind of traveller are you?</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {travellerTypes.map((t) => (
                  <button
                    key={t.type}
                    onClick={() => setTravellerType(t.type)}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      travellerType === t.type
                        ? 'bg-cyanAccent/15 border-cyanAccent shadow-glow-cyan'
                        : 'glass-card border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <span className="text-2xl block mb-2">{t.icon}</span>
                      <h3 className="text-sm font-bold text-white">{t.type}</h3>
                      <p className="text-[11px] text-slate-300 mt-1 leading-snug">{t.desc}</p>
                    </div>
                    {travellerType === t.type && (
                      <span className="mt-3 text-[10px] font-mono text-cyanAccent flex items-center gap-1">
                        <Check className="w-3 h-3" /> Selected
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 glass-button-primary rounded-xl text-xs font-bold shadow-glow-cyan flex items-center gap-2"
                >
                  <span>Next: Passions & Enjoys</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: What do you enjoy? */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <span className="text-xs font-mono text-tealAccent uppercase font-bold">
                Step 02 • Core Affinities
              </span>
              <h2 className="text-lg font-bold text-white">What do you enjoy? (Select all that apply)</h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {interestList.map((item) => {
                  const isChecked = selectedInterests.includes(item);
                  return (
                    <button
                      key={item}
                      onClick={() => toggleInterest(item)}
                      className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                        isChecked
                          ? 'bg-tealAccent/20 border-tealAccent text-white shadow-glow-teal'
                          : 'glass-card border-white/5 text-slate-300 hover:text-white'
                      }`}
                    >
                      <span className="text-xs font-semibold">{item}</span>
                      {isChecked && <CheckCircle className="w-4 h-4 text-tealAccent" />}
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 glass-button-secondary rounded-xl text-xs font-semibold"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 glass-button-primary rounded-xl text-xs font-bold shadow-glow-teal flex items-center gap-2"
                >
                  <span>Next: Accessibility Calibration</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Accessibility Preferences */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <span className="text-xs font-mono text-skyAccent uppercase font-bold">
                Step 03 • Sensory & Physical Comfort
              </span>
              <h2 className="text-lg font-bold text-white">Accessibility & Comfort Calibration</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  { key: 'lowMotion', title: 'Low Motion Exploration', desc: 'No rapid spins or vestibular tilt in 3D' },
                  { key: 'audioGuide', title: 'Spoken Audio Narration', desc: 'AI voice commentary for sight impaired' },
                  { key: 'textGuide', title: 'On-Screen Synchronized Text', desc: 'Detailed closed captions and transcripts' },
                  { key: 'seniorFriendly', title: 'Senior Friendly Simplicity', desc: 'Generous touch points and relaxed pacing' },
                  { key: 'mobilityFriendly', title: 'Mobility & Step-Free Verification', desc: 'Verified ramp & elevator routes' },
                  { key: 'enhancedVisuals', title: 'Enhanced Visual Contrast', desc: 'High luminance WCAG AAA clarity' },
                ].map((item) => {
                  const isChecked = accessibilityChoices[item.key];
                  return (
                    <label
                      key={item.key}
                      className={`p-4 rounded-xl border text-left transition-all flex items-start justify-between cursor-pointer ${
                        isChecked
                          ? 'bg-cyanAccent/15 border-cyanAccent'
                          : 'glass-card border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold text-white block">{item.title}</span>
                        <span className="text-[11px] text-slate-300 block mt-0.5">{item.desc}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) =>
                          setAccessibilityChoices((prev: any) => ({
                            ...prev,
                            [item.key]: e.target.checked,
                          }))
                        }
                        className="rounded accent-cyanAccent w-4 h-4 mt-0.5"
                      />
                    </label>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 glass-button-secondary rounded-xl text-xs font-semibold"
                >
                  Back
                </button>
                <button
                  onClick={handleFinish}
                  className="px-7 py-3 glass-button-primary rounded-xl text-xs font-bold shadow-glow-cyan flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Synthesize My Travel Twin</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Generated Travel Twin Profile Card */
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-tealAccent/40 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-cyanAccent via-tealAccent to-skyAccent flex items-center justify-center text-4xl shadow-glow-teal">
            🌍
          </div>

          <div>
            <span className="text-xs font-mono font-bold text-tealAccent uppercase tracking-widest">
              Neural Profile Generated
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Your Travel Twin: {travellerType}
            </h2>
            <p className="text-xs text-slate-300 mt-2 max-w-md mx-auto">
              Configured for {selectedInterests.join(', ')} with verified accessibility safeguards enabled.
            </p>
          </div>

          <div className="p-4 rounded-2xl glass-card max-w-lg mx-auto text-left space-y-2 border-white/10">
            <span className="text-xs font-mono text-cyanAccent block font-semibold">Recommended Starting Journey:</span>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Kashmir Serene Immersion</h4>
                <p className="text-[11px] text-slate-300 font-sans">
                  Dal Lake Shikara glide tailored for {travellerType} preferences.
                </p>
              </div>
              <span className="text-xs font-mono text-tealAccent">98% Match</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/virtual-visit?destination=Kashmir')}
              className="w-full sm:w-auto px-7 py-3 rounded-xl glass-button-primary text-xs font-bold shadow-glow-cyan"
            >
              Start Recommended Kashmir Journey
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl glass-button-secondary text-xs font-semibold"
            >
              View My Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
