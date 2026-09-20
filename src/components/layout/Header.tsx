import React from 'react';
import { useAegis } from '../../hooks/useAegisState';
import { useAuth } from '../../context/AuthContext';
import { useNearby } from '../../context/NearbyContext';
import { useTranslation } from '../../hooks/useTranslation';
import { SupportedLanguage } from '../../types';
import { DiscreetQuickExit } from '../common/DiscreetQuickExit';
import { AbhayaLogo } from '../common/AbhayaLogo';
import { MessageSquare } from 'lucide-react';

export const Header: React.FC = () => {
  const { setCurrentPage, setLanguage, setIsDisguised, profile } = useAegis();
  const { communityProfile } = useAuth();
  const { unreadAlertCount } = useNearby();
  const { t, currentLang } = useTranslation();

  const displayName = communityProfile?.first_name || communityProfile?.alias || profile.name || 'Abhaya';
  const initialLetter = displayName.trim().charAt(0).toUpperCase() || 'A';

  return (
    <header
      className="sticky top-0 z-30 w-full max-w-md mx-auto h-14 bg-[var(--surface)] border-b border-[var(--line)] select-none"
      aria-label="Application Header"
    >
      <div className="flex h-full items-center justify-between px-3.5">
        {/* Left: Abhaya Arch & Marigold Dot logo mark + Wordmark "Abhaya" */}
        <button
          id="btn-header-home"
          onClick={() => setCurrentPage('home')}
          className="flex items-center gap-2 group focus:outline-none cursor-pointer"
          aria-label="Abhaya Home"
        >
          <div className="flex items-center justify-center text-[var(--text)] transition-transform group-active:scale-95">
            <AbhayaLogo className="w-7 h-7" strokeWidth={2.6} />
          </div>

          <span className="font-heading text-[19px] font-semibold tracking-tight text-[var(--text)]">
            {t.appName || 'Abhaya'}
          </span>
        </button>

        {/* Right: Avatar + Language Selector & Quick Hide Button */}
        <div className="flex items-center gap-2">
          {/* Profile Avatar */}
          <button
            type="button"
            onClick={() => setCurrentPage('profile')}
            className="w-9 h-9 rounded-full bg-[var(--surface-2)] border border-[var(--line)] hover:bg-[var(--surface)] flex items-center justify-center transition cursor-pointer"
            aria-label="Profile"
            title="Profile"
          >
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--primary)] text-[var(--primary-fg)] font-bold text-xs shadow-xs">
              {initialLetter}
            </div>
          </button>

          {/* Nearby Community Chat Icon */}
          <button
            id="btn-header-nearby"
            type="button"
            onClick={() => setCurrentPage('nearby')}
            className="relative w-9 h-9 rounded-full bg-[var(--surface-2)] border border-[var(--line)] flex items-center justify-center text-[var(--text)] hover:bg-[var(--surface)] transition cursor-pointer"
            aria-label="Nearby Area Community and Alerts"
            title="Nearby Area Community"
          >
            <MessageSquare className="w-4 h-4" />
            {unreadAlertCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-orange-500 ring-2 ring-[var(--surface)] animate-pulse"
                title={`${unreadAlertCount} new area alerts`}
              />
            )}
          </button>

          {/* Language Selector */}
          <div className="relative">
            <select
              id="select-header-language"
              value={currentLang}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="h-9 px-2.5 rounded-full text-[12px] font-semibold cursor-pointer text-center bg-[var(--surface-2)] text-[var(--text)] border border-[var(--line)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] min-w-[40px]"
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
            className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full"
          />
        </div>
      </div>
    </header>
  );
};
