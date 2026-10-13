import { searchCities } from '@/api/geocoding';
import { fetchJson } from '@/api/client';

jest.mock('@/api/client', () => ({
  fetchJson: jest.fn(),
}));

const mockedFetchJson = fetchJson as jest.MockedFunction<typeof fetchJson>;

describe('searchCities', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns empty array without a request for empty or too short queries', async () => {
    expect(await searchCities('')).toEqual([]);
    expect(await searchCities('   ')).toEqual([]);
    expect(await searchCities('K')).toEqual([]);
    expect(mockedFetchJson).not.toHaveBeenCalled();
  });

  it('calls geocoding API with trimmed query and default params', async () => {
    const results = [{ id: 703448, name: 'Kyiv', latitude: 50.45, longitude: 30.52 }];
    mockedFetchJson.mockResolvedValue({ results });

    const response = await searchCities('  Kyiv  ');

    expect(response).toEqual(results);
    expect(mockedFetchJson).toHaveBeenCalledWith(
      'https://geocoding-api.open-meteo.com',
      '/v1/search',
      { name: 'Kyiv', count: 10, language: 'en', format: 'json' },
    );
  });

  it('returns empty array when API response has no results field', async () => {
    mockedFetchJson.mockResolvedValue({});
    expect(await searchCities('Nowhereville')).toEqual([]);
  });
});
