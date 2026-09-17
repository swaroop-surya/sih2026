import React from 'react';
import { useAegis } from '../../hooks/useAegisState';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { DisguisedScreen } from '../common/DisguisedScreen';
import { OfflineIndicator } from '../common/OfflineIndicator';
import { AlertOctagon, Clock, ArrowRight, ShieldAlert } from 'lucide-react';

export const MobileShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    isDisguised,
    setIsDisguised,
    activeSOS,
    checkins,
    currentPage,
    setCurrentPage
  } = useAegis();

  if (isDisguised) {
    return <DisguisedScreen onReturnToAegis={() => setIsDisguised(false)} />;
  }

  const activeCheckin = checkins.find(c => c.status === 'ACTIVE');

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col justify-start items-center">
      {/* Container constrained to mobile viewport width for native feel */}
      <div className="w-full max-w-md min-h-screen bg-slate-950 flex flex-col relative border-x border-slate-900 shadow-2xl">
        {currentPage !== 'onboarding' && <Header />}

        {/* Global Active Emergency Bar if SOS is ongoing */}
        {activeSOS && currentPage !== 'emergency' && (
          <div
            onClick={() => setCurrentPage('emergency')}
            className="cursor-pointer bg-rose-600 text-white px-4 py-2.5 flex items-center justify-between text-xs font-semibold shadow-md animate-pulse sticky top-12 z-30"
          >
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-4 h-4" />
              <span>EMERGENCY SOS IS ACTIVE • Trusted circle notified</span>
            </div>
            <span className="flex items-center gap-1 text-[11px] underline">
              View <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        )}

        {/* Active Safety Check-in Ticker */}
        {activeCheckin && !activeSOS && currentPage !== 'checkin' && (
          <div
            onClick={() => setCurrentPage('checkin')}
            className="cursor-pointer bg-amber-950/80 border-b border-amber-800/40 text-amber-200 px-4 py-2 flex items-center justify-between text-xs transition hover:bg-amber-900/60 sticky top-12 z-30"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span className="truncate max-w-[240px]">
                Check-in: <strong>{activeCheckin.purpose}</strong>
              </span>
            </div>
            <span className="text-[11px] font-medium text-amber-300">Active</span>
          </div>
        )}

        {/* Main scrollable page viewport */}
        <main className={`flex-1 w-full px-3.5 py-4 ${currentPage !== 'onboarding' ? 'pb-24' : ''}`}>
          {children}
        </main>

        {/* Persistent bottom navigation */}
        {currentPage !== 'onboarding' && <BottomNav />}

        {/* Real-time PWA offline status indicator */}
        <OfflineIndicator />
      </div>
    </div>
  );
};
