/**
 * Environment configuration
 * Access environment variables with type safety
 */

const STORAGE_KEY = 'app_environment_config';

// In DEV mode use sessionStorage so preferences reset each browser session,
// ensuring localhost is always the default when running locally.
const getStorage = (): Storage => (import.meta.env.DEV ? sessionStorage : localStorage);

const getValidUrls = (): string[] => {
  const localUrl = import.meta.env.VITE_API_LOCAL_URL || 'http://localhost:5173';
  const devUrl = 'https://api.dev2.workfloow.app';
  const prodUrl = import.meta.env.VITE_API_PRODUCTION_URL || 'https://api.workfloow.app';
  return [localUrl, devUrl, prodUrl];
};

const getApiBaseUrl = (): string => {
  const localUrl = import.meta.env.VITE_API_LOCAL_URL || 'http://localhost:5173';
  const defaultUrl = import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.DEV ? localUrl : 'https://api.dev2.workfloow.app');

  try {
    const storage = getStorage();
    const stored = storage.getItem(STORAGE_KEY);
    if (stored) {
      const config = JSON.parse(stored);
      if (config?.environment?.value) {
        const validUrls = getValidUrls();
        if (validUrls.includes(config.environment.value)) {
          return config.environment.value;
        } else {
          console.warn('Stored config has invalid URL, clearing:', config.environment.value);
          storage.removeItem(STORAGE_KEY);
        }
      }
    }
  } catch (e) {
    console.error('Failed to parse stored config:', e);
    getStorage().removeItem(STORAGE_KEY);
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

  /**
   * Paddle client-side token
   * Sandbox tokens start with test_, production tokens start with live_
   */
  paddleToken: import.meta.env.VITE_PADDLE_TOKEN as string,

  /**
   * Paddle environment — 'sandbox' for testing, 'production' for live
   */
  paddleEnvironment: (import.meta.env.VITE_PADDLE_ENV || 'sandbox') as 'sandbox' | 'production',
};

export default env;
