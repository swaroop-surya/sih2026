import React, { useState, useRef } from 'react';
import { Home, ShieldAlert, AlertTriangle, FileText, User } from 'lucide-react';
import { useAegis } from '../../hooks/useAegisState';
import { useTranslation } from '../../hooks/useTranslation';

export const BottomNav: React.FC = () => {
  const { currentPage, setCurrentPage, activeSOS, initiateSOSCountdown } = useAegis();
  const { t } = useTranslation();

  type NavTab = 'home' | 'safety' | 'sos' | 'incidents' | 'profile';

  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const holdStartTimeRef = useRef<number>(0);

  const startHold = (e: React.TouchEvent | React.MouseEvent) => {
    setIsHolding(true);
    setHoldProgress(0);
    holdStartTimeRef.current = Date.now();
    const duration = 1500;

    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - holdStartTimeRef.current;
      const progress = Math.min(100, (elapsed / duration) * 100);
      setHoldProgress(progress);

      if (progress >= 100) {
        if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
        setIsHolding(false);
        setHoldProgress(0);
        initiateSOSCountdown(false, 'Activated via Bottom Navigation hold');
      }
    }, 30);
  };

  const cancelHold = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    const elapsed = Date.now() - holdStartTimeRef.current;
    setIsHolding(false);
    setHoldProgress(0);
    if (elapsed < 300 && elapsed > 0) {
      setCurrentPage('emergency');
    }
  };

  const isTabActive = (tab: NavTab) => {
    switch (tab) {
      case 'home':
        return currentPage === 'home';
      case 'safety':
        return ['risk-check', 'resources', 'recruitment-checker', 'checkin', 'safety-plan', 'location-safety', 'cyber-safety'].includes(currentPage);
      case 'sos':
        return currentPage === 'emergency';
      case 'incidents':
        return ['incidents', 'evidence'].includes(currentPage);
      case 'profile':
        return ['profile', 'responder', 'analytics'].includes(currentPage);
      default:
        return false;
    }
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto bg-[var(--surface)] border-t border-[var(--line)] pb-safe select-none"
      aria-label="Main Navigation"
    >
      <div className="grid grid-cols-5 items-center w-full px-2 h-16">
        {/* 1. Home */}
        <button
          id="nav-tab-home"
          onClick={() => setCurrentPage('home')}
          className={`flex flex-col items-center justify-center h-full focus:outline-none transition-colors ${
            isTabActive('home') ? 'text-[var(--primary)] font-medium' : 'text-[var(--muted)] hover:text-[var(--text)]'
          }`}
          aria-label={t.navHome || 'Home'}
        >
          <Home className="w-5 h-5 stroke-[1.75]" />
          <span className="text-[12px] mt-1 tracking-tight">
            {t.navHome || 'Home'}
          </span>
        </button>

        {/* 2. Safety */}
        <button
          id="nav-tab-safety"
          onClick={() => setCurrentPage('risk-check')}
          className={`flex flex-col items-center justify-center h-full focus:outline-none transition-colors ${
            isTabActive('safety') ? 'text-[var(--primary)] font-medium' : 'text-[var(--muted)] hover:text-[var(--text)]'
          }`}
          aria-label={t.navSafety || 'Safety'}
        >
          <ShieldAlert className="w-5 h-5 stroke-[1.75]" />
          <span className="text-[12px] mt-1 tracking-tight">
            {t.navSafety || 'Safety'}
          </span>
        </button>

        {/* 3. Center SOS: Raised kumkum circle, hold to trigger */}
        <div className="relative flex items-center justify-center -top-3">
          <button
            id="nav-tab-sos"
            onMouseDown={startHold}
            onMouseUp={cancelHold}
            onMouseLeave={cancelHold}
            onTouchStart={startHold}
            onTouchEnd={cancelHold}
            onTouchCancel={cancelHold}
            className={`relative w-14 h-14 rounded-full flex flex-col items-center justify-center text-white select-none transition-transform active:scale-95 ${
              activeSOS ? 'bg-[var(--sos)] ring-4 ring-[var(--sos)]/30' : 'bg-[var(--sos)]'
            }`}
            aria-label="Emergency SOS"
            title="Emergency SOS"
          >
            {/* Progress Ring during Hold */}
            {isHolding && (
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 56 56">
                <circle
                  cx="28"
                  cy="28"
                  r="25"
                  stroke="var(--accent)"
                  strokeWidth="3"
                  fill="transparent"
                  strokeDasharray="157"
                  strokeDashoffset={157 - (157 * holdProgress) / 100}
                />
              </svg>
            )}
            <AlertTriangle className="w-6 h-6 stroke-[1.75]" />
            <span className="text-[10px] font-semibold tracking-wider leading-none mt-0.5">
              SOS
            </span>
          </button>
        </div>

        {/* 4. Incidents */}
        <button
          id="nav-tab-incidents"
          onClick={() => setCurrentPage('incidents')}
          className={`flex flex-col items-center justify-center h-full focus:outline-none transition-colors ${
            isTabActive('incidents') ? 'text-[var(--primary)] font-medium' : 'text-[var(--muted)] hover:text-[var(--text)]'
          }`}
          aria-label={t.navIncidents || 'Incidents'}
        >
          <FileText className="w-5 h-5 stroke-[1.75]" />
          <span className="text-[12px] mt-1 tracking-tight">
            {t.navIncidents || 'Incidents'}
          </span>
        </button>

        {/* 5. Profile */}
        <button
          id="nav-tab-profile"
          onClick={() => setCurrentPage('profile')}
          className={`flex flex-col items-center justify-center h-full focus:outline-none transition-colors ${
            isTabActive('profile') ? 'text-[var(--primary)] font-medium' : 'text-[var(--muted)] hover:text-[var(--text)]'
          }`}
          aria-label={t.navProfile || 'Profile'}
        >
          <User className="w-5 h-5 stroke-[1.75]" />
          <span className="text-[12px] mt-1 tracking-tight">
            {t.navProfile || 'Profile'}
          </span>
        </button>
      </div>
    </nav>
  );
};
