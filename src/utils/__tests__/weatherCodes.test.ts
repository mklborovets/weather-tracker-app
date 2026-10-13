import { getWeatherInfo } from '@/utils/weatherCodes';

describe('weatherCodes', () => {
  it.each([
    [0, 'Clear sky', 'sunny'],
    [1, 'Mainly clear', 'sunny-outline'],
    [2, 'Partly cloudy', 'partly-sunny'],
    [3, 'Overcast', 'cloudy'],
    [45, 'Foggy', 'cloud-outline'],
    [48, 'Foggy', 'cloud-outline'],
    [51, 'Drizzle', 'rainy-outline'],
    [53, 'Drizzle', 'rainy-outline'],
    [55, 'Drizzle', 'rainy-outline'],
    [56, 'Freezing Drizzle', 'snow-outline'],
    [57, 'Freezing Drizzle', 'snow-outline'],
    [61, 'Slight rain', 'rainy-outline'],
    [63, 'Moderate rain', 'rainy'],
    [65, 'Heavy rain', 'rainy'],
    [66, 'Freezing rain', 'snow-outline'],
    [67, 'Freezing rain', 'snow-outline'],
    [71, 'Slight snow', 'snow-outline'],
    [73, 'Moderate snow', 'snow'],
    [75, 'Heavy snow', 'snow'],
    [77, 'Heavy snow', 'snow'],
    [80, 'Rain showers', 'rainy'],
    [81, 'Rain showers', 'rainy'],
    [82, 'Rain showers', 'rainy'],
    [85, 'Snow showers', 'snow'],
    [86, 'Snow showers', 'snow'],
    [95, 'Thunderstorm', 'thunderstorm'],
    [96, 'Thunderstorm with hail', 'thunderstorm'],
    [99, 'Thunderstorm with hail', 'thunderstorm'],
  ])('maps WMO code %i to "%s" with %s icon', (code, label, iconName) => {
    const info = getWeatherInfo(code);
    expect(info.label).toBe(label);
    expect(info.iconName).toBe(iconName);
    expect(info.iconColor).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it.each([-1, 4, 999])('falls back to "Variable" for unknown code %i', (code) => {
    const info = getWeatherInfo(code);
    expect(info.label).toBe('Variable');
    expect(info.iconName).toBe('partly-sunny-outline');
  });
});
