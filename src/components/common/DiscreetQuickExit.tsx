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
      className={`flex h-8 w-8 items-center justify-center rounded-full transition-all active:scale-90 shrink-0 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-600 transition-colors ${className}`}
      title="Discreet Quick Disguise (Shortcut: ESC)"
      aria-label="Discreet Quick Disguise"
    >
      <EyeOff className="w-3.5 h-3.5 stroke-[1.8]" />
    </button>
  );
};
