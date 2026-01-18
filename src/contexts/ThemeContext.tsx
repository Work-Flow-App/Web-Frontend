import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { createAppTheme } from '../theme/themeFactory';
import type { CustomThemeColors } from '../theme/palette';

interface ThemeContextType {
  mode: 'light' | 'dark';
  activeThemeId: string;
  customThemes: CustomThemeDefinition[];
  toggleColorMode: () => void;
  switchTheme: (id: string) => void;
  addTheme: (name: string, colors: CustomThemeColors) => void;
  removeTheme: (id: string) => void;
}

interface CustomThemeDefinition {
  id: string;
  name: string;
  colors: CustomThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeContextProvider');
  }
  return context;
};

const STORAGE_KEY = 'workfloww_theme_config';

interface StoredConfig {
  mode: 'light' | 'dark';
  activeThemeId: string;
  customThemes: CustomThemeDefinition[];
}

export const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [activeThemeId, setActiveThemeId] = useState<string>('default');
  const [customThemes, setCustomThemes] = useState<CustomThemeDefinition[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const config: StoredConfig = JSON.parse(stored);
        setMode(config.mode || 'light');
        setActiveThemeId(config.activeThemeId || 'default');
        setCustomThemes(config.customThemes || []);
      } catch (e) {
        console.error('Failed to parse theme config', e);
      }
    }
  }, []);

  // Save to local storage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ mode, activeThemeId, customThemes }));
  }, [mode, activeThemeId, customThemes]);

  const toggleColorMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const switchTheme = (id: string) => {
    setActiveThemeId(id);
  };

  const addTheme = (name: string, colors: CustomThemeColors) => {
    const newTheme: CustomThemeDefinition = {
      id: `custom-${Date.now()}`,
      name,
      colors,
    };
    setCustomThemes((prev) => [...prev, newTheme]);
    setActiveThemeId(newTheme.id);
  };

  const removeTheme = (id: string) => {
    setCustomThemes((prev) => prev.filter((t) => t.id !== id));
    if (activeThemeId === id) {
      setActiveThemeId('default');
    }
  };

  const themeConfig = useMemo(() => {
    let customColors: CustomThemeColors | undefined;

    if (activeThemeId !== 'default') {
      const selectedTheme = customThemes.find((t) => t.id === activeThemeId);
      if (selectedTheme) {
        customColors = selectedTheme.colors;
      }
    }

    return {
      mode,
      customColors,
    };
  }, [mode, activeThemeId, customThemes]);

  const theme = useMemo(() => {
    return createAppTheme(themeConfig);
  }, [themeConfig]);

  const value = useMemo(
    () => ({
      mode,
      activeThemeId,
      customThemes,
      toggleColorMode,
      switchTheme,
      addTheme,
      removeTheme,
    }),
    [mode, activeThemeId, customThemes]
  );

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
