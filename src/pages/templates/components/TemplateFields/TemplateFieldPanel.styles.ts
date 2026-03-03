import { styled, Box } from '@mui/material';
import { floowColors } from '../../../../theme/colors';

export const LayoutContainer = styled(Box)(() => ({
  position: 'relative',
  width: '100%',
}));

interface RightPanelProps {
  open?: boolean;
}

export const RightPanel = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'open',
})<RightPanelProps>(({ open }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  width: '360px',
  background: floowColors.white,
  border: `1px solid ${floowColors.grey[200]}`,
  borderRadius: '8px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 10,
  transform: open ? 'translateX(0)' : 'translateX(calc(100% + 24px))',
  transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  maxHeight: 'calc(100vh - 220px)',
  overflowY: 'auto',

  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-track': {
    background: floowColors.grey[50],
  },
  '&::-webkit-scrollbar-thumb': {
    background: floowColors.grey[300],
    borderRadius: '2px',
  },
}));

export const PanelHeader = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '14px 16px',
  borderBottom: `1px solid ${floowColors.grey[100]}`,
  background: floowColors.grey[50],
  borderRadius: '8px 8px 0 0',
  position: 'sticky',
  top: 0,
  zIndex: 2,
  flexShrink: 0,
}));

export const PanelTitle = styled(Box)(() => ({
  fontSize: '13px',
  fontWeight: 700,
  fontFamily: 'Manrope, sans-serif',
  color: floowColors.grey[900],
  letterSpacing: '0.01em',
}));

export const CloseBtn = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '26px',
  height: '26px',
  borderRadius: '50%',
  cursor: 'pointer',
  color: floowColors.grey[400],
  transition: 'all 0.15s ease',
  flexShrink: 0,

  '& svg': {
    width: '14px',
    height: '14px',
  },

  '&:hover': {
    background: floowColors.grey[200],
    color: floowColors.grey[800],
  },
}));

export const FormGrid = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '14px',
  padding: '16px',
  flex: 1,
}));

export const FormFullWidth = styled(Box)(() => ({
  gridColumn: '1 / -1',
}));

export const FormFieldWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
}));

export const FieldInputLabel = styled(Box)(() => ({
  fontSize: '11px',
  fontWeight: 700,
  fontFamily: 'Manrope, sans-serif',
  color: floowColors.grey[600],
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
}));

export const Required = styled('span')(() => ({
  color: floowColors.error.main,
}));

export const Divider = styled(Box)(() => ({
  gridColumn: '1 / -1',
  height: '1px',
  background: floowColors.grey[100],
  margin: '2px 0',
}));

export const SectionLabel = styled(Box)(() => ({
  gridColumn: '1 / -1',
  fontSize: '11px',
  fontWeight: 700,
  fontFamily: 'Manrope, sans-serif',
  color: floowColors.grey[500],
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
}));

export const RadioRow = styled(Box)(() => ({
  gridColumn: '1 / -1',
  display: 'flex',
  gap: '8px',
}));

interface RadioOptionProps {
  selected?: boolean;
}

export const RadioOption = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<RadioOptionProps>(({ selected }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '7px',
  padding: '8px 16px',
  borderRadius: '6px',
  border: `1.5px solid ${selected ? floowColors.grey[900] : floowColors.grey[200]}`,
  cursor: 'pointer',
  background: selected ? floowColors.grey[900] : floowColors.white,
  color: selected ? floowColors.white : floowColors.grey[600],
  fontSize: '12px',
  fontWeight: 600,
  fontFamily: 'Manrope, sans-serif',
  transition: 'all 0.15s ease',
  userSelect: 'none',

  '&:hover': {
    borderColor: floowColors.grey[700],
    background: selected ? floowColors.grey[800] : floowColors.grey[50],
  },
}));

interface RadioDotProps {
  selected?: boolean;
}

export const RadioDot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<RadioDotProps>(({ selected }) => ({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  border: `1.5px solid ${selected ? floowColors.white : floowColors.grey[400]}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,

  '&::after': {
    content: '""',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    background: selected ? floowColors.white : 'transparent',
  },
}));

export const PanelFooter = styled(Box)(() => ({
  display: 'flex',
  gap: '8px',
  justifyContent: 'flex-end',
  padding: '12px 16px',
  borderTop: `1px solid ${floowColors.grey[100]}`,
  background: floowColors.grey[50],
  borderRadius: '0 0 8px 8px',
  position: 'sticky',
  bottom: 0,
  zIndex: 2,
  flexShrink: 0,
}));

export const PanelLoadingState = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 16px',
  color: floowColors.grey[400],
  fontSize: '13px',
  fontFamily: 'Manrope, sans-serif',
}));
