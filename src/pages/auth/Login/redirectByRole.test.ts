import { describe, it, expect, vi } from 'vitest';
import type { NavigateFunction } from 'react-router-dom';
import { redirectByRole } from './Login';

describe('redirectByRole', () => {
  it('redirects to /company for ROLE_COMPANY', () => {
    const navigate = vi.fn();
    redirectByRole('ROLE_COMPANY', navigate as any);
    expect(navigate).toHaveBeenCalledWith('/company');
  });

  it('redirects to /company for COMPANY', () => {
    const navigate = vi.fn();
    redirectByRole('COMPANY', navigate as any);
    expect(navigate).toHaveBeenCalledWith('/company');
  });

  it('redirects to /worker for ROLE_WORKER', () => {
    const navigate = vi.fn();
    redirectByRole('ROLE_WORKER', navigate as any);
    expect(navigate).toHaveBeenCalledWith('/worker');
  });

  it('redirects to /worker for WORKER', () => {
    const navigate = vi.fn();
    redirectByRole('WORKER', navigate as any);
    expect(navigate).toHaveBeenCalledWith('/worker');
  });

  it('defaults to /company for null or unknown roles', () => {
    const navigate = vi.fn();
    redirectByRole(null, navigate as any);
    expect(navigate).toHaveBeenCalledWith('/company');

    redirectByRole('UNKNOWN_ROLE', navigate as any);
    expect(navigate).toHaveBeenCalledWith('/company');
  });

  it('sends the user back to the requested page when one is given', () => {
    const navigate = vi.fn();
    redirectByRole('ROLE_WORKER', navigate as unknown as NavigateFunction, '/subscribe?utm_source=email');
    expect(navigate).toHaveBeenCalledWith('/subscribe?utm_source=email');
    expect(navigate).toHaveBeenCalledTimes(1);
  });

  it('falls back to the role page when no redirect is given', () => {
    const navigate = vi.fn();
    redirectByRole('ROLE_WORKER', navigate as unknown as NavigateFunction, null);
    expect(navigate).toHaveBeenCalledWith('/worker');
  });
});
