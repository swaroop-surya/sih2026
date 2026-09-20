import React from 'react';
import { AbhayaLogo } from '../common/AbhayaLogo';

export const SplashScreen: React.FC = () => {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg)] text-[var(--text)] transition-colors select-none"
      role="status"
      aria-label="Loading Abhaya"
    >
      <div className="flex flex-col items-center gap-5 animate-pulse">
        {/* Arch Logo */}
        <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-[var(--surface-2)] border border-[var(--line)] shadow-sm">
          <AbhayaLogo className="w-14 h-14 text-[var(--primary)]" strokeWidth={2.4} />
        </div>

        {/* Wordmark & Tagline */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">Abhaya</h1>
          <p className="text-sm font-medium text-[var(--muted)] mt-1">You're not alone.</p>
        </div>
      </div>

      {/* Discreet bottom loading indicator */}
      <div className="absolute bottom-10 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-ping" />
        <span className="text-xs text-[var(--muted)] font-medium">Securing session...</span>
      </div>
    </div>
  );
};
