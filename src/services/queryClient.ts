import { QueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

/**
 * App-wide TanStack Query client.
 *
 * - staleTime: cached data is served with no request at all for 5 minutes, so
 *   leaving a page and coming back doesn't re-request everything.
 * - That is safe because any successful write through axiosInstance invalidates
 *   the cache (see axiosConfig.ts): a change made in this browser shows up the
 *   next time a cached page is shown. Only changes made by other users can take
 *   up to 5 minutes to appear.
 * - 4xx errors are not retried — they won't succeed on a second attempt.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60_000,
      gcTime: 15 * 60_000,
      retry: (failureCount, error) => {
        const status = isAxiosError(error) ? error.response?.status : undefined;
        if (status && status >= 400 && status < 500) return false;
        return failureCount < 1;
      },
    },
  },
});
