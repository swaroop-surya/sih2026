import React from 'react';
import { Shield, Sparkles, AlertTriangle, RotateCcw, Mic, MicOff } from 'lucide-react';
import { useAegis } from '../../hooks/useAegisState';
import { useTranslation } from '../../hooks/useTranslation';
import { useVoiceTrigger } from '../../context/VoiceTriggerContext';
import { useTheme } from '../../context/ThemeContext';
import { DiscreetQuickExit } from '../common/DiscreetQuickExit';
import { ThemeToggle } from '../common/ThemeToggle';
import { SupportedLanguage } from '../../types';

export const Header: React.FC = () => {
  const { isCream } = useTheme();
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
    <header
      className={`sticky top-0 z-40 backdrop-blur-md px-3.5 py-2.5 transition-colors ${
        isCream
          ? 'border-b-2 border-black bg-[#FDFBD4]/95 shadow-sm'
          : 'border-b border-[#FDFBD4]/20 bg-black/95 shadow-md'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        {/* Brand identity */}
        <div className="flex items-center gap-2">
          <div
            className={`relative flex h-8 w-8 items-center justify-center rounded-full transition ${
              isCream
                ? 'bg-white border border-black/20 text-black shadow-sm'
                : 'bg-[#181814] border border-[#FDFBD4]/30 text-[#FDFBD4]'
            }`}
          >
            <Shield className="h-4 w-4 stroke-[1.8]" />
            <span className={`absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full ${
              activeSOS ? 'bg-rose-500 animate-ping' : 'bg-emerald-500 ring-2 ring-white'
            }`} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1
                className={`text-sm font-black tracking-tight leading-none ${
                  isCream ? 'text-black' : 'text-[#FDFBD4]'
                }`}
              >
                {t.appName}
              </h1>
              {activeDemoScenarioId && (
                <span
                  className={`flex items-center gap-1 rounded-full border px-1.5 py-0.2 text-[9px] font-bold ${
                    isCream
                      ? 'bg-black text-[#FDFBD4] border-black'
                      : 'bg-[#FDFBD4]/10 border-[#FDFBD4]/40 text-[#FDFBD4]'
                  }`}
                >
                  <Sparkles className="w-2.5 h-2.5" /> DEMO
                </span>
              )}
            </div>
            <p className="text-[10px] font-semibold leading-none mt-1">
              {activeSOS ? (
                <span className="text-rose-600 font-bold animate-pulse">● SOS ACTIVE</span>
              ) : activeCheckin ? (
                <span className={isCream ? 'text-amber-800' : 'text-amber-300'}>● Check-in Active</span>
              ) : (
                <span className={isCream ? 'text-emerald-800' : 'text-emerald-400'}>● {t.statusSafe}</span>
              )}
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-1.5">
          {activeDemoScenarioId && (
            <button
              onClick={resetToDefaultData}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-all active:scale-90 shrink-0 ${
                isCream
                  ? 'bg-black/5 hover:bg-black/10 text-black border border-black/15'
                  : 'bg-white/5 hover:bg-white/10 text-[#FDFBD4] border border-[#FDFBD4]/20'
              }`}
              title="Reset Demo Data"
              aria-label="Reset Demo Data"
            >
              <RotateCcw className="w-3.5 h-3.5 stroke-[1.8]" />
            </button>
          )}

          {/* Discreet Voice Guard Status Button */}
          <button
            id="btn-header-voice-guard"
            onClick={() => setIsModalOpen(true)}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-all active:scale-90 shrink-0 ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse shadow-sm'
                : isCream
                ? 'bg-black/5 hover:bg-black/10 text-black border border-black/15'
                : 'bg-white/5 hover:bg-white/10 text-[#FDFBD4] border border-[#FDFBD4]/20'
            }`}
            title={isListening ? "Voice Guard Armed (Listening)" : "Voice Trigger Guard"}
            aria-label="Voice Trigger Guard"
          >
            {isListening ? (
              <Mic className="w-3.5 h-3.5 stroke-[1.8] text-white" />
            ) : (
              <MicOff className={`w-3.5 h-3.5 stroke-[1.8] ${isCream ? 'text-black' : 'text-[#FDFBD4]'}`} />
            )}
          </button>

          {/* Minimalist Dark / Cream Theme Switcher */}
          <ThemeToggle />

          {/* Discreet Minimalist Language Switcher */}
          <select
            value={currentLang}
            onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
            className={`h-8 px-2 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all appearance-none cursor-pointer text-center shrink-0 ${
              isCream
                ? 'bg-black/5 hover:bg-black/10 text-black border border-black/15 focus:border-black'
                : 'bg-white/5 hover:bg-white/10 text-[#FDFBD4] border border-[#FDFBD4]/20 focus:border-[#FDFBD4]'
            }`}
            aria-label="Language"
            title="Language"
          >
            <option value="en" className={isCream ? 'bg-[#FDFBD4] text-black' : 'bg-black text-[#FDFBD4]'}>EN</option>
            <option value="hi" className={isCream ? 'bg-[#FDFBD4] text-black' : 'bg-black text-[#FDFBD4]'}>HI</option>
            <option value="te" className={isCream ? 'bg-[#FDFBD4] text-black' : 'bg-black text-[#FDFBD4]'}>TE</option>
            <option value="ta" className={isCream ? 'bg-[#FDFBD4] text-black' : 'bg-black text-[#FDFBD4]'}>TA</option>
          </select>

          {/* Minimalist Panic Quick Exit */}
          <DiscreetQuickExit onTriggerDisguise={() => setIsDisguised(true)} />
        </div>
      </div>
    </header>
  );
};
