import { styled, Box } from '@mui/material';
import { rem, Bold } from '../../components/UI/Typography/utility';
import { floowColors } from '../../theme/colors';

export const DetailCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: rem(16),
  border: `1px solid ${floowColors.slate.light}`,
  padding: rem(22),
  display: 'flex',
  flexDirection: 'column',
  gap: rem(16),
  marginBottom: rem(16),
}));

export const SectionTitle = styled('h3')(({ theme }) => ({
  margin: 0,
  fontSize: rem(15),
  fontWeight: Bold._700,
  color: theme.palette.text.primary,
}));

export const MetaRow = styled(Box)(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: rem(28),
}));

export const MetaItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(4),
  '& .label': {
    fontSize: rem(11),
    fontWeight: Bold._700,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: theme.palette.text.secondary,
  },
  '& .value': {
    fontSize: rem(14.5),
    fontWeight: Bold._600,
    color: theme.palette.text.primary,
  },
}));

export const InlineRow = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'flex-end',
  gap: rem(12),
  flexWrap: 'wrap',
}));

export const ActionsRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  paddingTop: rem(4),
  borderTop: `1px solid ${theme.palette.colors?.grey_100 || floowColors.slate.light}`,
}));
