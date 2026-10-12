import { useColorScheme } from 'react-native';
import { useSettings, ThemeMode } from '@/store/useSettings';
import { darkTheme, lightTheme, AppThemeColors } from '@/constants/theme';

export function useThemeColors(): {
  colors: AppThemeColors;
  isDark: boolean;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
} {
  const systemScheme = useColorScheme();
  const { themeMode, setThemeMode } = useSettings();

  const isDark = themeMode === 'system' ? systemScheme !== 'light' : themeMode === 'dark';

  const toggleTheme = () => {
    if (themeMode === 'system') {
      setThemeMode(isDark ? 'light' : 'dark');
    } else if (themeMode === 'dark') {
      setThemeMode('light');
    } else {
      setThemeMode('dark');
    }
  };

  return {
    colors: isDark ? darkTheme : lightTheme,
    isDark,
    themeMode,
    toggleTheme,
    setThemeMode,
  };
}
