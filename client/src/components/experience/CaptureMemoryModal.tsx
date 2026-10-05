import React, { useState } from 'react';
import type { Destination } from '../../types';
import { memoryApi } from '../../services/api';
import { uploadMemoryImage } from '../../services/firebaseStorage';
import { isFirebaseConfigured } from '../../config/firebase';
import { Camera, X, Check, Sparkles, Image as ImageIcon, Loader2, Upload, Cloud } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CaptureMemoryModalProps {
  destination: Destination;
  currentAttractionName: string;
  isOpen: boolean;
  onClose: () => void;
  onMemorySaved?: (memory: any) => void;
}

export const CaptureMemoryModal: React.FC<CaptureMemoryModalProps> = ({
  destination,
  currentAttractionName,
  isOpen,
  onClose,
  onMemorySaved,
}) => {
  const [caption, setCaption] = useState(
    `Breathtaking moment at ${currentAttractionName || destination.name}. The atmosphere is truly serene.`
  );
  const [selectedTag, setSelectedTag] = useState<string>('Serene Horizon');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [customFile, setCustomFile] = useState<File | null>(null);
  const [customPreview, setCustomPreview] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');

  if (!isOpen) return null;

  const currentImage = customPreview || destination.images[0] || destination.bannerImage;

  const tags = ['Serene Horizon', 'Cultural Wonder', 'Golden Sunset', 'Alpine Majesty', 'Ancient Architecture'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCustomFile(file);
      setCustomPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim() || saving) return;

    setSaving(true);
    try {
      let finalImageUrl = destination.images[0] || destination.bannerImage;

      if (customFile) {
        setStatusMessage('Uploading to Firebase Storage...');
        finalImageUrl = await uploadMemoryImage(customFile, 'user', destination.name);
      }

      setStatusMessage('Saving to Memories Album...');
      const res = await memoryApi.create({
        destinationId: destination._id,
        imageUrl: finalImageUrl,
        caption: caption.trim(),
        sceneName: currentAttractionName || `${destination.name} Viewpoint`,
        tags: [destination.category, selectedTag],
      });

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });

      setSuccess(true);
      if (onMemorySaved) onMemorySaved(res.data.memory);

      setTimeout(() => {
        setSuccess(false);
        setCustomFile(null);
        setCustomPreview(null);
        setStatusMessage('');
        onClose();
      }, 1400);
    } catch (err: any) {
      alert('Could not save memory. Please ensure you are logged in.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
    >
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-cyanAccent/30 shadow-glass overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyanAccent/20 border border-cyanAccent/30 flex items-center justify-center text-cyanAccent">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Capture Journey Memory</h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {destination.name} • {currentAttractionName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-5 space-y-4">
          {/* Snapshot View */}
          <div className="relative h-48 rounded-xl overflow-hidden border border-white/15 shadow-inner group">
            <img
              src={currentImage}
              alt={currentAttractionName}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-transparent to-black/20" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-white px-2.5 py-1 rounded-full bg-navy-900/80 backdrop-blur-sm border border-white/10 font-mono">
                📸 {customFile ? customFile.name : currentAttractionName}
              </span>
              <span className="text-[10px] text-tealAccent font-mono bg-tealAccent/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                {customFile ? (
                  <>
                    <Cloud className="w-3 h-3" />
                    <span>Firebase Upload</span>
                  </>
                ) : (
                  <span>HD 3D Render</span>
                )}
              </span>
            </div>
          </div>

          {/* Photo Source Switcher */}
          <div className="flex items-center justify-between text-[11px] bg-navy-900/40 p-2 rounded-xl border border-white/10">
            <label className="flex items-center gap-1.5 cursor-pointer text-cyanAccent hover:text-cyanAccent-light transition-colors font-medium">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Custom Photo (Firebase Cloud)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {customFile && (
              <button
                type="button"
                onClick={() => {
                  setCustomFile(null);
                  setCustomPreview(null);
                }}
                className="text-slate-400 hover:text-white underline text-[10px]"
              >
                Reset to 3D Scene
              </button>
            )}
          </div>

          {/* Caption Input */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Personal Reflection / Caption
            </label>
            <textarea
              rows={2}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What did this scenic vista make you feel?"
              className="w-full glass-input rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none"
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Select Memory Tag
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setSelectedTag(t)}
                  className={`text-[11px] px-3 py-1 rounded-full border transition-all ${
                    selectedTag === t
                      ? 'bg-cyanAccent/25 text-cyanAccent-light border-cyanAccent shadow-glow-cyan'
                      : 'glass-card border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  #{t}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving || success}
            className="w-full py-2.5 glass-button-primary rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-glow-cyan"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{statusMessage || 'Storing in Travel Twin Archive...'}</span>
              </>
            ) : success ? (
              <>
                <Check className="w-4 h-4 text-tealAccent-light" />
                <span>Saved to Memories Album!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Save to Journey Memories Album</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
