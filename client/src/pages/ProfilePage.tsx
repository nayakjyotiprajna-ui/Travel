import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import {
  User as UserIcon,
  ShieldCheck,
  Check,
  RotateCcw,
  Sparkles,
  Accessibility as AccessibilityIcon,
  HeartHandshake
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, resetTravelTwin } = useAuth();
  const { settings, updateSetting } = useAccessibility();

  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [travellerType, setTravellerType] = useState(user?.travellerType || 'Explorer');
  const [preferences, setPreferences] = useState<string[]>(user?.travelPreferences || ['Mountains', 'Culture']);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const availableInterests = [
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

  const handleTogglePref = (item: string) => {
    setPreferences((prev) =>
      prev.includes(item) ? prev.filter((p) => p !== item) : [...prev, item]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name,
      avatar,
      travellerType,
      travelPreferences: preferences,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetTwin = async () => {
    if (!window.confirm('Reset your Travel Twin profile and recalibrate preferences?')) return;
    await resetTravelTwin();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Title */}
      <div className="border-b border-white/10 pb-6">
        <span className="text-xs font-mono font-bold tracking-widest text-tealAccent uppercase">
          Explorer Profile
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
          Profile & Neural Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Manage your personal travel identity, avatar, and accessibility parameters.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-tealAccent/15 border border-tealAccent/30 text-xs text-tealAccent-light flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Profile and Travel Twin settings saved successfully!</span>
        </div>
      )}

      {resetSuccess && (
        <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
          <RotateCcw className="w-4 h-4" />
          <span>Travel Twin reset to baseline default. You may recalibrate your persona.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Personal Details */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-cyanAccent" />
            General Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1 font-mono">
                Full Name:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full glass-input rounded-xl p-3 text-xs text-white"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1 font-mono">
                Email Address (Read-only):
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full glass-input rounded-xl p-3 text-xs text-slate-500 bg-white/5 cursor-not-allowed"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1 font-mono">
                Avatar Image URL:
              </label>
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://..."
                className="w-full glass-input rounded-xl p-3 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Travel Twin Personality */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-tealAccent" />
            Travel Twin Archetype & Interests
          </h2>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5 font-mono">
              Travel Archetype:
            </label>
            <select
              value={travellerType}
              onChange={(e) => setTravellerType(e.target.value)}
              className="w-full glass-input rounded-xl p-3 text-xs text-white"
            >
              <option value="Explorer">Explorer — Curious wanderer & monument seeker</option>
              <option value="Peaceful Traveller">Peaceful Traveller — Calm, slow reflection, nature solace</option>
              <option value="Culture Lover">Culture Lover — Living arts, folklore, ancient history</option>
              <option value="Adventure Seeker">Adventure Seeker — Alpine crests & desert expanses</option>
              <option value="Photographer">Photographer — Scenic light framing & vistas</option>
              <option value="Family Traveller">Family Traveller — Multigenerational comfort</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2 font-mono">
              Affinities & Activities:
            </label>
            <div className="flex flex-wrap gap-2">
              {availableInterests.map((item) => {
                const active = preferences.includes(item);
                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => handleTogglePref(item)}
                    className={`text-xs px-3.5 py-1.5 rounded-full border transition-all ${
                      active
                        ? 'bg-tealAccent/20 text-tealAccent-light border-tealAccent shadow-glow-teal'
                        : 'glass-card border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={handleResetTwin}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass-button-secondary text-xs font-semibold text-amber-300 hover:bg-amber-500/10"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Travel Twin</span>
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 rounded-xl glass-button-primary text-xs font-bold shadow-glow-cyan"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};
