import { useCallback, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'workflow:time-format-24h';

type Listener = () => void;
const listeners = new Set<Listener>();

function readStoredPreference(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

let cachedValue = readStoredPreference();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return cachedValue;
}

function setStoredPreference(value: boolean) {
  cachedValue = value;
  try {
    localStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    // ignore write failures (e.g. private browsing storage limits)
  }
  emitChange();
}

/**
 * Shared 12-hour/24-hour time-format preference for time pickers across the app.
 * Persisted to localStorage and kept live-in-sync across every mounted picker
 * (e.g. the Start/End Time fields in one modal, or the Worker and Company
 * "Add Work Log" modals) — toggling the format anywhere applies everywhere
 * immediately, and is remembered the next time either view is opened.
 */
export function useTimeFormatPreference(): [boolean, (is24Hour: boolean) => void] {
  const is24Hour = useSyncExternalStore(subscribe, getSnapshot);
  const setIs24Hour = useCallback((value: boolean) => setStoredPreference(value), []);
  return [is24Hour, setIs24Hour];
}
