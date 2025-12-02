import { useState, useEffect } from 'react';
import { apiClient } from '../services/api/client';

/**
 * Hook to wait for session restoration before rendering protected routes
 *
 * @returns {Object} - { isRestoring: boolean, hasSession: boolean }
 * - isRestoring: true while session is being restored
 * - hasSession: true if user has valid session after restoration
 *
 * @example
 * ```tsx
 * function ProtectedRoute() {
 *   const { isRestoring, hasSession } = useSessionRestore();
 *
 *   if (isRestoring) {
 *     return <LoadingSpinner />;
 *   }
 *
 *   if (!hasSession) {
 *     return <Navigate to="/login" />;
 *   }
 *
 *   return <Outlet />;
 * }
 * ```
 */
export function useSessionRestore() {
  const [isRestoring, setIsRestoring] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const sessionValid = await apiClient.waitForSessionRestore();
        setHasSession(sessionValid);
      } catch (error) {
        console.error('Session restore error:', error);
        setHasSession(false);
      } finally {
        setIsRestoring(false);
      }
    };

    restoreSession();
  }, []);

  return { isRestoring, hasSession };
}
