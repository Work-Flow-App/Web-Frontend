import { styled } from '@mui/material/styles';
import { Box, IconButton } from '@mui/material';
import { rem, Bold } from '../../../../components/UI/Typography/utility';
import { floowColors } from '../../../../theme/colors';

// ─── Section card (Template Details / Fields) ──────────────────────────────────
// Shared shell used by both the "Template Details" section (Create/Edit forms) and the
// "Fields" section below, so a template's whole edit surface reads as one design.

export const SectionCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${floowColors.slate.light}`,
  borderRadius: rem(14),
  padding: rem(18),
  display: 'flex',
  flexDirection: 'column',
  gap: rem(14),
}));

export const SectionHeader = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: rem(12),
}));

export const SectionIconBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'tint',
})<{ tint?: string }>(({ tint }) => ({
  width: rem(34),
  height: rem(34),
  borderRadius: rem(10),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  backgroundColor: `${tint || floowColors.blue.main}1A`,
  color: tint || floowColors.blue.main,
  '& svg': { fontSize: rem(18) },
}));

export const SectionHeaderText = styled(Box)(() => ({
  minWidth: 0,
  flex: 1,
}));

export const SectionTitleRow = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
}));

export const SectionTitle = styled('h3')(({ theme }) => ({
  margin: 0,
  fontSize: rem(15),
  fontWeight: Bold._700,
  color: theme.palette.text.primary,
}));

export const SectionSubtitle = styled(Box)(({ theme }) => ({
  fontSize: rem(12.5),
  color: theme.palette.grey[500],
  marginTop: rem(2),
}));

export const CountBadge = styled(Box)(() => ({
  fontSize: rem(11),
  fontWeight: Bold._700,
  color: floowColors.grey[600],
  backgroundColor: floowColors.grey[100],
  borderRadius: rem(20),
  padding: `${rem(1)} ${rem(8)}`,
  lineHeight: 1.6,
}));

// ─── "Add Field" — full-width dashed slot, not a regular button ───────────────

export const AddFieldButton = styled('button')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: rem(5),
  width: '100%',
  padding: `${rem(7)} ${rem(12)}`,
  borderRadius: rem(8),
  border: `1px dashed ${floowColors.blue.main}`,
  backgroundColor: `${floowColors.blue.main}0D`,
  color: floowColors.blue.main,
  fontSize: rem(12.5),
  fontWeight: Bold._700,
  fontFamily: 'inherit',
  cursor: 'pointer',
  transition: 'border-color 0.15s ease, background-color 0.15s ease, color 0.15s ease',

  '&:hover': {
    borderStyle: 'solid',
    backgroundColor: `${floowColors.blue.main}1F`,
  },

  '&:focus-visible': {
    outline: `2px solid ${floowColors.blue.main}`,
    outlineOffset: rem(2),
  },

  '& svg': {
    fontSize: rem(15),
  },
}));

export const EmptyRowsHint = styled(Box)(({ theme }) => ({
  fontSize: rem(12.5),
  color: theme.palette.grey[500],
  padding: `${rem(10)} 0`,
}));

// ─── Field row ──────────────────────────────────────────────────────────────────

export const FieldRowCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'accentcolor',
})<{ accentcolor: string }>(({ accentcolor }) => ({
  position: 'relative',
  border: `1px solid ${floowColors.slate.light}`,
  borderLeft: `3px solid ${accentcolor}`,
  borderRadius: rem(10),
  padding: rem(14),
  paddingRight: rem(76),
  display: 'flex',
  flexDirection: 'column',
  gap: rem(12),
}));

export const FieldRowHeader = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
}));

export const FieldNumberBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'accentcolor',
})<{ accentcolor: string }>(({ accentcolor }) => ({
  width: rem(24),
  height: rem(24),
  borderRadius: '50%',
  backgroundColor: accentcolor,
  color: floowColors.white,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: Bold._700,
  fontSize: rem(12),
  flexShrink: 0,
}));

export const FieldRowTitle = styled(Box)(({ theme }) => ({
  fontSize: rem(13),
  fontWeight: Bold._700,
  color: theme.palette.text.primary,
  display: 'flex',
  alignItems: 'center',
  gap: rem(6),
  minWidth: 0,
  overflow: 'hidden',

  '& svg': {
    fontSize: rem(15),
    flexShrink: 0,
  },

  '& span': {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
}));

// Top-right corner cluster: reorder up/down + remove.
export const FieldRowActions = styled(Box)(() => ({
  position: 'absolute',
  top: rem(8),
  right: rem(8),
  display: 'flex',
  alignItems: 'center',
  gap: rem(2),
}));

export const RowActionButton = styled(IconButton)(() => ({
  '&.Mui-disabled': {
    opacity: 0.3,
  },
}));