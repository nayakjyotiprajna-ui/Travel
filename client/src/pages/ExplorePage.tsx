import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { destinationApi } from '../services/api';
import type { Destination } from '../types';
import { InteractiveGlobe } from '../components/3d/InteractiveGlobe';
import { SkeletonCard } from '../components/common/SkeletonCard';
import { EmptyState } from '../components/common/EmptyState';
import {
  Search,
  Filter,
  Eye,
  Sliders,
  MapPin,
  Globe2,
  LayoutGrid,
  CheckCircle,
  Accessibility as AccessibilityIcon
} from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showGlobe, setShowGlobe] = useState(false);

  const categories = [
    'All',
    'Mountains',
    'Beaches',
    'Heritage',
    'Nature',
    'Culture',
    'Adventure',
    'Accessible Only',
  ];

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const categoryParam = selectedCategory === 'All' || selectedCategory === 'Accessible Only' ? undefined : selectedCategory;
      const res = await destinationApi.getAll({
        search: searchQuery || undefined,
        category: categoryParam,
      });

      if (res.data.success) {
        let list = res.data.destinations;
        if (selectedCategory === 'Accessible Only') {
          list = list.filter((d) => d.accessibility?.wheelchairAccessible);
        }
        setDestinations(list);
      }
    } catch (err) {
      console.warn('Error fetching destinations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDestinations();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-tealAccent uppercase">
            Global Destinations Atlas
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
            Explore the World in High Fidelity
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Choose between immersive virtual visits with full sensory accessibility or pre-travel simulations for real expeditions.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl glass-panel border border-white/10">
          <button
            onClick={() => setShowGlobe(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              !showGlobe ? 'bg-cyanAccent text-navy-950 shadow-glow-cyan' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>
          <button
            onClick={() => setShowGlobe(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              showGlobe ? 'bg-cyanAccent text-navy-950 shadow-glow-cyan' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>3D Earth</span>
          </button>
        </div>
      </div>

      {/* 3D Earth Toggle View */}
      {showGlobe && (
        <div className="animate-in fade-in duration-200">
          <InteractiveGlobe
            onSelectDestination={(destName) => {
              setSearchQuery(destName);
              setSelectedCategory('All');
              setShowGlobe(false);
            }}
          />
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by destination name, state, or keywords (e.g. Kashmir, Sun Temple)..."
              className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 glass-button-primary rounded-xl text-xs font-bold shadow-glow-cyan"
          >
            Search
          </button>
        </form>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-cyanAccent/20 text-cyanAccent-light border border-cyanAccent shadow-glow-cyan'
                  : 'glass-card text-slate-400 border-white/5 hover:text-white'
              }`}
            >
              {cat === 'Accessible Only' ? (
                <span className="flex items-center gap-1">
                  <AccessibilityIcon className="w-3.5 h-3.5 text-tealAccent" />
                  Accessible Only
                </span>
              ) : (
                cat
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Destinations Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : destinations.length === 0 ? (
        <EmptyState
          title="No destinations match your criteria"
          description="Try broadening your search term or selecting 'All' in categories."
          actionText="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('All');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => (
            <div
              key={dest._id}
              className="glass-card rounded-2xl overflow-hidden group border border-white/10 hover:border-cyanAccent/40 flex flex-col justify-between"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={dest.bannerImage}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-black/20" />
                <span className="absolute top-3 left-3 text-[10px] font-mono px-2.5 py-1 rounded-full bg-navy-950/80 backdrop-blur-md border border-white/10 text-cyanAccent-light">
                  {dest.category}
                </span>

                {dest.accessibility?.wheelchairAccessible && (
                  <span className="absolute top-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded-full bg-tealAccent/20 backdrop-blur-md border border-tealAccent/30 text-tealAccent-light flex items-center gap-1">
                    <AccessibilityIcon className="w-3 h-3" /> Step-Free
                  </span>
                )}

                <span className="absolute bottom-3 left-3 text-xs text-slate-300 font-mono flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-tealAccent" />
                  {dest.state}, {dest.country}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <Link
                    to={`/destination/${dest._id}`}
                    className="text-xl font-bold text-white tracking-tight hover:text-cyanAccent transition-colors block"
                  >
                    {dest.name}
                  </Link>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed font-sans">
                    {dest.shortDescription}
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Terrain: {dest.accessibility?.terrainDifficulty || 'Moderate'}</span>
                    <span>Best: {dest.simulationDefaults?.bestSeason?.split(' ')[0] || 'Autumn'}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to={`/virtual-visit?destination=${encodeURIComponent(dest.name)}`}
                      className="py-2.5 text-center rounded-xl glass-button-primary text-xs font-semibold flex items-center justify-center gap-1.5 shadow-glow-cyan"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Virtual Visit</span>
                    </Link>
                    <Link
                      to={`/simulate?destination=${encodeURIComponent(dest.name)}`}
                      className="py-2.5 text-center rounded-xl glass-button-secondary text-xs font-medium text-slate-300 hover:text-white flex items-center justify-center gap-1.5"
                    >
                      <Sliders className="w-3.5 h-3.5 text-cyanAccent" />
                      <span>Simulate Trip</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
