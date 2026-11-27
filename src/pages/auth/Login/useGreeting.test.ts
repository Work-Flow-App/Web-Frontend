import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getGreetingForTime, getCurrentDay } from './useGreeting';
import { GREETING_RANGES } from './constants';

describe('useGreeting and getGreetingForTime', () => {
  describe('Boundary tests for getGreetingForTime', () => {
    it('03:59 -> Good evening (before 4am)', () => {
      expect(getGreetingForTime(3, 59)).toBe(GREETING_RANGES.EVENING);
    });

    it('04:00 -> Good morning (after 4am starts)', () => {
      expect(getGreetingForTime(4, 0)).toBe(GREETING_RANGES.MORNING);
    });

    it('04:59 -> Good morning', () => {
      expect(getGreetingForTime(4, 59)).toBe(GREETING_RANGES.MORNING);
    });

    it('05:00 -> Good morning', () => {
      expect(getGreetingForTime(5, 0)).toBe(GREETING_RANGES.MORNING);
    });

    it('11:59 -> Good morning', () => {
      expect(getGreetingForTime(11, 59)).toBe(GREETING_RANGES.MORNING);
    });

    it('12:00 -> Good noon', () => {
      expect(getGreetingForTime(12, 0)).toBe(GREETING_RANGES.NOON);
    });

    it('12:59 -> Good noon', () => {
      expect(getGreetingForTime(12, 59)).toBe(GREETING_RANGES.NOON);
    });

    it('13:00 -> Good afternoon', () => {
      expect(getGreetingForTime(13, 0)).toBe(GREETING_RANGES.AFTERNOON);
    });

    it('16:59 -> Good afternoon', () => {
      expect(getGreetingForTime(16, 59)).toBe(GREETING_RANGES.AFTERNOON);
    });

    it('17:00 -> Good evening', () => {
      expect(getGreetingForTime(17, 0)).toBe(GREETING_RANGES.EVENING);
    });

    it('20:59 -> Good evening', () => {
      expect(getGreetingForTime(20, 59)).toBe(GREETING_RANGES.EVENING);
    });

    it('21:00 -> Good evening (replaces Good night)', () => {
      expect(getGreetingForTime(21, 0)).toBe(GREETING_RANGES.EVENING);
    });

    it('23:59 -> Good evening', () => {
      expect(getGreetingForTime(23, 59)).toBe(GREETING_RANGES.EVENING);
    });

    it('00:00 -> Good evening', () => {
      expect(getGreetingForTime(0, 0)).toBe(GREETING_RANGES.EVENING);
    });
  });

  describe('Mock Date tests', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    const getGreetingFromCurrentDate = () => {
      const d = new Date();
      return getGreetingForTime(d.getHours(), d.getMinutes());
    };

    it('mock Date at 04:30 -> Good morning', () => {
      vi.setSystemTime(new Date(2026, 10, 18, 4, 30, 0));
      expect(getGreetingFromCurrentDate()).toBe('Good morning');
    });

    it('mock Date at 09:00 -> Good morning', () => {
      vi.setSystemTime(new Date(2026, 10, 18, 9, 0, 0));
      expect(getGreetingFromCurrentDate()).toBe('Good morning');
    });

    it('mock Date at 12:30 -> Good noon', () => {
      vi.setSystemTime(new Date(2026, 10, 18, 12, 30, 0));
      expect(getGreetingFromCurrentDate()).toBe('Good noon');
    });

    it('mock Date at 15:00 -> Good afternoon', () => {
      vi.setSystemTime(new Date(2026, 10, 18, 15, 0, 0));
      expect(getGreetingFromCurrentDate()).toBe('Good afternoon');
    });

    it('mock Date at 18:00 -> Good evening', () => {
      vi.setSystemTime(new Date(2026, 10, 18, 18, 0, 0));
      expect(getGreetingFromCurrentDate()).toBe('Good evening');
    });

    it('mock Date at 22:00 -> Good evening', () => {
      vi.setSystemTime(new Date(2026, 10, 18, 22, 0, 0));
      expect(getGreetingFromCurrentDate()).toBe('Good evening');
    });
  });

  describe('getCurrentDay dynamic day tests', () => {
    it('returns Monday for Monday date', () => {
      // 2026-11-16 is Monday
      const monday = new Date(2026, 10, 16, 10, 0, 0);
      expect(getCurrentDay(monday)).toBe('Monday');
    });

    it('returns Saturday for Saturday date', () => {
      // 2026-11-21 is Saturday
      const saturday = new Date(2026, 10, 21, 10, 0, 0);
      expect(getCurrentDay(saturday)).toBe('Saturday');
    });

    it('returns Sunday for Sunday date', () => {
      // 2026-11-22 is Sunday
      const sunday = new Date(2026, 10, 22, 10, 0, 0);
      expect(getCurrentDay(sunday)).toBe('Sunday');
    });
  });
});
