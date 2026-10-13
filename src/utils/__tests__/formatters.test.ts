import {
  convertCelsiusToFahrenheit,
  formatTemperature,
  formatWindSpeed,
  formatTimeAgo,
  formatDayOfWeek,
  formatShortDate,
  cleanCityName,
} from '@/utils/formatters';

describe('formatters', () => {
  describe('convertCelsiusToFahrenheit', () => {
    it('correctly converts freezing point (0°C to 32°F)', () => {
      expect(convertCelsiusToFahrenheit(0)).toBe(32);
    });

    it('correctly converts boiling point (100°C to 212°F)', () => {
      expect(convertCelsiusToFahrenheit(100)).toBe(212);
    });

    it('correctly converts room temperature (25°C to 77°F)', () => {
      expect(convertCelsiusToFahrenheit(25)).toBe(77);
    });

    it('correctly converts negative temperature (-10°C to 14°F)', () => {
      expect(convertCelsiusToFahrenheit(-10)).toBe(14);
    });
  });

  describe('formatTemperature', () => {
    it('formats Celsius by default with rounded degree symbol', () => {
      expect(formatTemperature(22.6)).toBe('23°C');
      expect(formatTemperature(22.2)).toBe('22°C');
      expect(formatTemperature(0)).toBe('0°C');
      expect(formatTemperature(-4.8)).toBe('-5°C');
    });

    it('formats Fahrenheit when specified', () => {
      expect(formatTemperature(0, 'fahrenheit')).toBe('32°F');
      expect(formatTemperature(25, 'fahrenheit')).toBe('77°F');
      expect(formatTemperature(-10, 'fahrenheit')).toBe('14°F');
    });
  });

  describe('formatWindSpeed', () => {
    it('rounds and appends km/h unit', () => {
      expect(formatWindSpeed(15.4)).toBe('15 km/h');
      expect(formatWindSpeed(15.8)).toBe('16 km/h');
      expect(formatWindSpeed(0)).toBe('0 km/h');
    });
  });

  describe('formatDayOfWeek', () => {
    const toIsoDate = (date: Date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
        date.getDate(),
      ).padStart(2, '0')}`;

    it('returns "Today" for the current date', () => {
      expect(formatDayOfWeek(toIsoDate(new Date()))).toBe('Today');
    });

    it('returns short weekday name for other dates', () => {
      expect(formatDayOfWeek('2026-10-15')).toBe('Thu');
    });

    it('handles empty or malformed date strings safely', () => {
      expect(formatDayOfWeek('')).toBe('');
      expect(formatDayOfWeek('invalid')).toBe('invalid');
      expect(formatDayOfWeek('2026-abc-01')).toBe('2026-abc-01');
    });
  });

  describe('formatShortDate', () => {
    it('formats YYYY-MM-DD as short month and day', () => {
      expect(formatShortDate('2026-10-15')).toBe('Oct 15');
      expect(formatShortDate('2026-01-03')).toBe('Jan 3');
    });
  });

  describe('formatTimeAgo', () => {
    it('returns empty string if isoDateString is missing', () => {
      expect(formatTimeAgo(undefined)).toBe('');
      expect(formatTimeAgo('')).toBe('');
    });

    it('returns empty string for invalid date strings', () => {
      expect(formatTimeAgo('not-a-date')).toBe('');
    });

    it('returns "just now" for timestamp under 1 minute', () => {
      const now = new Date().toISOString();
      expect(formatTimeAgo(now)).toBe('just now');
    });

    it('returns "1 min ago" for 1 minute elapsed', () => {
      const oneMinAgo = new Date(Date.now() - 65 * 1000).toISOString();
      expect(formatTimeAgo(oneMinAgo)).toBe('1 min ago');
    });

    it('returns formatted minutes for under an hour', () => {
      const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      expect(formatTimeAgo(tenMinsAgo)).toBe('10 mins ago');
    });

    it('returns "1 hour ago" for single hour', () => {
      const oneHourAgo = new Date(Date.now() - 65 * 60 * 1000).toISOString();
      expect(formatTimeAgo(oneHourAgo)).toBe('1 hour ago');
    });

    it('returns formatted hours for multiple hours', () => {
      const threeHoursAgo = new Date(Date.now() - 3 * 3600 * 1000).toISOString();
      expect(formatTimeAgo(threeHoursAgo)).toBe('3 hours ago');
    });

    it('returns "1 day ago" for 24-47 hours elapsed', () => {
      const oneDayAgo = new Date(Date.now() - 25 * 3600 * 1000).toISOString();
      expect(formatTimeAgo(oneDayAgo)).toBe('1 day ago');
    });

    it('returns "X days ago" for 48+ hours elapsed', () => {
      const twoDaysAgo = new Date(Date.now() - 49 * 3600 * 1000).toISOString();
      expect(formatTimeAgo(twoDaysAgo)).toBe('2 days ago');
    });
  });

  describe('cleanCityName', () => {
    it('returns "Current Location" when rawName is missing or empty', () => {
      expect(cleanCityName(undefined)).toBe('Current Location');
      expect(cleanCityName(null)).toBe('Current Location');
      expect(cleanCityName('')).toBe('Current Location');
      expect(cleanCityName('   ')).toBe('Current Location');
    });

    it('removes administrative suffixes from city names', () => {
      expect(cleanCityName('Kyiv urban hromada')).toBe('Kyiv');
      expect(cleanCityName('Lviv hromada')).toBe('Lviv');
      expect(cleanCityName('Brovary raion')).toBe('Brovary');
      expect(cleanCityName('Dnipro міська громада')).toBe('Dnipro');
      expect(cleanCityName('Odesa район')).toBe('Odesa');
    });

    it('preserves clean city names as-is', () => {
      expect(cleanCityName('London')).toBe('London');
      expect(cleanCityName('Kyiv')).toBe('Kyiv');
    });
  });
});
