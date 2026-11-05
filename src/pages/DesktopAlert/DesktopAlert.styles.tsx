import React from 'react';
import { styled, keyframes } from '@mui/material/styles';
import { Box, Typography, ButtonBase } from '@mui/material';
import { rem } from '../../components/UI/Typography/utility';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const scaleUp = keyframes`
  from {
    opacity: 0;
    transform: scale(0.92) translateY(${rem(12)});
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

export const Overlay = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(15, 23, 42, 0.65)',
  backdropFilter: `blur(${rem(4)})`,
  WebkitBackdropFilter: `blur(${rem(4)})`,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1500,
  padding: rem(16),
  animation: `${fadeIn} 0.25s ease-out`,
});

export const CardContainer = styled(Box)({
  width: '100%',
  maxWidth: rem(390),
  maxHeight: '92vh',
  backgroundColor: '#FFFFFF',
  borderRadius: rem(28),
  boxShadow: `0 ${rem(20)} ${rem(40)} rgba(0, 0, 0, 0.3)`,
  overflow: 'hidden',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  animation: `${scaleUp} 0.3s cubic-bezier(0.16, 1, 0.3, 1)`,
});

export const HeaderBanner = styled(Box)({
  position: 'relative',
  width: '100%',
  height: rem(195),
  flexShrink: 0,
  backgroundColor: '#77E20D',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
});

export const CloseButton = styled(ButtonBase)({
  position: 'absolute',
  top: rem(14),
  right: rem(14),
  width: rem(34),
  height: rem(34),
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.55)',
  color: '#0F172A',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  zIndex: 3,
  transition: 'background-color 0.2s ease, transform 0.15s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    transform: 'scale(1.06)',
  },
  '&:active': {
    transform: 'scale(0.94)',
  },
});

export const CloseCrossIcon: React.FC = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.5 1.5L12.5 12.5M1.5 12.5L12.5 1.5"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  </svg>
);

export const IllustrationSvg = styled('svg')({
  width: '100%',
  height: '100%',
  display: 'block',
});

export const IllustrationGraphic: React.FC = () => (
  <IllustrationSvg
    viewBox="0 0 360 195"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Sparkles and Accents */}
    <path
      d="M136 24L137.5 29L142 30.5L137.5 32L136 37L134.5 32L130 30.5L134.5 29L136 24Z"
      fill="#0F172A"
    />
    <path
      d="M246 32L247.2 36.2L251 37.5L247.2 38.8L246 43L244.8 38.8L241 37.5L244.8 36.2L246 32Z"
      fill="#FFFFFF"
      opacity="0.9"
    />
    <path
      d="M256 50L258 56L264 58L258 60L256 66L254 60L248 58L254 56L256 50Z"
      fill="#0F172A"
    />
    <path
      d="M86 64V72M82 68H90"
      stroke="#0F172A"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <path
      d="M262 72V80M258 76H266"
      stroke="#0F172A"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    {/* Motion burst marks around CRT */}
    <path
      d="M130 45L122 39M134 56L124 56"
      stroke="#0F172A"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <path
      d="M232 86C238 88 243 93 244 100"
      stroke="#0F172A"
      strokeWidth="2.2"
      strokeLinecap="round"
    />

    {/* Laptop Behind */}
    <g id="laptop">
      {/* Laptop Screen */}
      <polygon
        points="95,62 154,58 152,106 99,112"
        fill="#0F172A"
        stroke="#000000"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <polygon
        points="102,66 148,63 147,100 105,105"
        fill="#1E293B"
      />
      {/* Laptop Base */}
      <polygon
        points="99,112 152,106 147,122 108,136"
        fill="#9EE825"
        stroke="#000000"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <polygon
        points="108,136 147,122 170,128 126,144"
        fill="#A3E635"
        stroke="#000000"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <line
        x1="113"
        y1="131"
        x2="149"
        y2="119"
        stroke="#000000"
        strokeWidth="2"
      />
    </g>

    {/* Retro Desktop Monitor */}
    <g id="desktop-crt">
      {/* Monitor outer shadow/depth */}
      <path
        d="M145 35L213 30L233 42L235 110L218 120L150 125L145 35Z"
        fill="#0F172A"
      />
      {/* Monitor casing */}
      <rect
        x="146"
        y="34"
        width="72"
        height="65"
        rx="14"
        fill="#D9F99D"
        stroke="#000000"
        strokeWidth="3"
      />
      {/* Screen Bezel */}
      <rect
        x="154"
        y="41"
        width="56"
        height="46"
        rx="9"
        fill="#0F172A"
      />
      {/* Screen Display */}
      <rect
        x="158"
        y="45"
        width="48"
        height="38"
        rx="6"
        fill="#0A1E00"
      />
      {/* Screen reflection highlight */}
      <path
        d="M162 49L170 49C166 57 163 67 163 76L160 76C160 67 161 58 162 49Z"
        fill="#FFFFFF"
        opacity="0.6"
      />
      {/* Bright Checkmark */}
      <path
        d="M172 63.5L178 70L193 54"
        stroke="#77E20D"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Monitor Stand */}
      <path
        d="M170 99H194V107H170V99Z"
        fill="#BEF264"
        stroke="#000000"
        strokeWidth="2.8"
      />

      {/* Desktop CPU Unit */}
      <rect
        x="153"
        y="107"
        width="84"
        height="28"
        rx="4"
        fill="#D9F99D"
        stroke="#000000"
        strokeWidth="3"
      />
      {/* Floppy slot and power button */}
      <line
        x1="190"
        y1="117"
        x2="225"
        y2="117"
        stroke="#000000"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="163" cy="118" r="2.5" fill="#000000" />

      {/* Keyboard in front */}
      <polygon
        points="150,132 216,126 211,146 142,152"
        fill="#BEF264"
        stroke="#000000"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Keyboard keys */}
      <line
        x1="149"
        y1="137"
        x2="213"
        y2="131"
        stroke="#000000"
        strokeWidth="2"
      />
      <line
        x1="146"
        y1="143"
        x2="210"
        y2="137"
        stroke="#000000"
        strokeWidth="2"
      />
      <line
        x1="144"
        y1="149"
        x2="208"
        y2="143"
        stroke="#000000"
        strokeWidth="2"
      />
    </g>

    {/* Back Cloud Layer */}
    <path
      d="M-20 195C-10 160 30 150 55 165C75 145 115 145 135 168C165 145 210 150 230 172C250 150 290 148 315 170C340 155 375 160 390 195H-20Z"
      fill="#CBD5E1"
      opacity="0.7"
    />
    {/* Front Fluffy White Cloud Layer */}
    <path
      d="M-20 195C-15 170 15 162 38 178C58 158 96 158 116 178C138 160 178 160 198 180C220 162 260 162 282 182C302 166 338 168 355 186C368 178 382 182 390 195H-20Z"
      fill="#FFFFFF"
    />
  </IllustrationSvg>
);

export interface AlertBannerProps {
  onClose: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ onClose }) => (
  <HeaderBanner>
    <CloseButton onClick={onClose} aria-label="Close alert">
      <CloseCrossIcon />
    </CloseButton>
    <IllustrationGraphic />
  </HeaderBanner>
);

export const ContentContainer = styled(Box)({
  padding: `${rem(24)} ${rem(24)} ${rem(28)}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  backgroundColor: '#FFFFFF',
});

export const Title = styled(Typography)({
  fontSize: rem(23),
  fontWeight: 800,
  lineHeight: 1.25,
  color: '#0F172A',
  margin: 0,
  marginBottom: rem(10),
  fontFamily: 'inherit',
});

export const Description = styled(Typography)({
  fontSize: rem(15),
  fontWeight: 400,
  lineHeight: 1.45,
  color: '#334155',
  margin: 0,
  maxWidth: rem(320),
  fontFamily: 'inherit',
});

export const Separator = styled(Box)({
  width: '100%',
  height: rem(1),
  backgroundColor: '#E2E8F0',
  marginTop: rem(18),
  marginBottom: rem(16),
});

export const TipSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: rem(10),
  textAlign: 'left',
  width: '100%',
  maxWidth: rem(310),
  justifyContent: 'center',
});

export const TipIconBadge = styled(Box)({
  width: rem(24),
  height: rem(24),
  borderRadius: '50%',
  border: `${rem(1.5)} solid #77E20D`,
  color: '#4D9608',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: rem(13),
  fontWeight: 700,
  fontFamily: 'serif',
  fontStyle: 'italic',
  flexShrink: 0,
  userSelect: 'none',
});

export const TipDescription = styled(Typography)({
  fontSize: rem(13.5),
  lineHeight: 1.35,
  color: '#1E293B',
  fontWeight: 400,
  margin: 0,
  fontFamily: 'inherit',
});

export const GotItButton = styled(ButtonBase)({
  width: '100%',
  maxWidth: rem(210),
  height: rem(46),
  borderRadius: rem(23),
  backgroundColor: '#77E20D',
  color: '#000000',
  fontSize: rem(16),
  fontWeight: 700,
  fontFamily: 'inherit',
  cursor: 'pointer',
  marginTop: rem(22),
  boxShadow: `0 ${rem(4)} ${rem(14)} rgba(119, 226, 13, 0.4)`,
  transition: 'background-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease',
  '&:hover': {
    backgroundColor: '#6BCB0B',
    transform: `translateY(${rem(-1)})`,
    boxShadow: `0 ${rem(6)} ${rem(18)} rgba(119, 226, 13, 0.5)`,
  },
  '&:active': {
    transform: `translateY(${rem(1)})`,
    boxShadow: `0 ${rem(2)} ${rem(8)} rgba(119, 226, 13, 0.3)`,
  },
});
