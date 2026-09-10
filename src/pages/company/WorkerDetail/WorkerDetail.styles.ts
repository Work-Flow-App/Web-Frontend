import { Box, Typography, styled } from '@mui/material';
import { rem, Bold } from '../../../components/UI/Typography/utility';

export const SectionTitle = styled(Typography)(() => ({
  fontWeight: Bold._600,
  marginBottom: rem(12),
}));

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

export const ProfileHeaderCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.colors?.white || theme.palette.background.paper,
  border: `1px solid ${theme.palette.colors?.grey_200 || theme.palette.grey[200]}`,
  borderRadius: rem(14),
  padding: `${rem(24)} ${rem(28)}`,
  display: 'flex',
  gap: rem(20),
  alignItems: 'flex-start',
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
  '@media (max-width: 600px)': {
    width: '100%',
  },
}));

export const HeaderTitleRow = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(10),
  marginBottom: rem(6),
}));

export const HeaderTitle = styled(Typography)(({ theme }) => ({
  fontSize: rem(26),
  fontWeight: 700,
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
  flexWrap: 'wrap',

  '@media (max-width: 600px)': {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: rem(8),
  },
}));

export const StatsRow = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: rem(16),
  '@media (max-width: 720px)': {
    gridTemplateColumns: '1fr',
  },
}));

/* ── Hourly rate card ─────────────────────────────────────────────── */

export const RateCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: rem(16),
  padding: rem(20),
  borderRadius: rem(12),
  border: `1px solid ${theme.palette.colors?.grey_200 || theme.palette.grey[200]}`,
  backgroundColor: theme.palette.background.paper,
  flexWrap: 'wrap',
}));

export const RateColsRow = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: rem(28),
  flexWrap: 'wrap',
}));

export const RateMainCol = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(4),
});

export const RateLabel = styled(Typography)(({ theme }) => ({
  fontSize: rem(13),
  fontWeight: 600,
  color: theme.palette.colors?.grey_600 || theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: rem(0.4),
}));

export const RateValue = styled(Typography, {
  shouldForwardProp: (prop) => prop !== '$empty',
})<{ $empty?: boolean }>(({ theme, $empty }) => ({
  fontSize: rem(28),
  fontWeight: 700,
  color: $empty
    ? theme.palette.colors?.grey_400 || theme.palette.text.disabled
    : theme.palette.text.primary,
  fontStyle: $empty ? 'italic' : 'normal',
  lineHeight: 1.2,
  '& span': {
    fontSize: rem(14),
    fontWeight: 500,
    color: theme.palette.colors?.grey_600 || theme.palette.text.secondary,
    marginLeft: rem(6),
  },
}));

export const RateEditRow = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
}));
