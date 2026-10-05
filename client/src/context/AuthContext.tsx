import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { authApi } from '../services/api';
import {
  signInWithGoogle,
  logoutFromFirebase,
  subscribeToFirebaseAuthState,
} from '../services/firebaseAuth';
import { isFirebaseConfigured } from '../config/firebase';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  updateProfile: (data: any) => Promise<void>;
  resetTravelTwin: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isFirebaseReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('traveltwin_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const res = await authApi.getMe();
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
        return;
      }
    } catch (err) {
      // Check if we have a saved Firebase session before clearing
      const cachedFbUser = localStorage.getItem('traveltwin_firebase_user');
      if (cachedFbUser) {
        try {
          setUser(JSON.parse(cachedFbUser));
          return;
        } catch (e) {
          // ignore parsing error
        }
      }
      console.warn('[Auth] Session check failed, clearing token');
      localStorage.removeItem('traveltwin_token');
      localStorage.removeItem('traveltwin_firebase_user');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      refreshUser();
    } else {
      setIsLoading(false);
    }

    // Subscribe to Firebase Auth state if enabled
    if (isFirebaseConfigured) {
      const unsubscribe = subscribeToFirebaseAuthState((fbUser) => {
        if (!fbUser && localStorage.getItem('traveltwin_firebase_user')) {
          localStorage.removeItem('traveltwin_token');
          localStorage.removeItem('traveltwin_firebase_user');
          setToken(null);
          setUser(null);
        }
      });
      return () => unsubscribe();
    }
  }, [token]);

  const login = async (credentials: any) => {
    const res = await authApi.login(credentials);
    if (res.data.success && res.data.token) {
      localStorage.setItem('traveltwin_token', res.data.token);
      localStorage.removeItem('traveltwin_firebase_user');
      setToken(res.data.token);
      setUser(res.data.user);
    }
  };

  const register = async (data: any) => {
    const res = await authApi.register(data);
    if (res.data.success && res.data.token) {
      localStorage.setItem('traveltwin_token', res.data.token);
      localStorage.removeItem('traveltwin_firebase_user');
      setToken(res.data.token);
      setUser(res.data.user);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const fbUser = await signInWithGoogle();
      const idToken = await fbUser.getIdToken();

      // Attempt to link/create backend profile if API is available
      try {
        const res = await authApi.login({
          email: fbUser.email,
          firebaseUid: fbUser.uid,
          provider: 'google',
        });
        if (res.data?.success && res.data?.token) {
          localStorage.setItem('traveltwin_token', res.data.token);
          setToken(res.data.token);
          setUser(res.data.user);
          return;
        }
      } catch (backendErr) {
        console.info('[Auth] Backend sync skipped or unavailable, using Firebase profile directly');
      }

      // Default client-side TravelTwin profile populated with Firebase Google credentials
      const profile: User = {
        id: fbUser.uid,
        name: fbUser.displayName || 'Google Explorer',
        email: fbUser.email || '',
        role: 'user',
        avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        travelPreferences: ['Scenic Views', 'Cultural Heritage', 'Virtual Tourism'],
        accessibilityPreferences: {
          lowMotion: false,
          audioGuide: true,
          textGuide: true,
          seniorFriendly: false,
          mobilityFriendly: false,
          enhancedVisuals: true,
          highContrast: false,
          largeText: false,
        },
        travellerType: 'Culture Seeker',
        xp: 200,
        level: 1,
      };

      localStorage.setItem('traveltwin_token', idToken);
      localStorage.setItem('traveltwin_firebase_user', JSON.stringify(profile));
      setToken(idToken);
      setUser(profile);
    } catch (err: any) {
      console.error('[Firebase Google Login error]', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('traveltwin_token');
    localStorage.removeItem('traveltwin_firebase_user');
    logoutFromFirebase().catch(() => {});
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data: any) => {
    try {
      const res = await authApi.updateProfile(data);
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
        return;
      }
    } catch (err) {
      // If running with local Firebase user, update state locally
      if (user) {
        const updated = { ...user, ...data };
        setUser(updated);
        localStorage.setItem('traveltwin_firebase_user', JSON.stringify(updated));
      }
    }
  };

  const resetTravelTwin = async () => {
    try {
      const res = await authApi.resetTravelTwin();
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
      }
    } catch (err) {
      if (user) {
        const updated: User = { ...user, xp: 0, level: 1 };
        setUser(updated);
        localStorage.setItem('traveltwin_firebase_user', JSON.stringify(updated));
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        loginWithGoogle,
        logout,
        updateProfile,
        resetTravelTwin,
        refreshUser,
        isFirebaseReady: isFirebaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
