import React from 'react';
import { Home, ShieldCheck, FileText, LifeBuoy, User, AlertCircle } from 'lucide-react';
import { useAegis, AppPage } from '../../hooks/useAegisState';
import { useTranslation } from '../../hooks/useTranslation';

export const BottomNav: React.FC = () => {
  const { currentPage, setCurrentPage, activeSOS } = useAegis();
  const { t } = useTranslation();

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

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto border-t border-slate-800 bg-slate-950/95 backdrop-blur-md pb-safe"
      aria-label="Main Navigation"
    >
      <div className="flex items-center justify-around px-1 py-1.5">
        {/* Home */}
        <button
          id="nav-tab-home"
          onClick={() => setCurrentPage('home')}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition ${
            isTabActive('home') ? 'text-sky-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">{t.navHome}</span>
        </button>

        {/* Safety */}
        <button
          id="nav-tab-safety"
          onClick={() => setCurrentPage('risk-check')}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition ${
            isTabActive('safety') ? 'text-sky-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">{t.navSafety}</span>
        </button>

        {/* Emergency SOS Center Button */}
        <button
          id="nav-tab-emergency"
          onClick={() => setCurrentPage('emergency')}
          className={`relative -top-2 flex flex-col items-center justify-center h-12 w-12 rounded-full border-2 shadow-lg transition active:scale-95 ${
            activeSOS
              ? 'bg-rose-600 border-rose-400 text-white animate-pulse'
              : 'bg-rose-950/90 border-rose-600/80 text-rose-300 hover:bg-rose-900'
          }`}
          aria-label="Emergency SOS"
        >
          <AlertCircle className="w-6 h-6 text-white" />
          <span className="text-[9px] font-bold text-rose-200 -mt-0.5">SOS</span>
        </button>

        {/* Incidents & Evidence */}
        <button
          id="nav-tab-incidents"
          onClick={() => setCurrentPage('incidents')}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition ${
            isTabActive('incidents') ? 'text-sky-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">{t.navIncidents}</span>
        </button>

        {/* Resources */}
        <button
          id="nav-tab-resources"
          onClick={() => setCurrentPage('resources')}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition ${
            isTabActive('resources') ? 'text-sky-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LifeBuoy className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">{t.navResources}</span>
        </button>

        {/* Profile */}
        <button
          id="nav-tab-profile"
          onClick={() => setCurrentPage('profile')}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition ${
            isTabActive('profile') ? 'text-sky-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">{t.navProfile}</span>
        </button>
      </div>
    </nav>
  );
};
