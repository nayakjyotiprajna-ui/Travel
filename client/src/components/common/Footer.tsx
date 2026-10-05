import React from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, ShieldCheck, Sparkles, Globe2, Compass } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="glass-panel border-t border-white/10 mt-20 pt-16 pb-12 relative overflow-hidden">
      {/* Background soft ambient blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-cyanAccent/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="text-2xl" role="img" aria-label="Globe">🌍</span>
              <span className="text-xl font-bold tracking-tight text-white">
                Travel<span className="text-gradient-teal">Twin</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              "Experience the journey. Before, instead of, or beyond travel."
              An AI-powered Virtual Travel & Accessibility Platform empowering everyone to explore our world freely.
            </p>
            <div className="flex items-center gap-2 text-xs text-tealAccent-light bg-tealAccent/10 border border-tealAccent/20 px-3 py-1.5 rounded-full w-fit">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>WCAG 2.1 AAA Accessibility Designed</span>
            </div>
          </div>

          {/* Travel Modes */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Two Ways To Travel</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/virtual-visit" className="hover:text-cyanAccent transition-colors flex items-center gap-1.5">
                  <span className="text-xs">🥽</span> Mode 1: Virtual Visit
                </Link>
              </li>
              <li>
                <Link to="/simulate" className="hover:text-cyanAccent transition-colors flex items-center gap-1.5">
                  <span className="text-xs">✈️</span> Mode 2: Trip Simulation
                </Link>
              </li>
              <li>
                <Link to="/ai-travel-twin" className="hover:text-cyanAccent transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-skyAccent" /> AI Travel Twin
                </Link>
              </li>
              <li>
                <Link to="/travel-together" className="hover:text-cyanAccent transition-colors flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5 text-tealAccent" /> Travel Together
                </Link>
              </li>
            </ul>
          </div>

          {/* Discovery & Gamification */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Passport & Memories</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/passport" className="hover:text-cyanAccent transition-colors">Digital Passport</Link>
              </li>
              <li>
                <Link to="/memories" className="hover:text-cyanAccent transition-colors">Journey Memories</Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-cyanAccent transition-colors">Destinations Atlas</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-cyanAccent transition-colors">Explorer Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Featured Destinations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Iconic Journeys</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/explore" className="hover:text-cyanAccent transition-colors">Kashmir Alpine Solace</Link></li>
              <li><Link to="/explore" className="hover:text-cyanAccent transition-colors">Goa Coastal Susegad</Link></li>
              <li><Link to="/explore" className="hover:text-cyanAccent transition-colors">Konark Sun Temple</Link></li>
              <li><Link to="/explore" className="hover:text-cyanAccent transition-colors">Rajasthan Desert Royalty</Link></li>
              <li><Link to="/explore" className="hover:text-cyanAccent transition-colors">Kerala Backwaters</Link></li>
              <li><Link to="/explore" className="hover:text-cyanAccent transition-colors">Ladakh High Passes</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} TravelTwin Platform. Built for Innovation & Universal Access.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-tealAccent" /> AI Travel Director Engine
            </span>
            <span>Real 3D WebXR Simulation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
