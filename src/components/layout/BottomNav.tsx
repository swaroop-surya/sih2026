import React from 'react';
import { Home, ShieldCheck, FileText, LifeBuoy, User, AlertCircle } from 'lucide-react';
import { useAegis } from '../../hooks/useAegisState';
import { useTranslation } from '../../hooks/useTranslation';
import { useTheme } from '../../context/ThemeContext';

export const BottomNav: React.FC = () => {
  const { currentPage, setCurrentPage, activeSOS } = useAegis();
  const { t } = useTranslation();
  const { isCream } = useTheme();

  const isTabActive = (tab: 'home' | 'safety' | 'incidents' | 'resources' | 'profile') => {
    switch (tab) {
      case 'home':
        return currentPage === 'home';
      case 'safety':
        return ['risk-check', 'recruitment-checker', 'checkin', 'safety-plan', 'location-safety'].includes(currentPage);
      case 'incidents':
        return ['incidents', 'evidence'].includes(currentPage);
      case 'resources':
        return ['resources', 'cyber-safety', 'ai-assistant'].includes(currentPage);
      case 'profile':
        return ['profile', 'responder', 'analytics'].includes(currentPage);
      default:
        return false;
    }
  };

  const leftItems = [
    { id: 'nav-tab-home', label: t.navHome, tab: 'home' as const, icon: Home, page: 'home' as const },
    { id: 'nav-tab-safety', label: t.navSafety, tab: 'safety' as const, icon: ShieldCheck, page: 'risk-check' as const },
  ];

  const rightItems = [
    { id: 'nav-tab-incidents', label: t.navIncidents, tab: 'incidents' as const, icon: FileText, page: 'incidents' as const },
    { id: 'nav-tab-resources', label: t.navResources, tab: 'resources' as const, icon: LifeBuoy, page: 'resources' as const },
    { id: 'nav-tab-profile', label: t.navProfile, tab: 'profile' as const, icon: User, page: 'profile' as const },
  ];

  const renderNavButton = (item: { id: string; label: string; tab: 'home' | 'safety' | 'incidents' | 'resources' | 'profile'; icon: React.ComponentType<{ className?: string }>; page: any }) => {
    const active = isTabActive(item.tab);
    const Icon = item.icon;

    return (
      <button
        key={item.id}
        id={item.id}
        onClick={() => setCurrentPage(item.page)}
        className="flex flex-col items-center justify-center flex-1 py-1 focus:outline-none transition-all active:scale-95 select-none"
        aria-label={item.label}
      >
        {/* Minimalist Icon Container */}
        <div
          className={`relative flex items-center justify-center h-7 w-7 rounded-full transition-all duration-200 ${
            active
              ? isCream
                ? 'text-black'
                : 'text-[#FDFBD4]'
              : isCream
              ? 'text-black/45 hover:text-black'
              : 'text-[#888880] hover:text-[#FDFBD4]'
          }`}
        >
          <Icon className={`w-4 h-4 transition-transform ${active ? 'stroke-[2.1] scale-105' : 'stroke-[1.6]'}`} />
          {active && (
            <span
              className={`absolute -bottom-0.5 h-1 w-1 rounded-full ${
                isCream ? 'bg-black' : 'bg-[#FDFBD4]'
              }`}
            />
          )}
        </div>

        {/* Crisp Label */}
        <span
          className={`text-[10px] mt-1 tracking-tight transition-colors whitespace-nowrap leading-none ${
            active
              ? isCream
                ? 'font-bold text-black'
                : 'font-bold text-[#FDFBD4]'
              : isCream
              ? 'font-medium text-black/60'
              : 'font-medium text-[#888880]'
          }`}
        >
          {item.label}
        </span>
      </button>
    );
  };

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto pb-safe transition-colors ${
        isCream
          ? 'border-t-2 border-black bg-[#FDFBD4]/95 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]'
          : 'border-t border-[#FDFBD4]/20 bg-[#000000]/95 shadow-[0_-4px_20px_rgba(0,0,0,0.9)]'
      } backdrop-blur-md`}
      aria-label="Main Navigation"
    >
      <div className="flex items-center justify-between px-1.5 py-1">
        {/* Left Nav Actions */}
        <div className="flex items-center flex-1 justify-around">
          {leftItems.map(renderNavButton)}
        </div>

        {/* Center Emergency SOS Action (Minimalist & Clean) */}
        <div className="flex flex-col items-center px-1 shrink-0 -mt-3">
          <button
            id="nav-tab-emergency"
            onClick={() => setCurrentPage('emergency')}
            className={`flex flex-col items-center justify-center h-11 w-11 rounded-full transition-all active:scale-90 select-none ${
              activeSOS
                ? 'bg-rose-600 text-white animate-pulse shadow-lg'
                : 'bg-rose-600 hover:bg-rose-700 text-white'
            } ${
              isCream
                ? 'border-2 border-black shadow-[0_2px_0_#000]'
                : 'border border-[#FDFBD4]/40 shadow-[0_0_12px_rgba(244,63,94,0.4)]'
            }`}
            aria-label="Emergency SOS"
            title="Emergency SOS"
          >
            <AlertCircle className="w-5 h-5 stroke-[1.9] text-white" />
          </button>
          <span
            className={`text-[9px] mt-1 font-bold tracking-wider uppercase leading-none ${
              isCream ? 'text-black' : 'text-[#FDFBD4]'
            }`}
          >
            SOS
          </span>
        </div>

        {/* Right Nav Actions */}
        <div className="flex items-center flex-1 justify-around">
          {rightItems.map(renderNavButton)}
        </div>
      </div>
    </nav>
  );
};
