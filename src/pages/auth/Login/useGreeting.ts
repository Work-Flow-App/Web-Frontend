import { useState, useEffect } from 'react';
import { GREETING_RANGES } from './constants';

/**
 * Maps hour (0-23) and minutes (0-59) to greeting string based on local client time.
 *
 * 04:00-11:59  "Good morning" (after 4am)
 * 12:00-12:59  "Good noon"
 * 13:00-16:59  "Good afternoon"
 * 17:00-03:59  "Good evening" (replaces Good night)
 */
export function getGreetingForTime(hours: number, minutes: number = 0): string {
  const totalMinutes = hours * 60 + minutes;

  // 04:00 - 11:59 (after 4am)
  if (totalMinutes >= 240 && totalMinutes < 720) {
    return GREETING_RANGES.MORNING;
  }
  // 12:00 - 12:59
  if (totalMinutes >= 720 && totalMinutes < 780) {
    return GREETING_RANGES.NOON;
  }
  // 13:00 - 16:59
  if (totalMinutes >= 780 && totalMinutes < 1020) {
    return GREETING_RANGES.AFTERNOON;
  }
  // 17:00 - 03:59 (all night/evening hours)
  return GREETING_RANGES.EVENING;
}

export function useGreeting(): string {
  const [greeting, setGreeting] = useState<string>(() => {
    const now = new Date();
    return getGreetingForTime(now.getHours(), now.getMinutes());
  });

  useEffect(() => {
    const updateGreeting = () => {
      const now = new Date();
      setGreeting(getGreetingForTime(now.getHours(), now.getMinutes()));
    };

    updateGreeting();
    // Re-check every 60 seconds
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  return greeting;
}

/**
 * Returns the current day of the week (e.g. "Monday", "Tuesday", etc.)
 * dynamically based on the user's local country / timezone worldwide.
 */
export function getCurrentDay(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

export function useCurrentDay(): string {
  const [day, setDay] = useState<string>(() => getCurrentDay());

  useEffect(() => {
    const updateDay = () => {
      setDay(getCurrentDay());
    };

    updateDay();
    // Re-check every 60 seconds
    const interval = setInterval(updateDay, 60000);
    return () => clearInterval(interval);
  }, []);

  return day;
}
