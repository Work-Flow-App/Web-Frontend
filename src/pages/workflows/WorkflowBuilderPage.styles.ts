import { styled, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { rem, Bold } from '../../components/UI/Typography/utility';
import { floowColors } from '../../theme/colors';

export { STEP_COLORS } from '../../enums';

// ─── Main card ────────────────────────────────────────────────────────────────

export const StepsCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: rem(16),
  border: `1px solid ${floowColors.slate.light}`,
  overflow: 'hidden',

  [theme.breakpoints.down('sm')]: {
    borderRadius: rem(10),
  },
}));

// ─── Card header ──────────────────────────────────────────────────────────────

export const StepsCardHeader = styled(Box)(({ theme }) => ({
  padding: `${rem(20)} ${rem(22)}`,
  borderBottom: `1px solid ${floowColors.slate.light}`,

  [theme.breakpoints.down('md')]: {
    padding: `${rem(16)} ${rem(18)}`,
  },

  [theme.breakpoints.down('sm')]: {
    padding: `${rem(14)} ${rem(14)}`,
  },
}));

export const StepsCardTitleRow = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(10),
}));

export const StepsCardTitle = styled('h2')(({ theme }) => ({
  margin: 0,
  fontSize: rem(16),
  fontWeight: Bold._700,
  color: theme.palette.text.primary,
  lineHeight: 1.4,

  [theme.breakpoints.down('sm')]: {
    fontSize: rem(15),
  },
}));

export const StepsCountBadge = styled(Box)(({ theme }) => ({
  fontSize: rem(12),
  fontWeight: Bold._700,
  color: theme.palette.grey[600],
  backgroundColor: floowColors.grey[100],
  borderRadius: rem(20),
  padding: `${rem(2)} ${rem(9)}`,
  lineHeight: 1.5,
}));

export const StepsCardSubtitle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(6),
  fontSize: rem(12),
  color: theme.palette.grey[500],
  marginTop: rem(6),
  '& svg': {
    fontSize: rem(13),
    flexShrink: 0,
  },
}));

// ─── Rail wrapper ─────────────────────────────────────────────────────────────
// Rail left = paddingLeft + col1(18) + gap(14) + col2Half(18) = paddingLeft + 50.
// Default 22 + 50 = 72 | md 18 + 50 = 68 | sm 14 + 50 = 64

export const StepsRailWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  paddingTop: 0,
  paddingRight: rem(22),
  paddingBottom: rem(20),
  paddingLeft: rem(22),

  [theme.breakpoints.down('md')]: {
    paddingRight: rem(18),
    paddingBottom: rem(16),
    paddingLeft: rem(18),
  },

  [theme.breakpoints.down('sm')]: {
    paddingRight: rem(14),
    paddingBottom: rem(14),
    paddingLeft: rem(14),
  },
}));

export const StepsRail = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: rem(72),
  top: rem(26),
  bottom: rem(30),
  width: rem(2),
  backgroundColor: floowColors.slate.light,
  borderRadius: rem(2),
  zIndex: 0,

  [theme.breakpoints.down('md')]: {
    left: rem(68),
  },

  [theme.breakpoints.down('sm')]: {
    left: rem(64),
  },
}));

// ─── Steps list ───────────────────────────────────────────────────────────────

export const StepsList = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(6),
}));

// ─── Step row ─────────────────────────────────────────────────────────────────
// Hover effects target children via named CSS classes:
//   .step-drag-grip → opacity 1
//   .step-card-body → lighter background
//   .step-kebab     → muted background

export const StepRow = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '18px 36px 1fr 28px',
  alignItems: 'start',
  gap: rem(14),
  padding: `${rem(10)} 0`,
  position: 'relative',

  '&:hover .step-drag-grip': {
    opacity: 1,
  },

  '&:hover .step-card-body': {
    backgroundColor: floowColors.tailwind.gray[50],
  },

  '&:hover .step-kebab': {
    backgroundColor: floowColors.grey[100],
  },

  '&.dragging': {
    opacity: 0.5,
  },

  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '16px 32px 1fr 24px',
    gap: rem(10),
  },
}));

// ─── Drag grip ────────────────────────────────────────────────────────────────

export const StepDragGrip = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  paddingTop: rem(9),
  cursor: 'grab',
  opacity: 0.45,
  transition: 'opacity 0.15s',
  color: floowColors.slate.main,
  flexShrink: 0,

  '&:active': {
    cursor: 'grabbing',
  },
}));

// ─── Number badge column ──────────────────────────────────────────────────────

export const StepNumberColumn = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  paddingTop: rem(9),
  flexShrink: 0,
}));

// ─── Numbered colored circle ──────────────────────────────────────────────────
// box-shadow ring creates the white halo + color shadow without affecting layout.

export const StepNumberBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'stepcolor',
})<{ stepcolor: string }>(({ stepcolor }) => ({
  width: rem(32),
  height: rem(32),
  borderRadius: '50%',
  backgroundColor: stepcolor,
  color: floowColors.white,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: Bold._700,
  fontSize: rem(14),
  flexShrink: 0,
  userSelect: 'none',
  position: 'relative',
  zIndex: 1,
  lineHeight: 1,
  boxShadow: `0 0 0 3px ${floowColors.white}, 0 0 0 5px ${stepcolor}33, 0 2px 6px ${stepcolor}33`,
}));

// ─── Step inner card (col 3) ──────────────────────────────────────────────────

export const StepCardBody = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'stepcolor',
})<{ stepcolor: string }>(({ theme, stepcolor }) => ({
  flex: 1,
  minWidth: 0,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${floowColors.slate.light}`,
  borderLeft: `3px solid ${stepcolor}`,
  borderRadius: rem(10),
  padding: `${rem(11)} ${rem(14)}`,
  transition: 'background-color 0.15s',

  [theme.breakpoints.down('sm')]: {
    padding: `${rem(8)} ${rem(10)}`,
    borderRadius: rem(8),
  },
}));

export const StepTitleRow = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
  flexWrap: 'wrap',
}));

export const StepTitle = styled(Box)(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: Bold._700,
  color: theme.palette.text.primary,
  lineHeight: 1.4,

  [theme.breakpoints.down('sm')]: {
    fontSize: rem(13),
  },
}));

export const StepDescription = styled(Box)(() => ({
  fontSize: rem(13),
  color: floowColors.slate.dark,
  lineHeight: 1.5,
  marginTop: rem(4),
  wordBreak: 'break-word',
}));

// ─── Kebab (3-dot) button ─────────────────────────────────────────────────────

export const StepKebabButton = styled(IconButton)(() => ({
  borderRadius: rem(7),
  padding: rem(6),
  flexShrink: 0,
  paddingTop: rem(9),
  transition: 'background-color 0.15s',
  alignSelf: 'start',
}));

// ─── Context menu ─────────────────────────────────────────────────────────────

export const StepContextMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    minWidth: rem(140),
    boxShadow: `0 4px 16px ${floowColors.shadow.card}`,
    borderRadius: rem(8),
    border: `1px solid ${theme.palette.grey[100]}`,
  },
}));

export const StepEditMenuItem = styled(MenuItem)(({ theme }) => ({
  display: 'flex',
  gap: rem(8),
  fontSize: rem(14),
  color: theme.palette.text.primary,
  '& svg': {
    fontSize: rem(18),
    color: theme.palette.text.secondary,
  },
}));

export const StepDeleteMenuItem = styled(MenuItem)(({ theme }) => ({
  display: 'flex',
  gap: rem(8),
  fontSize: rem(14),
  color: theme.palette.error.main,
  '& svg': {
    fontSize: rem(18),
  },
}));

// ─── Add-step node (end of rail) ──────────────────────────────────────────────

export const AddNodeWrapper = styled('button')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '18px 36px 1fr',
  alignItems: 'center',
  gap: rem(14),
  paddingTop: rem(8),
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  textAlign: 'left',
  width: '100%',
  padding: `${rem(8)} 0 0`,

  '&:hover .add-node-label': {
    color: theme.palette.text.primary,
  },

  '&:hover .add-node-circle': {
    borderColor: theme.palette.grey[400],
  },

  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '16px 32px 1fr',
    gap: rem(10),
  },
}));

export const AddNodeCircle = styled(Box)(({ theme }) => ({
  width: rem(32),
  height: rem(32),
  borderRadius: '50%',
  backgroundColor: theme.palette.background.paper,
  border: `2px dashed ${theme.palette.grey[300]}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.grey[400],
  transition: 'border-color 0.15s',
  flexShrink: 0,
  position: 'relative',
  zIndex: 1,

  [theme.breakpoints.down('sm')]: {
    width: rem(28),
    height: rem(28),
  },
}));

export const AddNodeLabel = styled(Box)(({ theme }) => ({
  fontSize: rem(13),
  fontWeight: Bold._600,
  color: theme.palette.grey[500],
  transition: 'color 0.15s',
}));

// ─── Empty state ──────────────────────────────────────────────────────────────

export const EmptyStepsHint = styled(Box)(({ theme }) => ({
  fontSize: rem(13),
  color: theme.palette.grey[400],
  paddingTop: rem(12),
  paddingBottom: rem(4),
  textAlign: 'center',
}));

// ─── Drag overlay (floating ghost row) ───────────────────────────────────────

export const DragOverlayRow = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: '18px 36px 1fr 28px',
  alignItems: 'start',
  gap: rem(14),
  padding: `${rem(10)} ${rem(22)}`,
  backgroundColor: floowColors.white,
  borderRadius: rem(10),
  boxShadow: `0 8px 24px ${floowColors.shadow.card}`,
  border: `1px solid ${floowColors.slate.light}`,
  opacity: 0.95,
}));
