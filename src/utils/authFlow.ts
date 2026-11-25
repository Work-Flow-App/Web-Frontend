const AUTH_PAGES = ['/login', '/signin', '/signup', '/forgot-password', '/reset-password', '/verify-email', '/resend-verification'];

interface ErrorLike {
  code?: unknown;
  status?: unknown;
  response?: { status?: unknown; data?: { code?: unknown } };
}

const asErrorLike = (error: unknown): ErrorLike | null =>
  error && typeof error === 'object' ? (error as ErrorLike) : null;

/** Machine-readable reason the backend attached to an error (e.g. EMAIL_NOT_VERIFIED). */
export const getErrorCode = (error: unknown): string | undefined => {
  const e = asErrorLike(error);
  const code = e?.code ?? e?.response?.data?.code;
  return typeof code === 'string' ? code : undefined;
};

export const getErrorStatus = (error: unknown): number | undefined => {
  const e = asErrorLike(error);
  const status = e?.status ?? e?.response?.status;
  return typeof status === 'number' ? status : undefined;
};

/**
 * Returns the path only if it stays inside this app, so a crafted ?redirect= can't send a
 * user to another site after they log in.
 */
export const safeRedirectPath = (raw: string | null | undefined): string | null => {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//') || raw.startsWith('/\\')) {
    return null;
  }
  const pathname = raw.split(/[?#]/)[0];
  if (pathname === '/' || AUTH_PAGES.includes(pathname)) {
    return null;
  }
  return raw;
};

/** Login URL that brings the user back to where they were after signing in. */
export const loginPathFor = ({ pathname, search }: { pathname: string; search: string }): string => {
  const target = safeRedirectPath(pathname + search);
  return target ? `/login?redirect=${encodeURIComponent(target)}` : '/login';
};
