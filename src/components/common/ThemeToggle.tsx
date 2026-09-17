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
        {/* Dark Mode Card (Black & #FDFBD4) */}
        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left ${
            theme === 'dark'
              ? 'bg-[#000000] border-[#FDFBD4] shadow-md ring-2 ring-[#FDFBD4]/30'
              : 'bg-[#121212] border-slate-800 hover:border-[#FDFBD4]/50'
          }`}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1c1c1c] text-[#FDFBD4] border border-[#FDFBD4]/30 shrink-0">
            <Moon className="w-4 h-4 text-[#FDFBD4]" />
          </div>
          <div>
            <p className="font-bold text-xs text-white flex items-center gap-1.5">
              <span>Dark Mode</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#1f1f1f] text-[#FDFBD4] font-mono border border-[#FDFBD4]/20">
                #000 & #FDFBD4
              </span>
            </p>
            <p className="text-[10px] text-slate-400">Deep black canvas with #FDFBD4 cream highlights</p>
          </div>
        </button>

        {/* Light Mode Card (#FDFBD4 & Black) */}
        <button
          type="button"
          onClick={() => setTheme('cream')}
          className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left ${
            theme === 'cream'
              ? 'bg-[#FDFBD4] border-[#000000] shadow-md ring-2 ring-[#000000]/30'
              : 'bg-[#FDFBD4]/60 border-slate-800 hover:border-[#000000]'
          }`}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#000000] text-[#FDFBD4] shrink-0">
            <Sun className="w-4 h-4 text-[#FDFBD4]" />
          </div>
          <div>
            <p className="font-bold text-xs text-[#000000] flex items-center gap-1.5">
              <span>White / Cream Mode</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#000000] text-[#FDFBD4] font-mono">
                #FDFBD4
              </span>
            </p>
            <p className="text-[10px] text-[#2c2b18]">Luminous #FDFBD4 canvas with bold black styling</p>
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
            ? 'bg-[#FDFBD4] border-[#000000] text-[#000000] hover:bg-[#F5F2BD]'
            : 'bg-[#000000] border-[#FDFBD4]/40 text-[#FDFBD4] hover:border-[#FDFBD4]'
        } ${className}`}
        title={`Current: ${isCream ? 'Cream Light (#FDFBD4)' : 'Dark Mode (Black & #FDFBD4)'}. Click to switch theme.`}
      >
        {isCream ? (
          <>
            <Sun className="w-3.5 h-3.5 text-[#000000]" />
            <span className="text-[11px] font-bold text-[#000000]">Cream</span>
          </>
        ) : (
          <>
            <Moon className="w-3.5 h-3.5 text-[#FDFBD4]" />
            <span className="text-[11px] font-bold text-[#FDFBD4]">Dark</span>
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
          ? 'bg-[#FDFBD4] border-[#000000] text-[#000000] hover:bg-[#F5F2BD]'
          : 'bg-[#000000] border-[#FDFBD4]/50 text-[#FDFBD4] hover:border-[#FDFBD4] hover:bg-[#141414]'
      } ${className}`}
      title={isCream ? 'Switch to Dark Mode (Black & #FDFBD4)' : 'Switch to White / Cream Mode (#FDFBD4 & Black)'}
      aria-label="Toggle theme"
    >
      {isCream ? (
        <Sun className="w-4 h-4 text-[#000000] animate-fade-in" />
      ) : (
        <Moon className="w-4 h-4 text-[#FDFBD4] animate-fade-in" />
      )}
    </button>
  );
};
