import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Trophy, Sparkles, CheckCircle, ArrowRight, Home } from 'lucide-react';
import confetti from 'canvas-confetti';

interface JourneyCompleteModalProps {
  destinationName: string;
  xpAwarded: number;
  isOpen: boolean;
  onClose: () => void;
  stampData?: any;
}

export const JourneyCompleteModal: React.FC<JourneyCompleteModalProps> = ({
  destinationName,
  xpAwarded,
  isOpen,
  onClose,
  stampData,
}) => {
  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
    >
      <div className="glass-panel w-full max-w-md rounded-3xl border border-cyanAccent/40 shadow-2xl p-6 sm:p-8 text-center animate-in zoom-in-95 duration-200">
        {/* Trophy icon */}
        <div className="relative w-20 h-20 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-400 to-yellow-300 flex items-center justify-center text-navy-950 shadow-glow-teal mb-4 animate-bounce">
          <Trophy className="w-10 h-10" />
        </div>

        <span className="text-xs font-mono font-bold tracking-widest text-tealAccent uppercase">
          Journey Milestone Achieved
        </span>

        <h2 className="text-2xl font-extrabold text-white mt-1">
          {destinationName} Explored!
        </h2>

        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
          You have successfully completed your virtual journey through {destinationName}. Your digital travel passport has been officially stamped.
        </p>

        {/* Digital Stamp Preview Card */}
        <div className="my-6 p-4 rounded-2xl glass-card border border-tealAccent/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 px-2 py-0.5 bg-tealAccent/20 rounded-bl-xl text-[10px] font-mono text-tealAccent">
            PASSPORT VERIFIED
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full border-2 border-dashed border-tealAccent flex flex-col items-center justify-center text-tealAccent rotate-[-6deg]">
              <span className="text-lg">🏔️</span>
              <span className="text-[9px] font-mono font-bold">PASSED</span>
            </div>

            <div className="text-left">
              <h4 className="text-sm font-bold text-white">
                {destinationName} Explorer Stamp
              </h4>
              <p className="text-[11px] text-tealAccent font-mono mt-0.5">
                Code: {stampData?.stamp?.code || 'TT-PASSPORT-GOLD'}
              </p>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-amber-400 font-semibold font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>+{xpAwarded} XP Earned</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation CTAs */}
        <div className="space-y-2.5">
          <Link
            to="/passport"
            className="w-full py-3 glass-button-primary rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-glow-cyan"
          >
            <Award className="w-4 h-4" />
            <span>Inspect My Digital Passport</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/dashboard"
            className="w-full py-2.5 glass-button-secondary rounded-xl text-xs font-semibold flex items-center justify-center gap-2 text-slate-300 hover:text-white"
          >
            <Home className="w-4 h-4" />
            <span>Go to Explorer Dashboard</span>
          </Link>

          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white transition-colors pt-2 block mx-auto"
          >
            Keep Exploring Virtual Space
          </button>
        </div>
      </div>
    </div>
  );
};
