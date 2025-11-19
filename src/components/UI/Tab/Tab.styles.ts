import { styled, Box } from '@mui/material';
import { floowColors } from '../../../theme/colors';
import type { TabSize } from './ITab';

interface StyledTabProps {
  active?: boolean;
  size?: TabSize;
}

// Size configurations
const tabSizeConfig = {
  small: {
    width: '120px',
    height: '36px',
    padding: '8px 16px 8px 12px',
    fontSize: '12px',
    iconGap: '6px',
  },
  medium: {
    width: '150px',
    height: '44px',
    padding: '10px 20px 10px 15px',
    fontSize: '14px',
    iconGap: '10px',
  },
  large: {
    width: '180px',
    height: '52px',
    padding: '12px 24px 12px 18px',
    fontSize: '16px',
    iconGap: '12px',
  },
};

export const TabMenuContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '10px',
  gap: '10px',
  width: 'auto',
  maxWidth: '650px',
  height: '64px',
  background: floowColors.grey[900], // #171717
  borderRadius: '16px',
  boxSizing: 'border-box',
  flexShrink: 1,
  flexGrow: 0,
  minWidth: 'fit-content',

  // Responsive adjustments
  [theme.breakpoints.down('lg')]: {
    maxWidth: '550px',
  },

  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
    height: '56px',
    padding: '8px',
    gap: '8px',
    borderRadius: '12px',
  },

  [theme.breakpoints.down('sm')]: {
    height: '48px',
    padding: '6px',
    gap: '6px',
    borderRadius: '10px',
    overflowX: 'auto',
    flexWrap: 'nowrap',
    '&::-webkit-scrollbar': {
      height: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: floowColors.grey[600],
      borderRadius: '2px',
    },
  },
}));

export const StyledTab = styled(Box)<StyledTabProps>(({ theme, active, size = 'medium' }) => {
  const config = tabSizeConfig[size];

  return {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: config.padding,
    gap: config.iconGap,
    width: config.width,
    height: config.height,
    background: active
      ? `linear-gradient(180deg, ${floowColors.grey[50]} 0%, ${floowColors.grey[400]} 100%)`
      : 'transparent',
    border: active ? `2px solid ${floowColors.grey[600]}` : `2px solid transparent`,
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    userSelect: 'none',
    flexShrink: 0,

    // Text styling
    fontSize: config.fontSize,
    fontWeight: active ? 600 : 500,
    fontFamily: 'Manrope, sans-serif',
    color: active ? floowColors.black : floowColors.grey[300],
    whiteSpace: 'nowrap',

    // Icon styling
    '& .tab-icon': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    '& svg': {
      width: size === 'small' ? '16px' : size === 'medium' ? '20px' : '24px',
      height: size === 'small' ? '16px' : size === 'medium' ? '20px' : '24px',
      fill: 'currentColor',
      display: 'block',
    },
    '& .tab-label': {
      display: 'flex',
      alignItems: 'center',
      lineHeight: 1,
    },

    // Hover state (only when not active)
    ...(!active && {
      '&:hover': {
        background: floowColors.grey[800],
        border: `2px solid ${floowColors.grey[700]}`,
        color: floowColors.grey[100],
      },
    }),

    // Disabled state
    '&[data-disabled="true"]': {
      cursor: 'not-allowed',
      opacity: 0.5,
      '&:hover': {
        background: 'transparent',
        border: '2px solid transparent',
        color: floowColors.grey[300],
      },
    },

    // Responsive adjustments
    [theme.breakpoints.down('md')]: {
      width: size === 'large' ? '160px' : size === 'medium' ? '130px' : '100px',
      height: size === 'large' ? '48px' : size === 'medium' ? '40px' : '32px',
      fontSize: size === 'large' ? '15px' : size === 'medium' ? '13px' : '11px',
      padding:
        size === 'large'
          ? '10px 20px 10px 16px'
          : size === 'medium'
            ? '8px 16px 8px 12px'
            : '6px 12px 6px 10px',
    },

    [theme.breakpoints.down('sm')]: {
      width: size === 'large' ? '140px' : size === 'medium' ? '110px' : '90px',
      height: size === 'large' ? '44px' : size === 'medium' ? '36px' : '28px',
      fontSize: size === 'large' ? '14px' : size === 'medium' ? '12px' : '10px',
    },
  };
});
