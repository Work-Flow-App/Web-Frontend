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
  alignItems: 'center',
  gap: rem(12),
}));

export const Avatar = styled(Box)(({ theme }) => ({
  width: rem(44),
  height: rem(44),
  minWidth: rem(44),
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontSize: rem(15),
  fontWeight: 700,
}));

export const AuthorBlock = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(2),
  minWidth: 0,
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

export const PostContent = styled(Typography)(({ theme }) => ({
  fontSize: rem(14),
  color: theme.palette.colors?.grey_900 || theme.palette.text.primary,
  whiteSpace: 'pre-wrap',
  lineHeight: 1.6,
}));
