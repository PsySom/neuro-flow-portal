
import React, { createContext, useContext, useEffect, useState } from 'react';

export type AccentColor = 'emerald' | 'blue' | 'purple' | 'pink' | 'orange' | 'teal' | 'sage' | 'lavender' | 'sky' | 'mint' | 'rose' | 'ice';
export type FontSize = 'small' | 'medium' | 'large';
export type Theme = 'light' | 'dark' | 'system';

interface PersonalizationSettings {
  theme: Theme;
  accentColor: AccentColor;
  fontSize: FontSize;
}

interface PersonalizationContextType {
  settings: PersonalizationSettings;
  updateSettings: (newSettings: Partial<PersonalizationSettings>) => void;
  applySettings: () => void;
}

const defaultSettings: PersonalizationSettings = {
  theme: 'system',
  accentColor: 'emerald',
  fontSize: 'medium'
};

const PersonalizationContext = createContext<PersonalizationContextType | undefined>(undefined);

const colorVariables = {
  emerald: {
    primary: '142 69% 58%',
    secondary: '142 76% 36%',
    accent: '142 69% 58%',
    light: '142 76% 73%',
    dark: '142 76% 36%'
  },
  blue: {
    primary: '217 91% 60%',
    secondary: '217 76% 47%',
    accent: '217 91% 60%',
    light: '217 91% 73%',
    dark: '217 76% 47%'
  },
  purple: {
    primary: '262 83% 58%',
    secondary: '262 76% 47%',
    accent: '262 83% 58%',
    light: '262 83% 73%',
    dark: '262 76% 47%'
  },
  pink: {
    primary: '330 81% 60%',
    secondary: '330 76% 47%',
    accent: '330 81% 60%',
    light: '330 81% 73%',
    dark: '330 76% 47%'
  },
  orange: {
    primary: '25 95% 53%',
    secondary: '25 76% 47%',
    accent: '25 95% 53%',
    light: '25 95% 68%',
    dark: '25 76% 47%'
  },
  teal: {
    primary: '173 58% 39%',
    secondary: '173 76% 29%',
    accent: '173 58% 39%',
    light: '173 58% 54%',
    dark: '173 76% 29%'
  },
  sage: {
    primary: '156 39% 65%',
    secondary: '156 39% 45%',
    accent: '156 39% 65%',
    light: '156 39% 80%',
    dark: '156 39% 35%'
  },
  lavender: {
    primary: '267 57% 70%',
    secondary: '267 57% 50%',
    accent: '267 57% 70%',
    light: '267 57% 85%',
    dark: '267 57% 40%'
  },
  sky: {
    primary: '204 94% 78%',
    secondary: '204 94% 58%',
    accent: '204 94% 78%',
    light: '204 94% 90%',
    dark: '204 94% 48%'
  },
  mint: {
    primary: '167 72% 60%',
    secondary: '167 72% 40%',
    accent: '167 72% 60%',
    light: '167 72% 75%',
    dark: '167 72% 30%'
  },
  rose: {
    primary: '351 83% 75%',
    secondary: '351 83% 55%',
    accent: '351 83% 75%',
    light: '351 83% 87%',
    dark: '351 83% 45%'
  },
  ice: {
    primary: '180 100% 85%',
    secondary: '180 100% 65%',
    accent: '180 100% 85%',
    light: '180 100% 95%',
    dark: '180 100% 55%'
  }
};

const fontSizeVariables = {
  small: {
    base: '14px',
    scale: '0.9'
  },
  medium: {
    base: '16px',
    scale: '1'
  },
  large: {
    base: '18px',
    scale: '1.1'
  }
};

export function PersonalizationProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<PersonalizationSettings>(() => {
    const saved = localStorage.getItem('personalization-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const updateSettings = (newSettings: Partial<PersonalizationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const applySettings = () => {
    // Save to localStorage
    localStorage.setItem('personalization-settings', JSON.stringify(settings));
    
    // Apply theme
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (settings.theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(settings.theme);
    }

    // Apply accent color variables
    const colors = colorVariables[settings.accentColor] || colorVariables.emerald;
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-accent-light', colors.light);
    root.style.setProperty('--color-accent-dark', colors.dark);

    // Apply font size
    const fontSize = fontSizeVariables[settings.fontSize];
    root.style.setProperty('--font-size-base', fontSize.base);
    root.style.setProperty('--font-scale', fontSize.scale);
    root.style.fontSize = fontSize.base;
  };

  // Apply settings on mount and when they change
  useEffect(() => {
    applySettings();
  }, [settings]);

  // Sync with system theme preference
  useEffect(() => {
    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applySettings();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [settings.theme]);

  return (
    <PersonalizationContext.Provider value={{ settings, updateSettings, applySettings }}>
      {children}
    </PersonalizationContext.Provider>
  );
}

export function usePersonalization() {
  const context = useContext(PersonalizationContext);
  if (!context) {
    throw new Error('usePersonalization must be used within PersonalizationProvider');
  }
  return context;
}
