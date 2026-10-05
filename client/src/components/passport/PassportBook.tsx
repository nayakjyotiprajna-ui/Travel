import React from 'react';
import { Award, ShieldCheck, Trophy, Sparkles, Lock, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PassportBookProps {
  passportData: any;
}

export const PassportBook: React.FC<PassportBookProps> = ({ passportData }) => {
  const { passportId, user, entries = [], destinationsStatus = [], totalDestinations, unlockedCount } = passportData;

  const xpToNextLevel = (user?.level || 1) * 500;
  const currentLevelXp = (user?.xp || 0) % 500;
  const xpPercent = Math.min(100, Math.round((currentLevelXp / 500) * 100));

  const badges = [
    {
      name: 'Pioneer Explorer',
      desc: 'Complete your first destination journey',
      unlocked: unlockedCount >= 1,
      icon: '🧭',
    },
    {
      name: 'Mountain Soul',
      desc: 'Explore alpine mountain sanctuaries',
      unlocked: entries.some((e: any) => e.category === 'Mountains'),
      icon: '🏔️',
    },
    {
      name: 'Heritage Guardian',
      desc: 'Uncover ancient historical monuments',
      unlocked: entries.some((e: any) => e.category === 'Heritage'),
      icon: '🏛️',
    },
    {
      name: 'Grand Voyageur',
      desc: 'Unlock 3 or more virtual destination stamps',
      unlocked: unlockedCount >= 3,
      icon: '👑',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Passport Identity Booklet Header */}
      <div className="relative rounded-3xl p-6 sm:p-10 border border-tealAccent/30 shadow-2xl overflow-hidden bg-gradient-to-br from-[#0c1836] via-[#09142b] to-[#060c1c]">
        {/* Holographic watermark background */}
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-cyanAccent/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 text-white/5 font-extrabold text-8xl font-mono select-none pointer-events-none">
          PASSPORT
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* User Photo & Stamp Details */}
          <div className="flex items-center gap-5 md:col-span-2">
            <div className="relative">
              <img
                src={
                  user?.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
                }
                alt={user?.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-tealAccent shadow-glow-teal"
              />
              <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-navy-950 border border-tealAccent text-[10px] font-mono text-tealAccent-light font-bold">
                Lv. {user?.level || 1}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest text-tealAccent uppercase px-2 py-0.5 rounded bg-tealAccent/15 border border-tealAccent/30">
                  Global Travel Twin Citizen
                </span>
                <span className="text-[10px] font-mono text-slate-400">ID: {passportId}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {user?.name || 'Explorer'}
              </h2>

              <p className="text-xs text-slate-300 font-sans">
                Style: <span className="text-cyanAccent font-semibold">{user?.travellerType || 'Universal Explorer'}</span>
              </p>

              {/* XP Progress Bar */}
              <div className="pt-2 w-full max-w-md">
                <div className="flex justify-between text-[11px] font-mono mb-1 text-slate-300">
                  <span>Experience: {user?.xp || 0} XP</span>
                  <span className="text-tealAccent">Level {user?.level || 1} ({xpPercent}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-tealAccent to-cyanAccent rounded-full transition-all duration-700"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Counter Box */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl glass-panel border-white/10 text-center">
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Stamps Earned</span>
              <span className="text-2xl font-extrabold text-cyanAccent font-mono mt-0.5 block">
                {unlockedCount} / {totalDestinations}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Achievements</span>
              <span className="text-2xl font-extrabold text-amber-400 font-mono mt-0.5 block">
                {badges.filter((b) => b.unlocked).length} / {badges.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Destinations Stamp Grid (Completed vs Locked) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Official Visa Stamps & Journey Progress
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {unlockedCount} of {destinationsStatus.length} Discovered
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {destinationsStatus.map((dest: any) => {
            const isUnlocked = dest.isUnlocked;
            const entry = entries.find((e: any) => (e.destinationId?._id || e.destinationId) === dest._id);

            return (
              <div
                key={dest._id}
                className={`relative p-5 rounded-2xl border transition-all overflow-hidden ${
                  isUnlocked
                    ? 'glass-card border-tealAccent/40 shadow-glow-teal'
                    : 'glass-card border-white/5 opacity-70 hover:opacity-90'
                }`}
              >
                {/* Background image tint */}
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-10 filter blur-xs"
                  style={{ backgroundImage: `url(${dest.bannerImage})` }}
                />

                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400">
                      {dest.state}, {dest.country}
                    </span>
                    <h4 className="text-base font-bold text-white mt-0.5">{dest.name}</h4>
                    <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-cyanAccent/10 text-cyanAccent-light border border-cyanAccent/20">
                      {dest.category}
                    </span>
                  </div>

                  {/* Stamp Graphic */}
                  {isUnlocked ? (
                    <div className="w-14 h-14 rounded-full border-2 border-dashed border-tealAccent flex flex-col items-center justify-center text-tealAccent rotate-[-8deg] shadow-glow-teal bg-navy-950/70">
                      <span className="text-base">
                        {dest.category === 'Mountains' ? '🏔️' : dest.category === 'Beaches' ? '🏖️' : '🏛️'}
                      </span>
                      <span className="text-[8px] font-mono font-bold uppercase tracking-wider">VISITED</span>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-slate-500 bg-navy-950/40">
                      <Lock className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <div className="relative z-10 mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                  {isUnlocked ? (
                    <div className="text-[10px] text-tealAccent font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{entry?.stamp?.code || 'STAMP-UNLOCKED'}</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-mono">Unlocks upon exploration</span>
                  )}

                  <Link
                    to={`/virtual-visit?destination=${encodeURIComponent(dest.name)}`}
                    className="text-xs text-cyanAccent hover:text-white font-semibold transition-colors"
                  >
                    {isUnlocked ? 'Revisit →' : 'Explore Now →'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gamification Badges Section */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          Explorer Badges & Achievements
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((b) => (
            <div
              key={b.name}
              className={`p-4 rounded-2xl border transition-all ${
                b.unlocked
                  ? 'glass-card border-amber-500/40 bg-gradient-to-b from-amber-500/10 to-transparent'
                  : 'glass-card border-white/5 opacity-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                    b.unlocked ? 'bg-amber-500/20 shadow-glow-teal' : 'bg-slate-800'
                  }`}
                >
                  {b.icon}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{b.name}</h4>
                  <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{b.desc}</p>
                </div>
              </div>
              <div className="mt-3 text-right">
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    b.unlocked ? 'bg-tealAccent/20 text-tealAccent' : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {b.unlocked ? 'Unlocked' : 'Locked'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
