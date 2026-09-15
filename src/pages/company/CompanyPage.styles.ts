import { Box, styled } from '@mui/material';
import { rem } from '../../components/UI/Typography/utility';

export const PageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100%',
  width: '100%',
  backgroundColor: theme.palette.colors?.grey_50 || theme.palette.background.default,
  padding: rem(40),
  boxSizing: 'border-box',
  [theme.breakpoints.down('xl')]: {
    padding: rem(32),
  },
  [theme.breakpoints.down('lg')]: {
    padding: rem(24),
  },
  [theme.breakpoints.down('sm')]: {
    padding: rem(16),
  },
}));

export const DashboardGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(12, 1fr)',
  gap: rem(24),
  width: '100%',
  boxSizing: 'border-box',
  [theme.breakpoints.down('xl')]: {
    gap: rem(20),
  },
}));

interface GridItemProps {
  lgSpan: number;
  mdSpan?: number;
  smSpan?: number;
}

export const GridItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'lgSpan' && prop !== 'mdSpan' && prop !== 'smSpan',
})<GridItemProps>(({ theme, lgSpan, mdSpan = 6, smSpan = 12 }) => ({
  gridColumn: `span ${lgSpan}`,
  [theme.breakpoints.down('xl')]: {
    gridColumn: `span ${mdSpan}`,
  },
  [theme.breakpoints.down('md')]: {
    gridColumn: `span ${smSpan}`,
  },
}));
