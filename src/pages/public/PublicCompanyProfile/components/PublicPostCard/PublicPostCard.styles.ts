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

export const PostContent = styled(Box)(({ theme }) => ({
  fontSize: rem(14),
  lineHeight: 1.6,
  color: theme.palette.colors?.grey_900 || theme.palette.text.primary,
  wordBreak: 'break-word',
  overflowWrap: 'anywhere',
  '& a': {
    color: theme.palette.primary.main,
    textDecoration: 'underline',
    wordBreak: 'break-all',
  },
  '& p': {
    margin: 0,
    '& + p': {
      marginTop: rem(6),
    },
  },
  '& em, & i': {
    fontStyle: 'italic !important',
  },
  '& u': {
    textDecoration: 'underline',
  },
  '& h1': {
    fontSize: rem(20),
    fontWeight: 700,
    lineHeight: rem(26),
    margin: `${rem(10)} 0 ${rem(6)} 0`,
    [theme.breakpoints.down('sm')]: {
      fontSize: rem(17),
      lineHeight: rem(22),
    },
  },
  '& h2': {
    fontSize: rem(17),
    fontWeight: 600,
    lineHeight: rem(23),
    margin: `${rem(8)} 0 ${rem(4)} 0`,
    [theme.breakpoints.down('sm')]: {
      fontSize: rem(15),
    },
  },
  '& h3': {
    fontSize: rem(15),
    fontWeight: 600,
    lineHeight: rem(21),
    margin: `${rem(6)} 0 ${rem(4)} 0`,
  },
  '& ul, & ol': {
    paddingLeft: rem(20),
    margin: `${rem(6)} 0`,
    '& li': {
      marginBottom: rem(3),
    },
  },
  '& blockquote': {
    borderLeft: `${rem(3)} solid ${theme.palette.colors?.grey_300 || theme.palette.grey[300]}`,
    paddingLeft: rem(12),
    marginLeft: 0,
    marginRight: 0,
    marginTop: rem(6),
    marginBottom: rem(6),
    fontStyle: 'italic',
    color: theme.palette.colors?.grey_600 || theme.palette.text.secondary,
  },
  '& mark': {
    backgroundColor: '#fef08a',
    borderRadius: rem(2),
    padding: `${rem(1)} ${rem(3)}`,
  },
}));
