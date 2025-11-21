/**
 * Environment configuration
 * Access environment variables with type safety
 */

const STORAGE_KEY = 'app_environment_config';

/**
 * Get API base URL from localStorage configuration or fallback to env variable
 */
const getApiBaseUrl = (): string => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const config = JSON.parse(stored);
      if (config?.environment?.value) {
        return config.environment.value;
      }
    }
  } catch (e) {
    console.error('Failed to parse stored config:', e);
  }

  return import.meta.env.VITE_API_BASE_URL || 'https://api.dev.workfloow.app';
};

export const env = {
  /**
   * Backend API base URL
   * Can be switched between local and production via AppConfiguration (press C 3 times)
   */
  get apiBaseUrl(): string {
    return getApiBaseUrl();
  },

  /**
   * API request timeout in milliseconds
   */
  apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10),

  /**
   * Current environment mode
   */
  mode: import.meta.env.MODE,

  /**
   * Is development mode
   */
  isDev: import.meta.env.DEV,

  /**
   * Is production mode
   */
  isProd: import.meta.env.PROD,
};

export default env;
