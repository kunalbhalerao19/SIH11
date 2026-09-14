/**
 * Application Configuration
 * Centralized registry for all environment variables with type-safe fallbacks.
 */

export const APP_CONFIG = {
  title: import.meta.env.VITE_APP_TITLE || 'MPLADS AI Insight - SIH 2026',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  enableMockData: import.meta.env.VITE_ENABLE_MOCK_DATA !== 'false',
  confidenceThreshold: parseFloat(import.meta.env.VITE_AI_MODEL_CONFIDENCE_THRESHOLD || '0.75'),
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  govPortalUrl: import.meta.env.VITE_GOV_PORTAL_URL || 'https://mplads.mospi.gov.in',
};
