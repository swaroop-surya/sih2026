import React from 'react';
import { useAegis } from '../../hooks/useAegisState';
import { useTranslation } from '../../hooks/useTranslation';
import { SupportedLanguage } from '../../types';
import { DiscreetQuickExit } from '../common/DiscreetQuickExit';
import { AbhayaLogo } from '../common/AbhayaLogo';

export const Header: React.FC = () => {
  const { setCurrentPage, setLanguage, setIsDisguised } = useAegis();
  const { t, currentLang } = useTranslation();

  return (
    <header
      className="sticky top-0 z-30 w-full max-w-md mx-auto h-14 bg-[var(--surface)] border-b border-[var(--line)] select-none"
      aria-label="Application Header"
    >
      <div className="flex h-full items-center justify-between px-4">
        {/* Left: Abhaya Arch & Marigold Dot logo mark + Wordmark "Abhaya" */}
        <button
          id="btn-header-home"
          onClick={() => setCurrentPage('home')}
          className="flex items-center gap-2.5 group focus:outline-none"
          aria-label="Abhaya Home"
        >
          <div className="flex items-center justify-center text-[var(--text)] transition-transform group-active:scale-95">
            <AbhayaLogo className="w-7 h-7" strokeWidth={2.6} />
          </div>

          <span className="font-heading text-[20px] font-semibold tracking-tight text-[var(--text)]">
            {t.appName || 'Abhaya'}
          </span>
        </button>

        {/* Right: Language Selector & Quick Hide Button */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="relative">
            <select
              id="select-header-language"
              value={currentLang}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="h-9 px-3 rounded-full text-[13px] font-medium cursor-pointer text-center bg-[var(--surface-2)] text-[var(--text)] border border-[var(--line)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] min-w-[44px]"
              aria-label={t.languageSelect || 'Language'}
              title={t.languageSelect || 'Language'}
            >
              <option value="en">EN</option>
              <option value="hi">हिन्दी</option>
              <option value="te">తెలుగు</option>
              <option value="ta">தமிழ்</option>
            </select>
          </div>

          {/* Quick Hide Button (44px min tap target) */}
          <DiscreetQuickExit
            onTriggerDisguise={() => setIsDisguised(true)}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full"
          />
        </div>
      </div>
    </header>
  );
};
