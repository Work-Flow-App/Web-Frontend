import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  UPGRADE_PROMPT_EVENT,
  classifySubscriptionError,
  handlePaymentRequired,
  type UpgradePromptDetail,
} from './subscriptionErrors';

const error402 = (data: { message?: string; code?: string }) => ({ response: { status: 402, data } });

describe('classifySubscriptionError', () => {
  it.each([
    ['SUBSCRIPTION_REQUIRED', 'lapsed'],
    ['PLAN_UPGRADE_REQUIRED', 'upgrade'],
    ['JOB_LIMIT_EXCEEDED', 'cap'],
    ['SEAT_LIMIT_EXCEEDED', 'cap'],
    ['STORAGE_LIMIT_EXCEEDED', 'cap'],
    ['DOCUMENT_LIMIT_EXCEEDED', 'cap'],
  ])('reads %s as %s', (code, kind) => {
    expect(classifySubscriptionError(error402({ code, message: 'anything' }))).toBe(kind);
  });

  it('trusts the code over the message', () => {
    // An active Starter company must never be treated as lapsed because of the wording
    expect(
      classifySubscriptionError(error402({ code: 'PLAN_UPGRADE_REQUIRED', message: 'Trial expired, resubscribe' }))
    ).toBe('upgrade');
  });

  it('falls back to the message when the backend sends no code', () => {
    expect(classifySubscriptionError(error402({ message: 'Your trial expired' }))).toBe('lapsed');
    expect(classifySubscriptionError(error402({ message: 'Monthly job limit reached' }))).toBe('cap');
    expect(classifySubscriptionError(error402({ code: 'PAYMENT_REQUIRED', message: 'Seat limit reached' }))).toBe('cap');
    expect(classifySubscriptionError(error402({}))).toBe('unknown');
  });
});

describe('handlePaymentRequired', () => {
  const stubWindow = (pathname = '/company/estimates') => {
    const win = { location: { pathname, href: pathname }, dispatchEvent: vi.fn() };
    vi.stubGlobal('window', win);
    return win;
  };

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends a lapsed subscription to the subscribe page', () => {
    const win = stubWindow();

    handlePaymentRequired(error402({ code: 'SUBSCRIPTION_REQUIRED' }));

    expect(win.location.href).toBe('/subscribe');
    expect(win.dispatchEvent).not.toHaveBeenCalled();
  });

  it('opens the upgrade prompt for a Pro-only feature, without redirecting', () => {
    const win = stubWindow();

    handlePaymentRequired(error402({ code: 'PLAN_UPGRADE_REQUIRED', message: 'This feature requires the PROFESSIONAL plan.' }));

    expect(win.location.href).toBe('/company/estimates');
    const event = win.dispatchEvent.mock.calls[0][0] as CustomEvent<UpgradePromptDetail>;
    expect(event.type).toBe(UPGRADE_PROMPT_EVENT);
    expect(event.detail.kind).toBe('upgrade');
  });

  it('passes a reached limit on to the prompt with the backend message', () => {
    const win = stubWindow();

    handlePaymentRequired(error402({ code: 'JOB_LIMIT_EXCEEDED', message: 'Monthly job limit reached (70).' }));

    const event = win.dispatchEvent.mock.calls[0][0] as CustomEvent<UpgradePromptDetail>;
    expect(event.detail).toEqual({ kind: 'cap', message: 'Monthly job limit reached (70).' });
    expect(win.location.href).toBe('/company/estimates');
  });

  it('does nothing for an unclassified 402', () => {
    const win = stubWindow();

    handlePaymentRequired(error402({ message: 'Something else' }));

    expect(win.location.href).toBe('/company/estimates');
    expect(win.dispatchEvent).not.toHaveBeenCalled();
  });
});
