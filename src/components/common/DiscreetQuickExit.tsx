import React, { useEffect } from 'react';
import { EyeOff } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

interface DiscreetQuickExitProps {
  onTriggerDisguise: () => void;
  className?: string;
}

export const DiscreetQuickExit: React.FC<DiscreetQuickExitProps> = ({
  onTriggerDisguise,
  className = ''
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
      className={`flex items-center justify-center rounded-full transition-all active:scale-95 bg-[var(--surface-2)] hover:bg-[var(--sos)]/10 border border-[var(--line)] hover:border-[var(--sos)]/30 text-[var(--muted)] hover:text-[var(--sos)] cursor-pointer select-none ${className}`}
      title={`${t.quickExit || 'Quick hide'} (Esc)`}
      aria-label={t.quickExit || 'Quick hide'}
    >
      <EyeOff className="w-4 h-4 stroke-[2]" />
    </button>
  );
};
