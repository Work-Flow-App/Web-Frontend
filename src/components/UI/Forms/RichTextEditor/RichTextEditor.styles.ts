import { Box, FormControl, styled } from '@mui/material';
import { rem } from '../../Typography/utility';

export const StyledFormControl = styled(FormControl)(() => ({
  width: '100%',
  rowGap: rem(6),
  outline: 'none',
}));

export const Label = styled('label')(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: 700,
  color: theme.palette.colors.grey_600,
  lineHeight: rem(20),
  marginBottom: rem(6),
  display: 'block',
}));

export const RequiredIndicator = styled('span')(({ theme }) => ({
  color: theme.palette.error.main,
  marginLeft: rem(2),
}));

export const Toolbar = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.75, 1),
  borderBottom: `1px solid ${theme.palette.border?.main || theme.palette.grey[300]}`,
  backgroundColor: theme.palette.colors.grey_50 || theme.palette.grey[50],
  borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
}));

export const ToolbarButton = styled('button')<{ isActive?: boolean }>(({ theme, isActive }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: rem(28),
  height: rem(28),
  border: 'none',
  borderRadius: theme.shape.borderRadius / 2,
  backgroundColor: isActive ? theme.palette.primary.main : 'transparent',
  color: isActive ? theme.palette.primary.contrastText : theme.palette.colors.grey_600,
  cursor: 'pointer',
  fontSize: rem(13),
  fontWeight: 600,
  fontFamily: 'inherit',
  transition: 'background-color 0.15s ease, color 0.15s ease',
  '&:hover': {
    backgroundColor: isActive
      ? theme.palette.primary.dark
      : theme.palette.colors.grey_100 || theme.palette.grey[100],
  },
}));

export const Divider = styled('div')(({ theme }) => ({
  width: '1px',
  height: rem(20),
  alignSelf: 'center',
  backgroundColor: theme.palette.border?.main || theme.palette.grey[300],
  margin: theme.spacing(0, 0.25),
}));

export const EditorWrapper = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.border?.main || theme.palette.grey[300]}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.colors.white,
  '&:hover': {
    borderColor: theme.palette.border?.dark || theme.palette.grey[400],
  },
  '&:focus-within': {
    borderColor: theme.palette.colors.grey_300,
  },
  '& .tiptap': {
    outline: 'none',
    padding: theme.spacing(1.5, 2),
    minHeight: rem(120),
    fontSize: rem(14),
    fontWeight: 500,
    lineHeight: rem(20),
    color: theme.palette.colors.grey_900,
    fontFamily: theme.typography.fontFamily,
    '& p': {
      margin: 0,
      '& + p': {
        marginTop: rem(4),
      },
    },
    '& ul, & ol': {
      paddingLeft: rem(20),
      margin: `${rem(4)} 0`,
    },
    '& p.is-editor-empty:first-child::before': {
      content: 'attr(data-placeholder)',
      float: 'left',
      color: theme.palette.colors.grey_400,
      pointerEvents: 'none',
      height: 0,
    },
  },
}));

export const ErrorWrapper = styled(Box)(({ theme }) => ({
  textAlign: 'left',
  fontSize: rem(12),
  color: theme.palette.error.main,
  marginTop: rem(4),
}));
