import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface AudioAmbianceProps {
  destinationCategory?: string;
  autoPlay?: boolean;
}

export const AudioAmbiance: React.FC<AudioAmbianceProps> = ({ destinationCategory = 'Mountains', autoPlay = false }) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<any>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
      gainNodeRef.current = audioCtxRef.current.createGain();
      gainNodeRef.current.gain.value = 0.08; // Gentle, relaxing volume
      gainNodeRef.current.connect(audioCtxRef.current.destination);
    }

    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playChimeOrWave = () => {
    if (!audioCtxRef.current || !gainNodeRef.current || !isPlaying) return;

    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();

    // Pentatonic scale chime for serenity (Santoor / meditation vibe)
    const pitches = destinationCategory === 'Mountains'
      ? [261.63, 293.66, 329.63, 392.00, 440.00, 523.25] // C pentatonic
      : [220.00, 261.63, 293.66, 349.23, 392.00, 440.00]; // A minor gentle wave

    const randomPitch = pitches[Math.floor(Math.random() * pitches.length)];
    osc.type = destinationCategory === 'Beaches' ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(randomPitch, ctx.currentTime);

    noteGain.gain.setValueAtTime(0, ctx.currentTime);
    noteGain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 1.2);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 4.5);

    osc.connect(noteGain);
    noteGain.connect(gainNodeRef.current);

    osc.start();
    osc.stop(ctx.currentTime + 4.6);
  };

  useEffect(() => {
    if (isPlaying) {
      initAudio();
      playChimeOrWave();
      intervalRef.current = setInterval(() => {
        playChimeOrWave();
      }, 3800);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, destinationCategory]);

  const toggleSound = () => {
    initAudio();
    setIsPlaying(!isPlaying);
  };

  return (
    <button
      onClick={toggleSound}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
        isPlaying
          ? 'bg-tealAccent/20 text-tealAccent-light border border-tealAccent/40 shadow-glow-teal'
          : 'glass-button-secondary text-slate-400 hover:text-white'
      }`}
      title={isPlaying ? 'Mute ambient soundscape' : 'Enable relaxing ambient soundscape'}
      aria-label="Toggle ambient soundscape"
    >
      {isPlaying ? (
        <>
          <Volume2 className="w-3.5 h-3.5 animate-pulse" />
          <span className="hidden sm:inline">Ambiance: On</span>
        </>
      ) : (
        <>
          <VolumeX className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ambiance: Off</span>
        </>
      )}
    </button>
  );
};
