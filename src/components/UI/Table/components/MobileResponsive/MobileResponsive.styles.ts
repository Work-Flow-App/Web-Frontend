import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { rem } from '../../../Typography/utility';

export const CardContainer = styled(Box)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  const highlightColor = isDark ? 'rgba(33, 150, 243, 0.08)' : 'rgba(33, 150, 243, 0.03)';
  const highlightHoverColor = isDark ? 'rgba(33, 150, 243, 0.12)' : 'rgba(33, 150, 243, 0.06)';

  return {
    background: isDark ? theme.palette.background.paper : theme.palette.colors.white,
    border: `1.5px solid ${isDark ? theme.palette.colors.grey_200 : theme.palette.colors.grey_100}`,
    borderRadius: rem(16),
    padding: rem(20),
    marginBottom: rem(16),
    display: 'flex',
    flexDirection: 'column',
    gap: rem(16),
    boxShadow: 'none',
    transition: 'all 0.2s ease',
    position: 'relative',
    '&.highlighted-row': {
      background: highlightColor,
      borderColor: theme.palette.primary.main || '#2196f3',
    },
    '&:hover': {
      borderColor: isDark ? theme.palette.colors.grey_300 : theme.palette.colors.grey_200,
      '&.highlighted-row': {
        background: highlightHoverColor,
        borderColor: theme.palette.primary.main || '#2196f3',
      },
    },
  };
});

export const CardHeader = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
}));

export const HeaderLeft = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
}));

export const HeaderRight = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
}));

export const ActionsWrapper = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
  marginLeft: 'auto',
}));

export const CardTitle = styled(Typography)(({ theme }) => ({
  fontSize: rem(16),
  fontWeight: 700,
  color: theme.palette.colors.black,
  fontFamily: 'Manrope, sans-serif',
}));

export const FieldsContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(10),
  width: '100%',
}));

export const FieldRow = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  width: '100%',
  position: 'relative',
}));

export const FieldLabel = styled(Typography)(({ theme }) => ({
  flex: `0 0 ${rem(120)}`,
  fontSize: rem(14),
  fontWeight: 500,
  color: theme.palette.colors.grey_600,
  fontFamily: 'Manrope, sans-serif',
}));

export const FieldValueContainer = styled(Box)(() => ({
  flex: '1 1 auto',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

export const FieldValue = styled(Box)(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: 400,
  color: theme.palette.colors.grey_800,
  fontFamily: 'Manrope, sans-serif',
}));

export const FieldRightValue = styled(Box)(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: 400,
  color: theme.palette.colors.grey_800,
  fontFamily: 'Manrope, sans-serif',
  marginLeft: 'auto',
}));

export const CardFooter = styled(Box)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    borderTop: `1px solid ${isDark ? theme.palette.colors.grey_200 : theme.palette.colors.grey_100}`,
    paddingTop: rem(16),
    marginTop: rem(4),
    gap: rem(16),
  };
});

export const UserSelector = styled(Box)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    display: 'flex',
    alignItems: 'center',
    gap: rem(8),
    border: `1px solid ${isDark ? theme.palette.colors.grey_300 : theme.palette.colors.grey_200}`,
    borderRadius: rem(24),
    padding: `${rem(4)} ${rem(12)}`,
    background: isDark ? theme.palette.colors.grey_50 : theme.palette.colors.white,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    userSelect: 'none',
    '&:hover': {
      background: isDark ? theme.palette.colors.grey_100 : theme.palette.colors.grey_50,
      borderColor: isDark ? theme.palette.colors.grey_400 : theme.palette.colors.grey_300,
    },
  };
});

export const SelectorAvatar = styled(Box)(({ theme }) => ({
  width: rem(24),
  height: rem(24),
  borderRadius: '50%',
  background: theme.palette.colors.grey_100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: rem(10),
  fontWeight: 600,
  color: theme.palette.colors.grey_600,
  fontFamily: 'Manrope, sans-serif',
  textTransform: 'uppercase',
  overflow: 'hidden',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
}));

export const SelectorName = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  fontWeight: 500,
  color: theme.palette.colors.grey_800,
  fontFamily: 'Manrope, sans-serif',
}));

export const ViewButton = styled(Box)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: isDark ? theme.palette.colors.white : theme.palette.colors.black,
    color: isDark ? theme.palette.colors.black : theme.palette.colors.white,
    borderRadius: rem(8),
    padding: `${rem(8)} ${rem(24)}`,
    cursor: 'pointer',
    fontSize: rem(14),
    fontWeight: 600,
    fontFamily: 'Manrope, sans-serif',
    transition: 'background 0.2s ease',
    userSelect: 'none',
    width: rem(120),
    textAlign: 'center',
    boxSizing: 'border-box',
    '&:hover': {
      background: isDark ? theme.palette.colors.grey_100 : '#1a1a1a',
    },
    '&:active': {
      background: isDark ? theme.palette.colors.grey_200 : '#000000',
    },
  };
});
