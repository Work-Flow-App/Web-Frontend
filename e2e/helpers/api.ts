export const API_BASE_URL = process.env.API_BASE_URL ?? 'https://api.dev2.workfloow.app';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export async function getAuthToken(): Promise<string> {
  const userName = process.env.TEST_USER_USERNAME;
  const password = process.env.TEST_USER_PASSWORD;

  if (!userName || !password) {
    throw new Error('TEST_USER_USERNAME and TEST_USER_PASSWORD env vars are required');
  }

  const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userName, password }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Authentication failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as AuthTokens;
  return data.accessToken;
}

export async function apiGet(
  path: string,
  token: string,
): Promise<{ status: number; body: unknown }> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const contentType = res.headers.get('content-type') ?? '';
  const body = contentType.includes('application/json') ? await res.json() : await res.text();

  return { status: res.status, body };
}
