import React, { useState } from 'react';
import { aiApi } from '../../services/api';
import { Sparkles, Send, Volume2, X, Bot, HelpCircle, Loader2 } from 'lucide-react';

interface AiGuideDrawerProps {
  destinationName: string;
  currentAttractionName?: string;
  isOpen: boolean;
  onClose: () => void;
  audioGuideEnabled?: boolean;
}

export const AiGuideDrawer: React.FC<AiGuideDrawerProps> = ({
  destinationName,
  currentAttractionName,
  isOpen,
  onClose,
  audioGuideEnabled,
}) => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: `Hello! I am your AI Travel Guide for ${destinationName}. You are currently at ${currentAttractionName || destinationName}. What would you like to discover about the heritage, history, or culture here?`,
    },
  ]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    `Why is ${currentAttractionName || destinationName} famous?`,
    `What local foods must I experience?`,
    `Tell me an ancient legend or history about this place.`,
    `How accessible is this site for visitors?`,
  ];

  const handleAsk = async (promptText?: string) => {
    const q = promptText || question;
    if (!q.trim() || loading) return;

    const userMsg = q;
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    if (!promptText) setQuestion('');
    setLoading(true);

    try {
      const res = await aiApi.destinationGuide({
        destination: destinationName,
        currentAttraction: currentAttractionName,
        question: userMsg,
      });

      const reply = res.data.answer;
      setMessages((prev) => [...prev, { sender: 'ai', text: reply }]);

      // If audio guide enabled, read aloud using SpeechSynthesis
      if (audioGuideEnabled && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(reply);
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `At ${destinationName}, this landmark is acclaimed for its deep cultural roots and breathtaking scenic character. Feel free to explore further!`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 glass-panel border-l border-cyanAccent/30 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyanAccent to-tealAccent flex items-center justify-center text-navy-950 font-bold shadow-glow-cyan">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              AI Travel Director & Guide
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </h3>
            <p className="text-[10px] text-tealAccent font-mono">{destinationName} • Live Guide</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
          aria-label="Close Guide"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-3 bg-white/5 border-b border-white/5 overflow-x-auto flex gap-2 no-scrollbar">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleAsk(p)}
            className="flex-shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-cyanAccent/10 text-cyanAccent-light border border-cyanAccent/20 hover:bg-cyanAccent/20 transition-colors whitespace-nowrap"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Message Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[88%] ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-tealAccent-dark to-cyanAccent-dark text-white rounded-br-none shadow-md'
                  : 'glass-card border-white/10 text-slate-100 rounded-bl-none shadow-sm'
              }`}
            >
              {msg.text}
            </div>

            {msg.sender === 'ai' && (
              <button
                onClick={() => speakText(msg.text)}
                className="mt-1 flex items-center gap-1 text-[10px] text-slate-400 hover:text-cyanAccent transition-colors px-1"
                title="Read aloud"
              >
                <Volume2 className="w-3 h-3" />
                <span>Listen</span>
              </button>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 p-3 text-xs text-slate-400 glass-card rounded-2xl w-fit">
            <Loader2 className="w-4 h-4 animate-spin text-cyanAccent" />
            <span>Consulting regional historical archive...</span>
          </div>
        )}
      </div>

      {/* Input box */}
      <div className="p-3 border-t border-white/10 bg-navy-950/60">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={`Ask anything about ${destinationName}...`}
            className="flex-1 glass-input rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!question.trim() || loading}
            className="p-2.5 rounded-xl glass-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
