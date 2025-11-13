import { styled, Box } from '@mui/material';
import { rem } from '../Typography/utility';

export const DropdownContainer = styled(Box)(() => ({
  position: 'relative',
  display: 'inline-block',
}));

export const DropdownContent = styled(Box)<{ open?: boolean; position?: string }>(
  ({ open, position = 'bottom-right' }) => {
    const positions = {
      'bottom-right': {
        top: 'calc(100% + 8px)',
        right: 0,
      },
      'bottom-left': {
        top: 'calc(100% + 8px)',
        left: 0,
      },
      'top-right': {
        bottom: 'calc(100% + 8px)',
        right: 0,
      },
      'top-left': {
        bottom: 'calc(100% + 8px)',
        left: 0,
      },
    };

    return {
      position: 'absolute',
      zIndex: 1000,
      opacity: open ? 1 : 0,
      visibility: open ? 'visible' : 'hidden',
      transform: open ? 'translateY(0)' : 'translateY(-10px)',
      transition: 'opacity 0.2s ease, transform 0.2s ease, visibility 0.2s',
      ...positions[position as keyof typeof positions],
    };
  }
);

export const Backdrop = styled(Box)<{ open?: boolean }>(({ open }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 999,
  display: open ? 'block' : 'none',
}));
