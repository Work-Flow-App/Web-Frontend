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

export const EditorWrapper = styled(Box)(({ theme }) => ({
  border: `${rem(1)} solid ${theme.palette.border?.main || theme.palette.colors.grey_300}`,
  borderRadius: rem(8),
  backgroundColor: theme.palette.colors.white,
  overflow: 'hidden',
  transition: 'border-color 0.2s ease',
  '&:hover': {
    borderColor: theme.palette.colors.grey_400,
  },
  '&:focus-within': {
    borderColor: theme.palette.colors.black,
  },
  '& .tiptap': {
    outline: 'none',
    padding: rem(12),
    minHeight: rem(140),
    maxHeight: rem(360),
    overflowY: 'auto',
    fontSize: rem(14),
    fontWeight: 400,
    lineHeight: rem(22),
    color: theme.palette.colors.grey_900,
    fontFamily: theme.typography.fontFamily,
    [theme.breakpoints.down('sm')]: {
      padding: rem(10),
      minHeight: rem(110),
      fontSize: rem(13),
      lineHeight: rem(20),
    },
    '& p': {
      margin: 0,
      '& + p': {
        marginTop: rem(6),
      },
    },
    '& em, & i': {
      fontStyle: 'italic !important',
    },
    '& u': {
      textDecoration: 'underline',
    },
    '& h1': {
      fontSize: rem(22),
      fontWeight: 700,
      lineHeight: rem(28),
      margin: `${rem(12)} 0 ${rem(6)} 0`,
      color: theme.palette.colors.grey_900,
      [theme.breakpoints.down('sm')]: {
        fontSize: rem(18),
        lineHeight: rem(24),
      },
    },
    '& h2': {
      fontSize: rem(18),
      fontWeight: 600,
      lineHeight: rem(24),
      margin: `${rem(10)} 0 ${rem(4)} 0`,
      color: theme.palette.colors.grey_900,
      [theme.breakpoints.down('sm')]: {
        fontSize: rem(16),
        lineHeight: rem(22),
      },
    },
    '& h3': {
      fontSize: rem(16),
      fontWeight: 600,
      lineHeight: rem(22),
      margin: `${rem(8)} 0 ${rem(4)} 0`,
      color: theme.palette.colors.grey_900,
    },
    '& ul, & ol': {
      paddingLeft: rem(20),
      margin: `${rem(6)} 0`,
      '& li': {
        marginBottom: rem(3),
      },
    },
    '& blockquote': {
      borderLeft: `${rem(3)} solid ${theme.palette.colors.grey_300}`,
      paddingLeft: rem(12),
      marginLeft: 0,
      marginRight: 0,
      marginTop: rem(6),
      marginBottom: rem(6),
      fontStyle: 'italic',
      color: theme.palette.colors.grey_600,
    },
    '& mark': {
      backgroundColor: '#fef08a',
      borderRadius: rem(2),
      padding: `${rem(1)} ${rem(3)}`,
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

export const Toolbar = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: rem(4),
  padding: rem(6),
  borderBottom: `${rem(1)} solid ${theme.palette.border?.main || theme.palette.colors.grey_200}`,
  backgroundColor: theme.palette.colors.grey_50,
  [theme.breakpoints.down('sm')]: {
    padding: rem(4),
    gap: rem(2),
  },
}));

export const ToolbarGroup = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(2),
}));

export const ToolbarButton = styled('button')<{ isActive?: boolean }>(({ theme, isActive }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: rem(30),
  height: rem(30),
  border: 'none',
  borderRadius: rem(4),
  backgroundColor: isActive ? theme.palette.colors.grey_200 : 'transparent',
  color: isActive ? theme.palette.colors.black : theme.palette.colors.grey_700,
  cursor: 'pointer',
  padding: 0,
  transition: 'background-color 0.15s ease, color 0.15s ease, opacity 0.15s ease',
  '&:hover': {
    backgroundColor: isActive ? theme.palette.colors.grey_300 : theme.palette.colors.grey_100,
  },
  '&:disabled': {
    opacity: 0.35,
    cursor: 'not-allowed',
    backgroundColor: 'transparent',
  },
  '& svg': {
    fontSize: rem(18),
  },
  [theme.breakpoints.down('sm')]: {
    width: rem(28),
    height: rem(28),
    '& svg': {
      fontSize: rem(16),
    },
  },
}));

export const HeadingSelect = styled('select')(({ theme }) => ({
  height: rem(30),
  padding: `0 ${rem(6)}`,
  border: `${rem(1)} solid ${theme.palette.colors.grey_300}`,
  borderRadius: rem(4),
  backgroundColor: theme.palette.colors.white,
  color: theme.palette.colors.grey_800,
  fontSize: rem(12),
  fontWeight: 600,
  fontFamily: 'inherit',
  cursor: 'pointer',
  outline: 'none',
  '&:hover': {
    borderColor: theme.palette.colors.grey_400,
  },
  [theme.breakpoints.down('sm')]: {
    height: rem(28),
    fontSize: rem(11),
    padding: `0 ${rem(4)}`,
  },
}));

export const ColorControlWrapper = styled('label')<{ isActive?: boolean; $disabled?: boolean }>(
  ({ theme, isActive, $disabled }) => ({
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: rem(30),
    height: rem(30),
    borderRadius: rem(4),
    backgroundColor: isActive ? theme.palette.colors.grey_200 : 'transparent',
    cursor: $disabled ? 'not-allowed' : 'pointer',
    position: 'relative',
    padding: `${rem(2)} 0`,
    opacity: $disabled ? 0.35 : 1,
    transition: 'background-color 0.15s ease, opacity 0.15s ease',
    '&:hover': {
      backgroundColor: $disabled
        ? 'transparent'
        : isActive
        ? theme.palette.colors.grey_300
        : theme.palette.colors.grey_100,
    },
    '& input[type="color"]': {
      position: 'absolute',
      opacity: 0,
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      cursor: $disabled ? 'not-allowed' : 'pointer',
      pointerEvents: $disabled ? 'none' : 'auto',
    },
    '& svg': {
      fontSize: rem(16),
      color: isActive ? theme.palette.colors.black : theme.palette.colors.grey_700,
    },
    [theme.breakpoints.down('sm')]: {
      width: rem(28),
      height: rem(28),
      '& svg': {
        fontSize: rem(14),
      },
    },
  })
);

export const ColorLine = styled('span')<{ $color?: string }>(({ $color }) => ({
  width: rem(16),
  height: rem(3),
  borderRadius: rem(1),
  backgroundColor: $color || '#000000',
  marginTop: rem(1),
  transition: 'background-color 0.2s ease',
}));

export const Divider = styled('div')(({ theme }) => ({
  width: rem(1),
  height: rem(18),
  alignSelf: 'center',
  backgroundColor: theme.palette.colors.grey_300,
  margin: `0 ${rem(3)}`,
  [theme.breakpoints.down('sm')]: {
    margin: `0 ${rem(1)}`,
  },
}));

export const ErrorWrapper = styled(Box)(({ theme }) => ({
  textAlign: 'left',
  fontSize: rem(12),
  color: theme.palette.error.main,
  marginTop: rem(4),
}));
