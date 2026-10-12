export interface AppThemeColors {
  background: string;
  card: string;
  cardSecondary: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderLight: string;
  accent: string;
  accentSubtle: string;
  danger: string;
  warning: string;
  success: string;
}

export const darkTheme: AppThemeColors = {
  background: '#0f172a',
  card: '#1e293b',
  cardSecondary: '#0f172a',
  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  border: '#334155',
  borderLight: '#475569',
  accent: '#38bdf8',
  accentSubtle: '#0284c7',
  danger: '#f87171',
  warning: '#fbbf24',
  success: '#4ade80',
};

export const lightTheme: AppThemeColors = {
  background: '#f8fafc',
  card: '#ffffff',
  cardSecondary: '#f1f5f9',
  textPrimary: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#94a3b8',
  border: '#e2e8f0',
  borderLight: '#cbd5e1',
  accent: '#0284c7',
  accentSubtle: '#e0f2fe',
  danger: '#ef4444',
  warning: '#d97706',
  success: '#16a34a',
};
