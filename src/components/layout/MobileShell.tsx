import React, { useState } from 'react';
import { useAegis } from '../../hooks/useAegisState';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { DisguisedScreen } from '../common/DisguisedScreen';
import { OfflineIndicator } from '../common/OfflineIndicator';
import { AlertTriangle, Clock, ArrowRight, Sparkles, X, Play, RotateCcw, ShieldCheck } from 'lucide-react';
import { demoScenarios } from '../../data/demoScenarios';
import { useTranslation } from '../../hooks/useTranslation';

export const MobileShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    isDisguised,
    setIsDisguised,
    activeSOS,
    checkins,
    currentPage,
    setCurrentPage,
    sosCountdown,
    cancelSOSCountdown,
    executeSOSImmediate,
    profile,
    loadDemoScenario,
    resetToDefaultData
  } = useAegis();
  const { t } = useTranslation();

  const [isDemoSheetOpen, setIsDemoSheetOpen] = useState(false);

  if (isDisguised) {
    return <DisguisedScreen onReturnToAegis={() => setIsDisguised(false)} />;
  }

  const activeCheckin = checkins.find(c => c.status === 'ACTIVE');
  const showAskAegisFloating = ['home', 'risk-check', 'resources'].includes(currentPage);
  const showDemoPill = profile.showDemoTools !== false && currentPage !== 'onboarding';

  return (
    <div className="min-h-screen flex flex-col justify-start items-center bg-[var(--bg)] text-[var(--text)] transition-colors">
      {/* Centered mobile viewport shell */}
      <div className="w-full max-w-md min-h-screen flex flex-col relative bg-[var(--bg)] border-x border-[var(--line)] text-[var(--text)] transition-colors">
        {currentPage !== 'onboarding' && currentPage !== 'nearby' && <Header />}

        {/* Global Active Emergency Banner if SOS is ongoing */}
        {activeSOS && currentPage !== 'emergency' && (
          <div
            onClick={() => setCurrentPage('emergency')}
            className="cursor-pointer bg-[var(--sos)] text-white px-4 py-2.5 flex items-center justify-between text-xs font-semibold shadow-sm sticky top-14 z-30 animate-pulse"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>SOS alert active • Live location shared</span>
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
            className="cursor-pointer px-4 py-2 flex items-center justify-between text-xs bg-[var(--surface-2)] border-b border-[var(--line)] text-[var(--text)] sticky top-14 z-30 hover:bg-[var(--surface)] transition"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[var(--warn)]" />
              <span className="truncate max-w-[240px]">
                Check-in active: <strong>{activeCheckin.purpose}</strong>
              </span>
            </div>
            <span className="text-[12px] font-semibold text-[var(--safe)]">
              Monitoring
            </span>
          </div>
        )}

        {/* Main scrollable page viewport */}
        <main
          className={`flex-1 w-full ${
            currentPage === 'nearby'
              ? 'px-0 py-0 pb-20'
              : currentPage !== 'onboarding'
              ? 'px-4 py-5 pb-28'
              : ''
          }`}
        >
          {children}
        </main>

        {/* Floating "Ask Abhaya" button */}
        {showAskAegisFloating && (
          <button
            id="btn-floating-ask-abhaya"
            onClick={() => setCurrentPage('ai-assistant')}
            className="fixed bottom-20 right-4 z-40 h-10 px-3.5 rounded-full bg-[var(--surface)] text-[var(--text)] border border-[var(--line)] shadow-md flex items-center gap-2 hover:bg-[var(--surface-2)] active:scale-95 transition-all cursor-pointer"
            aria-label="Ask Abhaya AI"
            title="Ask Abhaya AI"
          >
            <Sparkles className="w-4 h-4 text-[var(--primary)] stroke-[2]" />
            <span className="text-[12px] font-semibold tracking-tight">Ask Abhaya</span>
          </button>
        )}

        {/* Small floating "Demo" pill above nav */}
        {showDemoPill && (
          <button
            id="btn-floating-demo-pill"
            onClick={() => setIsDemoSheetOpen(true)}
            className="fixed bottom-20 left-4 z-40 h-8 px-3 rounded-full bg-[var(--surface-2)] text-[var(--text)] border border-[var(--line)] text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:bg-[var(--surface)] active:scale-95 transition cursor-pointer"
            aria-label="Open Demo Scenarios"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--safe)]" />
            <span>Demo</span>
          </button>
        )}

        {/* 5-Second Cancel Countdown Modal */}
        {sosCountdown !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="soft-card w-full max-w-sm p-6 text-center space-y-4 bg-[var(--surface)] border-2 border-[var(--sos)] shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-[var(--sos)]/10 text-[var(--sos)] flex items-center justify-center mx-auto text-2xl font-black font-heading animate-pulse">
                {sosCountdown}
              </div>
              <div>
                <h3 className="card-title text-lg font-bold text-[var(--text)]">
                  {t.sendingAlertIn || 'Sending alert in'} {sosCountdown}s
                </h3>
                <p className="text-caption mt-1">
                  Alerting your trusted contacts and sharing your live location.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  id="btn-cancel-sos-countdown"
                  onClick={cancelSOSCountdown}
                  className="soft-btn soft-btn-secondary w-full"
                >
                  {t.cancelSOS || 'Cancel SOS'}
                </button>
                <button
                  id="btn-send-sos-now"
                  onClick={executeSOSImmediate}
                  className="soft-btn soft-btn-sos w-full"
                >
                  Send now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Demo Scenarios Bottom Sheet Modal */}
        {isDemoSheetOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-md bg-[var(--surface)] border-t border-[var(--line)] rounded-t-[24px] p-5 space-y-4 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
                <div>
                  <h3 className="section-title">Evaluator Demo Scenarios</h3>
                  <p className="text-caption">Instant multi-module state workflows</p>
                </div>
                <button
                  onClick={() => setIsDemoSheetOpen(false)}
                  className="w-9 h-9 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)]"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {demoScenarios.map((scenario, index) => (
                  <div
                    key={scenario.id}
                    className="p-3.5 rounded-[14px] bg-[var(--surface-2)] border border-[var(--line)] flex items-start justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[var(--safe)]/15 text-[var(--safe)] text-xs font-bold flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>
                        <h4 className="text-sm font-semibold text-[var(--text)] truncate">
                          {scenario.title}
                        </h4>
                      </div>
                      <p className="text-caption text-xs mt-1 line-clamp-2">
                        {scenario.summary}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        loadDemoScenario(scenario.id);
                        setIsDemoSheetOpen(false);
                      }}
                      className="soft-btn soft-btn-primary h-9 px-3 text-xs shrink-0"
                    >
                      <Play className="w-3 h-3 mr-1 fill-current" />
                      Load
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => {
                    resetToDefaultData();
                    setIsDemoSheetOpen(false);
                  }}
                  className="soft-btn soft-btn-secondary w-full text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                  Reset to default
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Persistent bottom navigation */}
        {currentPage !== 'onboarding' && <BottomNav />}

        {/* Real-time PWA offline status indicator */}
        <OfflineIndicator />
      </div>
    </div>
  );
};
