import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { InteractiveGlobe } from '../components/3d/InteractiveGlobe';
import { destinationApi } from '../services/api';
import type { Destination } from '../types';
import {
  Sparkles,
  Eye,
  Sliders,
  Compass,
  Users,
  Award,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  MapPin,
  ChevronRight,
  HeartHandshake
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loadingDestinations, setLoadingDestinations] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await destinationApi.getAll({ featured: true });
        if (res.data.success) {
          setDestinations(res.data.destinations);
        }
      } catch (err) {
        console.warn('Failed to load featured destinations, using fallback list');
      } finally {
        setLoadingDestinations(false);
      }
    };
    fetchDestinations();
  }, []);

  return (
    <div className="space-y-24 sm:space-y-32 overflow-hidden pb-12">
      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-8 sm:pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyanAccent/10 border border-cyanAccent/30 text-cyanAccent-light text-xs font-mono font-medium shadow-glow-cyan animate-pulse-slow">
              <Sparkles className="w-3.5 h-3.5 text-cyanAccent" />
              <span>AI-Powered Virtual Travel & Accessibility Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Your Journey Doesn't Need a <span className="text-gradient-teal">Passport.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-sans max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Experience destinations virtually, personalize every journey with AI, and simulate your real trip before you travel.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/ai-travel-twin"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl glass-button-primary text-sm font-bold flex items-center justify-center gap-2 shadow-glow-cyan"
              >
                <span>Start My Journey</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/explore"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl glass-button-secondary text-sm font-semibold flex items-center justify-center gap-2 hover:border-cyanAccent/50"
              >
                <Compass className="w-4 h-4 text-cyanAccent" />
                <span>Explore Destinations</span>
              </Link>
            </div>

            {/* Trust and Accessibility Badges */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-tealAccent" />
                Zero Physical Boundaries
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-tealAccent" />
                Low-Motion & Audio Guided
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-tealAccent" />
                Real 3D Simulation
              </span>
            </div>
          </div>

          {/* Right Column: 3D Interactive Earth */}
          <div className="lg:col-span-6 w-full">
            <InteractiveGlobe />
          </div>
        </div>
      </section>

      {/* ================= SECTION 1: TWO WAYS TO TRAVEL ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-mono font-bold tracking-widest text-tealAccent uppercase">
            Product Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Choose How You Want To Travel.
          </h2>
          <p className="text-sm text-slate-300">
            Tailored journeys for both virtual wanderlust and pre-trip validation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Virtual Visit */}
          <div className="glass-card rounded-3xl p-8 sm:p-10 border border-tealAccent/30 relative overflow-hidden group hover:border-tealAccent transition-all shadow-glass">
            <div className="absolute top-0 right-0 p-8 text-tealAccent/10 text-8xl font-black select-none pointer-events-none group-hover:text-tealAccent/20 transition-colors">
              🥽
            </div>

            <div className="relative z-10 space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-tealAccent/20 border border-tealAccent/30 flex items-center justify-center text-2xl shadow-glow-teal">
                🥽
              </div>

              <div>
                <span className="text-xs font-mono text-tealAccent uppercase tracking-wider block font-bold">
                  Mode 01 • Universal Virtual Immersion
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                  Virtual Visit
                </h3>
                <p className="text-cyanAccent font-mono text-xs mt-1">
                  "I can't travel right now."
                </p>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                Experience destinations virtually from anywhere. Engineered for users experiencing financial limitations, health conditions, mobility restrictions, or lack of time. Immerse in 3D audio environments, AI guidance, and interactive cultural activities.
              </p>

              <ul className="space-y-2 text-xs text-slate-300 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-tealAccent" />
                  Sensory comfort controls & low-motion toggle
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-tealAccent" />
                  Real interactive 3D landscapes & hotspots
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-tealAccent" />
                  Contextual AI Travel Director & voice guide
                </li>
              </ul>

              <div className="pt-2">
                <Link
                  to="/virtual-visit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl glass-button-primary text-xs font-bold shadow-glow-teal"
                >
                  <Eye className="w-4 h-4" />
                  <span>Start Virtual Visit</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Pre-Travel Simulation */}
          <div className="glass-card rounded-3xl p-8 sm:p-10 border border-cyanAccent/30 relative overflow-hidden group hover:border-cyanAccent transition-all shadow-glass">
            <div className="absolute top-0 right-0 p-8 text-cyanAccent/10 text-8xl font-black select-none pointer-events-none group-hover:text-cyanAccent/20 transition-colors">
              ✈️
            </div>

            <div className="relative z-10 space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-cyanAccent/20 border border-cyanAccent/30 flex items-center justify-center text-2xl shadow-glow-cyan">
                ✈️
              </div>

              <div>
                <span className="text-xs font-mono text-cyanAccent uppercase tracking-wider font-bold">
                  Mode 02 • Real Trip Validation Engine
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                  Pre-Travel Simulation
                </h3>
                <p className="text-skyAccent font-mono text-xs mt-1">
                  "I'm planning a real trip."
                </p>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                Experience your planned journey before booking it. Simulate your full trip pipeline: Hotel → Road Transit → Tourist Monuments → Crowd Congestion → Weather Scenarios → Activities. Generate a complete AI itinerary tailored to your exact constraints.
              </p>

              <ul className="space-y-2 text-xs text-slate-300 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyanAccent" />
                  Stage-by-stage interactive trip simulation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyanAccent" />
                  Predict crowd density and packing tips
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyanAccent" />
                  Day 1..N morning/afternoon/evening itinerary
                </li>
              </ul>

              <div className="pt-2">
                <Link
                  to="/simulate"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl glass-button-secondary text-xs font-bold hover:border-cyanAccent hover:text-white"
                >
                  <Sliders className="w-4 h-4 text-cyanAccent" />
                  <span>Simulate My Trip</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 2: HOW TRAVELTWIN WORKS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono font-bold tracking-widest text-tealAccent uppercase">
            Seamless Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            How TravelTwin Works
          </h2>
          <p className="text-sm text-slate-300">
            From travel intention to memory preservation in seven intuitive stages.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
          {[
            { step: '01', title: 'Choose Purpose', desc: 'Virtual visit or real trip planning simulation' },
            { step: '02', title: 'Preferences', desc: 'Select sensory, pacing, and dietary needs' },
            { step: '03', title: 'AI Twin Born', desc: 'Neural profile tailored to your exploration style' },
            { step: '04', title: 'Explore 3D', desc: 'Interact with landscapes, landmarks, and vistas' },
            { step: '05', title: 'Activities', desc: 'Solve cultural quizzes and photo challenges' },
            { step: '06', title: 'Save Memories', desc: 'Store personal photo snapshots and reflections' },
            { step: '07', title: 'Travel Insights', desc: 'Earn digital passport stamps, badges, and XP' },
          ].map((item, idx) => (
            <div
              key={item.step}
              className="glass-card p-5 rounded-2xl border-white/5 relative group hover:border-cyanAccent/40 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-2xl font-black font-mono text-cyanAccent/40 group-hover:text-cyanAccent transition-colors">
                  {item.step}
                </span>
                <h4 className="text-sm font-bold text-white mt-2">{item.title}</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">{item.desc}</p>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
                <div
                  className="h-full bg-cyanAccent rounded-full"
                  style={{ width: `${((idx + 1) / 7) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SECTION 3: FEATURED DESTINATIONS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-tealAccent uppercase">
              Curated Atlas
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Featured Destinations
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              Handcrafted 3D virtual environments and simulation datasets.
            </p>
          </div>

          <Link
            to="/explore"
            className="flex items-center gap-1.5 text-xs text-cyanAccent hover:text-white font-mono transition-colors"
          >
            <span>View All Destinations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(destinations.length > 0
            ? destinations
            : [
                {
                  _id: '1',
                  name: 'Kashmir',
                  state: 'Jammu & Kashmir',
                  category: 'Mountains',
                  shortDescription: 'Mirror-still lakes, alpine pine valleys, and timeless Himalayan serenity.',
                  bannerImage: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80',
                },
                {
                  _id: '2',
                  name: 'Goa',
                  state: 'Goa',
                  category: 'Beaches',
                  shortDescription: 'Golden sands, turquoise waters, colonial Latin quarters, and coastal serenity.',
                  bannerImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
                },
                {
                  _id: '3',
                  name: 'Konark',
                  state: 'Odisha',
                  category: 'Heritage',
                  shortDescription: 'Colossal stone chariot of the Sun God, astronomical sundials, and Kalinga heritage.',
                  bannerImage: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80',
                },
                {
                  _id: '4',
                  name: 'Rajasthan',
                  state: 'Rajasthan',
                  category: 'Heritage',
                  shortDescription: 'Royal hilltop forts, desert palaces, camel caravans, and vibrant folklore.',
                  bannerImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
                },
                {
                  _id: '5',
                  name: 'Kerala',
                  state: 'Kerala',
                  category: 'Nature',
                  shortDescription: 'Emerald backwaters, kettuvallam houseboats, fragrant spice hills, and Ayurveda.',
                  bannerImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
                },
                {
                  _id: '6',
                  name: 'Ladakh',
                  state: 'Ladakh',
                  category: 'Adventure',
                  shortDescription: 'High-altitude cold desert, Buddhist monasteries, cobalt blue lakes, and stellar night skies.',
                  bannerImage: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
                },
              ]
          ).map((dest: any) => (
            <div
              key={dest.name}
              className="glass-card rounded-2xl overflow-hidden group border border-white/10 hover:border-cyanAccent/40 flex flex-col justify-between"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={dest.bannerImage}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 text-[10px] font-mono px-2.5 py-1 rounded-full bg-navy-950/80 backdrop-blur-md border border-white/10 text-cyanAccent-light">
                  {dest.category}
                </span>
                <span className="absolute bottom-3 left-3 text-xs text-slate-300 font-mono flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-tealAccent" />
                  {dest.state}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{dest.name}</h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    {dest.shortDescription}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                  <Link
                    to={`/virtual-visit?destination=${encodeURIComponent(dest.name)}`}
                    className="py-2 text-center rounded-xl glass-button-primary text-xs font-semibold"
                  >
                    Virtual Visit
                  </Link>
                  <Link
                    to={`/simulate?destination=${encodeURIComponent(dest.name)}`}
                    className="py-2 text-center rounded-xl glass-button-secondary text-xs font-medium text-slate-300 hover:text-white"
                  >
                    Simulate Trip
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SECTION 4: AI TRAVEL TWIN ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-14 glass-panel border border-cyanAccent/30 shadow-glass overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-mono font-bold tracking-widest text-tealAccent uppercase">
                Autonomous Intelligence
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                "Your journey should feel like <span className="text-gradient-teal">YOUR journey."</span>
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed font-sans max-w-xl">
                The Travel Twin neural layer continually learns your personal affinities — whether you thrive on peaceful mountain contemplation, high-energy cultural immersions, architectural photography, or low-motion sensory ease.
              </p>

              {/* Preference Badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                {['Adventure', 'Peaceful', 'Culture', 'Photography', 'Family', 'Nature', 'Accessibility'].map((pref) => (
                  <span
                    key={pref}
                    className="text-xs px-3 py-1 rounded-full bg-cyanAccent/10 text-cyanAccent-light border border-cyanAccent/25 font-mono"
                  >
                    ✨ {pref}
                  </span>
                ))}
              </div>

              <div className="pt-3">
                <Link
                  to="/ai-travel-twin"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl glass-button-primary text-xs font-bold shadow-glow-cyan"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Create My Travel Twin</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Travel Twin Visual Hologram Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="glass-card p-6 rounded-3xl border border-tealAccent/40 shadow-glow-teal max-w-sm w-full space-y-4">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyanAccent to-tealAccent flex items-center justify-center text-2xl shadow-glow-cyan">
                    🤖
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">AI Travel Twin</h4>
                    <span className="text-[11px] text-tealAccent font-mono">Neural Profiler Active</span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex justify-between font-mono">
                    <span>Cultural Affinity</span>
                    <span className="text-cyanAccent font-bold">94%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyanAccent rounded-full w-[94%]" />
                  </div>

                  <div className="flex justify-between font-mono pt-1">
                    <span>Pacing Preference</span>
                    <span className="text-tealAccent font-bold">Tranquil & Balanced</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-tealAccent rounded-full w-[82%]" />
                  </div>

                  <div className="flex justify-between font-mono pt-1">
                    <span>Accessibility Conformance</span>
                    <span className="text-emerald-400 font-bold">WCAG AAA</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full w-[100%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 5: TRAVEL TOGETHER ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-white/10 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-mono font-bold tracking-widest text-cyanAccent uppercase">
                Real-Time Synchronized Metaverse
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                "Don't travel alone. Experience the world together."
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                Create a private room, share your generated room code with friends, and wander virtual destinations simultaneously. Live avatars, synchronized location waypoints, and shared landmark memories powered by real-time WebSockets.
              </p>
              <div className="pt-2">
                <Link
                  to="/travel-together"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl glass-button-primary text-xs font-bold shadow-glow-cyan"
                >
                  <Users className="w-4 h-4" />
                  <span>Create Travel Room</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Avatars Preview */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="p-6 rounded-2xl glass-panel border border-white/10 w-full max-w-sm space-y-4">
                <span className="text-xs font-mono text-tealAccent block">Room: TRAVEL-4892</span>
                <div className="flex -space-x-3 overflow-hidden py-2">
                  {[
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
                  ].map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="Traveler"
                      className="inline-block h-12 w-12 rounded-full ring-2 ring-cyanAccent object-cover"
                    />
                  ))}
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-slate-800 ring-2 ring-cyanAccent text-xs text-white font-mono">
                    +4
                  </div>
                </div>
                <p className="text-[11px] text-slate-300 font-sans">
                  Active in Dal Lake Shikara: 5 travelers exploring in synchronized audio sync.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 6: TRAVEL PASSPORT PREVIEW ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-tealAccent/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-mono text-tealAccent font-bold uppercase tracking-wider">
              Gamified Credentials
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Official Digital Travel Passport
            </h2>
            <p className="text-xs text-slate-300 max-w-xl">
              Earn stamped visas, unlock regional pioneer badges, and build your certified travel twin identity.
            </p>
          </div>

          <Link
            to="/passport"
            className="flex-shrink-0 px-7 py-3 rounded-xl glass-button-primary text-xs font-bold flex items-center gap-2 shadow-glow-teal"
          >
            <Award className="w-4 h-4" />
            <span>View My Passport</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ================= SECTION 7: FINAL CTA ================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <span className="text-xs font-mono font-bold tracking-widest text-cyanAccent uppercase">
          Universal Access
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Where will your next journey take you?
        </h2>
        <p className="text-sm text-slate-300 max-w-xl mx-auto">
          Start in Kashmir, sail through Kerala backwaters, decode the Konark Sun Chariot, or simulate your real vacation.
        </p>
        <div className="pt-2">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-9 py-4 rounded-xl glass-button-primary text-sm font-bold shadow-glow-cyan"
          >
            <span>Start Exploring</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
