import { Typography, styled } from '@mui/material';
import { rem, Bold } from '../../../components/UI/Typography/utility';

export const SectionTitle = styled(Typography)(() => ({
  fontWeight: Bold._600,
  marginBottom: rem(12),
}));
