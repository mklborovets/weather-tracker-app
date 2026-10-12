import {
  convertCelsiusToFahrenheit,
  formatTemperature,
  formatWindSpeed,
  formatTimeAgo,
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

  describe('formatTimeAgo', () => {
    it('returns empty string if isoDateString is missing', () => {
      expect(formatTimeAgo(undefined)).toBe('');
      expect(formatTimeAgo('')).toBe('');
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
  });
});
