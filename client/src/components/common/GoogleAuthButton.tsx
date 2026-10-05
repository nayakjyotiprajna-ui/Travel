import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2, Info } from 'lucide-react';

interface GoogleAuthButtonProps {
  buttonText?: string;
  redirectTo?: string;
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  buttonText = 'Continue with Google',
  redirectTo = '/dashboard',
}) => {
  const { loginWithGoogle, isFirebaseReady } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleClick = async () => {
    setErrorMsg('');
    if (!isFirebaseReady) {
      setShowConfigModal(true);
      return;
    }

    setLoading(true);
    try {
      await loginWithGoogle();
      navigate(redirectTo);
    } catch (err: any) {
      console.error('Google sign in failed', err);
      if (err.code === 'auth/popup-closed-by-user') {
        // user closed popup, don't show scary error
        return;
      }
      setErrorMsg(err.message || 'Firebase Google Sign-In failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full space-y-2">
        <button
          type="button"
          onClick={handleClick}
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 active:scale-[0.99] text-white text-xs font-semibold flex items-center justify-center gap-3 transition-all duration-200 shadow-sm disabled:opacity-50 group hover:border-cyanAccent/40"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-cyanAccent" />
          ) : (
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>{buttonText}</span>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyanAccent/15 text-cyanAccent-light border border-cyanAccent/30 ml-auto">
            Firebase
          </span>
        </button>

        {errorMsg && (
          <div className="text-[11px] text-red-300 text-center font-mono bg-red-500/10 p-2 rounded-lg border border-red-500/20">
            {errorMsg}
          </div>
        )}
      </div>

      {/* Config Guide Modal if user clicks Google Auth before pasting keys into .env */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md">
          <div className="glass-card max-w-md w-full p-6 rounded-2xl border border-cyanAccent/30 shadow-glass space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyanAccent/15 border border-cyanAccent/30 flex items-center justify-center text-cyanAccent">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Connect Firebase Project</h3>
                <p className="text-xs text-slate-300">Quick 2-minute setup in client/.env</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              TravelTwin's Firebase SDK is ready! To activate live Google Sign-In and Cloud Storage:
            </p>

            <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside bg-navy-900/60 p-3 rounded-xl border border-white/10">
              <li>Open <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-cyanAccent hover:underline">Firebase Console</a></li>
              <li>Create or select your project and click <strong>Add Web App</strong></li>
              <li>Under <strong>Authentication &rarr; Sign-in method</strong>, enable <strong>Google</strong></li>
              <li>Open <code className="text-tealAccent">client/.env</code> and paste your config values</li>
            </ol>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 rounded-xl glass-button-primary text-xs font-semibold"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
