import { styled } from '@mui/material/styles';
import { Box, IconButton } from '@mui/material';

export const InvitationsContainer = styled(Box)({
  width: '100%',
  height: '100%',
});

export const StatusBadge = styled('span')<{ color: string }>(({ color, theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 12px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: theme.typography.fontWeightSemiBold,
  backgroundColor: `${color}20`,
  color: color,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}));

export const InvitationLinkText = styled(Box)(({ theme }) => ({
  maxWidth: '250px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: '14px',
  color: theme.palette.colors.slate_dark,
}));

export const CopyButton = styled(IconButton)(({ theme }) => ({
  padding: '4px',
  '&:hover': {
    backgroundColor: theme.palette.colors.slate_light,
  },
}));
