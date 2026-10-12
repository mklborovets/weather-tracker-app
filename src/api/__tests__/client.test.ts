import { fetchJson, ApiError } from '@/api/client';

describe('fetchJson client', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it('successfully fetches and parses JSON data with query params', async () => {
    const mockData = { results: [{ id: 1, name: 'Kyiv' }] };
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(mockData),
    });
    global.fetch = mockFetch;

    const result = await fetchJson('https://example.com', '/v1/search', {
      name: 'Kyiv',
      count: 5,
      language: undefined,
    });

    expect(result).toEqual(mockData);
    expect(mockFetch).toHaveBeenCalledTimes(1);

    const calledUrl = mockFetch.mock.calls[0][0];
    expect(calledUrl).toContain('name=Kyiv');
    expect(calledUrl).toContain('count=5');
    expect(calledUrl).not.toContain('language');
  });

  it('throws ApiError with status code when response is not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      text: jest.fn().mockResolvedValue('City not found'),
    });

    await expect(
      fetchJson('https://example.com', '/v1/search', { name: 'Unknown' }),
    ).rejects.toThrow(ApiError);

    try {
      await fetchJson('https://example.com', '/v1/search', { name: 'Unknown' });
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      if (error instanceof ApiError) {
        expect(error.statusCode).toBe(404);
        expect(error.details).toBe('City not found');
      }
    }
  });

  it('throws ApiError with statusCode 0 on network failures', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Failed to connect'));

    await expect(fetchJson('https://example.com', '/v1/search')).rejects.toThrow(ApiError);

    try {
      await fetchJson('https://example.com', '/v1/search');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      if (error instanceof ApiError) {
        expect(error.statusCode).toBe(0);
        expect(error.message).toContain('Failed to connect');
      }
    }
  });
});
