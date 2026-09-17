import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  variant?: 'icon' | 'selector' | 'pill';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'icon', className = '' }) => {
  const { theme, setTheme, toggleTheme, isCream } = useTheme();

  if (variant === 'selector') {
    return (
      <div className={`grid grid-cols-2 gap-2.5 ${className}`}>
        {/* Dark Mode Card */}
        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left ${
            theme === 'dark'
              ? 'bg-slate-900 border-sky-500 shadow-md ring-1 ring-sky-500/50'
              : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-200 shrink-0">
            <Moon className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <p className="font-bold text-xs text-white">Dark Mode</p>
            <p className="text-[10px] text-slate-400">Deep midnight slate for night & low light</p>
          </div>
        </button>

        {/* Cream Light Mode Card */}
        <button
          type="button"
          onClick={() => setTheme('cream')}
          className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left ${
            theme === 'cream'
              ? 'bg-[#FAF6EE] border-amber-600/80 shadow-md ring-1 ring-amber-600/50'
              : 'bg-[#F4EEE3]/40 border-slate-800 hover:border-amber-600/30'
          }`}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EBE3D5] text-amber-800 shrink-0">
            <Sun className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="font-bold text-xs text-[#1C1917]">Cream Mode</p>
            <p className="text-[10px] text-[#78716C]">Soft, glare-free warm cream light theme</p>
          </div>
        </button>
      </div>
    );
  }

  if (variant === 'pill') {
    return (
      <button
        onClick={toggleTheme}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition active:scale-95 ${
          isCream
            ? 'bg-[#FAF6EE] border-[#E4DDD0] text-[#1C1917] hover:bg-[#F4EEE3]'
            : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
        } ${className}`}
        title={`Current: ${isCream ? 'Cream Light' : 'Dark Mode'}. Click to switch theme.`}
      >
        {isCream ? (
          <>
            <Sun className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-[11px]">Cream</span>
          </>
        ) : (
          <>
            <Moon className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-[11px]">Dark</span>
          </>
        )}
      </button>
    );
  }

  // Default 'icon' button in header
  return (
    <button
      id="btn-theme-toggle"
      onClick={toggleTheme}
      className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all active:scale-95 ${
        isCream
          ? 'bg-[#FAF6EE] border-[#E4DDD0] text-amber-600 hover:bg-[#F4EEE3]'
          : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
      } ${className}`}
      title={isCream ? 'Switch to Dark Mode' : 'Switch to Cream Light Mode'}
      aria-label="Toggle theme"
    >
      {isCream ? (
        <Sun className="w-4 h-4 text-amber-600 animate-fade-in" />
      ) : (
        <Moon className="w-4 h-4 text-sky-400 animate-fade-in" />
      )}
    </button>
  );
};
