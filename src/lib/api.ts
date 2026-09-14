/**
 * API Client & Backend Connector Service
 * Interfaces with FastAPI backend at APP_CONFIG.apiBaseUrl with graceful fallback.
 */

import { APP_CONFIG } from './config';

export const API_BASE_URL = APP_CONFIG.apiBaseUrl;

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
  isBackendConnected: boolean;
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
        isBackendConnected: true,
      };
    }

    const data = await res.json();
    return {
      status: res.status,
      data,
      isBackendConnected: true,
    };
  } catch (err) {
    return {
      status: 0,
      error: err instanceof Error ? err.message : 'Backend connection unavailable',
      isBackendConnected: false,
    };
  }
}

/**
 * Health check probe to verify if the FastAPI backend service is reachable.
 */
export async function checkBackendHealth(): Promise<{ connected: boolean; version?: string; latencyMs: number }> {
  const start = performance.now();
  try {
    const res = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(3000),
    });
    const latencyMs = Math.round(performance.now() - start);
    if (res.ok) {
      const data = await res.json();
      return { connected: true, version: data.version || '1.0.0', latencyMs };
    }
    return { connected: false, latencyMs };
  } catch {
    return { connected: false, latencyMs: Math.round(performance.now() - start) };
  }
}
