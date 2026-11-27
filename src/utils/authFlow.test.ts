import { describe, it, expect } from 'vitest';
import { getErrorCode, getErrorStatus, loginPathFor, safeRedirectPath } from './authFlow';
import { AuthErrorCode } from '../enums/AuthErrorCode';

describe('getErrorCode', () => {
  it('reads code from an apiClient error', () => {
    expect(getErrorCode({ message: 'x', status: 409, code: 'EMAIL_NOT_VERIFIED' })).toBe(
      AuthErrorCode.EMAIL_NOT_VERIFIED
    );
  });

  it('reads code from an axios-style response', () => {
    expect(getErrorCode({ response: { data: { code: 'USERNAME_TAKEN' } } })).toBe(AuthErrorCode.USERNAME_TAKEN);
  });

  it('returns undefined when there is no code', () => {
    expect(getErrorCode({ message: 'x', status: 409 })).toBeUndefined();
    expect(getErrorCode(null)).toBeUndefined();
    expect(getErrorCode('boom')).toBeUndefined();
  });
});

describe('getErrorStatus', () => {
  it('reads status from apiClient and axios-style errors', () => {
    expect(getErrorStatus({ status: 429 })).toBe(429);
    expect(getErrorStatus({ response: { status: 402 } })).toBe(402);
    expect(getErrorStatus(new Error('x'))).toBeUndefined();
  });
});

describe('safeRedirectPath', () => {
  it('accepts in-app paths with query strings', () => {
    expect(safeRedirectPath('/subscribe?utm_source=email')).toBe('/subscribe?utm_source=email');
    expect(safeRedirectPath('/company/jobs')).toBe('/company/jobs');
  });

  it('rejects anything that could leave the app', () => {
    expect(safeRedirectPath('https://evil.example')).toBeNull();
    expect(safeRedirectPath('//evil.example')).toBeNull();
    expect(safeRedirectPath('/\\evil.example')).toBeNull();
    expect(safeRedirectPath('javascript:alert(1)')).toBeNull();
  });

  it('ignores auth pages and empty values', () => {
    expect(safeRedirectPath('/login')).toBeNull();
    expect(safeRedirectPath('/signup?x=1')).toBeNull();
    expect(safeRedirectPath('')).toBeNull();
    expect(safeRedirectPath(null)).toBeNull();
  });
});

describe('loginPathFor', () => {
  it('keeps the page the user was trying to open', () => {
    expect(loginPathFor({ pathname: '/subscribe', search: '?utm_source=email' })).toBe(
      '/login?redirect=%2Fsubscribe%3Futm_source%3Demail'
    );
  });

  it('is plain /login when there is nothing worth returning to', () => {
    expect(loginPathFor({ pathname: '/', search: '' })).toBe('/login');
    expect(loginPathFor({ pathname: '/login', search: '' })).toBe('/login');
  });

  it('round-trips through safeRedirectPath', () => {
    const path = loginPathFor({ pathname: '/company/jobs', search: '?page=2' });
    const redirect = new URLSearchParams(path.split('?')[1]).get('redirect');
    expect(safeRedirectPath(redirect)).toBe('/company/jobs?page=2');
  });
});
