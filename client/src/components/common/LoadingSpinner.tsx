import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', label = 'Loading travel data...' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  }[size];

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 space-y-4" role="status" aria-live="polite">
      <div className="relative">
        <div
          className={`${sizeClasses} border-cyanAccent/20 border-t-cyanAccent rounded-full animate-spin`}
        />
        <div
          className={`absolute inset-0 ${sizeClasses} border-tealAccent/10 border-b-tealAccent rounded-full animate-spin-slow`}
        />
      </div>
      {label && <p className="text-sm font-medium text-slate-300 font-mono tracking-wide">{label}</p>}
    </div>
  );
};
