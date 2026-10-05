import React, { useState, useEffect } from 'react';
import type { TravelRoom } from '../../types';
import { getSocket } from '../../services/socket';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  Copy,
  Check,
  Send,
  MapPin,
  Sparkles,
  MessageSquare,
  Compass,
  Eye,
  LogOut,
  Radio
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface TravelRoomViewProps {
  initialRoom: TravelRoom;
  onLeaveRoom: () => void;
}

export const TravelRoomView: React.FC<TravelRoomViewProps> = ({ initialRoom, onLeaveRoom }) => {
  const { user } = useAuth();
  const [room, setRoom] = useState<TravelRoom>(initialRoom);
  const [copied, setCopied] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<any[]>(initialRoom.chatMessages || []);
  const [participants, setParticipants] = useState<any[]>(initialRoom.participants || []);
  const socket = getSocket();

  useEffect(() => {
    // Join room channel on Socket.IO
    socket.emit('room:join', { roomCode: room.roomCode, user });

    // Listen to participant joins
    socket.on('room:participant_joined', (participant) => {
      setParticipants((prev) => {
        if (prev.some((p) => p.userId === participant.userId)) return prev;
        return [...prev, participant];
      });
    });

    // Listen to participant leaves
    socket.on('room:participant_left', ({ userId }) => {
      setParticipants((prev) => prev.filter((p) => p.userId !== userId));
    });

    // Listen to real-time chat messages
    socket.on('chat:received', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Listen to shared location changes
    socket.on('journey:updated', ({ location }) => {
      setRoom((prev) => ({ ...prev, currentLocation: location }));
    });

    return () => {
      socket.emit('room:leave', { roomCode: room.roomCode, user });
      socket.off('room:participant_joined');
      socket.off('room:participant_left');
      socket.off('chat:received');
      socket.off('journey:updated');
    };
  }, [room.roomCode]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(room.roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    socket.emit('chat:message', {
      roomCode: room.roomCode,
      message: {
        senderId: user?.id,
        senderName: user?.name || 'Explorer',
        text: chatInput.trim(),
      },
    });

    setChatInput('');
  };

  return (
    <div className="space-y-6">
      {/* Room Control Bar */}
      <div className="glass-panel p-5 sm:p-7 rounded-3xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-tealAccent/15 border border-tealAccent/30 text-tealAccent font-mono text-xs">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              Live Multiplayer Travel Room
            </span>
            <span className="text-xs font-mono text-slate-400">
              Destination: {room.destinationName}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-white mt-1">
            Exploring {room.destinationName} Together
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Current Landmark: <span className="text-cyanAccent font-semibold">{room.currentLocation}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Room Code Badge */}
          <div className="flex items-center gap-2 bg-navy-950/80 border border-cyanAccent/30 px-3.5 py-2 rounded-xl">
            <span className="text-xs font-mono text-slate-400">Code:</span>
            <span className="text-sm font-mono font-bold text-cyanAccent tracking-widest">
              {room.roomCode}
            </span>
            <button
              onClick={handleCopyCode}
              className="p-1 text-slate-400 hover:text-white rounded"
              title="Copy Room Code"
            >
              {copied ? <Check className="w-4 h-4 text-tealAccent" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <Link
            to={`/experience/${room.destinationId?._id || room.destinationId || ''}`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass-button-primary text-xs font-semibold"
          >
            <Eye className="w-4 h-4" />
            <span>Enter 3D Space</span>
          </Link>

          <button
            onClick={onLeaveRoom}
            className="p-2.5 rounded-xl glass-button-secondary text-red-400 hover:bg-red-500/10"
            title="Leave Room"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Room Grid: Participants + Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Participants Column */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyanAccent" />
              Travel Companions ({participants.length})
            </h3>
            <span className="text-[10px] text-tealAccent font-mono">Synchronized</span>
          </div>

          <div className="space-y-3">
            {participants.map((p, idx) => (
              <div
                key={p.userId || idx}
                className="p-3 rounded-xl glass-card border-white/5 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={
                      p.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                    }
                    alt={p.name}
                    className="w-9 h-9 rounded-full object-cover border border-cyanAccent/30"
                  />
                  <div>
                    <h4 className="text-xs font-semibold text-white">{p.name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {p.isHost ? '👑 Room Host' : 'Travel Companion'}
                    </span>
                  </div>
                </div>

                <div className="w-2.5 h-2.5 rounded-full bg-tealAccent shadow-glow-teal animate-pulse" />
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-cyanAccent/10 border border-cyanAccent/20 text-xs text-slate-200">
            <p className="font-semibold text-cyanAccent mb-1">Shared Virtual Presence</p>
            When any companion inspects a hotspot, the landmark waypoint automatically updates for all travelers in this room.
          </div>
        </div>

        {/* Real-Time Room Chat */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-white/10 flex flex-col h-[460px]">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-skyAccent" />
              Live Room Dialogue & Activity Log
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Socket.IO Encrypted</span>
          </div>

          {/* Messages Scroller */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((m, idx) => {
              const isMe = m.senderId === user?.id;
              const isSystem = m.senderId === 'system';

              if (isSystem) {
                return (
                  <div key={idx} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center text-xs text-slate-300 font-sans">
                    ✨ {m.text}
                  </div>
                );
              }

              return (
                <div
                  key={idx}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-slate-400 mb-1 px-1 font-mono">
                    {m.senderName}
                  </span>
                  <div
                    className={`p-3 rounded-2xl text-xs max-w-[80%] ${
                      isMe
                        ? 'bg-gradient-to-r from-tealAccent-dark to-cyanAccent-dark text-white rounded-br-none'
                        : 'glass-card text-slate-100 rounded-bl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Form */}
          <form onSubmit={handleSendMessage} className="pt-3 border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Message your travel room companions..."
              className="flex-1 glass-input rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="p-2.5 rounded-xl glass-button-primary disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
