import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { journeyApi, simulationApi, memoryApi, passportApi, destinationApi } from '../services/api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  Compass,
  Trophy,
  Award,
  Camera,
  Sliders,
  Eye,
  ArrowRight,
  Sparkles,
  Calendar,
  CheckCircle,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const [journeys, setJourneys] = useState<any[]>([]);
  const [simulations, setSimulations] = useState<any[]>([]);
  const [memoriesCount, setMemoriesCount] = useState<number>(0);
  const [passportStats, setPassportStats] = useState<any>(null);
  const [recommendedDests, setRecommendedDests] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [journeysRes, simRes, memRes, passRes, destRes] = await Promise.allSettled([
          journeyApi.getAll(),
          simulationApi.getAll(),
          memoryApi.getAll(),
          passportApi.getPassport(),
          destinationApi.getAll({ featured: true }),
        ]);

        if (journeysRes.status === 'fulfilled' && journeysRes.value.data.success) {
          setJourneys(journeysRes.value.data.journeys);
        }
        if (simRes.status === 'fulfilled' && simRes.value.data.success) {
          setSimulations(simRes.value.data.simulations);
        }
        if (memRes.status === 'fulfilled' && memRes.value.data.success) {
          setMemoriesCount(memRes.value.data.count);
        }
        if (passRes.status === 'fulfilled' && passRes.value.data.success) {
          setPassportStats(passRes.value.data.passport);
        }
        if (destRes.status === 'fulfilled' && destRes.value.data.success) {
          setRecommendedDests(destRes.value.data.destinations.slice(0, 3));
        }
      } catch (err) {
        console.warn('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <LoadingSpinner label="Loading Explorer Dashboard..." />;

  const currentLevel = user?.level || 1;
  const currentXp = user?.xp || 100;
  const xpPercent = Math.min(100, Math.round(((currentXp % 500) / 500) * 100));

  // Analytics graph data
  const activityData = [
    { day: 'Mon', xp: 40 },
    { day: 'Tue', xp: 90 },
    { day: 'Wed', xp: 140 },
    { day: 'Thu', xp: 80 },
    { day: 'Fri', xp: 210 },
    { day: 'Sat', xp: 320 },
    { day: 'Sun', xp: currentXp },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl p-8 sm:p-10 glass-panel border border-cyanAccent/30 shadow-glass overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-tealAccent uppercase tracking-widest">
            Welcome Back, Explorer
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            {user?.name || 'Traveler'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-lg">
            Travel Twin Persona: <strong className="text-cyanAccent">{user?.travellerType || 'Universal Explorer'}</strong>. Your sensory and comfort calibrations are active.
          </p>

          {/* XP Progress Bar */}
          <div className="pt-3 w-full max-w-md">
            <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
              <span>Level {currentLevel}</span>
              <span className="text-cyanAccent font-bold">{currentXp} Total XP ({xpPercent}%)</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-tealAccent to-cyanAccent rounded-full transition-all duration-700"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/virtual-visit"
            className="px-6 py-3 rounded-xl glass-button-primary text-xs font-bold shadow-glow-cyan flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            <span>Launch Virtual Visit</span>
          </Link>
          <Link
            to="/simulate"
            className="px-6 py-3 rounded-xl glass-button-secondary text-xs font-semibold hover:border-cyanAccent flex items-center justify-center gap-2"
          >
            <Sliders className="w-4 h-4 text-cyanAccent" />
            <span>New Simulation</span>
          </Link>
        </div>
      </div>

      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: 'Destinations Explored', val: passportStats?.unlockedCount || journeys.length || 1, icon: Compass, color: 'text-cyanAccent' },
          { label: 'Activities Done', val: 3, icon: Trophy, color: 'text-amber-400' },
          { label: 'Badges Unlocked', val: (passportStats?.unlockedCount || 1) >= 1 ? 2 : 1, icon: Award, color: 'text-tealAccent' },
          { label: 'Journey Memories', val: memoriesCount || 1, icon: Camera, color: 'text-indigo-400' },
          { label: 'Trip Simulations', val: simulations.length || 1, icon: Sliders, color: 'text-purple-400' },
        ].map((stat, idx) => (
          <div key={idx} className="p-5 rounded-2xl glass-card border border-white/5 space-y-2">
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
            <span className="text-2xl font-black text-white font-mono block">{stat.val}</span>
            <span className="text-[11px] text-slate-400 block font-sans">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Continue Journey & Recharts Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Continue Recent Journey */}
        <div className="lg:col-span-7 glass-panel p-6 sm:p-7 rounded-3xl border border-white/10 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyanAccent" />
              Continue Exploration
            </h2>
            <Link to="/explore" className="text-xs text-cyanAccent hover:underline font-mono">
              View All →
            </Link>
          </div>

          {journeys.length > 0 ? (
            <div className="space-y-3">
              {journeys.slice(0, 3).map((j: any) => {
                const dest = j.destinationId;
                return (
                  <div
                    key={j._id}
                    className="p-4 rounded-xl glass-card border-white/5 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={dest?.bannerImage || 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=150&q=80'}
                        alt={dest?.name || 'Destination'}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-white">{dest?.name || 'Kashmir'}</h4>
                        <span className="text-[11px] text-slate-400 font-mono">
                          Mode: {j.mode} • Comfort: {j.comfortMode}
                        </span>
                      </div>
                    </div>

                    <Link
                      to={`/experience/${dest?._id || dest || ''}?journeyId=${j._id}`}
                      className="px-4 py-2 glass-button-primary rounded-xl text-xs font-semibold whitespace-nowrap"
                    >
                      Resume
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-white/5 text-center space-y-3">
              <p className="text-xs text-slate-300">You haven't embarked on a journey yet.</p>
              <Link to="/virtual-visit" className="inline-block px-5 py-2 glass-button-primary text-xs font-semibold rounded-xl">
                Start First Virtual Visit
              </Link>
            </div>
          )}
        </div>

        {/* XP Momentum Chart */}
        <div className="lg:col-span-5 glass-panel p-6 sm:p-7 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-tealAccent" />
              XP Growth Velocity
            </h2>
            <span className="text-xs font-mono text-tealAccent">Active Explorer</span>
          </div>

          <div className="h-44 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#070C1B',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                />
                <Area type="monotone" dataKey="xp" stroke="#14B8A6" strokeWidth={2} fillOpacity={1} fill="url(#xpGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Saved Simulations Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyanAccent" />
            Saved Trip Simulations
          </h2>
          <Link to="/simulate" className="text-xs text-cyanAccent hover:underline font-mono">
            New Simulation →
          </Link>
        </div>

        {simulations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {simulations.map((s: any) => (
              <div key={s._id} className="p-5 rounded-2xl glass-card border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-cyanAccent">
                    {s.destinationId?.name || 'Destination'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{s.travelDates?.durationDays} Days</span>
                </div>
                <h4 className="text-sm font-bold text-white truncate">{s.aiPlan?.title || 'Trip Plan'}</h4>
                <div className="text-[11px] text-slate-300 space-y-1">
                  <p>Stay: {s.accommodation}</p>
                  <p>Transit: {s.transport}</p>
                  <p className="font-mono text-tealAccent font-semibold">Budget: ${s.budget?.amount}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl glass-panel border border-white/5 text-center text-xs text-slate-400">
            No saved simulations yet. Click [New Simulation] to test travel dates, budgets, and crowds.
          </div>
        )}
      </div>
    </div>
  );
};
