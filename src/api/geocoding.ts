import { fetchJson } from './client';
import { GeocodingResponse, GeocodingResult } from '@/types/geocoding';

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com';

export async function searchCities(
  query: string,
  count = 10,
  language = 'en',
): Promise<GeocodingResult[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  const response = await fetchJson<GeocodingResponse>(GEOCODING_BASE_URL, '/v1/search', {
    name: trimmed,
    count,
    language,
    format: 'json',
  });

  return response.results ?? [];
}
