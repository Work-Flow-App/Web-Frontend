import { describe, it, expect } from 'vitest';
import { computeRouteProgress } from './useFormRouteProgress';
import { ROUTE_COLORS } from './constants';

describe('computeRouteProgress', () => {
  describe('Phase "success"', () => {
    it('sets all segments and pins as completed', () => {
      const res = computeRouteProgress({
        userName: 'test@example.com',
        password: 'password123',
        mode: 'login',
        phase: 'success',
      });

      expect(res.lit).toBe(3);
      expect(res.seg1).toBe(0);
      expect(res.seg2).toBe(0);
      expect(res.seg3).toBe(0);
      expect(res.pin1Fill).toBe(ROUTE_COLORS.ink);
      expect(res.pin1Stroke).toBe(ROUTE_COLORS.lime);
      expect(res.pin2Fill).toBe(ROUTE_COLORS.ink);
      expect(res.pin2Stroke).toBe(ROUTE_COLORS.lime);
      expect(res.pin3Fill).toBe(ROUTE_COLORS.ink);
      expect(res.pin3Stroke).toBe(ROUTE_COLORS.lime);
      expect(res.nextBorder).toBe(ROUTE_COLORS.lime);
    });
  });

  describe('Mode "login"', () => {
    it('returns empty progress when both username and password are empty', () => {
      const res = computeRouteProgress({
        userName: '',
        password: '',
        mode: 'login',
      });

      expect(res.lit).toBe(0);
      expect(res.seg1).toBe(1);
      expect(res.seg2).toBe(1);
      expect(res.seg3).toBe(1);
      expect(res.pin1Fill).toBe(ROUTE_COLORS.white);
      expect(res.pin1Stroke).toBe(ROUTE_COLORS.baseRoute);
      expect(res.nextBorder).toBe(ROUTE_COLORS.fieldBorder);
    });

    it('returns partial progress (lit = 2) when only username is filled', () => {
      const res = computeRouteProgress({
        userName: 'john_doe',
        password: '',
        mode: 'login',
      });

      // 1 of 2 fields filled => Math.round((1/2)*3) = 2
      expect(res.lit).toBe(2);
      expect(res.seg1).toBe(0);
      expect(res.seg2).toBe(0);
      expect(res.seg3).toBe(1);
      expect(res.pin1Fill).toBe(ROUTE_COLORS.ink);
      expect(res.pin1Stroke).toBe(ROUTE_COLORS.lime);
      expect(res.pin2Fill).toBe(ROUTE_COLORS.ink);
      expect(res.pin2Stroke).toBe(ROUTE_COLORS.lime);
      expect(res.pin3Fill).toBe(ROUTE_COLORS.white);
      expect(res.pin3Stroke).toBe(ROUTE_COLORS.baseRoute);
      expect(res.nextBorder).toBe(ROUTE_COLORS.lime);
    });

    it('returns full progress (lit = 3) when both username and password are filled', () => {
      const res = computeRouteProgress({
        userName: 'john_doe',
        password: 'securepassword',
        mode: 'login',
      });

      expect(res.lit).toBe(3);
      expect(res.seg1).toBe(0);
      expect(res.seg2).toBe(0);
      expect(res.seg3).toBe(0);
      expect(res.pin1Fill).toBe(ROUTE_COLORS.ink);
      expect(res.pin2Fill).toBe(ROUTE_COLORS.ink);
      expect(res.pin3Fill).toBe(ROUTE_COLORS.ink);
      expect(res.nextBorder).toBe(ROUTE_COLORS.lime);
    });
  });

  describe('Mode "signup"', () => {
    it('returns empty progress when all signup fields are empty', () => {
      const res = computeRouteProgress({
        name: '',
        userName: '',
        password: '',
        mode: 'signup',
      });

      expect(res.lit).toBe(0);
      expect(res.seg1).toBe(1);
      expect(res.seg2).toBe(1);
      expect(res.seg3).toBe(1);
      expect(res.nextBorder).toBe(ROUTE_COLORS.fieldBorder);
    });

    it('returns lit = 1 when 1 field is filled', () => {
      const res = computeRouteProgress({
        name: 'Jane',
        userName: '',
        password: '',
        mode: 'signup',
      });

      expect(res.lit).toBe(1);
      expect(res.seg1).toBe(0);
      expect(res.seg2).toBe(1);
      expect(res.seg3).toBe(1);
      expect(res.pin1Fill).toBe(ROUTE_COLORS.ink);
      expect(res.pin2Fill).toBe(ROUTE_COLORS.white);
      expect(res.nextBorder).toBe(ROUTE_COLORS.lime);
    });

    it('returns lit = 2 when 2 fields are filled', () => {
      const res = computeRouteProgress({
        name: 'Jane Doe',
        userName: 'jane@example.com',
        password: '',
        mode: 'signup',
      });

      expect(res.lit).toBe(2);
      expect(res.seg1).toBe(0);
      expect(res.seg2).toBe(0);
      expect(res.seg3).toBe(1);
    });

    it('returns lit = 3 when all 3 fields are filled', () => {
      const res = computeRouteProgress({
        name: 'Jane Doe',
        userName: 'jane@example.com',
        password: 'password123',
        mode: 'signup',
      });

      expect(res.lit).toBe(3);
      expect(res.seg1).toBe(0);
      expect(res.seg2).toBe(0);
      expect(res.seg3).toBe(0);
      expect(res.pin1Fill).toBe(ROUTE_COLORS.ink);
      expect(res.pin2Fill).toBe(ROUTE_COLORS.ink);
      expect(res.pin3Fill).toBe(ROUTE_COLORS.ink);
    });
  });
});
