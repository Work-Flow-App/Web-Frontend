import { Box, Typography, styled } from '@mui/material';
import { rem } from '../../../../../../components/UI/Typography/utility';

export const FormWrapper = styled('form')(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(20),
  width: '100%',
}));

export const ComposerIdentityRow = styled(Box)(() => ({
  display: 'flex',
  gap: rem(12),
  alignItems: 'flex-start',
}));

export const ComposerAvatar = styled(Box)(({ theme }) => ({
  width: rem(42),
  height: rem(42),
  minWidth: rem(42),
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontSize: rem(14),
  fontWeight: 700,
}));

export const ComposerName = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: rem(14.5),
  color: theme.palette.colors?.grey_900 || theme.palette.text.primary,
  marginBottom: rem(5),
}));

export const AudiencePill = styled('button')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: rem(6),
  border: `1px solid ${theme.palette.colors?.grey_200 || theme.palette.grey[200]}`,
  backgroundColor: theme.palette.colors?.grey_50 || theme.palette.background.default,
  borderRadius: rem(16),
  padding: `${rem(5)} ${rem(10)}`,
  fontSize: rem(12.5),
  fontWeight: 600,
  color: theme.palette.colors?.grey_700 || theme.palette.text.primary,
  cursor: 'pointer',
  '& svg': {
    fontSize: rem(14),
  },
  '&:hover': {
    backgroundColor: theme.palette.colors?.grey_100 || theme.palette.grey[100],
  },
}));

export const AudienceOptionItem = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: rem(10),
  padding: rem(4),
  maxWidth: rem(280),
  '& svg': {
    marginTop: rem(2),
    flexShrink: 0,
  },
}));

export const AudienceOptionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: rem(13.5),
  color: theme.palette.colors?.grey_900 || theme.palette.text.primary,
}));

export const AudienceOptionDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.colors?.grey_500 || theme.palette.text.secondary,
  fontSize: rem(12),
  marginTop: rem(2),
  lineHeight: 1.35,
  whiteSpace: 'normal',
}));

export const AttachmentSection = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: rem(10),
}));

export const AttachmentSectionLabel = styled(Typography)(({ theme }) => ({
  fontSize: rem(13),
  fontWeight: 600,
  color: theme.palette.colors?.grey_700 || theme.palette.text.primary,
}));

export const AttachmentList = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(6),
  width: '100%',
}));

export const AttachmentItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: rem(8),
  padding: `${rem(8)} ${rem(12)}`,
  borderRadius: rem(8),
  border: `1px solid ${theme.palette.colors?.grey_200 || theme.palette.grey[200]}`,
  backgroundColor: theme.palette.colors?.grey_50 || theme.palette.background.default,
  fontSize: rem(13),
  color: theme.palette.colors?.grey_700 || theme.palette.text.primary,
}));
