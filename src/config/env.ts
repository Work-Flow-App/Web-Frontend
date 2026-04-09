/**
 * Environment configuration
 * Access environment variables with type safety
 */

const STORAGE_KEY = 'app_environment_config';

/**
 * Get valid environment URLs based on current mode
 */
const getValidUrls = (): string[] => {
  const localUrl = import.meta.env.VITE_API_LOCAL_URL ||
                   (import.meta.env.DEV ? import.meta.env.VITE_API_BASE_URL : 'http://localhost:5173');
  const devUrl = 'https://api.dev2.workfloow.app';
  const prodUrl = import.meta.env.VITE_API_PRODUCTION_URL || 'https://api.workfloow.app';
  return [localUrl, devUrl, prodUrl];
};

/**
 * Get API base URL from localStorage override or fallback to env variable
 */
const getApiBaseUrl = (): string => {
  // Default to local URL in development mode, production URL in production mode
  const defaultUrl = import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.DEV ? 'http://localhost:5173' : 'https://api.dev2.workfloow.app');

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const config = JSON.parse(stored);
      if (config?.environment?.value) {
        const validUrls = getValidUrls();

        // Validate that stored URL is one of the valid options
        if (validUrls.includes(config.environment.value)) {
          return config.environment.value;
        } else {
          // Clear invalid stored config
          console.warn('Stored config has invalid URL, clearing:', config.environment.value);
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    }
  } catch (e) {
    console.error('Failed to parse stored config:', e);
    localStorage.removeItem(STORAGE_KEY);
  }

  return defaultUrl;
};

export const env = {
  /**
   * Backend API base URL
   * Can be overridden via AppConfiguration modal (press C 3 times)
   * Otherwise uses VITE_API_BASE_URL environment variable
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

  /**
   * Google OAuth Client ID for Sign In with Google
   */
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID as string,
};

export default env;
