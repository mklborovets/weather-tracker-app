import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type ThemeMode = 'system' | 'light' | 'dark';

interface SettingsState {
  temperatureUnit: TemperatureUnit;
  themeMode: ThemeMode;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  toggleTemperatureUnit: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set, get) => ({
      temperatureUnit: 'celsius',
      themeMode: 'system',

      setTemperatureUnit: (unit) => set({ temperatureUnit: unit }),

      toggleTemperatureUnit: () => {
        const next = get().temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius';
        set({ temperatureUnit: next });
      },

      setThemeMode: (mode) => set({ themeMode: mode }),
    }),
    {
      name: 'weather-tracker-settings',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
