import { describe, it, expect, vi, beforeEach } from 'vitest';

const { getStoredAccessToken } = vi.hoisted(() => ({
  getStoredAccessToken: vi.fn(),
}));

vi.mock('./api/client', () => ({
  apiClient: { getStoredAccessToken },
}));

import { buildConnectHeaders } from './notificationSocket';

describe('buildConnectHeaders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns a fresh Authorization header from the currently stored token', () => {
    getStoredAccessToken.mockReturnValue('token-a');
    expect(buildConnectHeaders()).toEqual({ Authorization: 'Bearer token-a' });

    getStoredAccessToken.mockReturnValue('token-b');
    expect(buildConnectHeaders()).toEqual({ Authorization: 'Bearer token-b' });
  });

  it('returns empty headers when there is no stored token', () => {
    getStoredAccessToken.mockReturnValue(null);
    expect(buildConnectHeaders()).toEqual({});
  });
});
