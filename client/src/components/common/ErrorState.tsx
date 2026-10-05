import React from 'react';
import { AlertCircle, RotateCcw, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showBack?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went unexpected',
  message = 'We encountered an issue communicating with the virtual travel servers.',
  onRetry,
  showBack = true,
}) => {
  const navigate = useNavigate();

  return (
    <div className="glass-card max-w-lg mx-auto my-12 p-8 rounded-2xl text-center border-red-500/20 shadow-glass">
      <div className="w-14 h-14 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4">
        <AlertCircle className="w-7 h-7" />
      </div>

      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-300 mb-6 leading-relaxed">{message}</p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass-button-primary text-xs font-semibold"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
        )}
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass-button-secondary text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        )}
      </div>
    </div>
  );
};
