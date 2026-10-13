import { getWeatherForecast, transformForecastResponse } from '@/api/weather';
import { fetchJson } from '@/api/client';
import { OpenMeteoForecastResponse } from '@/types/weather';

jest.mock('@/api/client', () => ({
  fetchJson: jest.fn(),
}));

const mockedFetchJson = fetchJson as jest.MockedFunction<typeof fetchJson>;

const rawFixture = {
  latitude: 50.45,
  longitude: 30.52,
  timezone: 'Europe/Kyiv',
  current: {
    temperature_2m: 12.6,
    apparent_temperature: 10.4,
    relative_humidity_2m: 71.2,
    weather_code: 3,
    wind_speed_10m: 14.7,
  },
  daily: {
    time: ['2026-10-12', '2026-10-13'],
    weather_code: [3, 61],
    temperature_2m_max: [14.4, 11.6],
    temperature_2m_min: [6.2, 4.5],
    precipitation_probability_max: [10, 80],
  },
} as unknown as OpenMeteoForecastResponse;

describe('weather API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('transformForecastResponse', () => {
    it('normalizes current weather with rounded values', () => {
      const result = transformForecastResponse(rawFixture, 'Kyiv', 703448);

      expect(result.cityName).toBe('Kyiv');
      expect(result.cityId).toBe(703448);
      expect(result.timezone).toBe('Europe/Kyiv');
      expect(result.current).toEqual({
        temperature: 13,
        apparentTemperature: 10,
        humidity: 71,
        weatherCode: 3,
        windSpeed: 15,
      });
    });

    it('converts parallel daily arrays into a list of day objects', () => {
      const result = transformForecastResponse(rawFixture);

      expect(result.daily).toEqual([
        {
          date: '2026-10-12',
          weatherCode: 3,
          temperatureMax: 14,
          temperatureMin: 6,
          precipitationProbability: 10,
        },
        {
          date: '2026-10-13',
          weatherCode: 61,
          temperatureMax: 12,
          temperatureMin: 5,
          precipitationProbability: 80,
        },
      ]);
    });

    it('falls back to 0 when daily values are missing', () => {
      const partial = {
        ...rawFixture,
        daily: {
          time: ['2026-10-12'],
          weather_code: [],
          temperature_2m_max: [],
          temperature_2m_min: [],
        },
      } as unknown as OpenMeteoForecastResponse;

      const [day] = transformForecastResponse(partial).daily;
      expect(day).toEqual({
        date: '2026-10-12',
        weatherCode: 0,
        temperatureMax: 0,
        temperatureMin: 0,
        precipitationProbability: 0,
      });
    });

    it('sets lastUpdated to a valid ISO timestamp', () => {
      const result = transformForecastResponse(rawFixture);
      expect(Number.isNaN(Date.parse(result.lastUpdated))).toBe(false);
    });
  });

  describe('getWeatherForecast', () => {
    it('requests forecast with coordinates and returns normalized data', async () => {
      mockedFetchJson.mockResolvedValue(rawFixture);

      const result = await getWeatherForecast(50.45, 30.52, 'Kyiv', 1);

      expect(mockedFetchJson).toHaveBeenCalledWith(
        'https://api.open-meteo.com',
        '/v1/forecast',
        expect.objectContaining({ latitude: 50.45, longitude: 30.52, timezone: 'auto' }),
      );
      expect(result.cityName).toBe('Kyiv');
      expect(result.daily).toHaveLength(2);
    });

    it('propagates API errors when no cached data exists', async () => {
      mockedFetchJson.mockRejectedValue(new Error('Network error'));
      await expect(getWeatherForecast(99.9, 99.9)).rejects.toThrow('Network error');
    });

    it('returns cached data with isOffline flag when network fails', async () => {
      mockedFetchJson.mockResolvedValueOnce(rawFixture);
      await getWeatherForecast(50.45, 30.52, 'Kyiv', 1);

      mockedFetchJson.mockRejectedValueOnce(new Error('Network offline'));
      const cachedResult = await getWeatherForecast(50.45, 30.52, 'Kyiv', 1);

      expect(cachedResult.isOffline).toBe(true);
      expect(cachedResult.cityName).toBe('Kyiv');
      expect(cachedResult.current.temperature).toBe(13);

      mockedFetchJson.mockRejectedValueOnce(new Error('Network offline'));
      const fallbackDefaults = await getWeatherForecast(50.45, 30.52);
      expect(fallbackDefaults.cityName).toBe('Kyiv');
      expect(fallbackDefaults.cityId).toBe(1);
    });

    it('handles empty current and daily fields without throwing', () => {
      const minimalRaw = {
        latitude: 10,
        longitude: 20,
        timezone: 'UTC',
      } as unknown as OpenMeteoForecastResponse;

      const result = transformForecastResponse(minimalRaw);
      expect(result.current.temperature).toBe(0);
      expect(result.daily).toEqual([]);
    });
  });
});
