import { styled } from '@mui/material/styles';
import { Box, Typography, ButtonBase } from '@mui/material';

export const ModalFormContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
  padding: '0.25rem 0',
}));

export const ModalFormRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '1rem',
  
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

export const TimePickerWrapper = styled(Box)(() => ({
  width: '100%',
}));

// Custom Toolbar Styled Components
export const ToolbarContainer = styled(Box)(() => ({
  backgroundColor: '#101a32',
  padding: '1.25rem 1.5rem 1rem',
  width: '100%',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  minHeight: '7.5rem',
  '@media (max-width: 30rem)': {
    padding: '1rem 1.25rem 0.75rem',
    gap: '0.5rem',
    minHeight: '6.5rem',
  },
  '@media (max-width: 22.5rem)': {
    padding: '0.875rem 1rem 0.625rem',
    gap: '0.375rem',
    minHeight: '6rem',
  },
}));

export const ToolbarTopRow = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
}));

export const SelectTimeTitle = styled(Typography)(() => ({
  color: 'rgba(255, 255, 255, 0.7)',
  fontSize: '0.7rem',
  letterSpacing: '0.09375rem',
  fontWeight: 600,
  textTransform: 'uppercase',
}));

export const FormatToggleGroup = styled(Box)(() => ({
  display: 'inline-flex',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '1.25rem',
  padding: '0.125rem',
  border: '0.0625rem solid rgba(255, 255, 255, 0.15)',
}));

export const FormatToggleButton = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ active }) => ({
  borderRadius: '1rem',
  padding: '0.25rem 0.75rem',
  fontSize: '0.75rem',
  fontWeight: active ? 700 : 500,
  color: active ? '#101a32' : 'rgba(255, 255, 255, 0.7)',
  backgroundColor: active ? '#FFFFFF' : 'transparent',
  boxShadow: active ? '0 0 0.75rem rgba(255, 255, 255, 0.3)' : 'none',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    color: active ? '#101a32' : '#FFFFFF',
    backgroundColor: active ? '#FFFFFF' : 'rgba(255, 255, 255, 0.08)',
  },
}));

export const ToolbarTimeRow = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
}));

export const HourMinuteDisplay = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
}));

export const TimeDigitText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected?: boolean }>(({ selected }) => ({
  color: selected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)',
  backgroundColor: selected ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
  fontSize: '3rem',
  fontWeight: selected ? 400 : 300,
  lineHeight: 1,
  padding: '0.25rem 0.375rem',
  borderRadius: '0.5rem',
  minWidth: '3.75rem',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    color: '#FFFFFF',
  },
  '@media (max-width: 30rem)': {
    fontSize: '2.25rem',
    minWidth: '3rem',
  },
  '@media (max-width: 22.5rem)': {
    fontSize: '2rem',
    minWidth: '2.75rem',
  },
}));

export const TimeSeparatorText = styled(Typography)(() => ({
  fontSize: '3rem',
  color: 'rgba(255, 255, 255, 0.5)',
  fontWeight: 300,
  lineHeight: 1,
  margin: '0 0.25rem',
  alignSelf: 'center',
  '@media (max-width: 30rem)': {
    fontSize: '2.25rem',
  },
  '@media (max-width: 22.5rem)': {
    fontSize: '2rem',
  },
}));

export const AmPmOr24HWrapper = styled(Box)(() => ({
  marginLeft: 'auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '0.25rem',
}));

export const AmPmButton = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected?: boolean }>(({ selected }) => ({
  fontSize: '0.875rem',
  fontWeight: selected ? 600 : 500,
  color: selected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)',
  backgroundColor: selected ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
  padding: '0.25rem 0.5rem',
  borderRadius: '0.25rem',
  transition: 'background-color 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: selected ? 'rgba(255, 255, 255, 0.22)' : 'rgba(255, 255, 255, 0.08)',
    color: '#FFFFFF',
  },
}));

export const Label24H = styled(Typography)(() => ({
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'rgba(255, 255, 255, 0.7)',
  padding: '0.25rem 0.5rem',
  letterSpacing: '0.0625rem',
}));

export const timePickerDialogSx = {
  zIndex: 9000,
  '& .MuiDialog-paper': {
    borderRadius: '1rem',
    overflow: 'hidden',
    boxShadow: '0 1.5rem 3rem rgba(0, 0, 0, 0.16)',
    width: '100%',
    maxWidth: 'min(28rem, calc(100vw - 2rem))',
    margin: '1rem',
  },
  '& .MuiPickersLayout-root': {
    display: 'flex !important',
    flexDirection: 'column !important',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    maxWidth: '100%',
    width: '100%',
  },
  '& .MuiPickersToolbar-root': {
    width: '100% !important',
    maxWidth: '100% !important',
    boxSizing: 'border-box',
    gridColumn: '1 / -1',
    gridRow: 'auto',
    padding: 0,
  },
  '& .MuiPickersLayout-contentWrapper': {
    display: 'flex !important',
    flexDirection: 'column !important',
    alignItems: 'center !important',
    justifyContent: 'center !important',
    overflow: 'hidden',
    maxWidth: '100%',
    width: '100%',
    margin: '0 auto',
  },
  '& .MuiClock-root, & .MuiTimeClock-root': {
    margin: '1.5rem auto',
    maxWidth: '100%',
    overflow: 'hidden',
  },
  '& .MuiClock-clock': {
    backgroundColor: '#F5F5F5',
  },
  '& .MuiClockPointer-root': {
    backgroundColor: '#101a32',
  },
  '& .MuiClockPointer-thumb': {
    backgroundColor: '#101a32',
    borderColor: '#101a32',
  },
  '& .MuiClock-pin': {
    backgroundColor: '#101a32',
  },
  '& .MuiClockNumber-root': {
    color: '#404040',
    fontWeight: 500,
    fontSize: '0.875rem',
    '&.Mui-selected': {
      color: '#FFFFFF',
      backgroundColor: '#101a32',
    },
  },
  '& .MuiPickersArrowSwitcher-root': {
    paddingRight: '0.5rem',
    '& .MuiIconButton-root': {
      color: '#525252',
    },
  },
  '& .MuiDialogActions-root': {
    padding: '0.75rem 1.5rem 1rem',
    '& .MuiButton-root': {
      fontWeight: 600,
      fontSize: '0.875rem',
      letterSpacing: '0.03125rem',
      textTransform: 'none',
      borderRadius: '0.5rem',
      padding: '0.375rem 1rem',
    },
    '& .MuiButton-root:first-of-type': {
      color: '#737373',
    },
    '& .MuiButton-root:last-of-type': {
      color: '#101a32',
    },
  },
  '@media (max-width: 30rem)': {
    '& .MuiDialog-paper': {
      maxWidth: 'calc(100vw - 2rem)',
    },
    '& .MuiPickersLayout-contentWrapper': {
      minHeight: 'auto',
    },
    '& .MuiClock-root, & .MuiTimeClock-root': {
      width: '100%',
      maxWidth: '17.5rem',
      margin: '0 auto',
    },
    '& .MuiPickersArrowSwitcher-root': {
      paddingRight: '0',
      transform: 'translateX(1.5rem)',
    },
  },
  '@media (max-width: 22.5rem)': {
    '& .MuiClock-root, & .MuiTimeClock-root': {
      margin: '0.5rem auto',
      width: '13rem',
      height: '13rem',
    },
    '& .MuiClock-clock': {
      width: '13rem',
      height: '13rem',
    },
  },
};
