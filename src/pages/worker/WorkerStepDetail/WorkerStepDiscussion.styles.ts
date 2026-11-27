import { Box, FormControl, Select, MenuItem, styled } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { rem, Bold } from '../../../components/UI/Typography/utility';

export const HiddenFileInput = styled('input')({
  display: 'none',
});

export const DiscussionContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
}));

export const AttachmentDiscussionBox = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: rem(360),
}));

export const EditIconStyled = styled(EditIcon)(() => ({
  fontSize: rem(14),
}));

export const TypeDot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'dotColor',
})<{ dotColor: string }>(({ dotColor }) => ({
  width: rem(8),
  height: rem(8),
  minWidth: rem(8),
  borderRadius: '50%',
  backgroundColor: dotColor,
}));

export const TypeSelectFormControl = styled(FormControl)(() => ({
  minWidth: rem(140),
  flexShrink: 0,
}));

export const TypeSelectInput = styled(Select)(({ theme }) => ({
  fontSize: rem(12),
  fontWeight: Bold._600,
  borderRadius: rem(8),
  backgroundColor: theme.palette.colors.grey_50,
  '& .MuiSelect-select': {
    paddingTop: rem(6),
    paddingBottom: rem(6),
    paddingLeft: rem(10),
    paddingRight: `${rem(28)} !important`,
    display: 'flex',
    alignItems: 'center',
    gap: rem(8),
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.colors.grey_200,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.colors.grey_300,
  },
}));

export const TypeMenuItem = styled(MenuItem)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
  fontSize: rem(12),
  fontWeight: Bold._600,
  paddingTop: rem(8),
  paddingBottom: rem(8),
}));
