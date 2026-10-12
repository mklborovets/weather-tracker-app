// Raw API response from Open-Meteo Forecast
export interface OpenMeteoForecastResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units?: {
    time: string;
    interval: string;
    temperature_2m: string;
    apparent_temperature: string;
    relative_humidity_2m: string;
    weather_code: string;
    wind_speed_10m: string;
  };
  current: {
    time: string;
    interval: number;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily_units?: {
    time: string;
    weather_code: string;
    temperature_2m_max: string;
    temperature_2m_min: string;
    precipitation_probability_max?: string;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max?: (number | null)[];
  };
}

// Normalized daily item for UI lists
export interface DailyForecastDay {
  date: string;
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
  precipitationProbability: number;
}

// Normalized Weather Data model consumed by UI components and cache
export interface WeatherData {
  cityId?: number | string;
  cityName?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  lastUpdated: string; // ISO date string
  current: {
    temperature: number;
    apparentTemperature: number;
    humidity: number;
    weatherCode: number;
    windSpeed: number;
  };
  daily: DailyForecastDay[];
}
