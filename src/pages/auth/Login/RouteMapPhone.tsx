import React from 'react';
import { Box } from '@mui/material';
import { BrandLogo } from './BrandLogo';
import { useCurrentDay } from './useGreeting';
import * as styles from './styles';

interface RouteMapPhoneProps {
  seg1: number;
  seg2: number;
  seg3: number;
  pin1Fill: string;
  pin1Stroke: string;
  pin2Fill: string;
  pin2Stroke: string;
  pin3Fill: string;
  pin3Stroke: string;
  lit: number;
}

export const RouteMapPhone: React.FC<RouteMapPhoneProps> = ({
  seg1,
  seg2,
  seg3,
  pin1Fill,
  pin1Stroke,
  pin2Fill,
  pin2Stroke,
  pin3Fill,
  pin3Stroke,
  lit,
}) => {
  const currentDay = useCurrentDay();
  return (
    <Box sx={styles.phoneMapBox}>
      {/* Phone map SVG (verbatim from RoutePhone.dc.html) */}
      <Box
        component="svg"
        aria-hidden="true"
        viewBox="0 0 390 230"
        preserveAspectRatio="xMidYMid slice"
        sx={styles.phoneMapSvg}
      >
        <rect x="0" y="0" width="390" height="230" fill="#F1F2EE" />
        <path
          d="M -10 175 C 80 160, 160 195, 400 170 L 400 196 C 160 222, 80 186, -10 202 Z"
          fill="#C9DCEA"
        />
        <g fill="#E4E5E0">
          <rect x="20" y="60" width="90" height="60" rx="8" />
          <rect x="150" y="30" width="120" height="70" rx="8" />
          <rect x="300" y="120" width="80" height="80" rx="8" />
          <rect x="130" y="150" width="110" height="60" rx="8" />
        </g>
        <g stroke="#D6D7D0" strokeWidth="17" fill="none" strokeLinecap="round">
          <path d="M -10 135 L 400 130" />
          <path d="M 125 -10 L 120 240" />
          <path d="M 285 -10 L 290 240" />
        </g>
        <g stroke="#FFFFFF" strokeWidth="14" fill="none" strokeLinecap="round">
          <path d="M -10 135 L 400 130" />
          <path d="M 125 -10 L 120 240" />
          <path d="M 285 -10 L 290 240" />
        </g>
        <path
          d="M 40 205 C 70 170, 90 150, 120 135 S 210 120, 255 110 S 300 80, 345 60"
          fill="none"
          stroke="#B9C2AD"
          strokeWidth="4"
          strokeDasharray="2 9"
          strokeLinecap="round"
        />
        <g fill="none" strokeLinecap="round">
          <path
            className="rp-route"
            pathLength="1"
            strokeDasharray="1 1"
            strokeDashoffset={seg1}
            d="M 40 205 C 70 170, 90 150, 120 135"
            stroke="#A3F000"
            strokeWidth="13"
            strokeOpacity="0.55"
          />
          <path
            className="rp-route"
            pathLength="1"
            strokeDasharray="1 1"
            strokeDashoffset={seg2}
            d="M 120 135 C 150 120, 210 120, 255 110"
            stroke="#A3F000"
            strokeWidth="13"
            strokeOpacity="0.55"
          />
          <path
            className="rp-route"
            pathLength="1"
            strokeDasharray="1 1"
            strokeDashoffset={seg3}
            d="M 255 110 C 300 100, 300 80, 345 60"
            stroke="#A3F000"
            strokeWidth="13"
            strokeOpacity="0.55"
          />
          <path
            className="rp-route"
            pathLength="1"
            strokeDasharray="1 1"
            strokeDashoffset={seg1}
            d="M 40 205 C 70 170, 90 150, 120 135"
            stroke="#2F6B00"
            strokeWidth="4.5"
          />
          <path
            className="rp-route"
            pathLength="1"
            strokeDasharray="1 1"
            strokeDashoffset={seg2}
            d="M 120 135 C 150 120, 210 120, 255 110"
            stroke="#2F6B00"
            strokeWidth="4.5"
          />
          <path
            className="rp-route"
            pathLength="1"
            strokeDasharray="1 1"
            strokeDashoffset={seg3}
            d="M 255 110 C 300 100, 300 80, 345 60"
            stroke="#2F6B00"
            strokeWidth="4.5"
          />
        </g>
        <g strokeWidth="4">
          <circle cx="40" cy="205" r="10" fill="#0B0E0B" stroke="#A3F000" />
          <circle
            className="rp-pin"
            cx="120"
            cy="135"
            r="9"
            fill={pin1Fill}
            stroke={pin1Stroke}
          />
          <circle
            className="rp-pin"
            cx="255"
            cy="110"
            r="9"
            fill={pin2Fill}
            stroke={pin2Stroke}
          />
          <circle
            className="rp-pin"
            cx="345"
            cy="60"
            r="9"
            fill={pin3Fill}
            stroke={pin3Stroke}
          />
        </g>
      </Box>

      {/* Header overlay */}
      <Box sx={styles.phoneHeader}>
        <BrandLogo variant="phone" />
        <Box sx={styles.phoneBadge}>
          <Box component="span" aria-hidden="true" className="rl-badge-dot" sx={styles.mapBadgeDot} />
          {currentDay}
        </Box>
      </Box>

      {/* Next job badge: border turns lime when lit >= 1 */}
      <Box sx={lit >= 1 ? styles.phoneRewireBadgeLit : styles.phoneRewireBadgeUnlit}>
        10:30 · Rewire kitchen
      </Box>
    </Box>
  );
};
