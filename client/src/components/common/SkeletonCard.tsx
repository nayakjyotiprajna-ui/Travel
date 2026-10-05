import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-pulse border border-white/5">
      <div className="h-56 bg-slate-800/60 w-full" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-slate-800/80 rounded w-1/3" />
        <div className="h-6 bg-slate-800 rounded w-3/4" />
        <div className="h-3 bg-slate-800/60 rounded w-full" />
        <div className="h-3 bg-slate-800/60 rounded w-5/6" />
        <div className="pt-4 flex items-center justify-between">
          <div className="h-8 bg-slate-800 rounded w-1/4" />
          <div className="h-8 bg-slate-800 rounded w-1/3" />
        </div>
      </div>
    </div>
  );
};
