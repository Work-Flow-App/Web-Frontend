import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AxiosError, type InternalAxiosRequestConfig } from 'axios';

// Browser globals the API clients touch, installed before they're imported
const bus = vi.hoisted(() => {
  const store = new Map<string, string>();
  const g = globalThis as Record<string, unknown>;
  g.sessionStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
    clear: () => store.clear(),
  };
  g.window = { location: { href: '/dashboard', pathname: '/dashboard' } };

  // In-process stand-ins for the browser's tab-to-tab APIs, so each ApiClient
  // created in a test behaves like a separate tab of the same site
  const bus = { deliveryDelayMs: 0, sent: [] as unknown[] };
  type Listener = { name: string; onmessage: ((event: { data: unknown }) => void) | null };
  const channels = new Set<Listener>();
  class FakeBroadcastChannel implements Listener {
    name: string;
    onmessage: Listener['onmessage'] = null;
    constructor(name: string) {
      this.name = name;
      channels.add(this);
    }
    postMessage(data: unknown) {
      bus.sent.push(data);
      for (const channel of channels) {
        if (channel === this || channel.name !== this.name) continue;
        const deliver = () => channel.onmessage?.({ data: structuredClone(data) });
        if (bus.deliveryDelayMs > 0) setTimeout(deliver, bus.deliveryDelayMs);
        else queueMicrotask(deliver);
      }
    }
  }
  // Web Locks: callbacks for the same lock name run one after another
  const lockQueues = new Map<string, Promise<unknown>>();
  const locks = {
    request(name: string, callback: () => unknown) {
      const result = (lockQueues.get(name) ?? Promise.resolve()).then(() => callback());
      lockQueues.set(name, result.catch(() => undefined));
      return result;
    },
  };
  Object.defineProperty(globalThis, 'BroadcastChannel', { value: FakeBroadcastChannel, configurable: true, writable: true });
  Object.defineProperty(globalThis, 'navigator', { value: { locks }, configurable: true, writable: true });
  return bus;
});

vi.mock('../../config/env', () => ({ env: { apiBaseUrl: 'https://api.test', apiTimeout: 10_000 } }));
vi.mock('../queryClient', () => ({ queryClient: { invalidateQueries: vi.fn() } }));

import { apiClient, ApiClient } from './client';
import { axiosInstance } from './axiosConfig';

/**
 * Fake backend: an access token is valid until rotated, and a refresh token
 * can be used exactly once — reusing it returns 401 "revoked", like the real API.
 */
const server = {
  generation: 1,
  validAccess: null as string | null,
  validRefresh: 'refresh-1',
  refreshCalls: 0,
  // When set, /auth/refresh answers with this status instead
  refreshStatus: 0,
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

// Paths whose response arrives late, simulating a slow request still in flight
const latencyFor = (url: string) => (url.includes('/slow') ? 80 : 5);

async function fakeFetch(input: string, init?: RequestInit): Promise<Response> {
  const url = String(input);
  await delay(latencyFor(url));

  if (url.endsWith('/api/v1/auth/refresh')) {
    server.refreshCalls++;
    if (server.refreshStatus) {
      return json(server.refreshStatus, { message: 'Refresh failed' });
    }
    const { refreshToken } = JSON.parse(String(init?.body));
    if (refreshToken !== server.validRefresh) {
      return json(401, { message: 'Refresh token revoked' });
    }
    server.generation++;
    server.validAccess = `access-${server.generation}`;
    server.validRefresh = `refresh-${server.generation}`;
    return json(200, { accessToken: server.validAccess, refreshToken: server.validRefresh });
  }

  const auth = (init?.headers as Record<string, string> | undefined)?.Authorization;
  if (url.includes('/always401') || auth !== `Bearer ${server.validAccess}`) {
    return json(401, { message: 'Unauthorized' });
  }
  return json(200, { ok: true });
}

async function fakeAxiosAdapter(config: InternalAxiosRequestConfig) {
  const url = config.url ?? '';
  await delay(latencyFor(url));
  const auth = config.headers.Authorization;
  if (auth !== `Bearer ${server.validAccess}`) {
    const response = { status: 401, statusText: 'Unauthorized', data: {}, headers: {}, config };
    throw new AxiosError('Request failed with status code 401', 'ERR_BAD_REQUEST', config, null, response);
  }
  return { status: 200, statusText: 'OK', data: { ok: true }, headers: {}, config };
}

describe('token refresh after the access token expires', () => {
  beforeEach(() => {
    Object.assign(server, { generation: 1, validAccess: null, validRefresh: 'refresh-1', refreshCalls: 0, refreshStatus: 0 });
    vi.stubGlobal('fetch', vi.fn(fakeFetch));
    axiosInstance.defaults.adapter = fakeAxiosAdapter;
    window.location.href = '/dashboard';
    // Expired access token + valid refresh token: the state after idling
    sessionStorage.setItem('app_access_token', 'expired-access');
    sessionStorage.setItem('app_refresh_token', 'refresh-1');
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    apiClient.clearAuthToken(); // also cancels the proactive refresh timer
    apiClient.clearRefreshToken();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('a burst of parallel axios 401s sends one refresh and every request succeeds', async () => {
    const results = await Promise.all(
      Array.from({ length: 6 }, (_, i) => axiosInstance.get(`/api/v1/resource-${i}`))
    );

    expect(results.map((r) => r.status)).toEqual([200, 200, 200, 200, 200, 200]);
    expect(server.refreshCalls).toBe(1);
    expect(window.location.href).toBe('/dashboard');
    expect(apiClient.getStoredRefreshToken()).toBe('refresh-2');
  });

  it('a 401 that lands after another request refreshed retries without refreshing again', async () => {
    const [fast, slow] = await Promise.all([
      axiosInstance.get('/api/v1/fast'),
      axiosInstance.get('/api/v1/slow'), // 401 arrives after the refresh finished
    ]);

    expect(fast.status).toBe(200);
    expect(slow.status).toBe(200);
    expect(server.refreshCalls).toBe(1);
    expect(window.location.href).toBe('/dashboard');
  });

  it('a burst of parallel fetch-client 401s sends one refresh and every request succeeds', async () => {
    const results = await Promise.all(
      Array.from({ length: 4 }, (_, i) => apiClient.get(`/api/v1/resource-${i}`))
    );

    expect(results.map((r) => r.status)).toEqual([200, 200, 200, 200]);
    expect(server.refreshCalls).toBe(1);
    expect(window.location.href).toBe('/dashboard');
  });

  it('axios and fetch-client 401s at the same time share one refresh', async () => {
    const results = await Promise.all([
      axiosInstance.get('/api/v1/a'),
      apiClient.get('/api/v1/b'),
      axiosInstance.get('/api/v1/c'),
      apiClient.get('/api/v1/d'),
    ]);

    expect(results.map((r) => r.status)).toEqual([200, 200, 200, 200]);
    expect(server.refreshCalls).toBe(1);
    expect(window.location.href).toBe('/dashboard');
  });

  it('concurrent refreshAccessToken() callers (timer, restore, 401s) share one request', async () => {
    const results = await Promise.all([
      apiClient.refreshAccessToken(),
      apiClient.refreshAccessToken(),
      apiClient.refreshAccessToken(),
    ]);

    expect(results).toEqual([true, true, true]);
    expect(server.refreshCalls).toBe(1);
  });

  it('a fetch-client request that still gets 401 after refreshing fails instead of looping', async () => {
    await expect(apiClient.get('/api/v1/always401')).rejects.toMatchObject({ status: 401 });
    expect(server.refreshCalls).toBe(1);
  });

  it('a genuinely revoked refresh token still logs the user out', async () => {
    sessionStorage.setItem('app_refresh_token', 'already-used');

    const results = await Promise.allSettled([
      axiosInstance.get('/api/v1/a'),
      axiosInstance.get('/api/v1/b'),
    ]);

    expect(results.every((r) => r.status === 'rejected')).toBe(true);
    expect(server.refreshCalls).toBe(1);
    expect(apiClient.getStoredAccessToken()).toBeNull();
    expect(apiClient.getStoredRefreshToken()).toBeNull();
    expect(window.location.href).toBe('/login');
  });

  it('a 5xx from refresh keeps the session instead of logging out', async () => {
    server.refreshStatus = 500;

    await expect(axiosInstance.get('/api/v1/a')).rejects.toMatchObject({ response: { status: 401 } });

    expect(apiClient.getStoredRefreshToken()).toBe('refresh-1');
    expect(window.location.href).toBe('/dashboard');
  });

  it('a 400 from refresh logs out, since retrying the same request cannot succeed', async () => {
    server.refreshStatus = 400;

    await expect(axiosInstance.get('/api/v1/a')).rejects.toMatchObject({ response: { status: 401 } });

    expect(apiClient.getStoredRefreshToken()).toBeNull();
    expect(window.location.href).toBe('/login');
  });

  describe('duplicated tabs that share one login', () => {
    type Tab = { client: ApiClient; storage: Map<string, string> };
    const tabs: Tab[] = [];

    // A tab with its own sessionStorage. "Duplicate tab" starts one from a copy of another's.
    const openTab = (copyOf: Map<string, string> = new Map()): Tab => {
      const storage = new Map(copyOf);
      const client = new ApiClient({
        storage: () =>
          ({
            getItem: (k: string) => storage.get(k) ?? null,
            setItem: (k: string, v: string) => void storage.set(k, v),
            removeItem: (k: string) => void storage.delete(k),
          }) as Storage,
      });
      const tab = { client, storage };
      tabs.push(tab);
      return tab;
    };

    // Logged in a while ago: the access token has expired, refresh-1 is still valid
    const loggedInTab = (): Tab => {
      const tab = openTab();
      tab.client.setAuthToken('expired-access');
      tab.client.setRefreshToken('refresh-1');
      return tab;
    };

    beforeEach(() => {
      bus.sent.length = 0;
    });

    afterEach(() => {
      bus.deliveryDelayMs = 0;
      tabs.splice(0).forEach((tab) => tab.client.clearAuthToken());
    });

    it('a duplicate that refreshed first passes the new tokens on instead of logging this tab out', async () => {
      const tab = loggedInTab();
      const duplicate = openTab(tab.storage);

      expect((await duplicate.client.get('/api/v1/a')).status).toBe(200); // uses up refresh-1
      await vi.waitFor(() => expect(tab.client.getStoredRefreshToken()).toBe('refresh-2'));
      expect((await tab.client.get('/api/v1/b')).status).toBe(200);

      expect(server.refreshCalls).toBe(1);
      expect(window.location.href).toBe('/dashboard');
    });

    it('duplicates that hit 401 at the same moment send a single refresh', async () => {
      const tab = loggedInTab();
      const duplicate = openTab(tab.storage);

      const results = await Promise.all([tab.client.get('/api/v1/a'), duplicate.client.get('/api/v1/b')]);

      expect(results.map((r) => r.status)).toEqual([200, 200]);
      expect(server.refreshCalls).toBe(1);
      expect(window.location.href).toBe('/dashboard');
    });

    it('both stay signed in when the update reaches the duplicate only after its own refresh started', async () => {
      bus.deliveryDelayMs = 40;
      const tab = loggedInTab();
      const duplicate = openTab(tab.storage);

      const results = await Promise.all([tab.client.get('/api/v1/a'), duplicate.client.get('/api/v1/b')]);

      expect(results.map((r) => r.status)).toEqual([200, 200]);
      expect(window.location.href).toBe('/dashboard');
      await vi.waitFor(() =>
        expect(tab.client.getStoredRefreshToken()).toBe(duplicate.client.getStoredRefreshToken())
      );
    });

    it('a tab reloaded after the browser discarded it gets the login back from a live duplicate', async () => {
      const live = loggedInTab();
      const discardedStorage = new Map(live.storage); // the duplicate's sessionStorage when it was discarded
      expect((await live.client.get('/api/v1/a')).status).toBe(200); // meanwhile refresh-1 → refresh-2

      const restored = openTab(discardedStorage); // reloads with refresh-1, which is revoked by now
      expect((await restored.client.get('/api/v1/b')).status).toBe(200);

      expect(window.location.href).toBe('/dashboard');
      await vi.waitFor(() =>
        expect(live.client.getStoredRefreshToken()).toBe(restored.client.getStoredRefreshToken())
      );
    });

    it('a tab with a different login neither reads nor takes the tokens', async () => {
      const tab = loggedInTab();
      const otherLogin = openTab();
      otherLogin.client.setAuthToken('other-access');
      otherLogin.client.setRefreshToken('other-refresh');

      expect((await tab.client.get('/api/v1/a')).status).toBe(200); // broadcasts refresh-2
      await delay(50);

      expect(otherLogin.client.getStoredRefreshToken()).toBe('other-refresh');
      expect(bus.sent.length).toBeGreaterThan(0);
      expect(JSON.stringify(bus.sent)).not.toMatch(/access-2|refresh-2/); // only ever sent encrypted
    });

    it('an old update replayed as a newer one is ignored', async () => {
      const tab = loggedInTab();
      const duplicate = openTab(tab.storage);
      expect((await tab.client.get('/api/v1/a')).status).toBe(200); // broadcasts refresh-2
      const oldUpdate = bus.sent.find((message) => (message as { type: string }).type === 'tokens');
      await tab.client.refreshAccessToken(); // broadcasts refresh-3
      await vi.waitFor(() => expect(duplicate.client.getStoredRefreshToken()).toBe('refresh-3'));

      // A script on the same site replays the refresh-2 update with a higher count
      new BroadcastChannel('workfloow-auth').postMessage({ ...(oldUpdate as object), seq: 99 });
      await delay(50);

      expect(tab.client.getStoredRefreshToken()).toBe('refresh-3');
      expect(duplicate.client.getStoredRefreshToken()).toBe('refresh-3');
    });

    it('logging out in one tab signs its duplicates out too', async () => {
      const tab = loggedInTab();
      const duplicate = openTab(tab.storage);

      // Logout: the backend revokes the shared refresh token and the tab forgets the login
      server.validRefresh = 'revoked-by-logout';
      tab.client.clearAuthToken();
      tab.client.clearRefreshToken();

      await expect(duplicate.client.get('/api/v1/b')).rejects.toMatchObject({ status: 401 });
      expect(duplicate.client.getStoredRefreshToken()).toBeNull();
      expect(window.location.href).toBe('/login');
    });
  });
});
