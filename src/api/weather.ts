import { fetchJson } from './client';
import { OpenMeteoForecastResponse, WeatherData, DailyForecastDay } from '@/types/weather';

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
  const count = raw.daily.time.length;

  for (let i = 0; i < count; i++) {
    daily.push({
      date: raw.daily.time[i],
      weatherCode: raw.daily.weather_code[i] ?? 0,
      temperatureMax: Math.round(raw.daily.temperature_2m_max[i] ?? 0),
      temperatureMin: Math.round(raw.daily.temperature_2m_min[i] ?? 0),
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
      temperature: Math.round(raw.current.temperature_2m),
      apparentTemperature: Math.round(raw.current.apparent_temperature),
      humidity: Math.round(raw.current.relative_humidity_2m),
      weatherCode: raw.current.weather_code,
      windSpeed: Math.round(raw.current.wind_speed_10m),
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
  const raw = await getRawForecast(latitude, longitude);
  return transformForecastResponse(raw, cityName, cityId);
}
