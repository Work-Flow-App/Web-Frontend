/**
 * True when the given auth role (from `useAuth().userRole`) belongs to a worker
 * account rather than a company/admin account.
 */
export function isWorkerRole(userRole: string | null | undefined): boolean {
  return userRole === 'ROLE_WORKER' || userRole === 'WORKER';
}
