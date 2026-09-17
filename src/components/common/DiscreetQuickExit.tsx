import React, { useEffect } from 'react';
import { ShieldAlert, ExternalLink, EyeOff } from 'lucide-react';

interface DiscreetQuickExitProps {
  onTriggerDisguise: () => void;
  className?: string;
}

export const DiscreetQuickExit: React.FC<DiscreetQuickExitProps> = ({
  onTriggerDisguise,
  className = ''
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key or double Backquote activates quick exit immediately
      if (e.key === 'Escape') {
        onTriggerDisguise();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTriggerDisguise]);

  return (
    <button
      id="btn-quick-exit"
      onClick={onTriggerDisguise}
      className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/60 text-rose-300 text-xs font-semibold transition active:scale-95 shadow-sm ${className}`}
      title="Immediately hides this application (Shortcut: ESC)"
      aria-label="Discreet Quick Exit"
    >
      <EyeOff className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition-transform" />
      <span>Quick Exit</span>
    </button>
  );
};
