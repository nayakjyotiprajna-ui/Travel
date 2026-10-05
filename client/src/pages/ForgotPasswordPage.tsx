import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, ArrowLeft, Check, Loader2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 shadow-glass space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-cyanAccent/20 border border-cyanAccent/30 flex items-center justify-center text-cyanAccent shadow-glow-cyan">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Reset Account Access</h1>
          <p className="text-xs text-slate-300">
            Enter your registered email to receive authentication restoration instructions.
          </p>
        </div>

        {submitted ? (
          <div className="p-5 rounded-2xl bg-tealAccent/15 border border-tealAccent/30 text-center space-y-3">
            <Check className="w-8 h-8 text-tealAccent mx-auto" />
            <p className="text-xs text-slate-200 leading-relaxed">
              If an account is associated with <strong>{email}</strong>, a recovery link has been dispatched.
            </p>
            <Link
              to="/login"
              className="inline-block px-5 py-2 glass-button-primary text-xs font-semibold rounded-xl"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-300 block mb-1 font-mono">
                Registered Email:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="explorer@domain.com"
                className="w-full glass-input rounded-xl p-3 text-white placeholder-slate-400 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 glass-button-primary rounded-xl text-xs font-bold shadow-glow-cyan flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              <span>Send Recovery Link</span>
            </button>
          </form>
        )}

        <div className="text-center pt-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
