import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppTheme } from '../types';

interface ThemeContextType {
  theme: AppTheme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
  isDark: boolean;
  isCream: boolean; // Backward compatibility fallback (maps to light mode)
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aegis_theme') as AppTheme | null;
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        return saved;
      }
      // Migrate old 'cream' value to 'light'
      if (saved === ('cream' as any)) {
        return 'light';
      }
    }
    return 'dark'; // Default dark mode or system
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');

  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  };

  useEffect(() => {
    const active = theme === 'system' ? getSystemTheme() : theme;
    setResolvedTheme(active);

    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.setAttribute('data-theme', active);
      if (active === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light', 'theme-cream');
      } else {
        root.classList.add('light');
        root.classList.remove('dark', 'theme-dark');
      }

      // Update PWA / mobile browser theme-color meta tag
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', active === 'dark' ? '#0B1020' : '#F6F7FC');
      }
    }

    localStorage.setItem('aegis_theme', theme);
  }, [theme]);

  // Listen to system theme changes if set to system
  useEffect(() => {
    if (theme !== 'system' || typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const active = mediaQuery.matches ? 'dark' : 'light';
      setResolvedTheme(active);
      document.documentElement.setAttribute('data-theme', active);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
        isDark: resolvedTheme === 'dark',
        isCream: resolvedTheme === 'light'
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
