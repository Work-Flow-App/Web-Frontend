import { styled } from '@mui/material/styles';
import { Box, Button, Popover, Switch, Typography } from '@mui/material';

export const CustomiseButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  color: theme.palette.text.primary,
  borderColor: theme.palette.divider,
  borderRadius: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.text.secondary,
  },
}));

export const StyledPopover = styled(Popover)(({ theme }) => ({
  '& .MuiPaper-root': {
    padding: theme.spacing(1, 0),
    minWidth: 220,
    borderRadius: theme.spacing(1.5),
    boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.1)',
    marginTop: theme.spacing(1),
  },
}));

export const ColumnItemContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0.75, 2),
  transition: 'background-color 0.2s',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const ColumnLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  color: theme.palette.text.secondary,
  fontWeight: 500,
}));

// Custom switch styling to match the image precisely
export const ColumnSwitch = styled(Switch)(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff', // White thumb when ON
      '& + .MuiSwitch-track': {
        backgroundColor: '#3b82f6', // Blue track when ON
        opacity: 1,
        border: 0,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
    backgroundColor: '#fff', // White thumb always
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: '#E9E9EA', // Light grey track when OFF
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));
