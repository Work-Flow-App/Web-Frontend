// Route Line Design — Constants

export const ROUTE_COLORS = {
  lime: '#A3F000',
  darkGreen: '#2F6B00',
  ink: '#0B0E0B',
  pageBg: '#F6F7F2',
  phoneBg: '#F1F2EE',
  fieldBorder: '#D5DBCC',
  placeholder: '#7A8577',
  mutedText: '#4B5649',
  baseRoute: '#B9C2AD',
  park: '#DCEAD3',
  toggleBg: '#E9EDE2',
  errorBg: '#FDECEA',
  errorText: '#8A1C12',
  amber: '#FFB547',
  yellow: '#FFE14D',
  blue: '#7CC4F2',
  white: '#FFFFFF',
  roadOuter: '#D6D7D0',
  roadInner: '#FFFFFF',
  buildingFill: '#E4E5E0',
  waterFill: '#C9DCEA',
};

// Desktop stage dimensions (800 x 900 in rem, 1rem = 16px)
export const DESKTOP_STAGE_WIDTH_REM = 50; // 800px
export const DESKTOP_STAGE_HEIGHT_REM = 56.25; // 900px
export const DESKTOP_MAP_RATIO = '42%';
export const DESKTOP_MAP_MIN_WIDTH = '28rem';
export const DESKTOP_MAP_MAX_WIDTH = '44rem';
export const FORM_CARD_MAX_WIDTH = '30rem';

// Support phone and email constants
export const SUPPORT_PHONE = 'Call [YOUR SUPPORT NUMBER]';
export const SUPPORT_PHONE_TEL = 'tel:[YOUR-SUPPORT-NUMBER]';
export const SUPPORT_EMAIL = 'support@workfloow.app';
export const DEMO_ROUTE = '/demo';

// Desktop base route & segment paths (verbatim from RouteLine.dc.html)
export const SEG_PATHS = {
  base: 'M 120 780 C 170 700, 200 620, 250 580 S 400 520, 495 500 S 520 330, 560 280 S 640 200, 700 170',
  seg1: 'M 120 780 C 170 700, 200 620, 250 580',
  seg2: 'M 250 580 C 300 540, 400 520, 495 500',
  seg3: 'M 495 500 C 590 480, 520 330, 560 280',
  seg4: 'M 560 280 C 600 230, 640 200, 700 170',
};

// Desktop tick checkmark paths
export const TICK_PATHS = {
  tick1: 'M 243 580 l 5 5 l 10 -11',
  tick2: 'M 488 500 l 5 5 l 10 -11',
  tick3: 'M 553 280 l 5 5 l 10 -11',
  tick4: 'M 693 170 l 5 5 l 10 -11',
};

// Desktop pin coordinates [cx, cy]
export const DESKTOP_PINS: [number, number][] = [
  [120, 780],
  [250, 580],
  [495, 500],
  [560, 280],
  [700, 170],
];

// Phone segment paths (verbatim from RoutePhone.dc.html)
export const PHONE_SEG_PATHS = {
  base: 'M 40 205 C 70 170, 90 150, 120 135 S 210 120, 255 110 S 300 80, 345 60',
  seg1: 'M 40 205 C 70 170, 90 150, 120 135',
  seg2: 'M 120 135 C 150 120, 210 120, 255 110',
  seg3: 'M 255 110 C 300 100, 300 80, 345 60',
};

// Phone pin coordinates [cx, cy]
export const PHONE_PINS: [number, number][] = [
  [40, 205],
  [120, 135],
  [255, 110],
  [345, 60],
];

// Animation timing (ms)
export const ANIM_TIMING = {
  DRIVE: 2200,
  STOP: 1300,
  END: 1800,
  FADE: 700,
};

// 4 desktop jobs data (verbatim from RouteLine.dc.html)
export interface JobData {
  title: string;
  time: string;
}

export const JOBS_DATA: JobData[] = [
  { title: 'Boiler service', time: '8:00 am' },
  { title: 'Rewire kitchen', time: '10:30 am' },
  { title: 'Leaking tap', time: '1:00 pm' },
  { title: 'Bathroom quote', time: '3:30 pm' },
];

// Greeting ranges
export const GREETING_RANGES = {
  MORNING: 'Good morning', // 04:00 - 11:59 (after 4am)
  NOON: 'Good noon', // 12:00 - 12:59
  AFTERNOON: 'Good afternoon', // 13:00 - 16:59
  EVENING: 'Good evening', // 17:00 - 03:59 (instead of Good night)
  NIGHT: 'Good evening', // Replaced with Good evening per user specification
} as const;

export const PIN_FILL_ON = '#0B0E0B';
export const PIN_FILL_OFF = '#FFFFFF';
export const PIN_STROKE_ON = '#A3F000';
export const PIN_STROKE_OFF = '#B9C2AD';
