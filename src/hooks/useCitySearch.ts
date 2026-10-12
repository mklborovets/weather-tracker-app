import { useQuery } from '@tanstack/react-query';
import { searchCities } from '@/api/geocoding';
import { GeocodingResult } from '@/types/geocoding';

export function useCitySearch(query: string, count = 10, language = 'en') {
  const trimmed = query.trim();

  return useQuery<GeocodingResult[], Error>({
    queryKey: ['citySearch', trimmed, count, language],
    queryFn: () => searchCities(trimmed, count, language),
    enabled: trimmed.length >= 2,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
