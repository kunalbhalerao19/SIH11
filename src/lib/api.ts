/**
 * API Configuration and Client Service
 * Configured with environment variable VITE_API_BASE_URL
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!res.ok) {
      return {
        status: res.status,
        error: `Request failed with status ${res.status}: ${res.statusText}`,
      };
    }

    const data = await res.json();
    return {
      status: res.status,
      data,
    };
  } catch (err) {
    return {
      status: 0,
      error: err instanceof Error ? err.message : 'Network error occurred',
    };
  }
}
