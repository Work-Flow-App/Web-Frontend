/**
 * Environment configuration
 * Access environment variables with type safety
 */

export const env = {
  /**
   * Backend API base URL
   */
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.dev.workfloow.app',

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
} as const;

export default env;
