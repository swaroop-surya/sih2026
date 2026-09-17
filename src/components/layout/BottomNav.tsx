import React from 'react';
import { Home, ShieldCheck, FileText, LifeBuoy, User, AlertCircle, Sparkles } from 'lucide-react';
import { useAegis } from '../../hooks/useAegisState';
import { useTranslation } from '../../hooks/useTranslation';
import { useTheme } from '../../context/ThemeContext';

export const BottomNav: React.FC = () => {
  const { currentPage, setCurrentPage, activeSOS } = useAegis();
  const { t } = useTranslation();
  const { isCream } = useTheme();

  type NavTab = 'home' | 'safety' | 'sos' | 'incidents' | 'resources' | 'ai' | 'profile';

  const isTabActive = (tab: NavTab) => {
    switch (tab) {
      case 'home':
        return currentPage === 'home';
      case 'safety':
        return ['risk-check', 'recruitment-checker', 'checkin', 'safety-plan', 'location-safety'].includes(currentPage);
      case 'sos':
        return currentPage === 'emergency';
      case 'incidents':
        return ['incidents', 'evidence'].includes(currentPage);
      case 'resources':
        return ['resources', 'cyber-safety'].includes(currentPage);
      case 'ai':
        return currentPage === 'ai-assistant';
      case 'profile':
        return ['profile', 'responder', 'analytics'].includes(currentPage);
      default:
        return false;
    }
  };

  const navItems = [
    {
      id: 'nav-tab-home',
      label: t.navHome || 'Home',
      tab: 'home' as NavTab,
      icon: Home,
      page: 'home' as const,
      isSOS: false
    },
    {
      id: 'nav-tab-safety',
      label: t.navSafety || 'Safety',
      tab: 'safety' as NavTab,
      icon: ShieldCheck,
      page: 'risk-check' as const,
      isSOS: false
    },
    {
      id: 'nav-tab-sos',
      label: t.navSOS || 'SOS',
      tab: 'sos' as NavTab,
      icon: AlertCircle,
      page: 'emergency' as const,
      isSOS: true
    },
    {
      id: 'nav-tab-incidents',
      label: t.navIncidents || 'Incidents',
      tab: 'incidents' as NavTab,
      icon: FileText,
      page: 'incidents' as const,
      isSOS: false
    },
    {
      id: 'nav-tab-resources',
      label: t.navResources || 'Resources',
      tab: 'resources' as NavTab,
      icon: LifeBuoy,
      page: 'resources' as const,
      isSOS: false
    },
    {
      id: 'nav-tab-ai',
      label: t.navAI || 'AI',
      tab: 'ai' as NavTab,
      icon: Sparkles,
      page: 'ai-assistant' as const,
      isSOS: false
    },
    {
      id: 'nav-tab-profile',
      label: t.navProfile || 'Profile',
      tab: 'profile' as NavTab,
      icon: User,
      page: 'profile' as const,
      isSOS: false
    }
  ];

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto pb-safe transition-colors ${
        isCream
          ? 'border-t-2 border-black bg-[#FDFBD4]/95 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]'
          : 'border-t border-[#FDFBD4]/20 bg-[#000000]/95 shadow-[0_-4px_20px_rgba(0,0,0,0.9)]'
      } backdrop-blur-md`}
      aria-label="Main Navigation"
    >
      <div className="grid grid-cols-7 items-center w-full px-1 py-1.5 gap-0.5">
        {navItems.map((item) => {
          const active = isTabActive(item.tab);
          const Icon = item.icon;

          if (item.isSOS) {
            return (
              <button
                key={item.id}
                id={item.id}
                onClick={() => setCurrentPage(item.page)}
                className="flex flex-col items-center justify-center py-0.5 focus:outline-none transition-all active:scale-90 select-none group w-full"
                aria-label="Emergency SOS"
                title="Emergency SOS"
              >
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center transition-all ${
                    activeSOS
                      ? 'bg-rose-600 text-white animate-pulse shadow-md'
                      : 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
                  } ${
                    isCream
                      ? 'border border-black'
                      : 'border border-[#FDFBD4]/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 stroke-[2.4] text-white" />
                </div>
                <span
                  className={`text-[9px] mt-0.5 font-bold tracking-tight uppercase leading-none ${
                    isCream ? 'text-rose-700' : 'text-rose-400'
                  }`}
                >
                  SOS
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              id={item.id}
              onClick={() => setCurrentPage(item.page)}
              className="flex flex-col items-center justify-center py-0.5 focus:outline-none transition-all active:scale-95 select-none w-full min-w-0"
              aria-label={item.label}
              title={item.label}
            >
              <div
                className={`relative flex items-center justify-center h-7 w-7 rounded-full transition-all duration-150 ${
                  active
                    ? isCream
                      ? 'text-[#0D0D0D]'
                      : 'text-[#FDFBD4]'
                    : isCream
                    ? 'text-[#242424]/60 hover:text-[#0D0D0D]'
                    : 'text-[#888880] hover:text-[#FDFBD4]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 transition-transform ${active ? 'stroke-[2.3] scale-110' : 'stroke-[1.6]'}`} />
                {active && (
                  <span
                    className={`absolute -bottom-0.5 h-1 w-1 rounded-full ${
                      isCream ? 'bg-[#0D0D0D]' : 'bg-[#FDFBD4]'
                    }`}
                  />
                )}
              </div>

              <span
                className={`text-[9px] mt-0.5 tracking-tight transition-colors whitespace-nowrap leading-none truncate max-w-full px-0.5 ${
                  active
                    ? isCream
                      ? 'font-bold text-[#0D0D0D]'
                      : 'font-bold text-[#FDFBD4]'
                    : isCream
                    ? 'font-medium text-[#242424]'
                    : 'font-medium text-[#888880]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
