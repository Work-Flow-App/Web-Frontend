import { Box, Typography, styled } from '@mui/material';
import { rem } from '../../../../../components/UI/Typography/utility';

export const Card = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.colors?.white || theme.palette.background.paper,
  borderRadius: rem(12),
  border: `1px solid ${theme.palette.colors?.grey_200 || theme.palette.grey[200]}`,
  padding: rem(20),
  display: 'flex',
  flexDirection: 'column',
  gap: rem(12),
}));

export const CardHeader = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: rem(12),
}));

export const AuthorBlock = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(2),
}));

export const AuthorName = styled(Typography)(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: 600,
  color: theme.palette.colors?.grey_900 || theme.palette.text.primary,
}));

export const PostDate = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  color: theme.palette.colors?.grey_500 || theme.palette.text.secondary,
}));

export const HeaderActions = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(4),
}));

export const PostContent = styled(Typography)(({ theme }) => ({
  fontSize: rem(14),
  color: theme.palette.colors?.grey_900 || theme.palette.text.primary,
  whiteSpace: 'pre-wrap',
  lineHeight: 1.6,
}));

export const AttachmentsRow = styled(Box)(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: rem(8),
}));

export const AttachmentChip = styled('a')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: rem(6),
  padding: `${rem(6)} ${rem(12)}`,
  borderRadius: rem(20),
  border: `1px solid ${theme.palette.colors?.grey_200 || theme.palette.grey[200]}`,
  backgroundColor: theme.palette.colors?.grey_50 || theme.palette.background.default,
  fontSize: rem(12),
  color: theme.palette.colors?.grey_700 || theme.palette.text.primary,
  textDecoration: 'none',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
  },
}));
