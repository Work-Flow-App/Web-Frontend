import { styled, Box } from '@mui/material';
import { floowColors } from '../../../../theme/colors';

export const ToolbarWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '8px 10px',
  gap: '6px',
  background: floowColors.grey[900],
  borderRadius: '12px',
  width: 'fit-content',
  maxWidth: '100%',
  flexWrap: 'wrap',
  marginBottom: '12px',
}));

interface FieldTypeButtonProps {
  active?: boolean;
}

export const FieldTypeButton = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<FieldTypeButtonProps>(({ active }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '8px 14px 8px 10px',
  height: '40px',
  background: active
    ? `linear-gradient(180deg, ${floowColors.grey[50]} 0%, ${floowColors.grey[400]} 100%)`
    : 'transparent',
  border: active
    ? `2px solid ${floowColors.grey[600]}`
    : '2px solid transparent',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  userSelect: 'none',
  flexShrink: 0,
  whiteSpace: 'nowrap',

  fontSize: '13px',
  fontWeight: active ? 600 : 500,
  fontFamily: 'Manrope, sans-serif',
  color: active ? floowColors.black : floowColors.grey[300],

  '& svg': {
    width: '18px',
    height: '18px',
    flexShrink: 0,
  },

  ...(!active && {
    '&:hover': {
      background: floowColors.grey[800],
      border: `2px solid ${floowColors.grey[700]}`,
      color: floowColors.grey[100],
    },
  }),
}));
