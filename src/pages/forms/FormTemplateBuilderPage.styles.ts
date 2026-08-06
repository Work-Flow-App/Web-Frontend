import { styled, Box } from '@mui/material';
import { rem, Bold } from '../../components/UI/Typography/utility';
import { floowColors } from '../../theme/colors';

export { STEP_COLORS } from '../../enums';

export const FieldsCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: rem(16),
  border: `1px solid ${floowColors.slate.light}`,
  overflow: 'hidden',
}));

export const FieldsCardHeader = styled(Box)(() => ({
  padding: `${rem(20)} ${rem(22)}`,
  borderBottom: `1px solid ${floowColors.slate.light}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: rem(10),
}));

export const FieldsCardTitle = styled('h2')(({ theme }) => ({
  margin: 0,
  fontSize: rem(16),
  fontWeight: Bold._700,
  color: theme.palette.text.primary,
}));

export const FieldsList = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  padding: rem(16),
  gap: rem(10),
}));

interface FieldRowProps {
  accentcolor: string;
}

export const FieldRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'accentcolor',
})<FieldRowProps>(({ theme, accentcolor }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: rem(14),
  padding: `${rem(12)} ${rem(16)} ${rem(12)} ${rem(20)}`,
  borderRadius: rem(12),
  border: `1px solid ${floowColors.slate.light}`,
  backgroundColor: theme.palette.background.paper,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: rem(8),
    bottom: rem(8),
    left: rem(6),
    width: rem(4),
    borderRadius: rem(4),
    background: accentcolor,
  },
}));

export const FieldOrderControls = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export const FieldBody = styled(Box)(() => ({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: rem(4),
}));

export const FieldTitleRow = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
  flexWrap: 'wrap',
}));

export const FieldLabel = styled('span')(({ theme }) => ({
  fontSize: rem(14.5),
  fontWeight: Bold._700,
  color: theme.palette.text.primary,
}));

export const FieldMetaRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: rem(10),
  fontSize: rem(12.5),
  color: theme.palette.text.secondary,
}));

export const FieldActions = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(4),
  flexShrink: 0,
}));

export const EmptyFieldsHint = styled(Box)(({ theme }) => ({
  padding: `${rem(32)} ${rem(16)}`,
  textAlign: 'center',
  fontSize: rem(13.5),
  color: theme.palette.text.secondary,
}));

export const AddFieldButton = styled('button')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: rem(8),
  width: '100%',
  padding: rem(14),
  borderRadius: rem(12),
  border: `1.5px dashed ${floowColors.slate.light}`,
  background: 'transparent',
  color: theme.palette.success.main,
  fontSize: rem(13.5),
  fontWeight: Bold._700,
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  '&:hover': {
    borderColor: theme.palette.success.main,
    backgroundColor: theme.palette.success.light ? `${theme.palette.success.light}14` : 'rgba(16,185,129,0.06)',
  },
  '& svg': {
    fontSize: rem(18),
  },
}));
