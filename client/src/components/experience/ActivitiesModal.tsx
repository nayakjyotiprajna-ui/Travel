import React, { useState } from 'react';
import type { ActivityEmbedded } from '../../types';
import { X, Award, CheckCircle2, Trophy, Compass, HelpCircle, Camera, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ActivitiesModalProps {
  activities: ActivityEmbedded[];
  completedActivityIds: string[];
  isOpen: boolean;
  onClose: () => void;
  onCompleteActivity: (activity: ActivityEmbedded, xp: number) => void;
}

export const ActivitiesModal: React.FC<ActivitiesModalProps> = ({
  activities,
  completedActivityIds,
  isOpen,
  onClose,
  onCompleteActivity,
}) => {
  const [selectedActivity, setSelectedActivity] = useState<ActivityEmbedded | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [interactiveStep, setInteractiveStep] = useState<number>(1);

  if (!isOpen) return null;

  // Sample destination trivia questions
  const sampleQuiz = {
    question: 'What is the signature wooden skiff boat navigated on Dal Lake called?',
    options: ['Gondola', 'Shikara', 'Catamaran', 'Kettuvallam'],
    correctAnswer: 1,
    explanation: 'Shikaras are handcrafted cedarwood skiffs iconic to Srinagar and Kashmir waterways.',
  };

  const handleStartActivity = (act: ActivityEmbedded) => {
    setSelectedActivity(act);
    setQuizAnswer(null);
    setQuizSubmitted(false);
    setInteractiveStep(1);
  };

  const handleFinishCurrentActivity = () => {
    if (!selectedActivity) return;
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
    onCompleteActivity(selectedActivity, selectedActivity.xpReward);
    setSelectedActivity(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
    >
      <div className="glass-panel w-full max-w-xl rounded-2xl border border-cyanAccent/30 shadow-glass overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Interactive Destination Activities</h3>
              <p className="text-xs text-slate-400">Complete challenges to earn XP and level up your Travel Twin</p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedActivity(null);
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {!selectedActivity ? (
            <div className="space-y-3.5">
              {activities.map((act) => {
                const isDone = completedActivityIds.includes(act.id);
                return (
                  <div
                    key={act.id}
                    className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                      isDone
                        ? 'bg-tealAccent/10 border-tealAccent/30'
                        : 'glass-card border-white/5 hover:border-cyanAccent/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-white/5 text-cyanAccent mt-0.5">
                        {act.type === 'quiz' ? (
                          <HelpCircle className="w-5 h-5" />
                        ) : act.type === 'photo' ? (
                          <Camera className="w-5 h-5" />
                        ) : (
                          <Compass className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-white">{act.title}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyanAccent/10 text-cyanAccent font-mono">
                            +{act.xpReward} XP
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">{act.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400 font-mono">
                          <span>⏱️ {act.duration}</span>
                          <span>• Difficulty: {act.difficulty}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      {isDone ? (
                        <div className="flex items-center gap-1.5 text-xs text-tealAccent font-semibold px-3 py-1.5 rounded-full bg-tealAccent/15">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Completed</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartActivity(act)}
                          className="px-4 py-2 glass-button-primary text-xs font-semibold rounded-xl whitespace-nowrap"
                        >
                          Start
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Active Activity Play Flow */
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-mono text-cyanAccent uppercase tracking-wider">
                  Challenge in Progress: {selectedActivity.title}
                </span>
                <span className="text-xs font-mono text-amber-400">+{selectedActivity.xpReward} XP</span>
              </div>

              {selectedActivity.type === 'quiz' ? (
                /* Interactive Quiz */
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-white">{sampleQuiz.question}</h4>
                  <div className="space-y-2">
                    {sampleQuiz.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => !quizSubmitted && setQuizAnswer(idx)}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                          quizAnswer === idx
                            ? 'bg-cyanAccent/20 border-cyanAccent text-white'
                            : 'glass-card border-white/10 text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <span>{opt}</span>
                        {quizSubmitted && idx === sampleQuiz.correctAnswer && (
                          <CheckCircle2 className="w-4 h-4 text-tealAccent" />
                        )}
                      </button>
                    ))}
                  </div>

                  {quizSubmitted ? (
                    <div className="p-3 rounded-xl bg-tealAccent/10 border border-tealAccent/30 text-xs text-tealAccent-light">
                      <p className="font-semibold">Correct! {sampleQuiz.explanation}</p>
                      <button
                        onClick={handleFinishCurrentActivity}
                        className="mt-3 w-full py-2 glass-button-primary rounded-xl font-semibold text-center"
                      >
                        Claim +{selectedActivity.xpReward} XP & Complete
                      </button>
                    </div>
                  ) : (
                    <button
                      disabled={quizAnswer === null}
                      onClick={() => setQuizSubmitted(true)}
                      className="w-full py-2.5 glass-button-primary rounded-xl text-xs font-semibold disabled:opacity-50"
                    >
                      Submit Answer
                    </button>
                  )}
                </div>
              ) : (
                /* Interactive Exploration / Experience simulation */
                <div className="space-y-4">
                  <div className="p-4 rounded-xl glass-card border-cyanAccent/20">
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {selectedActivity.description}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-tealAccent font-mono">
                      <Sparkles className="w-4 h-4" />
                      <span>Phase {interactiveStep} of 2 Completed</span>
                    </div>
                  </div>

                  {interactiveStep === 1 ? (
                    <button
                      onClick={() => setInteractiveStep(2)}
                      className="w-full py-2.5 glass-button-primary rounded-xl text-xs font-semibold"
                    >
                      Inspect Landmark & Continue
                    </button>
                  ) : (
                    <button
                      onClick={handleFinishCurrentActivity}
                      className="w-full py-2.5 glass-button-primary rounded-xl text-xs font-semibold"
                    >
                      Claim +{selectedActivity.xpReward} XP Reward!
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
