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
  const prodUrl = import.meta.env.VITE_API_PRODUCTION_URL ||
                  (import.meta.env.PROD ? import.meta.env.VITE_API_BASE_URL : 'https://api.dev.workfloow.app');
  return [localUrl, prodUrl];
};

/**
 * Get API base URL from localStorage override or fallback to env variable
 */
const getApiBaseUrl = (): string => {
  // Default to local URL in development mode, production URL in production mode
  const defaultUrl = import.meta.env.DEV
    ? (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5173')
    : (import.meta.env.VITE_API_BASE_URL || 'https://api.dev.workfloow.app');

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const config = JSON.parse(stored);
      if (config?.environment?.value) {
        const validUrls = getValidUrls();
        const [localUrl, prodUrl] = validUrls;

        // Validate that stored URL is one of the valid options
        if (validUrls.includes(config.environment.value)) {
          // In development mode, if we find production URL stored, it means user explicitly selected it
          // We should keep it UNLESS the label says "Local" but URL is production (which is invalid)
          const storedValue = config.environment.value;
          const storedLabel = config.environment.label;

          // Check for mismatched label and value
          if (storedLabel === 'Local' && storedValue === prodUrl) {
            console.warn('Clearing mismatched config: label is Local but URL is Production');
            localStorage.removeItem(STORAGE_KEY);
            return defaultUrl;
          }

          if (storedLabel === 'Production' && storedValue === localUrl) {
            console.warn('Clearing mismatched config: label is Production but URL is Local');
            localStorage.removeItem(STORAGE_KEY);
            return defaultUrl;
          }

          return storedValue;
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
};

export default env;
