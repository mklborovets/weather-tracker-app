import { TemperatureUnit } from '@/store/useSettings';

export function convertCelsiusToFahrenheit(celsius: number): number {
  return Math.round(celsius * 1.8 + 32);
}

export function formatTemperature(celsius: number, unit: TemperatureUnit = 'celsius'): string {
  if (unit === 'fahrenheit') {
    return `${convertCelsiusToFahrenheit(celsius)}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

export function formatWindSpeed(kmh: number): string {
  return `${Math.round(kmh)} km/h`;
}

export function formatDayOfWeek(dateString: string): string {
  if (!dateString || typeof dateString !== 'string') return '';
  try {
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    const [year, month, day] = parts.map(Number);
    if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) return dateString;

    const date = new Date(year, month - 1, day);
    const today = new Date();

    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    if (isToday) {
      return 'Today';
    }

    return date.toLocaleDateString('en-US', { weekday: 'short' });
  } catch {
    return dateString;
  }
}

export function formatShortDate(dateString: string): string {
  if (!dateString || typeof dateString !== 'string') return '';
  try {
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    const [year, month, day] = parts.map(Number);
    if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) return dateString;

    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return dateString;
  }
}

export function formatTimeAgo(isoDateString?: string): string {
  if (!isoDateString) return '';
  try {
    const updatedTime = new Date(isoDateString).getTime();
    if (Number.isNaN(updatedTime)) return '';
    const now = Date.now();
    const diffMinutes = Math.max(0, Math.floor((now - updatedTime) / 60000));

    if (diffMinutes < 1) {
      return 'just now';
    }
    if (diffMinutes === 1) {
      return '1 min ago';
    }
    if (diffMinutes < 60) {
      return `${diffMinutes} mins ago`;
    }
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours === 1) {
      return '1 hour ago';
    }
    if (diffHours < 24) {
      return `${diffHours} hours ago`;
    }
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) {
      return '1 day ago';
    }
    return `${diffDays} days ago`;
  } catch {
    return '';
  }
}

export function cleanCityName(rawName?: string | null): string {
  if (!rawName) return 'Current Location';

  let cleaned = rawName.trim();

  cleaned = cleaned
    .replace(
      /\s+(urban\s+hromada|hromada|raion|district|municipality|city\s+council|міська\s+громада|громада|район|міськрада)$/i,
      '',
    )
    .trim();

  return cleaned || 'Current Location';
}
