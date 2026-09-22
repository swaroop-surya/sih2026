import React, { useState } from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';
import { useVolunteers } from '../../context/VolunteerContext';

export const VolunteerReconfirmBanner: React.FC = () => {
  const { isMyVolunteerActive, needsReconfirmation, confirmStillAvailable } = useVolunteers();
  const [isConfirming, setIsConfirming] = useState(false);
  const [justConfirmed, setJustConfirmed] = useState(false);

  if (!isMyVolunteerActive || !needsReconfirmation || justConfirmed) {
    return null;
  }

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await confirmStillAvailable();
      setJustConfirmed(true);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start justify-between gap-3 text-xs text-amber-900 dark:text-amber-200 animate-in fade-in">
      <div className="flex items-start gap-2.5 min-w-0">
        <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="min-w-0">
          <p className="font-semibold text-xs text-[var(--text)]">
            Still available to help nearby?
          </p>
          <p className="text-[11px] text-[var(--muted)] mt-0.5 leading-relaxed">
            Please re-confirm your volunteer availability to keep your listing visible to neighbours.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleConfirm}
        disabled={isConfirming}
        className="shrink-0 min-h-[44px] px-3.5 py-1.5 rounded-xl bg-[var(--primary)] text-white dark:text-[#1A1F45] font-semibold text-xs hover:opacity-95 transition cursor-pointer shadow-xs flex items-center gap-1.5"
      >
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>{isConfirming ? 'Saving...' : 'Yes, Available'}</span>
      </button>
    </div>
  );
};
