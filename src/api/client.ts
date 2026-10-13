export class ApiError extends Error {
  public statusCode: number;
  public details?: unknown;

  constructor(message: string, statusCode: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

export async function fetchJson<T>(
  baseUrl: string,
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined | null>,
): Promise<T> {
  const url = new URL(endpoint, baseUrl);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorReason = response.statusText;
      try {
        const parsed = JSON.parse(errorText) as { reason?: string; message?: string };
        if (parsed?.reason) {
          errorReason = parsed.reason;
        } else if (parsed?.message) {
          errorReason = parsed.message;
        }
      } catch {}

      const message = errorReason
        ? `API request failed with status ${response.status}: ${errorReason}`
        : `API request failed with status ${response.status}`;

      throw new ApiError(message, response.status, errorText);
    }

    const data: T = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    const message = error instanceof Error ? error.message : 'Unknown network error';
    throw new ApiError(`Network error: ${message}`, 0, error);
  }
}
