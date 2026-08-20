import { styled, Box, Table, Button, Slider } from '@mui/material';
import { rem } from '../../components/UI/Typography/utility';
import { floowColors } from '../../theme/colors';

export const PageWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100%',
  padding: rem(40),
  gap: theme.spacing(4),

  [theme.breakpoints.down('sm')]: {
    padding: rem(24),
  },
}));

export const HeadingWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
  maxWidth: rem(480),
  textAlign: 'center',
}));

export const Eyebrow = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(10),
  fontFamily: "'Manrope', sans-serif",
  fontSize: rem(13),
  fontWeight: 600,
  letterSpacing: '0.02em',
  color: floowColors.text.secondary,
  textTransform: 'uppercase',
}));

export const EyebrowLine = styled(Box)(() => ({
  width: rem(24),
  height: rem(1),
  background: floowColors.border.dark,
}));

export const CardsRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'stretch',
  gap: theme.spacing(3),
  width: '100%',

  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(2),
  },
}));

// Shared control row below the card group: adjusts seats for whichever card is
// currently selected, and submits checkout for that plan.
export const UniversalControlBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  width: '100%',
  maxWidth: rem(1150),
  padding: `${rem(16)} ${rem(24)}`,
  borderRadius: rem(16),
  border: `${rem(1)} solid ${floowColors.border.medium}`,
  background: floowColors.white,

  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
}));

export const UsersInfo = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(12),
}));

export const UsersIconCircle = styled(Box)(() => ({
  width: rem(40),
  height: rem(40),
  borderRadius: '50%',
  background: floowColors.grey[100],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}));

export const UsersTextGroup = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export const SliderWrapper = styled(Box)(({ theme }) => ({
  flex: `1 1 ${rem(240)}`,
  minWidth: rem(160),
  padding: `0 ${rem(8)}`,

  [theme.breakpoints.down('sm')]: {
    width: '100%',
    flexBasis: 'auto',
  },
}));

export const SeatSlider = styled(Slider)(() => ({
  color: floowColors.black,
  height: rem(6),

  '& .MuiSlider-rail': {
    backgroundColor: floowColors.grey[200],
    opacity: 1,
  },

  '& .MuiSlider-track': {
    border: 'none',
  },

  '& .MuiSlider-thumb': {
    width: rem(18),
    height: rem(18),
    backgroundColor: floowColors.white,
    border: `${rem(2)} solid ${floowColors.black}`,

    '&:hover, &.Mui-focusVisible': {
      boxShadow: `0 0 0 ${rem(8)} ${floowColors.blackAlpha[8]}`,
    },
    '&.Mui-active': {
      boxShadow: `0 0 0 ${rem(12)} ${floowColors.blackAlpha[10]}`,
    },
  },

  '& .MuiSlider-valueLabel': {
    backgroundColor: floowColors.black,
    borderRadius: rem(6),
    fontFamily: "'Manrope', sans-serif",
    fontWeight: 600,
  },

  '&.Mui-disabled': {
    color: floowColors.grey[300],

    '& .MuiSlider-thumb': {
      borderColor: floowColors.grey[300],
    },
  },
}));

export const OrderButton = styled(Button)(({ theme }) => ({
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: `${rem(10)} ${rem(28)}`,
  height: rem(44),
  background: floowColors.black,
  borderRadius: rem(8),
  fontFamily: "'Manrope', sans-serif",
  fontWeight: 600,
  fontSize: rem(15),
  color: floowColors.white,
  textTransform: 'none',
  boxShadow: 'none',
  whiteSpace: 'nowrap',

  '&:hover': {
    background: floowColors.grey[800],
  },

  '&.Mui-disabled': {
    background: floowColors.grey[100],
    color: floowColors.text.disabled,
  },

  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

export const ComparisonSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2.5),
  width: '100%',
  maxWidth: rem(1150),
}));

// Highlighted column index (1-based, counting the label column) for the featured plan.
// Kept in one place so the table styles and the header chip agree on which column it is.
export const FEATURED_COLUMN = 4;

export const ComparisonCard = styled(Box)(() => ({
  width: '100%',
  background: floowColors.white,
  border: `${rem(1)} solid ${floowColors.border.medium}`,
  borderRadius: rem(20),
  overflow: 'hidden',
  boxShadow: `0 ${rem(4)} ${rem(20)} ${floowColors.shadow.sm}`,
}));

export const ComparisonTable = styled(Table)(({ theme }) => ({
  borderCollapse: 'separate',

  '& th, & td': {
    borderBottom: `${rem(1)} solid ${floowColors.border.light}`,
    padding: theme.spacing(2, 2.5),
  },

  '& tr:last-of-type th, & tr:last-of-type td': {
    borderBottom: 'none',
  },

  '& thead th': {
    fontFamily: "'Manrope', sans-serif",
    fontWeight: 700,
    fontSize: rem(15),
    color: floowColors.text.heading,
    background: floowColors.grey[50],
    borderBottom: `${rem(2)} solid ${floowColors.grey[200]}`,
    whiteSpace: 'nowrap',
  },

  '& td:first-of-type, & th:first-of-type': {
    fontFamily: "'Manrope', sans-serif",
    fontWeight: 500,
    fontSize: rem(14),
    color: floowColors.text.primary,
    textAlign: 'left',
  },

  '& td:not(:first-of-type), & th:not(:first-of-type)': {
    textAlign: 'center',
  },

  '& tbody tr:hover': {
    background: floowColors.grey[50],
  },

  // Emphasize the featured plan's column so the recommended tier reads at a glance.
  [`& td:nth-of-type(${FEATURED_COLUMN}), & th:nth-of-type(${FEATURED_COLUMN})`]: {
    background: floowColors.blackAlpha[2],
    borderLeft: `${rem(1)} solid ${floowColors.border.medium}`,
    borderRight: `${rem(1)} solid ${floowColors.border.medium}`,
  },

  [`& thead th:nth-of-type(${FEATURED_COLUMN})`]: {
    background: floowColors.grey[100],
  },

  [`& tbody tr:hover td:nth-of-type(${FEATURED_COLUMN})`]: {
    background: floowColors.blackAlpha[5],
  },
}));

export const FeaturedColumnHeader = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: rem(4),
}));

export const FeaturedChip = styled(Box)(() => ({
  padding: `${rem(2)} ${rem(10)}`,
  borderRadius: rem(100),
  background: floowColors.black,
  color: floowColors.white,
  fontFamily: "'Manrope', sans-serif",
  fontWeight: 600,
  fontSize: rem(10),
  textTransform: 'uppercase',
  letterSpacing: '0.03em',
}));

export const FeatureBadge = styled(Box)<{ included?: boolean }>(({ included }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: rem(26),
  height: rem(26),
  borderRadius: '50%',
  background: included ? floowColors.success.light : floowColors.grey[100],
}));
