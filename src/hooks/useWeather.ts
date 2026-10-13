import { useQuery } from '@tanstack/react-query';
import { getWeatherForecast } from '@/api/weather';
import { WeatherData } from '@/types/weather';

export interface UseWeatherOptions {
  latitude?: number | null;
  longitude?: number | null;
  cityName?: string;
  cityId?: number | string;
  enabled?: boolean;
}

export function useWeather({
  latitude,
  longitude,
  cityName,
  cityId,
  enabled = true,
}: UseWeatherOptions) {
  const hasCoordinates =
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    !Number.isNaN(latitude) &&
    !Number.isNaN(longitude);

  const normalizedCityId = cityId !== undefined && cityId !== null ? String(cityId) : undefined;

  return useQuery<WeatherData, Error>({
    queryKey: ['weather', latitude, longitude, cityName, normalizedCityId],
    queryFn: () => getWeatherForecast(latitude!, longitude!, cityName, cityId),
    enabled: enabled && hasCoordinates,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
