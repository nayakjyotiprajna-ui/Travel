import React from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import {
  X,
  HeartHandshake,
  ZapOff,
  Contrast,
  Type,
  Volume2,
  FileText,
  Smile,
  Accessibility as AccessibilityIcon,
  RotateCcw
} from 'lucide-react';

export const AccessibilityModal: React.FC = () => {
  const { settings, updateSetting, resetSettings, isModalOpen, setIsModalOpen } = useAccessibility();

  if (!isModalOpen) return null;

  const toggles = [
    {
      key: 'lowMotion' as const,
      title: 'Low Motion & Vestibular Comfort',
      desc: 'Reduces or eliminates 3D camera rotation swings, parallax motion, and dynamic web animations.',
      icon: ZapOff,
      color: 'text-amber-400',
    },
    {
      key: 'highContrast' as const,
      title: 'High Contrast Mode',
      desc: 'Enhances border outlines, font legibility, and luminosity for maximum visual clarity.',
      icon: Contrast,
      color: 'text-skyAccent',
    },
    {
      key: 'largeText' as const,
      title: 'Large Typography',
      desc: 'Scales default body and header typography to 115% for effortless readability.',
      icon: Type,
      color: 'text-tealAccent',
    },
    {
      key: 'audioGuide' as const,
      title: 'Voice Audio Guide',
      desc: 'Enables spoken AI voice commentary during virtual tours and destination landmarks.',
      icon: Volume2,
      color: 'text-cyanAccent',
    },
    {
      key: 'textGuide' as const,
      title: 'Detailed Text Narratives',
      desc: 'Displays synchronized on-screen caption cards and transcripts for every landmark.',
      icon: FileText,
      color: 'text-indigo-400',
    },
    {
      key: 'seniorFriendly' as const,
      title: 'Senior Friendly Simplicity',
      desc: 'Simplifies complex UI navigation with larger tap targets and slower exploration pacing.',
      icon: Smile,
      color: 'text-emerald-400',
    },
    {
      key: 'mobilityFriendly' as const,
      title: 'Mobility & Step-Free Filters',
      desc: 'Prioritizes destinations and routes featuring verified ramps, elevators, and flat boardwalks.',
      icon: AccessibilityIcon,
      color: 'text-purple-400',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-title"
    >
      <div className="glass-panel w-full max-w-xl rounded-2xl border border-cyanAccent/30 shadow-glass overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-tealAccent/20 border border-tealAccent/30 flex items-center justify-center text-tealAccent">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h2 id="accessibility-title" className="text-lg font-bold text-white">
                Comfort & Accessibility Preferences
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Customize your sensory, motion, and interaction environment
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(false)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options List */}
        <div className="max-h-[60vh] overflow-y-auto p-5 space-y-3.5">
          {toggles.map((item) => {
            const isChecked = settings[item.key];
            return (
              <label
                key={item.key}
                className={`flex items-start justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isChecked
                    ? 'bg-cyanAccent/10 border-cyanAccent/40'
                    : 'glass-card border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-start gap-3.5 pr-4">
                  <div className={`p-2 rounded-lg bg-white/5 mt-0.5 ${item.color}`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white block">{item.title}</span>
                    <span className="text-xs text-slate-400 block mt-0.5 leading-relaxed">{item.desc}</span>
                  </div>
                </div>

                <div className="relative inline-flex items-center mt-1">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => updateSetting(item.key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyanAccent"></div>
                </div>
              </label>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white/5 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={resetSettings}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-5 py-2 glass-button-primary text-xs font-semibold rounded-xl shadow-glow-cyan"
          >
            Save & Apply
          </button>
        </div>
      </div>
    </div>
  );
};
