import { Box, styled } from '@mui/material';
import { rem } from '../../../../components/UI/Typography/utility';
import { floowColors } from '../../../../theme/colors';

export const WorkflowContainer = styled(Box)(() => ({
  background: 'white',
  border: `${rem(1)} solid ${floowColors.grey[300]}`,
  borderRadius: rem(8),
  padding: rem(24),
}));

export const StepCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'status',
})<{ status?: string }>(({ status }) => {
  let bg = floowColors.grey[50];
  let border = floowColors.grey[200];

  switch (status) {
    case 'COMPLETED':
      bg = floowColors.success.light;
      border = floowColors.success.main;
      break;
    case 'STARTED':
    case 'ONGOING':
      bg = floowColors.info.light;
      border = floowColors.info.main;
      break;
    case 'PENDING':
      bg = floowColors.warning.light;
      border = floowColors.warning.main;
      break;
    default:
      break;
  }

  return {
    background: bg,
    border: `${rem(1)} solid ${border}`,
    borderRadius: rem(8),
    padding: rem(16),
    marginBottom: rem(12),
  };
});

export const StepHeader = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: rem(8),
}));

