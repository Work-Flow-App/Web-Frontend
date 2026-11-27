import { useEffect } from 'react';
import type { RefObject } from 'react';
import { JOBS_DATA, ANIM_TIMING, DESKTOP_PINS, PIN_FILL_ON, PIN_FILL_OFF, PIN_STROKE_ON, PIN_STROKE_OFF } from './constants';

export interface RouteAnimRefs {
  pathRef: RefObject<SVGPathElement | null>;
  seg1GlowRef: RefObject<SVGPathElement | null>;
  seg2GlowRef: RefObject<SVGPathElement | null>;
  seg3GlowRef: RefObject<SVGPathElement | null>;
  seg4GlowRef: RefObject<SVGPathElement | null>;
  seg1CoreRef: RefObject<SVGPathElement | null>;
  seg2CoreRef: RefObject<SVGPathElement | null>;
  seg3CoreRef: RefObject<SVGPathElement | null>;
  seg4CoreRef: RefObject<SVGPathElement | null>;
  pin1Ref: RefObject<SVGCircleElement | null>;
  pin2Ref: RefObject<SVGCircleElement | null>;
  pin3Ref: RefObject<SVGCircleElement | null>;
  pin4Ref: RefObject<SVGCircleElement | null>;
  tick1Ref: RefObject<SVGPathElement | null>;
  tick2Ref: RefObject<SVGPathElement | null>;
  tick3Ref: RefObject<SVGPathElement | null>;
  tick4Ref: RefObject<SVGPathElement | null>;
  ring1Ref: RefObject<SVGGElement | null>;
  ring2Ref: RefObject<SVGGElement | null>;
  ring3Ref: RefObject<SVGGElement | null>;
  ring4Ref: RefObject<SVGGElement | null>;
  vanRef: RefObject<SVGGElement | null>;
  routeGroupRef: RefObject<SVGGElement | null>;
  pin1CircleStrokeRef: RefObject<SVGCircleElement | null>;
  pin2CircleStrokeRef: RefObject<SVGCircleElement | null>;
  pin3CircleStrokeRef: RefObject<SVGCircleElement | null>;
  pin4CircleStrokeRef: RefObject<SVGCircleElement | null>;
  jobCardsRef?: RefObject<(HTMLDivElement | null)[]>;
  jobMarksRef?: RefObject<(HTMLSpanElement | null)[]>;
  jobTimesRef?: RefObject<(HTMLSpanElement | null)[]>;
}

const { DRIVE, STOP, END, FADE } = ANIM_TIMING;
const PINS = DESKTOP_PINS;

export function useRouteAnimation(refs: RouteAnimRefs): void {
  useEffect(() => {
    let reduce = false;
    try {
      reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      // ignore
    }
    if (reduce) return;

    const pathEl = refs.pathRef.current;
    if (!pathEl) return;

    const measure = () => {
      const total = pathEl.getTotalLength();
      const lens: number[] = PINS.map(([x, y], idx) => {
        if (idx === 0) return 0;
        let best = 0;
        let bestD = Infinity;
        for (let l = 0; l <= total; l += total / 600) {
          const pt = pathEl.getPointAtLength(l);
          const d = (pt.x - x) ** 2 + (pt.y - y) ** 2;
          if (d < bestD) {
            bestD = d;
            best = l;
          }
        }
        return best;
      });
      lens[lens.length - 1] = total;
      return { lens, total };
    };

    let measured: { lens: number[]; total: number } | null = null;
    const t0 = performance.now();
    let rafId = 0;

    const setSegs = (V: number, target: number, frac: number) => {
      const glowRefs = [
        refs.seg1GlowRef,
        refs.seg2GlowRef,
        refs.seg3GlowRef,
        refs.seg4GlowRef,
      ];
      const coreRefs = [
        refs.seg1CoreRef,
        refs.seg2CoreRef,
        refs.seg3CoreRef,
        refs.seg4CoreRef,
      ];
      for (let i = 0; i < 4; i++) {
        const idx = i + 1;
        let val: number;
        if (V >= idx) {
          val = 0;
        } else if (target === idx) {
          val = +(1 - frac).toFixed(3);
        } else {
          val = 1;
        }
        glowRefs[i].current?.setAttribute('stroke-dashoffset', String(val));
        coreRefs[i].current?.setAttribute('stroke-dashoffset', String(val));
      }
    };

    const setPins = (V: number, popping: boolean, visited: number) => {
      const pinRefs = [refs.pin1Ref, refs.pin2Ref, refs.pin3Ref, refs.pin4Ref];
      const circRefs = [
        refs.pin1CircleStrokeRef,
        refs.pin2CircleStrokeRef,
        refs.pin3CircleStrokeRef,
        refs.pin4CircleStrokeRef,
      ];
      for (let i = 0; i < 4; i++) {
        const idx = i + 1;
        const on = V >= idx;
        const scale = popping && visited === idx ? 1.35 : 1;
        const p = pinRefs[i].current;
        const c = circRefs[i].current;
        if (p) {
          p.setAttribute('fill', on ? PIN_FILL_ON : PIN_FILL_OFF);
          p.setAttribute('stroke', on ? PIN_STROKE_ON : PIN_STROKE_OFF);
          p.style.transform = `scale(${scale})`;
        }
        if (c) {
          c.setAttribute('stroke', on ? PIN_STROKE_ON : PIN_STROKE_OFF);
        }
      }
    };

    const setTicks = (V: number, popping: boolean, visited: number) => {
      const tickRefs = [refs.tick1Ref, refs.tick2Ref, refs.tick3Ref, refs.tick4Ref];
      for (let i = 0; i < 4; i++) {
        const idx = i + 1;
        const on = V >= idx;
        const scale = on && popping && visited === idx ? 1.35 : on ? 1 : 0.2;
        const t = tickRefs[i].current;
        if (t) {
          t.setAttribute('opacity', on ? '1' : '0');
          t.style.transform = `scale(${scale})`;
        }
      }
    };

    const setRings = (target: number, V: number, fading: boolean) => {
      const ringRefs = [refs.ring1Ref, refs.ring2Ref, refs.ring3Ref, refs.ring4Ref];
      for (let i = 0; i < 4; i++) {
        const idx = i + 1;
        const show = target === idx && V < idx && !fading;
        ringRefs[i].current?.setAttribute('opacity', show ? '1' : '0');
      }
    };

    const setJobs = (
      V: number,
      target: number,
      fading: boolean,
      popping: boolean,
      visited: number
    ) => {
      const cards = refs.jobCardsRef?.current;
      const marks = refs.jobMarksRef?.current;
      const times = refs.jobTimesRef?.current;
      if (!cards) return;

      for (let i = 0; i < 4; i++) {
        const cardEl = cards[i];
        const markEl = marks?.[i];
        const timeEl = times?.[i];
        if (!cardEl) continue;

        const on = V >= i + 1;
        const next = !on && target === i + 1 && !fading;
        const justHit = popping && visited === i + 1;

        cardEl.style.background = on || next ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)';
        cardEl.style.borderColor = on ? '#A3F000' : next ? '#2F6B00' : '#D5DBCC';
        cardEl.style.transform = next || justHit ? 'translateX(0.5rem)' : 'none';

        if (markEl) {
          markEl.textContent = on ? '✓' : String(i + 1);
          markEl.style.background = on ? '#A3F000' : next ? '#0B0E0B' : '#E9EDE2';
          markEl.style.color = next ? '#FFFFFF' : '#0B0E0B';
          markEl.style.transform = justHit ? 'scale(1.35)' : 'none';
        }

        if (timeEl) {
          const baseTime = JOBS_DATA[i]?.time ?? '';
          timeEl.textContent = baseTime + (on ? ' · Done' : next ? ' · On the way' : '');
        }
      }
    };

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);
      if (!measured) {
        measured = measure();
      }

      const { lens, total } = measured;
      const n = PINS.length - 1; // 4
      const leg = DRIVE + STOP;
      const cycle = n * leg + END + FADE;
      const t = (now - t0) % cycle;

      let visited: number;
      let target: number;
      let frac: number;
      let popping = false;
      let fading = false;
      let len: number;

      if (t < n * leg) {
        const k = Math.floor(t / leg);
        const r = t - k * leg;
        if (r < DRIVE) {
          const u = r / DRIVE;
          frac = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
          visited = k;
          target = k + 1;
          len = lens[k] + (lens[k + 1] - lens[k]) * frac;
        } else {
          frac = 1;
          visited = k + 1;
          target = k + 2 > n ? 0 : k + 2;
          popping = r - DRIVE < 380;
          if (target) frac = 0;
          len = lens[k + 1];
        }
      } else {
        visited = n;
        target = 0;
        frac = 0;
        len = lens[n];
        fading = t >= n * leg + END;
      }

      const V = fading ? 0 : Math.max(0, visited);

      // Update van position
      const van = refs.vanRef.current;
      if (van) {
        const pt = pathEl.getPointAtLength(len);
        const ahead = pathEl.getPointAtLength(Math.min(len + 2, total));
        const behind = pathEl.getPointAtLength(Math.max(len - 2, 0));
        const va =
          Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * (180 / Math.PI);
        van.setAttribute(
          'transform',
          `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)}) rotate(${va.toFixed(1)})`
        );
        van.setAttribute('opacity', fading ? '0' : '1');
        van.style.transition = 'opacity 0.4s ease';
      }

      // Update route group opacity
      const rg = refs.routeGroupRef.current;
      if (rg) {
        rg.setAttribute('opacity', fading && V < 4 ? '0' : '1');
      }

      setSegs(V, target, frac);
      setPins(V, popping, visited);
      setTicks(V, popping, visited);
      setRings(target, V, fading);
      setJobs(V, target, fading, popping, visited);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // refs are stable
}
