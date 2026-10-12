import { getWeatherInfo } from '@/utils/weatherCodes';

describe('weatherCodes', () => {
  it('maps WMO code 0 to Clear sky', () => {
    const info = getWeatherInfo(0);
    expect(info.label).toBe('Clear sky');
    expect(info.iconName).toBe('sunny');
  });

  it('maps WMO code 2 to Partly cloudy', () => {
    const info = getWeatherInfo(2);
    expect(info.label).toBe('Partly cloudy');
    expect(info.iconName).toBe('partly-sunny');
  });

  it('maps WMO code 3 to Overcast', () => {
    const info = getWeatherInfo(3);
    expect(info.label).toBe('Overcast');
    expect(info.iconName).toBe('cloudy');
  });

  it('maps WMO code 61 to Slight rain', () => {
    const info = getWeatherInfo(61);
    expect(info.label).toBe('Slight rain');
    expect(info.iconName).toBe('rainy-outline');
  });

  it('maps WMO code 71 to Slight snow', () => {
    const info = getWeatherInfo(71);
    expect(info.label).toBe('Slight snow');
    expect(info.iconName).toBe('snow-outline');
  });

  it('maps WMO code 95 to Thunderstorm', () => {
    const info = getWeatherInfo(95);
    expect(info.label).toBe('Thunderstorm');
    expect(info.iconName).toBe('thunderstorm');
  });

  it('falls back to Variable for unknown WMO code', () => {
    const info = getWeatherInfo(999);
    expect(info.label).toBe('Variable');
    expect(info.iconName).toBe('partly-sunny-outline');
  });
});
