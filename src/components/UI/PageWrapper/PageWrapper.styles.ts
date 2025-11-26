import { styled, Box } from '@mui/material';
import { rem } from '../Typography/utility';

interface PageContainerProps {
  maxWidth?: string | number;
}

export const PageContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'maxWidth',
})<PageContainerProps>(({ theme: { spacing }, maxWidth }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: maxWidth || '100%',
  margin: '0 auto',
  padding: spacing(3),
}));

export const PageHeader = styled(Box)(({ theme: { spacing, palette } }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: spacing(2.5),
  gap: spacing(1.5),
  background: palette.colors?.white || palette.background.paper || '#FFFFFF',
  borderRadius: '8px 8px 0px 0px',
  width: '100%',
}));

export const HeaderContent = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 0,
  gap: rem(12),
  width: '100%',
  flex: 'none',
  order: 0,
  alignSelf: 'stretch',
  flexGrow: 0,
}));

export const HeaderLeft = styled(Box)(({ theme: { spacing } }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: 0,
  margin: '0 auto',
  gap: spacing(1),
  flex: 'none',
  order: 0,
  flexGrow: 1,
  minWidth: 0,
}));

export const HeaderRight = styled(Box)(({ theme: { spacing } }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  padding: 0,
  gap: spacing(1.5),
  margin: '0 auto',
  flex: 'none',
  order: 1,
  flexGrow: 0,
  flexShrink: 0,
}));

export const Title = styled('h1')(({ theme: { palette } }) => ({
  margin: `${rem(-2)} 0`,
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: rem(24),
  lineHeight: rem(33),
  letterSpacing: '0.005em',
  color: palette.colors?.grey_900 || '#262626',
}));

export const Description = styled('p')(({ theme: { palette } }) => ({
  margin: 0,
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  fontWeight: 500,
  fontSize: rem(16),
  lineHeight: rem(24),
  letterSpacing: '0.005em',
  color: palette.colors?.grey_400 || '#A1A1A1',
}));

export const FilterButton = styled(Box)(({ theme: { palette } }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 48,
  height: 48,
  borderRadius: 6,
  border: `1px solid ${palette.colors?.grey_100 || palette.border?.main || '#F5F5F5'}`,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  background: palette.colors?.white || palette.background.paper || '#FFFFFF',

  '&:hover': {
    borderColor: palette.colors?.grey_200 || palette.border?.dark || '#E5E5E5',
    background: palette.colors?.grey_50 || palette.background.default || '#FAFAFA',
  },

  '&:active': {
    transform: 'scale(0.98)',
  },
}));

export const PageContent = styled(Box)(({ theme: { palette } }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  background: palette.colors?.white || palette.background.paper || '#FFFFFF',
  borderRadius: '0px 0px 8px 8px',
  minHeight: 200,
}));
