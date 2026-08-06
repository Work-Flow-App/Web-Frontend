import { Box, Tabs, Tab, styled } from '@mui/material';
import { rem } from '../../components/UI/Typography/utility';

export const TabsWrapper = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.colors?.grey_100 || theme.palette.divider}`,
  marginBottom: rem(20),
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

interface TabPanelProps {
  active: boolean;
}

// Keeps both tabs mounted (so switching tabs doesn't lose fetched data) while only showing one
export const TabPanel = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<TabPanelProps>(({ active }) => ({
  display: active ? 'block' : 'none',
}));
