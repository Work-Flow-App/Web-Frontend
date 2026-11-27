import { useMemo } from 'react';
import { ROUTE_COLORS } from './constants';

interface UseFormRouteProgressArgs {
  name?: string;
  userName: string;
  password: string;
  mode: 'login' | 'signup';
  phase?: 'form' | 'success';
}

interface RouteProgressResult {
  lit: number;
  seg1: number;
  seg2: number;
  seg3: number;
  pin1Fill: string;
  pin1Stroke: string;
  pin2Fill: string;
  pin2Stroke: string;
  pin3Fill: string;
  pin3Stroke: string;
  nextBorder: string;
}

export function computeRouteProgress({
  name = '',
  userName,
  password,
  mode,
  phase,
}: UseFormRouteProgressArgs): RouteProgressResult {
  // After successful login/signup, all 3 segments are lit
  if (phase === 'success') {
    return {
      lit: 3,
      seg1: 0,
      seg2: 0,
      seg3: 0,
      pin1Fill: ROUTE_COLORS.ink,
      pin1Stroke: ROUTE_COLORS.lime,
      pin2Fill: ROUTE_COLORS.ink,
      pin2Stroke: ROUTE_COLORS.lime,
      pin3Fill: ROUTE_COLORS.ink,
      pin3Stroke: ROUTE_COLORS.lime,
      nextBorder: ROUTE_COLORS.lime,
    };
  }

  let lit = 0;
  if (mode === 'signup') {
    const filled =
      (name.trim().length > 0 ? 1 : 0) +
      (userName.trim().length > 0 ? 1 : 0) +
      (password.length > 0 ? 1 : 0);
    lit = Math.round((filled / 3) * 3);
  } else {
    const filled =
      (userName.trim().length > 0 ? 1 : 0) + (password.length > 0 ? 1 : 0);
    lit = Math.round((filled / 2) * 3);
  }

  const segOffset = (i: number) => (lit >= i ? 0 : 1);
  const pinFill = (i: number) => (lit >= i ? ROUTE_COLORS.ink : ROUTE_COLORS.white);
  const pinStroke = (i: number) =>
    lit >= i ? ROUTE_COLORS.lime : ROUTE_COLORS.baseRoute;

  return {
    lit,
    seg1: segOffset(1),
    seg2: segOffset(2),
    seg3: segOffset(3),
    pin1Fill: pinFill(1),
    pin1Stroke: pinStroke(1),
    pin2Fill: pinFill(2),
    pin2Stroke: pinStroke(2),
    pin3Fill: pinFill(3),
    pin3Stroke: pinStroke(3),
    nextBorder: lit >= 1 ? ROUTE_COLORS.lime : ROUTE_COLORS.fieldBorder,
  };
}

export function useFormRouteProgress(args: UseFormRouteProgressArgs): RouteProgressResult {
  return useMemo(
    () => computeRouteProgress(args),
    [args.name, args.userName, args.password, args.mode, args.phase]
  );
}
