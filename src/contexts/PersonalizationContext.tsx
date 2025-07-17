
import React, { createContext, useContext, useEffect, useState } from 'react';

export type AccentColor = 'sage-coral' | 'lavender-gold' | 'sky-apricot' | 'mint-plum' | 'rose-indigo' | 'ice-neon';
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
  accentColor: 'sage-coral',
  fontSize: 'medium'
};

const PersonalizationContext = createContext<PersonalizationContextType | undefined>(undefined);

const colorVariables = {
  'sage-coral': {
    primary: 'oklch(0.7357 0.1641 34.7091)',
    secondary: 'oklch(0.8278 0.1131 57.9984)',
    accent: 'oklch(0.8773 0.0763 54.9314)',
    light: 'oklch(0.8200 0.1054 40.8859)',
    dark: 'oklch(0.6368 0.1306 32.0721)'
  },
  'lavender-gold': {
    primary: 'oklch(0.7000 0.1200 285)',
    secondary: 'oklch(0.8500 0.1500 65)',
    accent: 'oklch(0.7500 0.1000 275)',
    light: 'oklch(0.8200 0.0800 270)',
    dark: 'oklch(0.5800 0.1400 280)'
  },
  'sky-apricot': {
    primary: 'oklch(0.7500 0.1300 220)',
    secondary: 'oklch(0.8300 0.1100 35)',
    accent: 'oklch(0.7800 0.0900 210)',
    light: 'oklch(0.8500 0.0700 215)',
    dark: 'oklch(0.6200 0.1500 225)'
  },
  'mint-plum': {
    primary: 'oklch(0.7200 0.1400 165)',
    secondary: 'oklch(0.7000 0.1600 320)',
    accent: 'oklch(0.7600 0.1000 155)',
    light: 'oklch(0.8000 0.0800 160)',
    dark: 'oklch(0.5900 0.1700 170)'
  },
  'rose-indigo': {
    primary: 'oklch(0.7100 0.1500 15)',
    secondary: 'oklch(0.6800 0.1700 260)',
    accent: 'oklch(0.7400 0.1100 10)',
    light: 'oklch(0.7900 0.0900 20)',
    dark: 'oklch(0.5700 0.1800 350)'
  },
  'ice-neon': {
    primary: 'oklch(0.8500 0.0800 195)',
    secondary: 'oklch(0.8000 0.2000 330)',
    accent: 'oklch(0.8700 0.0600 190)',
    light: 'oklch(0.9000 0.0400 200)',
    dark: 'oklch(0.7200 0.1200 185)'
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
    const colors = colorVariables[settings.accentColor];
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--accent', colors.secondary);
    root.style.setProperty('--chart-1', colors.primary);
    root.style.setProperty('--chart-2', colors.secondary);
    root.style.setProperty('--chart-3', colors.accent);

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
