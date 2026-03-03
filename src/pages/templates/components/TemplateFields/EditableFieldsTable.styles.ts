import { styled, Box } from '@mui/material';
import { floowColors } from '../../../../theme/colors';

export const TableContainer = styled(Box)(() => ({
  width: '100%',
  border: `1px solid ${floowColors.grey[200]}`,
  borderRadius: '4px',
  overflow: 'auto',

  '&::-webkit-scrollbar': {
    height: '6px',
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: floowColors.grey[100],
  },
  '&::-webkit-scrollbar-thumb': {
    background: floowColors.grey[300],
    borderRadius: '3px',
  },
}));

export const TableEl = styled('table')(() => ({
  width: '100%',
  borderCollapse: 'collapse',
  tableLayout: 'fixed',
  minWidth: '700px',
}));

export const Thead = styled('thead')(() => ({
  background: floowColors.grey[50],
  position: 'sticky',
  top: 0,
  zIndex: 2,
}));

export const Tbody = styled('tbody')(() => ({}));

export const Th = styled('th')(() => ({
  padding: '10px 12px',
  fontSize: '11px',
  fontWeight: 700,
  fontFamily: 'Manrope, sans-serif',
  color: floowColors.grey[500],
  textAlign: 'left',
  borderBottom: `2px solid ${floowColors.grey[200]}`,
  borderRight: `1px solid ${floowColors.grey[200]}`,
  userSelect: 'none',
  whiteSpace: 'nowrap',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',

  '&:last-child': {
    borderRight: 'none',
  },
}));

interface TdProps {
  isEditing?: boolean;
  isEditable?: boolean;
}

export const Td = styled('td', {
  shouldForwardProp: (prop) => !['isEditing', 'isEditable'].includes(prop as string),
})<TdProps>(({ isEditing, isEditable }) => ({
  padding: 0,
  borderBottom: `1px solid ${floowColors.grey[100]}`,
  borderRight: `1px solid ${floowColors.grey[100]}`,
  position: 'relative',
  height: '36px',
  verticalAlign: 'middle',

  ...(isEditable && {
    cursor: 'text',
    '&:hover': {
      background: `${floowColors.blue[50]}40`,
    },
  }),

  ...(isEditing && {
    outline: `2px solid ${floowColors.blue.main}`,
    outlineOffset: '-2px',
    background: floowColors.white,
    zIndex: 1,
    '&:hover': {
      background: floowColors.white,
    },
  }),

  '&:last-child': {
    borderRight: 'none',
  },
}));

export const Tr = styled('tr')(() => ({
  transition: 'background 0.1s ease',

  '&:last-child td': {
    borderBottom: 'none',
  },

  '&:hover td': {
    background: floowColors.grey[50],
  },
}));

export const CellText = styled(Box)(() => ({
  padding: '0 10px',
  height: '36px',
  display: 'flex',
  alignItems: 'center',
  fontSize: '13px',
  fontFamily: 'Manrope, sans-serif',
  color: floowColors.grey[800],
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  userSelect: 'none',
}));

export const CellPlaceholder = styled(Box)(() => ({
  padding: '0 10px',
  height: '36px',
  display: 'flex',
  alignItems: 'center',
  fontSize: '13px',
  fontFamily: 'Manrope, sans-serif',
  color: floowColors.grey[300],
  fontStyle: 'italic',
  userSelect: 'none',
}));

export const CellInput = styled('input')(() => ({
  width: '100%',
  height: '36px',
  padding: '0 10px',
  border: 'none',
  outline: 'none',
  background: 'transparent',
  fontSize: '13px',
  fontFamily: 'Manrope, sans-serif',
  color: floowColors.grey[900],
  boxSizing: 'border-box',

  '&[type="number"]': {
    MozAppearance: 'textfield',
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      WebkitAppearance: 'none',
      margin: 0,
    },
  },
}));

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  TEXT:     { bg: '#e3f2fd', color: '#1565c0' },
  NUMBER:   { bg: '#f3e5f5', color: '#6a1b9a' },
  DATE:     { bg: '#e8f5e9', color: '#2e7d32' },
  BOOLEAN:  { bg: '#fff3e0', color: '#e65100' },
  DROPDOWN: { bg: '#fce4ec', color: '#880e4f' },
  MAP:      { bg: '#e0f7fa', color: '#006064' },
};

interface TypeBadgeProps {
  fieldType: string;
}

export const TypeBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'fieldType',
})<TypeBadgeProps>(({ fieldType }) => {
  const colors = TYPE_COLORS[fieldType] || { bg: floowColors.grey[100], color: floowColors.grey[600] };
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '3px 8px',
    borderRadius: '4px',
    background: colors.bg,
    color: colors.color,
    fontSize: '11px',
    fontWeight: 700,
    fontFamily: 'Manrope, sans-serif',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    userSelect: 'none',

    '& svg': {
      width: '12px',
      height: '12px',
      flexShrink: 0,
    },
  };
});

interface RequiredBadgeProps {
  isRequired: boolean;
}

export const RequiredBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isRequired',
})<RequiredBadgeProps>(({ isRequired }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '3px 10px',
  borderRadius: '4px',
  background: isRequired ? floowColors.error.bgLight : floowColors.grey[100],
  color: isRequired ? floowColors.error.main : floowColors.grey[500],
  fontSize: '11px',
  fontWeight: 700,
  fontFamily: 'Manrope, sans-serif',
  cursor: 'pointer',
  userSelect: 'none',
  transition: 'all 0.15s ease',
  border: `1px solid ${isRequired ? floowColors.error.main + '30' : floowColors.grey[200]}`,

  '&:hover': {
    opacity: 0.75,
  },
}));

export const TypeDropdownOverlay = styled(Box)(() => ({
  position: 'fixed',
  inset: 0,
  zIndex: 99,
}));

export const TypeDropdown = styled(Box)(() => ({
  position: 'absolute',
  top: 'calc(100% + 2px)',
  left: 0,
  background: floowColors.white,
  border: `1px solid ${floowColors.grey[200]}`,
  borderRadius: '6px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
  zIndex: 100,
  minWidth: '170px',
  padding: '4px',
  overflow: 'hidden',
}));

interface TypeOptionProps {
  isActive?: boolean;
}

export const TypeOption = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<TypeOptionProps>(({ isActive }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '7px 10px',
  borderRadius: '4px',
  fontSize: '12px',
  fontFamily: 'Manrope, sans-serif',
  fontWeight: isActive ? 700 : 400,
  cursor: 'pointer',
  background: isActive ? floowColors.grey[100] : floowColors.white,
  color: floowColors.grey[800],
  transition: 'background 0.1s ease',

  '&:hover': {
    background: floowColors.grey[50],
  },

  '& svg': {
    width: '14px',
    height: '14px',
    color: floowColors.grey[500],
    flexShrink: 0,
  },
}));

export const RowActions = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '2px',
  padding: '0 6px',
  height: '36px',
}));

export const ActionBtn = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '26px',
  height: '26px',
  borderRadius: '4px',
  cursor: 'pointer',
  color: floowColors.grey[400],
  transition: 'all 0.15s ease',
  flexShrink: 0,

  '& svg': {
    width: '14px',
    height: '14px',
  },

  '&:hover': {
    background: floowColors.grey[100],
    color: floowColors.grey[700],
  },
}));

export const DeleteBtn = styled(ActionBtn)(() => ({
  '&:hover': {
    background: floowColors.error.bgLight,
    color: floowColors.error.main,
  },
}));

export const EmptyState = styled('td')(() => ({
  padding: '40px 20px',
  textAlign: 'center',
  color: floowColors.grey[400],
  fontSize: '13px',
  fontFamily: 'Manrope, sans-serif',
}));

export const SavingDot = styled(Box)(() => ({
  position: 'absolute',
  top: '4px',
  right: '4px',
  width: '5px',
  height: '5px',
  borderRadius: '50%',
  background: floowColors.blue.main,
  opacity: 0.7,
}));
