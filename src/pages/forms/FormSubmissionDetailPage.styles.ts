import { styled, Box } from '@mui/material';
import { rem, Bold } from '../../components/UI/Typography/utility';
import { floowColors } from '../../theme/colors';

export const DetailCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: rem(16),
  border: `1px solid ${floowColors.slate.light}`,
  overflow: 'hidden',
  marginBottom: rem(16),
}));

export const CardHeader = styled(Box)(() => ({
  padding: `${rem(18)} ${rem(22)}`,
  borderBottom: `1px solid ${floowColors.slate.light}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: rem(10),
}));

export const CardBody = styled(Box)(() => ({
  padding: rem(22),
  display: 'flex',
  flexDirection: 'column',
  gap: rem(20),
}));

export const SectionTitle = styled('h3')(({ theme }) => ({
  margin: 0,
  fontSize: rem(16),
  fontWeight: Bold._700,
  color: theme.palette.text.primary,
}));

export const CountBadge = styled(Box)(({ theme }) => ({
  fontSize: rem(12),
  fontWeight: Bold._700,
  color: theme.palette.grey[600],
  backgroundColor: floowColors.grey[100],
  borderRadius: rem(20),
  padding: `${rem(2)} ${rem(9)}`,
  lineHeight: 1.5,
}));

export const MetaRow = styled(Box)(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: rem(28),
}));

export const MetaItem = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(12),
}));

interface TintProps {
  tint: string;
}

// Same colored-icon convention as the field rows below - each tile gets its own tint instead
// of one flat neutral tone, so the card reads as more than a wall of grey.
export const MetaIconBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'tint',
})<TintProps>(({ theme, tint }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: rem(36),
  height: rem(36),
  borderRadius: rem(10),
  flexShrink: 0,
  backgroundColor: theme.palette.mode === 'dark' ? `${tint}26` : `${tint}1A`,
  color: tint,
  '& svg': {
    fontSize: rem(18),
  },
}));

export const MetaText = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(3),
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
    '&.muted': {
      color: theme.palette.text.secondary,
      fontWeight: Bold._500,
      fontStyle: 'italic',
    },
  },
}));

// A distinct white panel (vs. the grey card body) so "send this to a worker" reads as a
// deliberate action zone, not just another row of meta info.
export const SendToWorkerPanel = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-end',
  gap: rem(12),
  flexWrap: 'wrap',
  padding: rem(16),
  borderRadius: rem(12),
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : floowColors.grey[100]}`,
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : floowColors.white,
}));

export const FieldsList = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(10),
}));

export const ActionsRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  paddingTop: rem(4),
  borderTop: `1px solid ${theme.palette.colors?.grey_100 || floowColors.slate.light}`,
}));
