import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import {
  Globe,
  Compass,
  Sparkles,
  Eye,
  Sliders,
  Users,
  Award,
  LayoutDashboard,
  Shield,
  Menu,
  X,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Bell,
  HeartHandshake
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { setIsModalOpen } = useAccessibility();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/', icon: Globe },
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'AI Travel Twin', path: '/ai-travel-twin', icon: Sparkles },
    { name: 'Virtual Visit', path: '/virtual-visit', icon: Eye },
    { name: 'Pre-Travel Simulation', path: '/simulate', icon: Sliders },
    { name: 'Travel Together', path: '/travel-together', icon: Users },
    { name: 'My Passport', path: '/passport', icon: Award },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-cyanAccent rounded-lg p-1">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyanAccent-dark via-tealAccent to-skyAccent flex items-center justify-center shadow-glow-cyan transition-transform group-hover:scale-105">
              <span className="text-2xl select-none" role="img" aria-label="Globe">🌍</span>
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-white flex items-center gap-1.5 font-sans">
                Travel<span className="text-gradient-teal">Twin</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block -mt-1 font-mono font-medium">
                Virtual & Simulation Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs 2xl:text-sm font-medium transition-all ${
                    active
                      ? 'bg-cyanAccent/15 text-cyanAccent border border-cyanAccent/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <link.icon className={`w-3.5 h-3.5 ${active ? 'text-cyanAccent' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Accessibility Comfort Toggle */}
            <button
              onClick={() => setIsModalOpen(true)}
              aria-label="Open Accessibility & Comfort Mode Settings"
              title="Accessibility & Comfort Mode"
              className="p-2.5 rounded-lg glass-button-secondary text-cyanAccent-light hover:text-white flex items-center gap-1.5 text-xs font-medium"
            >
              <HeartHandshake className="w-4 h-4 text-tealAccent" />
              <span className="hidden lg:inline">Comfort Mode</span>
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full glass-card hover:border-cyanAccent/40 transition-all focus:outline-none focus:ring-2 focus:ring-cyanAccent"
                  aria-expanded={profileDropdownOpen}
                  aria-label="User profile menu"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-cyanAccent/30"
                  />
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-semibold text-white leading-none">{user.name.split(' ')[0]}</p>
                    <p className="text-[10px] text-tealAccent font-mono mt-0.5">Lv. {user.level} • {user.xp} XP</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl glass-panel p-2 shadow-glass border border-white/10 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <p className="text-xs font-semibold text-white">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block px-2 py-0.5 mt-1.5 text-[10px] rounded-full bg-tealAccent/20 text-tealAccent font-mono">
                        {user.travellerType || 'Explorer'}
                      </span>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-slate-200 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-cyanAccent" />
                      Dashboard
                    </Link>

                    <Link
                      to="/passport"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-slate-200 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Award className="w-4 h-4 text-aurora-amber" />
                      Digital Passport
                    </Link>

                    <Link
                      to="/memories"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-slate-200 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4 text-aurora-pink" />
                      Journey Memories
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-slate-200 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-skyAccent" />
                      Profile & Preferences
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs text-aurora-purple hover:bg-aurora-purple/10 rounded-lg transition-colors font-medium"
                      >
                        <Shield className="w-4 h-4 text-aurora-purple" />
                        Admin Console
                      </Link>
                    )}

                    <div className="border-t border-white/10 my-1"></div>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/explore"
                  className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                >
                  Explore
                </Link>
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-medium text-cyanAccent hover:text-white glass-button-secondary rounded-lg transition-all"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-semibold glass-button-primary rounded-lg shadow-glow-cyan"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              aria-label="Open Accessibility Settings"
              className="p-2 rounded-lg glass-button-secondary text-cyanAccent"
            >
              <HeartHandshake className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white glass-button-secondary"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden glass-panel border-t border-white/10 px-4 pt-3 pb-6 space-y-1">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  active ? 'bg-cyanAccent/20 text-cyanAccent' : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <link.icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}

          <div className="border-t border-white/10 my-3 pt-3">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2">
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border border-cyanAccent"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">{user.name}</p>
                    <p className="text-xs text-tealAccent">Level {user.level} • {user.xp} XP</p>
                  </div>
                </div>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-aurora-purple font-semibold hover:bg-white/5 rounded-lg"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    navigate('/');
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-xs font-medium glass-button-secondary rounded-lg"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-xs font-semibold glass-button-primary rounded-lg"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
