import { styled, Box, Button } from '@mui/material';
import { floowColors } from '../../../theme/colors';

interface CardWrapperProps {
  background?: string;
}

export const CardWrapper = styled(Box)<CardWrapperProps>(({ background }) => {
  const bgGradient = background || floowColors.gradient.pricingCard;

  return {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '32px 40px',
    gap: '40px',
    width: '363px',
    minHeight: '658px',
    background: bgGradient,
    backdropFilter: 'blur(42px)',
    WebkitBackdropFilter: 'blur(42px)',
    borderRadius: '24px',
    transition: 'all 0.3s ease-in-out',

    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: `0px 20px 40px ${floowColors.overlay.medium}`,
    },
  };
});

export const IconCircle = styled(Box)(() => ({
  position: 'relative',
  width: '40px',
  height: '40px',
  background: floowColors.gradient.pricingIcon,
  borderRadius: '100px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,

  '&::after': {
    content: '""',
    position: 'absolute',
    width: '20px',
    height: '20px',
    left: 'calc(50% - 10px)',
    top: 'calc(50% - 10px)',
    background: floowColors.black,
    borderRadius: '50%',
  },
}));

export const HeaderSection = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '8px',
  width: '100%',
}));

export const PlanName = styled(Box)(() => ({
  fontFamily: "'Manrope', sans-serif",
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: '24px',
  lineHeight: '33px',
  color: floowColors.white,
}));

export const PlanDescription = styled(Box)(() => ({
  fontFamily: "'Manrope', sans-serif",
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: '19px',
  color: floowColors.whiteAlpha[70],
}));

export const PriceSection = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'baseline',
  gap: '4px',
}));

export const Currency = styled(Box)(() => ({
  fontFamily: "'Manrope', sans-serif",
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: '32px',
  lineHeight: '44px',
  color: floowColors.white,
}));

export const Price = styled(Box)(() => ({
  fontFamily: "'Manrope', sans-serif",
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: '48px',
  lineHeight: '66px',
  color: floowColors.white,
}));

export const PricePeriod = styled(Box)(() => ({
  fontFamily: "'Manrope', sans-serif",
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: '19px',
  color: floowColors.whiteAlpha[70],
}));

export const StyledButton = styled(Button)(() => ({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '12px 14px',
  gap: '10px',
  width: '100%',
  height: '44px',
  background: floowColors.gradient.pricingButton,
  borderRadius: '8px',
  fontFamily: "'Manrope', sans-serif",
  fontStyle: 'normal',
  fontWeight: 600,
  fontSize: '16px',
  lineHeight: '22px',
  color: floowColors.black,
  textTransform: 'none',
  boxShadow: 'none',

  '&:hover': {
    background: floowColors.gradient.pricingButtonHover,
    boxShadow: `0px 4px 12px ${floowColors.shadow.card}`,
  },
}));

export const FeaturesSection = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '10px',
  width: '100%',
}));

export const FeaturesSectionTitle = styled(Box)(() => ({
  fontFamily: "'Manrope', sans-serif",
  fontStyle: 'normal',
  fontWeight: 600,
  fontSize: '16px',
  lineHeight: '22px',
  color: floowColors.white,
  marginBottom: '10px',
}));

export const FeatureItem = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '12px',
  width: '100%',
}));

export const RadioIcon = styled(Box)(() => ({
  width: '16px',
  height: '16px',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  border: `2px solid ${floowColors.whiteAlpha[50]}`,
  position: 'relative',

  '&::after': {
    content: '""',
    position: 'absolute',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: floowColors.white,
  },
}));

export const FeatureText = styled(Box)(() => ({
  fontFamily: "'Manrope', sans-serif",
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: '19px',
  color: floowColors.whiteAlpha[90],
}));
