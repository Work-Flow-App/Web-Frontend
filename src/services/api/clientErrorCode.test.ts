import { describe, it, expect, vi, afterEach } from 'vitest';

// Browser globals the client touches on import
vi.hoisted(() => {
  const store = new Map<string, string>();
  const g = globalThis as Record<string, unknown>;
  g.sessionStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
    clear: () => store.clear(),
  };
  g.window = { location: { href: '/signup', pathname: '/signup' } };
  class NoopChannel {
    onmessage = null;
    postMessage() {}
    close() {}
  }
  Object.defineProperty(globalThis, 'BroadcastChannel', { value: NoopChannel, configurable: true, writable: true });
  Object.defineProperty(globalThis, 'navigator', {
    value: { locks: { request: (_: string, cb: () => unknown) => Promise.resolve(cb()) } },
    configurable: true,
    writable: true,
  });
});

vi.mock('../../config/env', () => ({ env: { apiBaseUrl: 'https://api.test', apiTimeout: 10_000 } }));
vi.mock('../queryClient', () => ({ queryClient: { invalidateQueries: vi.fn() } }));

import { apiClient } from './client';

const jsonResponse = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

describe('apiClient error responses', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('keeps the backend code so pages can show the right next step', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      jsonResponse(409, { status: 409, code: 'EMAIL_NOT_VERIFIED', message: 'Not confirmed yet' })
    ));

    await expect(apiClient.post('/api/v1/auth/signup', {})).rejects.toMatchObject({
      status: 409,
      code: 'EMAIL_NOT_VERIFIED',
      message: 'Not confirmed yet',
    });
  });

  it('leaves code undefined when the backend sends none', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(400, { message: 'Bad input' })));

    const error = await apiClient.post('/api/v1/auth/signup', {}).catch((e: unknown) => e);
    expect(error).toMatchObject({ status: 400, message: 'Bad input' });
    expect((error as { code?: string }).code).toBeUndefined();
  });
});
