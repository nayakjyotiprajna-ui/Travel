import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleAuthButton } from '../components/common/GoogleAuthButton';
import { UserPlus, ArrowRight, AlertCircle, Loader2, Sparkles } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [travellerType, setTravellerType] = useState('Explorer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await register({
        name,
        email,
        password,
        confirmPassword,
        travellerType,
        travelPreferences: ['Mountains', 'Culture'],
      });
      navigate('/ai-travel-twin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-panel p-8 sm:p-10 rounded-3xl border border-tealAccent/30 shadow-glass space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-tealAccent/20 border border-tealAccent/30 flex items-center justify-center text-2xl shadow-glow-teal">
            🧭
          </div>
          <h1 className="text-2xl font-extrabold text-white">Create TravelTwin Account</h1>
          <p className="text-xs text-slate-300">
            Join the AI-powered virtual exploration platform.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-300 block mb-1 font-mono">Full Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Aria Sharma"
              className="w-full glass-input rounded-xl p-3 text-white placeholder-slate-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1 font-mono">Email Address:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="explorer@domain.com"
              className="w-full glass-input rounded-xl p-3 text-white placeholder-slate-400 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-300 block mb-1 font-mono">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full glass-input rounded-xl p-3 text-white placeholder-slate-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-slate-300 block mb-1 font-mono">Confirm:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full glass-input rounded-xl p-3 text-white placeholder-slate-400 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1 font-mono">
              Travel Style (You can customize later):
            </label>
            <select
              value={travellerType}
              onChange={(e) => setTravellerType(e.target.value)}
              className="w-full glass-input rounded-xl p-3 text-white"
            >
              <option value="Explorer">Explorer — Curious & adventurous</option>
              <option value="Peaceful Traveller">Peaceful Traveller — Calm & reflective</option>
              <option value="Culture Lover">Culture Lover — Heritage & folklore</option>
              <option value="Photographer">Photographer — Vistas & lighting</option>
              <option value="Family Traveller">Family Traveller — Safe & multigenerational</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 glass-button-primary rounded-xl text-xs font-bold shadow-glow-cyan flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            <span>Create Travel Twin Account</span>
          </button>
        </form>

        {/* Firebase Authentication Divider & Button */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink mx-3 text-[10px] uppercase font-mono text-slate-400">Or sign up with</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <GoogleAuthButton buttonText="Sign Up with Google" redirectTo="/ai-travel-twin" />

        <div className="text-center pt-2 text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-cyanAccent hover:underline font-semibold">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
