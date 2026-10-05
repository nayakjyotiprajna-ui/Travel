import React, { useState, useEffect } from 'react';
import { memoryApi } from '../services/api';
import type { Memory } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Camera, Trash2, X, Eye, Calendar, MapPin, Tag, Cloud } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MemoriesPage: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  const fetchMemories = async () => {
    setLoading(true);
    try {
      const res = await memoryApi.getAll();
      if (res.data.success) {
        setMemories(res.data.memories);
      }
    } catch (err) {
      console.warn('Error fetching memories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to remove this memory from your album?')) return;

    try {
      await memoryApi.delete(id);
      setMemories((prev) => prev.filter((m) => m._id !== id));
      if (selectedMemory?._id === id) setSelectedMemory(null);
    } catch (err) {
      alert('Failed to delete memory.');
    }
  };

  if (loading) return <LoadingSpinner label="Opening Journey Memories Vault..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold tracking-widest text-tealAccent uppercase">
              Personal Album
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyanAccent/15 text-cyanAccent border border-cyanAccent/30 flex items-center gap-1">
              <Cloud className="w-3 h-3" />
              <span>Firebase Cloud Storage</span>
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-1 flex items-center gap-3">
            <Camera className="w-8 h-8 text-cyanAccent" />
            <span>My Journey Memories</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Snapshots and reflections captured during your 3D virtual visits and explorations.
          </p>
        </div>

        <Link
          to="/virtual-visit"
          className="px-5 py-2.5 glass-button-primary rounded-xl text-xs font-bold shadow-glow-cyan flex items-center gap-2"
        >
          <Camera className="w-4 h-4" />
          <span>Capture New Memory</span>
        </Link>
      </div>

      {/* Grid Gallery */}
      {memories.length === 0 ? (
        <EmptyState
          icon={Camera}
          title="No journey memories captured yet"
          description="Start a virtual visit to any destination and click [Capture Memory] in the bottom dock to save photographs and captions."
          actionText="Start Virtual Visit"
          onAction={() => (window.location.href = '/virtual-visit')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {memories.map((m) => (
            <div
              key={m._id}
              onClick={() => setSelectedMemory(m)}
              className="glass-card rounded-2xl overflow-hidden group border border-white/10 hover:border-cyanAccent/40 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="relative h-60 overflow-hidden">
                <img
                  src={m.imageUrl}
                  alt={m.caption}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent" />

                <button
                  onClick={(e) => handleDelete(m._id, e)}
                  className="absolute top-3 right-3 p-2 rounded-lg bg-navy-950/70 border border-white/10 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Delete memory"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyanAccent/20 text-cyanAccent-light border border-cyanAccent/30 backdrop-blur-md">
                    {m.destinationName}
                  </span>
                  <h4 className="text-xs font-bold text-white mt-1 truncate">{m.sceneName}</h4>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <p className="text-xs text-slate-300 italic line-clamp-2">"{m.caption}"</p>
                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(m.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-cyanAccent hover:underline">Inspect Details →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Memory Zoom Modal */}
      {selectedMemory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <div className="glass-panel w-full max-w-2xl rounded-3xl border border-cyanAccent/30 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="relative h-80 sm:h-96">
              <img
                src={selectedMemory.imageUrl}
                alt={selectedMemory.caption}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedMemory(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-navy-950/80 text-white border border-white/10 hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-cyanAccent uppercase">
                    {selectedMemory.destinationName}
                  </span>
                  <h3 className="text-lg font-bold text-white">{selectedMemory.sceneName}</h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {new Date(selectedMemory.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="text-sm text-slate-200 leading-relaxed font-sans bg-white/5 p-4 rounded-xl border border-white/5">
                "{selectedMemory.caption}"
              </p>

              {selectedMemory.tags && selectedMemory.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedMemory.tags.map((t, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-tealAccent/15 text-tealAccent-light border border-tealAccent/25"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
