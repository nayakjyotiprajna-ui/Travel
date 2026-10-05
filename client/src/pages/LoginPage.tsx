import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleAuthButton } from '../components/common/GoogleAuthButton';
import { LogIn, ArrowRight, Sparkles, Shield, AlertCircle, Loader2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: 'traveler' | 'admin') => {
    setError('');
    setLoading(true);
    const demoEmail = role === 'admin' ? 'admin@traveltwin.com' : 'demo@traveltwin.com';
    const demoPassword = 'traveltwin2026';

    try {
      await login({ email: demoEmail, password: demoPassword });
      navigate(role === 'admin' ? '/admin' : '/dashboard');
    } catch (err: any) {
      // In case server wasn't seeded yet, fall back with direct mock
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-panel p-8 sm:p-10 rounded-3xl border border-cyanAccent/30 shadow-glass space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-cyanAccent/20 border border-cyanAccent/30 flex items-center justify-center text-2xl shadow-glow-cyan">
            🌍
          </div>
          <h1 className="text-2xl font-extrabold text-white">Log in to TravelTwin</h1>
          <p className="text-xs text-slate-300">
            Access your AI Travel Twin, Digital Passport, and saved simulations.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5 font-mono">
              Email Address:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="explorer@domain.com"
              className="w-full glass-input rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 font-mono">Password:</label>
              <Link to="/forgot-password" className="text-[11px] text-cyanAccent hover:underline">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full glass-input rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 glass-button-primary rounded-xl text-xs font-bold shadow-glow-cyan flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            <span>Sign In to Explorer Account</span>
          </button>
        </form>

        {/* Firebase Authentication Divider & Button */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink mx-3 text-[10px] uppercase font-mono text-slate-400">Or continue with</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <GoogleAuthButton buttonText="Sign In with Google" redirectTo="/dashboard" />

        {/* Quick Demo Access Bar */}
        <div className="pt-2 border-t border-white/10 space-y-2">
          <span className="text-[10px] font-mono text-slate-400 block text-center uppercase tracking-wider">
            One-Click Demo Credentials (Competition Ready)
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickDemo('traveler')}
              className="py-2 text-[11px] font-mono rounded-lg bg-tealAccent/15 text-tealAccent-light border border-tealAccent/30 hover:bg-tealAccent/25 transition-colors"
            >
              Demo Traveler
            </button>
            <button
              onClick={() => handleQuickDemo('admin')}
              className="py-2 text-[11px] font-mono rounded-lg bg-aurora-purple/15 text-aurora-purple border border-aurora-purple/30 hover:bg-aurora-purple/25 transition-colors"
            >
              Demo Admin
            </button>
          </div>
        </div>

        <div className="text-center pt-2 text-xs text-slate-400">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-cyanAccent hover:underline font-semibold">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};
