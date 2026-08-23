import { styled, Box, Button } from '@mui/material';
import { floowColors } from '../../../theme/colors';
import { rem } from '../Typography/utility';

interface CardWrapperProps {
  background?: string;
  selected?: boolean;
  clickable?: boolean;
}

export const CardWrapper = styled(Box)<CardWrapperProps>(({ theme, background, selected, clickable }) => ({
  boxSizing: 'border-box',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: `${rem(32)} ${rem(40)}`,
  gap: rem(24),
  width: '100%',
  maxWidth: rem(363),
  minHeight: rem(560),
  background: background || floowColors.white,
  borderRadius: rem(24),
  border: selected ? `${rem(2)} solid ${floowColors.black}` : `${rem(1)} solid ${floowColors.border.medium}`,
  boxShadow: selected ? `0 ${rem(12)} ${rem(32)} ${floowColors.shadow.lg}` : `0 ${rem(4)} ${rem(12)} ${floowColors.shadow.sm}`,
  transition: 'all 0.3s ease-in-out',
  cursor: clickable ? 'pointer' : 'default',
  outline: 'none',

  '&:hover': {
    transform: `translateY(${rem(-4)})`,
    boxShadow: `0 ${rem(20)} ${rem(40)} ${floowColors.shadow.xl}`,
  },

  '&:focus-visible': clickable
    ? {
        boxShadow: `0 0 0 ${rem(3)} ${floowColors.blackAlpha[20]}`,
      }
    : {},

  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
    minHeight: 'auto',
    padding: rem(24),
  },
}));

export const FeaturedBadge = styled(Box)(() => ({
  position: 'absolute',
  top: rem(-14),
  left: '50%',
  transform: 'translateX(-50%)',
  padding: `${rem(4)} ${rem(16)}`,
  borderRadius: rem(100),
  background: floowColors.black,
  fontFamily: "'Manrope', sans-serif",
  fontStyle: 'normal',
  fontWeight: 600,
  fontSize: rem(12),
  lineHeight: rem(16),
  color: floowColors.white,
  whiteSpace: 'nowrap',
}));

export const HeaderSection = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: rem(8),
  width: '100%',
}));

export const TitleRow = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: rem(8),
  width: '100%',
}));

export const NameGroup = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: rem(10),
}));

export const RadioIndicator = styled(Box)<{ selected?: boolean }>(({ selected }) => ({
  position: 'relative',
  width: rem(20),
  height: rem(20),
  flexShrink: 0,
  borderRadius: '50%',
  border: `${rem(2)} solid ${selected ? floowColors.black : floowColors.border.medium}`,
  transition: 'border-color 0.2s ease-in-out',

  '&::after': {
    content: '""',
    position: 'absolute',
    width: rem(10),
    height: rem(10),
    left: `calc(50% - ${rem(5)})`,
    top: `calc(50% - ${rem(5)})`,
    borderRadius: '50%',
    background: floowColors.black,
    opacity: selected ? 1 : 0,
    transition: 'opacity 0.2s ease-in-out',
  },
}));

export const PlanName = styled(Box)(() => ({
  fontFamily: "'Manrope', sans-serif",
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: rem(22),
  lineHeight: rem(30),
  color: floowColors.text.heading,
}));

export const PlanDescription = styled(Box)(() => ({
  fontFamily: "'Manrope', sans-serif",
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: rem(14),
  lineHeight: rem(19),
  color: floowColors.text.secondary,
}));

export const PriceSection = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  flexShrink: 0,
}));

export const PriceRow = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'baseline',
  gap: rem(2),
}));

export const Currency = styled(Box)(() => ({
  fontFamily: "'Manrope', sans-serif",
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: rem(22),
  lineHeight: rem(30),
  color: floowColors.text.heading,
}));

export const Price = styled(Box)(() => ({
  fontFamily: "'Manrope', sans-serif",
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: rem(28),
  lineHeight: rem(38),
  color: floowColors.text.heading,
}));

export const PricePeriod = styled(Box)(() => ({
  fontFamily: "'Manrope', sans-serif",
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: rem(13),
  lineHeight: rem(18),
  color: floowColors.text.secondary,
}));

export const StyledButton = styled(Button)(() => ({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: `${rem(12)} ${rem(14)}`,
  gap: rem(10),
  width: '100%',
  height: rem(44),
  background: floowColors.black,
  borderRadius: rem(8),
  fontFamily: "'Manrope', sans-serif",
  fontStyle: 'normal',
  fontWeight: 600,
  fontSize: rem(16),
  lineHeight: rem(22),
  color: floowColors.white,
  textTransform: 'none',
  boxShadow: 'none',

  '&:hover': {
    background: floowColors.grey[800],
    boxShadow: `0 ${rem(4)} ${rem(12)} ${floowColors.shadow.card}`,
  },

  '&.Mui-disabled': {
    background: floowColors.grey[100],
    color: floowColors.text.disabled,
  },
}));

export const FeaturesSection = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: rem(10),
  width: '100%',
}));

export const FeaturesSectionTitle = styled(Box)(() => ({
  fontFamily: "'Manrope', sans-serif",
  fontStyle: 'normal',
  fontWeight: 600,
  fontSize: rem(16),
  lineHeight: rem(22),
  color: floowColors.text.heading,
  marginBottom: rem(10),
}));

export const FeatureItem = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: rem(12),
  width: '100%',
}));

export const FeatureText = styled(Box)(() => ({
  fontFamily: "'Manrope', sans-serif",
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: rem(14),
  lineHeight: rem(19),
  color: floowColors.text.primary,
}));
