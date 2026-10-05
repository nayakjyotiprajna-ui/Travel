import React from 'react';
import { Compass, type LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Compass,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="glass-card max-w-md mx-auto my-12 p-8 rounded-2xl text-center border-white/10">
      <div className="w-14 h-14 mx-auto rounded-full bg-cyanAccent/10 border border-cyanAccent/20 flex items-center justify-center text-cyanAccent mb-4">
        <Icon className="w-7 h-7" />
      </div>

      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 mb-6 leading-relaxed">{description}</p>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2.5 rounded-xl glass-button-primary text-xs font-semibold"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
