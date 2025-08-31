import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first, then system preference
    const saved = localStorage.getItem('theme');
    if (saved) {
      console.log('Theme from localStorage:', saved);
      return saved === 'dark';
    }
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    console.log('System prefers dark theme:', systemPrefersDark);
    return systemPrefersDark;
  });

  useEffect(() => {
    // Update localStorage and document class when theme changes
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    if (isDark) {
      document.documentElement.classList.add('dark');
      console.log('Dark theme applied');
    } else {
      document.documentElement.classList.remove('dark');
      console.log('Light theme applied');
    }
  }, [isDark]);

  useEffect(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('theme')) {
        setIsDark(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    console.log('Theme toggle clicked. Current theme:', isDark ? 'dark' : 'light');
    setIsDark(!isDark);
  };

  const setTheme = (theme) => {
    setIsDark(theme === 'dark');
  };

  const forceLightTheme = () => {
    console.log('Forcing light theme');
    setIsDark(false);
  };

  const forceDarkTheme = () => {
    console.log('Forcing dark theme');
    setIsDark(true);
  };

  const value = {
    isDark,
    toggleTheme,
    setTheme,
    forceLightTheme,
    forceDarkTheme,
    theme: isDark ? 'dark' : 'light',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
