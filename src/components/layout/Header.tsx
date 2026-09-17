import React from 'react';
import { Shield, Sparkles, AlertTriangle, RotateCcw, Mic, MicOff } from 'lucide-react';
import { useAegis } from '../../hooks/useAegisState';
import { useTranslation } from '../../hooks/useTranslation';
import { useVoiceTrigger } from '../../context/VoiceTriggerContext';
import { DiscreetQuickExit } from '../common/DiscreetQuickExit';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { ThemeToggle } from '../common/ThemeToggle';
import { SupportedLanguage } from '../../types';

export const Header: React.FC = () => {
  const {
    activeDemoScenarioId,
    activeSOS,
    checkins,
    setIsDisguised,
    setLanguage,
    resetToDefaultData,
    profile
  } = useAegis();
  const { t, currentLang } = useTranslation();
  const { isListening, setIsModalOpen } = useVoiceTrigger();

  const activeCheckin = checkins.find(c => c.status === 'ACTIVE');

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-3.5 py-2.5">
      <div className="flex items-center justify-between gap-2">
        {/* Brand identity */}
        <div className="flex items-center gap-2">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/20 to-slate-800 border border-sky-500/40 text-sky-400 shadow-inner">
            <Shield className="h-4 w-4" />
            <span className={`absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full ${
              activeSOS ? 'bg-rose-500 animate-ping' : 'bg-emerald-400 ring-2 ring-slate-950'
            }`} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold tracking-tight text-white">{t.appName}</h1>
              {activeDemoScenarioId && (
                <span className="flex items-center gap-1 rounded bg-amber-500/20 border border-amber-500/40 px-1.5 py-0.2 text-[10px] font-semibold text-amber-300">
                  <Sparkles className="w-2.5 h-2.5" /> DEMO
                </span>
              )}
            </div>
            <p className="text-[10px] font-medium text-slate-400 leading-none">
              {activeSOS ? (
                <span className="text-rose-400 font-semibold animate-pulse">● SOS ACTIVE</span>
              ) : activeCheckin ? (
                <span className="text-amber-400">● Check-in Active</span>
              ) : (
                <span className="text-emerald-400">● {t.statusSafe}</span>
              )}
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-1.5">
          {activeDemoScenarioId && (
            <button
              onClick={resetToDefaultData}
              className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2 py-1 text-[10px] font-medium text-slate-400 hover:text-slate-200"
              title="Reset Demo Data"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>Reset</span>
            </button>
          )}

          {/* Discreet Voice Guard Status Button */}
          <button
            id="btn-header-voice-guard"
            onClick={() => setIsModalOpen(true)}
            className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold transition active:scale-95 border ${
              isListening
                ? 'bg-rose-950/80 border-rose-500/80 text-rose-300 shadow-sm animate-pulse'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
            title="Discreet Voice Trigger Guard (Speech API)"
          >
            {isListening ? (
              <>
                <Mic className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-[10px] hidden sm:inline">Voice Armed</span>
              </>
            ) : (
              <>
                <MicOff className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10px] hidden sm:inline">Voice Guard</span>
              </>
            )}
          </button>

          <PWAInstallButton />

          {/* Dark / Cream Theme Switcher */}
          <ThemeToggle />

          {/* Discreet language switcher */}
          <select
            value={currentLang}
            onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
            className="rounded-lg border border-slate-800 bg-slate-900/80 px-1.5 py-1 text-[11px] font-medium text-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
            aria-label="Language"
          >
            <option value="en">EN</option>
            <option value="hi">हिन्दी</option>
            <option value="te">తెలుగు</option>
            <option value="ta">தமிழ்</option>
          </select>

          {/* Panic Quick Exit */}
          <DiscreetQuickExit onTriggerDisguise={() => setIsDisguised(true)} />
        </div>
      </div>
    </header>
  );
};
