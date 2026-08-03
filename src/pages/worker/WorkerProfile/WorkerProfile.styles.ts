import { Box, Typography, Tabs, Tab, styled } from '@mui/material';
import { rem } from '../../../components/UI/Typography/utility';

export const PageContent = styled(Box)(() => ({
  maxWidth: rem(1200),
  width: '100%',
  margin: '0 auto',
  padding: `${rem(28)} ${rem(32)} ${rem(60)}`,
  display: 'flex',
  flexDirection: 'column',
  gap: rem(20),
  '@media (max-width: 900px)': {
    padding: `${rem(20)} ${rem(16)} ${rem(40)}`,
  },
}));

export const LoadingContainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: rem(300),
}));

export const ProfileHeaderCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.colors?.white || theme.palette.background.paper,
  border: `1px solid ${theme.palette.colors?.grey_200 || theme.palette.grey[200]}`,
  borderRadius: rem(14),
  overflow: 'hidden',
}));

export const HeaderRow = styled(Box)(() => ({
  display: 'flex',
  gap: rem(20),
  alignItems: 'flex-start',
  padding: `${rem(24)} ${rem(28)} ${rem(20)}`,
  '@media (max-width: 640px)': {
    flexWrap: 'wrap',
  },
}));

export const HeaderTop = styled(Box)(() => ({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: rem(16),
  flexWrap: 'wrap',
}));

export const IdBlock = styled(Box)(() => ({
  minWidth: 0,
}));

export const HeaderTitle = styled(Typography)(({ theme }) => ({
  fontSize: rem(26),
  fontWeight: 700,
  margin: `0 0 ${rem(6)}`,
  color: theme.palette.colors?.grey_900 || theme.palette.text.primary,
}));

export const HeaderMetaRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: rem(6),
  color: theme.palette.colors?.grey_400 || theme.palette.text.secondary,
  fontSize: rem(13.5),
  '& a': {
    color: theme.palette.colors?.grey_500 || theme.palette.text.secondary,
    fontWeight: 500,
    textDecoration: 'none',
    '&:hover': {
      color: theme.palette.success?.main,
      textDecoration: 'underline',
    },
  },
}));

export const HeaderMetaDot = styled('span')(({ theme }) => ({
  color: theme.palette.colors?.grey_200 || theme.palette.grey[300],
}));

export const HeaderActionsRow = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(10),
  flex: 'none',
}));

export const TabsWrapper = styled(Box)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.colors?.grey_100 || theme.palette.divider}`,
  padding: `0 ${rem(28)}`,
}));

export const StyledTabs = styled(Tabs)(({ theme }) => ({
  minHeight: rem(44),
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.success.main,
    height: rem(3),
    borderRadius: `${rem(3)} ${rem(3)} 0 0`,
  },
}));

export const StyledTab = styled(Tab)(({ theme }) => ({
  fontFamily: "'Manrope', sans-serif",
  fontWeight: 600,
  fontSize: rem(14.5),
  textTransform: 'none',
  minHeight: rem(44),
  padding: `${rem(16)} ${rem(4)}`,
  marginRight: rem(22),
  color: theme.palette.colors?.grey_400 || theme.palette.text.secondary,
  '&.Mui-selected': {
    color: theme.palette.colors?.grey_900 || theme.palette.text.primary,
  },
}));
