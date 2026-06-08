import { styled } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export const ToolTipWrapper = styled('span')(() => ({
  display: 'inline-flex',
  alignItems: 'center',
}));

export const StyledInfoIcon = styled(InfoOutlinedIcon)(({ theme }) => ({
  fontSize: '1rem',
  color: theme.palette.text.secondary,
  cursor: 'pointer',
}));
