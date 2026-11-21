import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SystemUI from 'expo-system-ui';

import { PALETTES, getShadows } from '../constants/theme';

const STORAGE_KEY = 'theme-preference';

const ThemeContext = createContext(null);

// Mode follows the system until the user taps the toggle; the choice is then stored.
export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();
  const [preference, setPreference] = useState(null); // 'light' | 'dark' | null (follow system)
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (active && (value === 'light' || value === 'dark')) setPreference(value);
      })
      .catch((error) => console.warn('Failed to read theme preference', error))
      .finally(() => active && setReady(true));
    return () => { active = false };
  }, []);

  const mode = preference ?? (systemScheme === 'dark' ? 'dark' : 'light');
  const colors = PALETTES[mode];

  // Keep the native window background in step so no grey/white flash shows behind screens.
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background).catch(() => {});
  }, [colors.background]);

  const toggleMode = useCallback(() => {
    const next = mode === 'dark' ? 'light' : 'dark';
    setPreference(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch((error) =>
      console.warn('Failed to save theme preference', error)
    );
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      isDark: mode === 'dark',
      colors,
      shadows: getShadows(colors.shadow, mode === 'dark' ? 1.6 : 1),
      toggleMode,
      ready,
    }),
    [mode, colors, toggleMode, ready]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
};
