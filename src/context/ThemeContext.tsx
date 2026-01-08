import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;           // Currently applied theme
  pendingTheme: Theme;    // Theme selected but not yet saved
  setTheme: (theme: Theme) => void;  // Set pending theme (for UI preview before save)
  applyTheme: () => void;            // Apply and persist the pending theme
  resetPendingTheme: () => void;     // Reset pending to current
  isDark: boolean;
  hasPendingChanges: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from cookie or default to 'system'
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = Cookies.get('theme_preference');
    return (savedTheme as Theme) || 'system';
  });

  // Pending theme for settings page (before save)
  const [pendingTheme, setPendingTheme] = useState<Theme>(theme);

  const [isDark, setIsDark] = useState(false);

  // Apply theme to DOM based on APPLIED theme (not pending)
  useEffect(() => {
    const computeIsDark = () => {
      if (theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      return theme === 'dark';
    };

    const shouldBeDark = computeIsDark();
    setIsDark(shouldBeDark);

    const root = window.document.documentElement;
    if (shouldBeDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Listen for system changes if system theme is selected
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const root = window.document.documentElement;
      if (mediaQuery.matches) {
        root.classList.add('dark');
        setIsDark(true);
      } else {
        root.classList.remove('dark');
        setIsDark(false);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Set pending theme (UI-only, no save)
  const setTheme = (newTheme: Theme) => {
    setPendingTheme(newTheme);
  };

  // Apply pending theme and persist to cookie
  const applyTheme = () => {
    setThemeState(pendingTheme);
    Cookies.set('theme_preference', pendingTheme, { expires: 365, path: '/' });
  };

  // Reset pending to current (for cancel)
  const resetPendingTheme = () => {
    setPendingTheme(theme);
  };

  const hasPendingChanges = pendingTheme !== theme;

  return (
    <ThemeContext.Provider value={{
      theme,
      pendingTheme,
      setTheme,
      applyTheme,
      resetPendingTheme,
      isDark,
      hasPendingChanges
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
