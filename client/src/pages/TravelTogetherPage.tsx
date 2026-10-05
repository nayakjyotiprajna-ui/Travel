import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { destinationApi, roomApi } from '../services/api';
import type { Destination, TravelRoom } from '../types';
import { TravelRoomView } from '../components/room/TravelRoomView';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  Users,
  Compass,
  KeyRound,
  ArrowRight,
  Radio,
  Sparkles,
  ShieldCheck,
  Eye,
  Plus
} from 'lucide-react';

export const TravelTogetherPage: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeRoom, setActiveRoom] = useState<TravelRoom | null>(null);
  const [selectedDestId, setSelectedDestId] = useState<string>('');
  const [joinCode, setJoinCode] = useState<string>('');
  const [actionError, setActionError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await destinationApi.getAll();
        if (res.data.success && res.data.destinations.length > 0) {
          setDestinations(res.data.destinations);
          setSelectedDestId(res.data.destinations[0]._id);
        }
      } catch (err) {
        console.warn('Error fetching destinations for rooms');
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDestId) return;
    setIsProcessing(true);
    setActionError('');

    try {
      const res = await roomApi.create(selectedDestId);
      if (res.data.success) {
        setActiveRoom(res.data.room);
      }
    } catch (err: any) {
      setActionError(err.response?.data?.message || 'Failed to create room. Please log in first.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setIsProcessing(true);
    setActionError('');

    try {
      const res = await roomApi.join(joinCode.trim());
      if (res.data.success) {
        setActiveRoom(res.data.room);
      }
    } catch (err: any) {
      setActionError(err.response?.data?.message || 'Invalid room code. Please check and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading Travel Together gateway..." />;

  if (activeRoom) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <TravelRoomView
          initialRoom={activeRoom}
          onLeaveRoom={() => setActiveRoom(null)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-cyanAccent/20 border border-cyanAccent/30 flex items-center justify-center text-cyanAccent shadow-glow-cyan mb-2">
          <Users className="w-7 h-7" />
        </div>
        <span className="text-xs font-mono font-bold tracking-widest text-tealAccent uppercase">
          Real-Time Metaverse Synchronization
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          Travel Together
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-sans">
          "Don't travel alone. Experience the world together."
          Create a synchronized room, invite friends with a code, and share real-time virtual waypoints.
        </p>
      </div>

      {actionError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 text-center font-mono">
          {actionError}
        </div>
      )}

      {/* Two Column: Create Room vs Join Room */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Create Room Box */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-tealAccent/30 space-y-5 shadow-glass flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-tealAccent/20 text-tealAccent">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Create a Travel Room</h3>
                <span className="text-xs text-slate-400">Generates unique TRAVEL-XXXX code</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Choose a destination to host a synchronized exploration room. You will control landmark waypoints and lead your companions.
            </p>

            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5 font-mono">
                  Select Destination:
                </label>
                <select
                  value={selectedDestId}
                  onChange={(e) => setSelectedDestId(e.target.value)}
                  className="w-full glass-input rounded-xl p-3 text-xs text-white"
                >
                  {destinations.map((d) => (
                    <option key={d._id} value={d._id} className="bg-navy-900 text-white">
                      {d.name} ({d.state})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 glass-button-primary rounded-xl text-xs font-bold shadow-glow-teal flex items-center justify-center gap-2"
              >
                <span>Create New Room</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Join Room Box */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-cyanAccent/30 space-y-5 shadow-glass flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyanAccent/20 text-cyanAccent">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Join with Room Code</h3>
                <span className="text-xs text-slate-400">Enter code shared by your friend</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Have an invitation code? Paste it here to instantly enter your companion's synchronized 3D travel session.
            </p>

            <form onSubmit={handleJoinRoom} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5 font-mono">
                  Room Code (e.g. TRAVEL-4892):
                </label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="TRAVEL-XXXX"
                  className="w-full glass-input rounded-xl p-3 text-xs text-white uppercase font-mono tracking-widest"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isProcessing || !joinCode.trim()}
                className="w-full py-3 glass-button-secondary rounded-xl text-xs font-bold hover:border-cyanAccent text-white flex items-center justify-center gap-2"
              >
                <span>Enter Companion Room</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="p-6 rounded-2xl glass-panel border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
        <div className="flex items-center gap-2.5">
          <Radio className="w-4 h-4 text-cyanAccent flex-shrink-0" />
          <span>Real-time Socket.IO WebSockets synchronization</span>
        </div>
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-tealAccent flex-shrink-0" />
          <span>Zero simulated bot players — real presence only</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Eye className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>Shared camera focus & collective memory capturing</span>
        </div>
      </div>
    </div>
  );
};
