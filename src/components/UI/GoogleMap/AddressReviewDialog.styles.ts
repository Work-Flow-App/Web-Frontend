import { styled } from '@mui/material/styles';
import { Box, Typography, OutlinedInput, Dialog } from '@mui/material';
import { rem } from '../Typography/utility';
import { floowColors } from '../../../theme/colors';

// GoogleMap (and this dialog with it) is often rendered inside the app's own GlobalModal
// wizard (e.g. the Add Job Wizard's location step), which uses a hardcoded z-index of
// 8000 (GlobalModal.styled.tsx) — far above MUI's default theme.zIndex.modal (1300).
// Without this, the dialog opens but renders behind the wizard's own overlay:
// technically visible in the DOM, invisible on screen. 9000 matches this codebase's
// existing "above GlobalModal" convention (see Dropdown's CustomPopper and the
// MobileTimePicker overrides) rather than picking a new number — a job template can mix
// a Dropdown field and an Address field on the same wizard screen, so staying on the
// shared convention avoids a second, narrower stacking collision between the two.
//
// Paper styling matches GlobalModal's own container (ModalContainerWrapper) — rounded
// corners, divider border, matching shadow — so this reads as the same modal family,
// not a one-off; below `sm` it becomes a bottom sheet instead of a centered dialog,
// same breakpoint GlobalModal itself switches on.
export const StyledDialog = styled(Dialog)(({ theme }) => ({
  zIndex: 9000,
  '& .MuiDialog-paper': {
    borderRadius: rem(16),
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: `0px 5px 55px ${floowColors.shadow.md}`,
    overflow: 'hidden',

    [theme.breakpoints.down('sm')]: {
      position: 'fixed',
      bottom: 0,
      margin: 0,
      width: '100%',
      maxWidth: '100%',
      borderRadius: `${rem(16)} ${rem(16)} 0 0`,
    },
  },
}));

export const ReviewFieldsGrid = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(16),
});

export const ReviewFieldLabel = styled(Typography)(({ theme }) => ({
  fontSize: rem(13),
  fontWeight: 600,
  color: theme.palette.text.primary,
  marginBottom: rem(6),
}));

export const ReviewFieldInput = styled(OutlinedInput)(({ theme }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: rem(8),
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
}));
