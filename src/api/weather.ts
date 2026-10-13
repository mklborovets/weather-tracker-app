import { fetchJson } from './client';
import { OpenMeteoForecastResponse, WeatherData, DailyForecastDay } from '@/types/weather';
import { safeAsyncStorage } from '@/store/storage';

const FORECAST_BASE_URL = 'https://api.open-meteo.com';

export async function getRawForecast(
  latitude: number,
  longitude: number,
): Promise<OpenMeteoForecastResponse> {
  return fetchJson<OpenMeteoForecastResponse>(FORECAST_BASE_URL, '/v1/forecast', {
    latitude,
    longitude,
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    timezone: 'auto',
  });
}

export function transformForecastResponse(
  raw: OpenMeteoForecastResponse,
  cityName?: string,
  cityId?: number | string,
): WeatherData {
  const daily: DailyForecastDay[] = [];
  const count = raw.daily?.time?.length ?? 0;

  for (let i = 0; i < count; i++) {
    daily.push({
      date: raw.daily.time[i],
      weatherCode: raw.daily.weather_code?.[i] ?? 0,
      temperatureMax: Math.round(raw.daily.temperature_2m_max?.[i] ?? 0),
      temperatureMin: Math.round(raw.daily.temperature_2m_min?.[i] ?? 0),
      precipitationProbability: Math.round(raw.daily.precipitation_probability_max?.[i] ?? 0),
    });
  }

  return {
    cityId,
    cityName,
    latitude: raw.latitude,
    longitude: raw.longitude,
    timezone: raw.timezone,
    lastUpdated: new Date().toISOString(),
    current: {
      temperature: Math.round(raw.current?.temperature_2m ?? 0),
      apparentTemperature: Math.round(raw.current?.apparent_temperature ?? 0),
      humidity: Math.round(raw.current?.relative_humidity_2m ?? 0),
      weatherCode: raw.current?.weather_code ?? 0,
      windSpeed: Math.round(raw.current?.wind_speed_10m ?? 0),
    },
    daily,
  };
}

export async function getWeatherForecast(
  latitude: number,
  longitude: number,
  cityName?: string,
  cityId?: number | string,
): Promise<WeatherData> {
  const cacheKey = `weather_cache_${latitude.toFixed(3)}_${longitude.toFixed(3)}`;
  try {
    const raw = await getRawForecast(latitude, longitude);
    const data = transformForecastResponse(raw, cityName, cityId);
    void Promise.resolve(safeAsyncStorage.setItem(cacheKey, JSON.stringify(data))).catch(() => {});
    return data;
  } catch (error) {
    try {
      const cached = await safeAsyncStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached) as WeatherData;
        return {
          ...parsed,
          cityId: cityId ?? parsed.cityId,
          cityName: cityName ?? parsed.cityName,
          isOffline: true,
        };
      }
    } catch {}
    throw error;
  }
}
