import { keyframes, GlobalStyles } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material';
import React from 'react';
import { ROUTE_COLORS, FORM_CARD_MAX_WIDTH } from './constants';

// ─── Keyframes (defined via @mui/material) ─────────────────────────────────────

const rlFloat = keyframes`
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-0.375rem); }
`;

const rlIn = keyframes`
  from { opacity: 0; transform: translateY(0.75rem); }
  to   { opacity: 1; transform: none; }
`;

const rlBob = keyframes`
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-0.1875rem); }
`;

const rlAnts = keyframes`
  to { stroke-dashoffset: -0.875rem; }
`;

const rlRing = keyframes`
  0%   { transform: scale(0.7); opacity: 0.9; }
  100% { transform: scale(2.6); opacity: 0; }
`;

const rlSlide = keyframes`
  from { opacity: 0; transform: translateX(-1.125rem); }
  to   { opacity: 1; transform: none; }
`;

const rlFade = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const rlShimmer = keyframes`
  from { stroke-dashoffset: 1; }
  to   { stroke-dashoffset: 0; }
`;

const rlBlink = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.35; }
`;

const rpIn = keyframes`
  from { opacity: 0; transform: translateY(0.625rem); }
  to   { opacity: 1; transform: none; }
`;

// ─── Animation strings ────────────────────────────────────────────────────────

export const rlBobAnim = `${rlBob} 1.6s ease-in-out infinite`;
export const rlInAnim = `${rlIn} 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both`;
export const rlFloatAnim = `${rlFloat} 3s ease-in-out infinite`;
export const rlAntsAnim = `${rlAnts} 1.1s linear infinite`;
export const rlRingAnim = `${rlRing} 2.6s ease-out infinite`;
export const rlSlideAnim = `${rlSlide} 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both`;
export const rlFadeAnim = `${rlFade} 1s ease both`;
export const rlShimmerAnim = `${rlShimmer} 3.2s linear infinite`;
export const rlBlinkAnim = `${rlBlink} 1.6s ease-in-out infinite`;
export const rpInAnim = `${rpIn} 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both`;

// ─── Global Styles for SVG transitions, Keyframes & Scrollbar elimination ─────

export const RouteLineGlobalStyles = React.createElement(GlobalStyles, {
  styles: {
    'html, body, #root': {
      height: '100%',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
      WebkitFontSmoothing: 'antialiased',
      background: ROUTE_COLORS.pageBg,
    },
    '*': {
      boxSizing: 'border-box',
    },
    'button:focus-visible, a:focus-visible': {
      outline: `0.1875rem solid ${ROUTE_COLORS.ink}`,
      outlineOffset: '0.1875rem',
    },
    '.rl-route': {
      transition: 'stroke-dashoffset 0.25s linear',
    },
    '.rl-pin': {
      transition:
        'fill 0.35s ease, stroke 0.35s ease, transform 0.5s cubic-bezier(0.3, 1.7, 0.5, 1)',
      transformBox: 'fill-box' as const,
      transformOrigin: 'center',
    },
    '.rl-tick': {
      transition:
        'opacity 0.25s ease, transform 0.5s cubic-bezier(0.3, 1.8, 0.5, 1)',
      transformBox: 'fill-box' as const,
      transformOrigin: 'center',
    },
    '.rl-burst': {
      transition: 'opacity 0.2s ease',
    },
    '.rl-ring': {
      transformBox: 'fill-box' as const,
      transformOrigin: 'center',
      animation: rlRingAnim,
    },
    '.rl-ring2': { animationDelay: '0.65s' },
    '.rl-ring3': { animationDelay: '1.3s' },
    '.rl-ring4': { animationDelay: '1.95s' },
    '.rl-jobcard': {
      transition:
        'background 0.35s ease, border-color 0.35s ease, transform 0.35s cubic-bezier(0.3, 1.6, 0.5, 1)',
    },
    '.rl-mark': {
      transition:
        'background 0.3s ease, transform 0.45s cubic-bezier(0.3, 1.8, 0.5, 1)',
    },
    '.rl-job': {
      animation: rlSlideAnim,
    },
    '.rl-job:nth-of-type(1)': { animationDelay: '0.12s' },
    '.rl-job:nth-of-type(2)': { animationDelay: '0.24s' },
    '.rl-job:nth-of-type(3)': { animationDelay: '0.36s' },
    '.rl-job:nth-of-type(4)': { animationDelay: '0.48s' },
    '.rl-in': {
      animation: rlInAnim,
    },
    '.rl-van': {
      animation: rlBobAnim,
    },
    '.rl-ants': {
      animation: rlAntsAnim,
    },
    '.rl-badge-dot': {
      animation: rlBlinkAnim,
    },
    '.rl-float': {
      animation: rlFloatAnim,
    },
    '.rp-route': {
      transition: 'stroke-dashoffset 0.9s cubic-bezier(0.2, 0.8, 0.2, 1)',
    },
    '.rp-pin': {
      transition: 'fill 0.4s ease, stroke 0.4s ease',
    },
    '.rp-in': {
      animation: rpInAnim,
    },
    '@media (prefers-reduced-motion: reduce)': {
      '.rl-route, .rl-pin, .rp-route, .rp-pin, .rl-btn, .rp-btn, .rl-jobcard, .rl-mark': {
        transition: 'none !important',
      },
      '.rl-in, .rl-van, .rl-ants, .rl-ring, .rl-job, .rl-block, .rl-shimmer, .rl-badge-dot, .rl-float, .rp-in': {
        animation: 'none !important',
      },
      '.rl-vehicle, .rl-ring, .rl-shimmer': {
        display: 'none !important',
      },
    },
  },
});

// ─── Styled Primitives ─────────────────────────────────────────────────────────

export const RLInput = styled('input')({
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
  fontWeight: 500,
  fontSize: 'clamp(0.9375rem, 1.8dvh, 1.0625rem)',
  color: ROUTE_COLORS.ink,
  backgroundColor: ROUTE_COLORS.white,
  border: `0.125rem solid ${ROUTE_COLORS.fieldBorder}`,
  borderRadius: '0.875rem',
  height: 'clamp(2.75rem, 6dvh, 3.5rem)',
  padding: '0 1rem',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  '&:focus': {
    borderColor: ROUTE_COLORS.ink,
    boxShadow: '0 0 0 0.25rem rgba(163, 240, 0, 0.55)',
  },
  '&::placeholder': {
    color: ROUTE_COLORS.placeholder,
  },
  '&[type="password"]': {
    paddingRight: '5.25rem',
  },
  '@media (max-height: 40rem)': {
    height: '2.75rem',
    fontSize: '0.875rem',
  },
});

export const RLForm = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: 'clamp(0.5rem, 1.4dvh, 0.875rem)',
  width: '100%',
  margin: 0,
  padding: 0,
  '@media (max-height: 40rem)': {
    gap: '0.25rem',
  },
});

// ─── Brand Logo Lockup Styles ─────────────────────────────────────────────────

export const brandLogoImgDesktop: SxProps<Theme> = {
  height: '1.625rem',
  width: 'auto',
  display: 'block',
  flexShrink: 0,
};

export const brandLogoImgPhone: SxProps<Theme> = {
  height: '1.25rem',
  width: 'auto',
  display: 'block',
  flexShrink: 0,
};

export const brandLogoDesktop: SxProps<Theme> = {
  display: 'inline-flex',
  alignItems: 'center',
  fontWeight: 800,
  fontSize: '1.625rem',
  letterSpacing: '-0.02em',
  lineHeight: 1,
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
  userSelect: 'none',
};

export const brandLogoPhone: SxProps<Theme> = {
  display: 'inline-flex',
  alignItems: 'center',
  fontWeight: 800,
  fontSize: '1.25rem',
  letterSpacing: '-0.02em',
  lineHeight: 1,
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
  userSelect: 'none',
};

export const brandLogoGreen: SxProps<Theme> = {
  color: ROUTE_COLORS.darkGreen,
};

export const brandLogoInk: SxProps<Theme> = {
  color: ROUTE_COLORS.ink,
};

export const brandLogoSvgDesktop: SxProps<Theme> = {
  width: '2.375rem',
  height: '1.25rem',
  margin: '0 0.0625rem',
  display: 'inline-block',
  verticalAlign: 'middle',
};

export const brandLogoSvgPhone: SxProps<Theme> = {
  width: '1.827rem',
  height: '0.962rem',
  margin: '0 0.0625rem',
  display: 'inline-block',
  verticalAlign: 'middle',
};

// ─── Desktop Page Layout (AuthShell) ──────────────────────────────────────────

export const pageRoot: SxProps<Theme> = {
  height: '100dvh',
  width: '100vw',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'row',
  bgcolor: ROUTE_COLORS.pageBg,
  color: ROUTE_COLORS.ink,
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
  '@media (max-width: 20rem), (max-height: 28rem)': {
    overflowY: 'auto',
  },
};

export const mapSection: SxProps<Theme> = {
  flex: '1 1 35rem',
  minWidth: 0,
  minHeight: '22.5rem',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
  bgcolor: ROUTE_COLORS.phoneBg,
  display: { xs: 'none', md: 'block' },
};

export const mapBox: SxProps<Theme> = {
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  bgcolor: ROUTE_COLORS.phoneBg,
};

export const mapSvg: SxProps<Theme> = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  display: 'block',
};

export const mapLogoWrap: SxProps<Theme> = {
  position: 'absolute',
  top: '1.75rem',
  left: '2rem',
  right: '2rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.75rem',
  flexWrap: 'wrap',
  zIndex: 2,
};

export const mapBadge: SxProps<Theme> = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.375rem 0.75rem',
  borderRadius: '62.4375rem',
  bgcolor: ROUTE_COLORS.white,
  border: `0.0625rem solid ${ROUTE_COLORS.fieldBorder}`,
  boxShadow: '0 0.125rem 0.5rem rgba(11, 14, 11, 0.08)',
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: ROUTE_COLORS.mutedText,
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
};

export const mapBadgeDot: SxProps<Theme> = {
  width: '0.5rem',
  height: '0.5rem',
  borderRadius: '50%',
  bgcolor: ROUTE_COLORS.darkGreen,
};

// ─── Desktop Job Cards (Item 4) ───────────────────────────────────────────────

export const jobListContainer: SxProps<Theme> = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
  position: 'absolute',
  left: '2rem',
  bottom: '2rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.625rem',
  maxWidth: '20rem',
  width: '20rem',
  zIndex: 2,
};

export const jobItem: SxProps<Theme> = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
};

export const jobCardBase: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.75rem 0.875rem',
  borderRadius: '0.875rem',
  bgcolor: 'rgba(255, 255, 255, 0.7)',
  border: `0.125rem solid ${ROUTE_COLORS.fieldBorder}`,
  boxShadow: '0 0.375rem 1.25rem rgba(11, 14, 11, 0.06)',
  transition:
    'background 0.35s ease, border-color 0.35s ease, transform 0.35s cubic-bezier(0.3, 1.6, 0.5, 1)',
  width: '100%',
  boxSizing: 'border-box',
};

export const jobMarkBase: SxProps<Theme> = {
  width: '1.75rem',
  height: '1.75rem',
  flex: 'none',
  borderRadius: '50%',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.8125rem',
  fontWeight: 700,
  bgcolor: ROUTE_COLORS.toggleBg,
  color: ROUTE_COLORS.ink,
  transition: 'background 0.3s ease, transform 0.45s cubic-bezier(0.3, 1.8, 0.5, 1)',
};

export const jobTextStack: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.125rem',
  minWidth: 0,
};

export const jobTitle: SxProps<Theme> = {
  fontSize: '0.9375rem',
  fontWeight: 700,
  color: ROUTE_COLORS.ink,
  lineHeight: 1.2,
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
};

export const jobTime: SxProps<Theme> = {
  fontSize: '0.8125rem',
  fontWeight: 500,
  color: ROUTE_COLORS.mutedText,
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
};

// ─── Desktop Form Section ─────────────────────────────────────────────────────

export const formSection: SxProps<Theme> = {
  flex: '1 1 auto',
  height: '100%',
  maxHeight: '100dvh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 'clamp(1rem, 3dvh, 2.5rem) clamp(1.25rem, 3vw, 3rem)',
  overflow: 'hidden',
  boxSizing: 'border-box',
  gap: 'clamp(0.5rem, 1.5dvh, 1rem)',
  '@media (max-height: 40rem)': {
    padding: '0.5rem 1rem',
    gap: '0.25rem',
  },
  '@media (max-width: 20rem), (max-height: 28rem)': {
    overflowY: 'auto',
  },
};

export const formCard: SxProps<Theme> = {
  width: '100%',
  maxWidth: FORM_CARD_MAX_WIDTH,
  display: 'flex',
  flexDirection: 'column',
  gap: 'clamp(0.625rem, 1.8dvh, 1.125rem)',
  '@media (max-height: 40rem)': {
    gap: '0.375rem',
  },
};

export const headingBox: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'clamp(0.125rem, 0.5dvh, 0.375rem)',
};

export const h1Style: SxProps<Theme> = {
  fontWeight: 800,
  fontSize: 'clamp(1.625rem, 4.2dvh, 2.5rem)',
  lineHeight: 1.1,
  letterSpacing: '-0.02em',
  margin: 0,
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
  color: ROUTE_COLORS.ink,
};

export const subStyle: SxProps<Theme> = {
  fontSize: 'clamp(0.875rem, 2dvh, 1.125rem)',
  lineHeight: 1.5,
  color: ROUTE_COLORS.mutedText,
  margin: 0,
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
};

// ─── Mode Switcher (Tabs) ─────────────────────────────────────────────────────

export const tabGroup: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '0.25rem',
  padding: '0.25rem',
  borderRadius: '0.875rem',
  background: ROUTE_COLORS.toggleBg,
};

export const tabBtnActive: SxProps<Theme> = {
  height: 'clamp(2.5rem, 5.2dvh, 2.875rem)',
  border: 0,
  borderRadius: '0.6875rem',
  cursor: 'pointer',
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
  fontWeight: 700,
  fontSize: 'clamp(0.8125rem, 1.4dvh, 0.9375rem)',
  color: ROUTE_COLORS.ink,
  bgcolor: ROUTE_COLORS.white,
  boxShadow: '0 0.0625rem 0.25rem rgba(11, 14, 11, 0.1)',
  transition: 'background 0.2s ease, color 0.2s ease',
};

export const tabBtnInactive: SxProps<Theme> = {
  height: 'clamp(2.5rem, 5.2dvh, 2.875rem)',
  border: 0,
  borderRadius: '0.6875rem',
  cursor: 'pointer',
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
  fontWeight: 700,
  fontSize: 'clamp(0.8125rem, 1.4dvh, 0.9375rem)',
  color: ROUTE_COLORS.ink,
  bgcolor: 'transparent',
  transition: 'background 0.2s ease, color 0.2s ease',
};

// ─── Google Button ────────────────────────────────────────────────────────────

export const googleBtn: SxProps<Theme> = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.625rem',
  width: '100%',
  boxSizing: 'border-box',
  height: 'clamp(2.75rem, 6dvh, 3.375rem)',
  borderRadius: '0.875rem',
  border: `0.125rem solid ${ROUTE_COLORS.fieldBorder}`,
  bgcolor: ROUTE_COLORS.white,
  cursor: 'pointer',
  color: ROUTE_COLORS.ink,
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
  fontWeight: 600,
  fontSize: 'clamp(0.875rem, 1.6dvh, 1rem)',
  transition: 'transform 0.15s ease, box-shadow 0.2s ease',
  userSelect: 'none',
  overflow: 'hidden',
  '&:hover': { transform: 'translateY(-0.0625rem)' },
  '&:active': { transform: 'scale(0.99)' },
  '@media (max-height: 40rem)': {
    height: '2.75rem',
    fontSize: '0.875rem',
  },
};

export const googleIframeOverlay: SxProps<Theme> = {
  position: 'absolute',
  inset: 0,
  opacity: 0.001,
  cursor: 'pointer',
  zIndex: 2,
  '& iframe': {
    width: '100% !important',
    height: '100% !important',
    cursor: 'pointer !important',
  },
};

// ─── Divider ──────────────────────────────────────────────────────────────────

export const dividerRow: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  color: '#5F6B5D',
  fontSize: '0.875rem',
  fontWeight: 500,
  lineHeight: 1,
};

export const dividerLine: SxProps<Theme> = {
  flex: 1,
  height: '0.0625rem',
  bgcolor: ROUTE_COLORS.fieldBorder,
};

// ─── Form Stack & Field Containers ────────────────────────────────────────────

export const formStack: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'clamp(0.5rem, 1.4dvh, 0.875rem)',
  '@media (max-height: 40rem)': {
    gap: '0.25rem',
  },
};

export const fieldWrapper: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  '@media (max-height: 40rem)': {
    gap: '0.125rem',
  },
};

export const fieldLabel: SxProps<Theme> = {
  fontSize: 'clamp(0.8125rem, 1.4dvh, 0.9375rem)',
  fontWeight: 700,
  color: ROUTE_COLORS.ink,
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
};

export const passWrapper: SxProps<Theme> = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  '& input': {
    paddingRight: '5.25rem',
  },
};

export const eyeBtn: SxProps<Theme> = {
  position: 'absolute',
  top: '0.3125rem',
  bottom: '0.3125rem',
  right: '0.3125rem',
  minWidth: '4.25rem',
  padding: '0 0.75rem',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '0.625rem',
  border: 0,
  bgcolor: ROUTE_COLORS.toggleBg,
  cursor: 'pointer',
  color: ROUTE_COLORS.ink,
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
  fontWeight: 700,
  fontSize: '0.875rem',
  lineHeight: 1,
  boxSizing: 'border-box',
  '&:hover': { bgcolor: '#DEE3D7' },
  '&:focus-visible': {
    outline: `0.1875rem solid ${ROUTE_COLORS.ink}`,
    outlineOffset: '0.1875rem',
  },
};

export const passToggle: SxProps<Theme> = eyeBtn;

// ─── Error Alert & Submit ─────────────────────────────────────────────────────

export const errorAlert: SxProps<Theme> = {
  margin: 0,
  padding: '0.5rem 0.75rem',
  borderRadius: '0.75rem',
  bgcolor: ROUTE_COLORS.errorBg,
  color: ROUTE_COLORS.errorText,
  fontSize: 'clamp(0.75rem, 1.3dvh, 0.875rem)',
  fontWeight: 600,
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

export const errorAlertIcon: SxProps<Theme> = {
  flex: 'none',
  width: '1.125rem',
  height: '1.125rem',
};

export const errorAlertText: SxProps<Theme> = {
  flex: '1 1 auto',
  lineHeight: 1.35,
};

export const submitBtn: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  height: 'clamp(2.75rem, 6.5dvh, 3.625rem)',
  borderRadius: '1rem',
  border: 0,
  cursor: 'pointer',
  bgcolor: ROUTE_COLORS.lime,
  color: ROUTE_COLORS.ink,
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
  fontWeight: 800,
  fontSize: 'clamp(0.875rem, 1.7dvh, 1.0625rem)',
  boxShadow: '0 0.5rem 1.5rem rgba(120, 180, 0, 0.35)',
  transition: 'transform 0.15s ease, box-shadow 0.2s ease',
  width: '100%',
  '&:hover': { transform: 'translateY(-0.0625rem)' },
  '&:active': { transform: 'scale(0.99)' },
  '&:disabled': { opacity: 0.6, cursor: 'not-allowed', transform: 'none' },
  '@media (max-height: 40rem)': {
    height: '2.75rem',
    fontSize: '0.875rem',
  },
};

export const resetLink: SxProps<Theme> = {
  alignSelf: 'center',
  fontSize: 'clamp(0.875rem, 1.5dvh, 1rem)',
  fontWeight: 700,
  padding: '0.375rem',
  color: ROUTE_COLORS.darkGreen,
  textDecoration: 'underline',
  cursor: 'pointer',
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
  background: 'none',
  border: 0,
  '&:hover': { color: '#1F4A00' },
  '&:focus-visible': { outline: `0.1875rem solid ${ROUTE_COLORS.ink}`, borderRadius: '0.25rem' },
};

export const backToLoginLink: SxProps<Theme> = {
  alignSelf: 'center',
  fontSize: 'clamp(0.875rem, 1.5dvh, 1rem)',
  fontWeight: 700,
  padding: '0.375rem',
  color: ROUTE_COLORS.darkGreen,
  textDecoration: 'underline',
  cursor: 'pointer',
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
  background: 'none',
  border: 0,
  '&:hover': { color: '#1F4A00' },
  '&:focus-visible': { outline: `0.1875rem solid ${ROUTE_COLORS.ink}`, borderRadius: '0.25rem' },
};

export const resendCodeBtn: SxProps<Theme> = {
  alignSelf: 'center',
  fontSize: 'clamp(0.8125rem, 1.4dvh, 0.875rem)',
  fontWeight: 600,
  padding: '0.25rem',
  color: ROUTE_COLORS.mutedText,
  background: 'none',
  border: 0,
  cursor: 'pointer',
  textDecoration: 'underline',
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
  '&:hover': { color: ROUTE_COLORS.ink },
};

// ─── Try a Demo Button (Item 8 in Spec, Image 3 in Visual Reference) ──────────

export const demoCard: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.625rem',
  minHeight: 'clamp(2.75rem, 6dvh, 3.5rem)',
  padding: '0.75rem 1rem',
  borderRadius: '1rem',
  border: '0.125rem dashed #9DB27F',
  bgcolor: '#F1F7E3',
  textDecoration: 'none',
  color: '#1F4A00',
  fontSize: 'clamp(0.875rem, 1.6dvh, 1rem)',
  fontWeight: 700,
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
  textAlign: 'center',
  transition: 'transform 0.15s ease',
  width: '100%',
  boxSizing: 'border-box',
  cursor: 'pointer',
  background: '#F1F7E3',
  '&:hover': { transform: 'translateY(-0.0625rem)' },
  '&:active': { transform: 'scale(0.99)' },
  '&:disabled': { opacity: 0.6, cursor: 'not-allowed', transform: 'none' },
  '@media (max-height: 40rem)': {
    display: 'none',
  },
};

export const demoIcon: SxProps<Theme> = {
  width: '1.375rem',
  height: '1.375rem',
  flex: 'none',
  display: 'inline-block',
};

// ─── Support Card: Call or Email (Image 1 in Visual Reference) ─────────────────

export const supportCard: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: 'clamp(0.625rem, 1.4dvh, 1rem)',
  borderRadius: '1rem',
  bgcolor: ROUTE_COLORS.white,
  border: `0.0625rem solid ${ROUTE_COLORS.fieldBorder}`,
  width: '100%',
  maxWidth: FORM_CARD_MAX_WIDTH,
  boxSizing: 'border-box',
  textDecoration: 'none',
  color: 'inherit',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    borderColor: ROUTE_COLORS.lime,
    boxShadow: '0 0.125rem 0.5rem rgba(11, 14, 11, 0.08)',
  },
  '@media (max-height: 34rem)': {
    display: 'none',
  },
};

export const supportIconBox: SxProps<Theme> = {
  width: '2.75rem',
  height: '2.75rem',
  flex: 'none',
  borderRadius: '0.75rem',
  bgcolor: ROUTE_COLORS.toggleBg,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const supportSvg: SxProps<Theme> = {
  width: '1.375rem',
  height: '1.375rem',
  flex: 'none',
  display: 'inline-block',
};

export const supportTextStack: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.125rem',
  minWidth: 0,
};

export const supportTitle: SxProps<Theme> = {
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
  fontWeight: 700,
  fontSize: 'clamp(0.875rem, 1.5dvh, 0.9375rem)',
  color: ROUTE_COLORS.ink,
};

export const supportPhoneText: SxProps<Theme> = {
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
  fontWeight: 600,
  fontSize: 'clamp(0.8125rem, 1.4dvh, 0.9375rem)',
  color: ROUTE_COLORS.darkGreen,
  textDecoration: 'underline',
  cursor: 'pointer',
  '&:hover': {
    color: '#1F4A00',
  },
};

export const supportEmailText: SxProps<Theme> = {
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
  fontWeight: 600,
  fontSize: '0.8125rem',
  color: ROUTE_COLORS.darkGreen,
  textDecoration: 'underline',
  cursor: 'pointer',
  '&:hover': {
    color: '#1F4A00',
  },
  '@media (max-height: 40rem)': {
    fontSize: '0.75rem',
  },
};

export const privacyRow: SxProps<Theme> = {
  margin: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  fontSize: '0.8125rem',
  fontWeight: 500,
  color: ROUTE_COLORS.mutedText,
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
  '@media (max-height: 34rem)': {
    display: 'none',
  },
};

// ─── Success Screen ───────────────────────────────────────────────────────────

export const successBox: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'clamp(0.625rem, 1.8dvh, 1.125rem)',
};

export const vanBadge: SxProps<Theme> = {
  width: 'clamp(3rem, 7dvh, 4rem)',
  height: 'clamp(3rem, 7dvh, 4rem)',
  borderRadius: '1.125rem',
  bgcolor: ROUTE_COLORS.lime,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  animation: rlBobAnim,
};

export const successH1: SxProps<Theme> = {
  fontWeight: 800,
  fontSize: 'clamp(1.5rem, 3.5dvh, 2.375rem)',
  lineHeight: 1.12,
  letterSpacing: '-0.02em',
  margin: 0,
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
  color: ROUTE_COLORS.ink,
};

export const successBody: SxProps<Theme> = {
  fontSize: 'clamp(0.875rem, 1.6dvh, 1.0625rem)',
  lineHeight: 1.5,
  color: ROUTE_COLORS.mutedText,
  margin: 0,
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
};

export const seeDayBtn: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 'clamp(2.75rem, 6.5dvh, 3.625rem)',
  borderRadius: '1rem',
  bgcolor: ROUTE_COLORS.ink,
  color: ROUTE_COLORS.white,
  textDecoration: 'none',
  fontSize: 'clamp(0.875rem, 1.6dvh, 1rem)',
  fontWeight: 700,
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
  cursor: 'pointer',
  border: 0,
  width: '100%',
  '&:hover': { transform: 'translateY(-0.0625rem)' },
  '&:active': { transform: 'scale(0.99)' },
};

export const notYouBtn: SxProps<Theme> = {
  alignSelf: 'center',
  border: 0,
  bgcolor: 'transparent',
  cursor: 'pointer',
  padding: '0.5rem',
  color: ROUTE_COLORS.darkGreen,
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
  fontWeight: 700,
  fontSize: 'clamp(0.8125rem, 1.4dvh, 0.9375rem)',
  '&:focus-visible': { outline: `0.1875rem solid ${ROUTE_COLORS.ink}`, borderRadius: '0.25rem' },
};

export const resendBox: SxProps<Theme> = {
  padding: '0.375rem 0.75rem',
  borderRadius: '0.75rem',
  bgcolor: '#FFF9E6',
  color: '#7A5A00',
  fontSize: '0.8125rem',
  fontWeight: 600,
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
};

export const resendLink: SxProps<Theme> = {
  color: '#7A5A00',
  fontWeight: 700,
  textDecoration: 'underline',
};

// ─── Phone Layout Styles ──────────────────────────────────────────────────────

export const phoneRoot: SxProps<Theme> = {
  height: '100dvh',
  width: '100vw',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  bgcolor: ROUTE_COLORS.phoneBg,
  color: ROUTE_COLORS.ink,
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
  '@media (max-width: 20rem), (max-height: 28rem)': {
    overflowY: 'auto',
  },
};

export const phoneMapHeader: SxProps<Theme> = {
  position: 'relative',
  height: '14.375rem',
  flex: 'none',
  overflow: 'hidden',
  bgcolor: ROUTE_COLORS.phoneBg,
  '@media (max-height: 47.5rem)': { height: '9rem' },
  '@media (max-height: 40rem)': { height: '6rem' },
};

export const phoneMapBox: SxProps<Theme> = {
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
};

export const phoneMapSvg: SxProps<Theme> = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
};

export const phoneHeader: SxProps<Theme> = {
  position: 'absolute',
  top: 'clamp(0.5rem, 1.8dvh, 1.125rem)',
  left: '1.25rem',
  right: '1.25rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  zIndex: 2,
};

export const phoneBadge: SxProps<Theme> = {
  padding: '0.25rem 0.625rem',
  borderRadius: '62.4375rem',
  bgcolor: ROUTE_COLORS.white,
  border: `0.0625rem solid ${ROUTE_COLORS.fieldBorder}`,
  fontSize: '0.75rem',
  fontWeight: 600,
  color: ROUTE_COLORS.mutedText,
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
  '@media (max-height: 40rem)': {
    display: 'none',
  },
};

export const phoneRewireBadgeUnlit: SxProps<Theme> = {
  position: 'absolute',
  left: '8.625rem',
  top: '9.25rem',
  padding: '0.25rem 0.5625rem',
  borderRadius: '0.5rem',
  bgcolor: ROUTE_COLORS.white,
  border: `0.0625rem solid ${ROUTE_COLORS.fieldBorder}`,
  fontSize: '0.75rem',
  fontWeight: 700,
  color: ROUTE_COLORS.ink,
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
  zIndex: 2,
  transition: 'border-color 0.4s ease',
  '@media (max-height: 47.5rem)': {
    top: '5.5rem',
  },
  '@media (max-height: 40rem)': {
    display: 'none',
  },
};

export const phoneRewireBadgeLit: SxProps<Theme> = {
  ...phoneRewireBadgeUnlit,
  border: `0.0625rem solid ${ROUTE_COLORS.lime}`,
};

export const phoneCard: SxProps<Theme> = {
  flex: '1 1 auto',
  minHeight: 0,
  overflow: 'hidden',
  bgcolor: ROUTE_COLORS.pageBg,
  borderRadius: '1.5rem 1.5rem 0 0',
  marginTop: '-1.25rem',
  position: 'relative',
  padding: 'clamp(0.75rem, 2dvh, 1.25rem) 1.25rem 1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: 'clamp(0.5rem, 1.4dvh, 0.875rem)',
  boxShadow: '0 -0.5rem 1.5rem rgba(11, 14, 11, 0.08)',
  boxSizing: 'border-box',
  zIndex: 3,
  '@media (max-height: 40rem)': {
    padding: '0.5rem 1rem',
    gap: '0.25rem',
  },
  '@media (max-width: 20rem), (max-height: 28rem)': {
    overflowY: 'auto',
  },
};
