import { styled, Box } from '@mui/material';
import { rem, Bold } from '../../components/UI/Typography/utility';
import { floowColors } from '../../theme/colors';

// Main container
export const BuilderContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(24),
  width: '100%',
}));

// Section wrapper
export const Section = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(16),
}));

export const SectionTitle = styled(Box)(({ theme: { palette } }) => ({
  fontSize: rem(16),
  fontWeight: Bold._600,
  color: palette.text.primary,
}));

export const SectionDescription = styled(Box)(({ theme: { palette } }) => ({
  fontSize: rem(14),
  color: palette.grey[500],
}));

// Available Steps List (Source)
export const AvailableStepsList = styled(Box)(({ theme: { palette } }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: rem(12),
  padding: rem(16),
  backgroundColor: palette.grey[50],
  borderRadius: rem(8),
  border: `1px solid ${palette.grey[200]}`,
  minHeight: rem(80),
}));

// Step Item (Small card in source list)
export const StepItem = styled(Box)(({ theme: { palette } }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
  padding: `${rem(8)} ${rem(12)}`,
  backgroundColor: palette.background.paper,
  borderRadius: rem(6),
  border: `1px solid ${palette.grey[300]}`,
  cursor: 'grab',
  transition: 'all 0.2s',

  '&:hover': {
    borderColor: palette.grey[400],
    boxShadow: '0 2px 4px ${floowColors.shadow.lg}',
  },

  '&.dragging': {
    opacity: 0.5,
    cursor: 'grabbing',
  },

  '&.in-order': {
    backgroundColor: palette.success.light,
    borderColor: palette.success.main,
  },
}));

export const StepItemName = styled(Box)(({ theme: { palette } }) => ({
  fontSize: rem(14),
  fontWeight: Bold._500,
  color: palette.text.primary,
}));

export const StepItemActions = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(4),
  marginLeft: rem(8),
}));

// Workflow Order Box (Target - horizontal)
export const WorkflowOrderBox = styled(Box)(({ theme: { palette } }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
  padding: rem(20),
  backgroundColor: palette.background.paper,
  borderRadius: rem(12),
  border: `2px dashed ${palette.grey[300]}`,
  minHeight: rem(120),
  overflowX: 'auto',
  transition: 'all 0.2s',

  '&:empty::before': {
    content: '"Drag steps here to set the order"',
    color: palette.grey[400],
    fontSize: rem(14),
  },

  '&.drag-over': {
    borderColor: palette.primary.main,
    backgroundColor: palette.primary.light || '${floowColors.shadow.xs}',
  },
}));

// Ordered Step Card (in the workflow order box)
export const OrderedStepCard = styled(Box)(({ theme: { palette } }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: rem(16),
  backgroundColor: palette.background.paper,
  borderRadius: rem(8),
  border: `1px solid ${palette.grey[300]}`,
  minWidth: rem(140),
  maxWidth: rem(180),
  cursor: 'grab',
  transition: 'all 0.2s',
  flexShrink: 0,

  '&:hover': {
    borderColor: palette.primary.main,
    boxShadow: '0 2px 8px ${floowColors.shadow.xl}',
  },

  '&.dragging': {
    opacity: 0.5,
    cursor: 'grabbing',
  },
}));

export const OrderedStepHeader = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  marginBottom: rem(8),
}));

export const OrderedStepNumber = styled(Box)(({ theme: { palette } }) => ({
  width: rem(28),
  height: rem(28),
  borderRadius: '50%',
  backgroundColor: palette.common.black,
  color: palette.common.white,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: Bold._600,
  fontSize: rem(12),
}));

export const OrderedStepName = styled(Box)(({ theme: { palette } }) => ({
  fontSize: rem(14),
  fontWeight: Bold._500,
  color: palette.text.primary,
  textAlign: 'center',
  wordBreak: 'break-word',
}));

export const OrderedStepDescription = styled(Box)(({ theme: { palette } }) => ({
  fontSize: rem(12),
  color: palette.grey[500],
  textAlign: 'center',
  marginTop: rem(4),
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
}));

// Arrow connector between ordered steps
export const StepConnector = styled(Box)(({ theme: { palette } }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: palette.grey[400],
  fontSize: rem(24),
  flexShrink: 0,
  padding: `0 ${rem(4)}`,
}));

// Empty state for workflow order
export const EmptyOrderState = styled(Box)(({ theme: { palette } }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  color: palette.grey[400],
  fontSize: rem(14),
}));

// Empty state (no steps created)
export const EmptyState = styled(Box)(({ theme: { palette } }) => ({
  textAlign: 'center',
  padding: `${rem(48)} ${rem(24)}`,
  backgroundColor: palette.grey[50],
  borderRadius: rem(12),
  border: `1px dashed ${palette.grey[300]}`,
}));

export const EmptyStateTitle = styled(Box)(({ theme: { palette } }) => ({
  fontSize: rem(18),
  fontWeight: Bold._600,
  color: palette.grey[600],
  marginBottom: rem(8),
}));

export const EmptyStateDescription = styled(Box)(({ theme: { palette } }) => ({
  fontSize: rem(14),
  color: palette.grey[500],
}));

// Legacy exports for backwards compatibility
export const StepsContainer = styled(Box)(() => ({
  width: '100%',
}));

export const StepCard = styled(Box)(({ theme: { palette } }) => ({
  background: palette.background.paper,
  border: `1px solid ${palette.divider}`,
  borderRadius: rem(8),
  padding: rem(16),
  minWidth: rem(250),
  maxWidth: rem(280),
  display: 'flex',
  flexDirection: 'column',
  gap: rem(12),
  cursor: 'grab',
  transition: 'all 0.2s',
  position: 'relative',

  '&:hover': {
    borderColor: palette.primary.main,
    boxShadow: '0 2px 8px ${floowColors.shadow.xl}',
  },

  '&.dragging': {
    opacity: 0.5,
    cursor: 'grabbing',
  },
}));

export const StepContent = styled(Box)(() => ({
  flex: 1,
}));

export const StepActions = styled(Box)(() => ({
  display: 'flex',
  gap: rem(8),
  justifyContent: 'flex-end',
}));

export const StepHeader = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: rem(8),
}));

export const StepNumber = styled(Box)(({ theme: { palette } }) => ({
  minWidth: rem(32),
  height: rem(32),
  borderRadius: '50%',
  backgroundColor: palette.common.black,
  color: palette.common.white,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: Bold._600,
  fontSize: rem(14),
}));

export const StepTitle = styled(Box)(({ theme: { palette } }) => ({
  fontSize: rem(16),
  fontWeight: Bold._600,
  color: palette.text.primary,
  marginBottom: rem(4),
}));

export const StepOptionalLabel = styled(Box)(({ theme: { palette } }) => ({
  fontSize: rem(12),
  color: palette.grey[500],
  display: 'block',
  marginBottom: rem(8),
}));

export const StepDescription = styled(Box)(({ theme: { palette } }) => ({
  fontSize: rem(14),
  color: palette.grey[600],
  marginTop: rem(8),
}));

export const DragHandle = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'grab',
}));

export const StepsScrollContainer = styled(Box)(() => ({
  overflowX: 'auto',
  paddingBottom: rem(16),
}));

export const StepsTrack = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(16),
  minWidth: 'max-content',
}));

export const StepConnectorArrow = styled(Box)(({ theme: { palette } }) => ({
  color: palette.grey[400],
  fontSize: rem(28),
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
}));
