import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { rem } from '../../../../components/UI/Typography/utility';
import { floowColors } from '../../../../theme/colors';

// Section card primitives (SectionCard, SectionHeader, ...) live in FieldRowsEditor.styles —
// re-exported here so the Template Details card matches the Fields card below it exactly.
export {
  SectionCard,
  SectionHeader,
  SectionIconBadge,
  SectionHeaderText,
  SectionTitle,
  SectionSubtitle,
} from '../FieldRowsEditor/FieldRowsEditor.styles';

export const FormBody = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(18),
}));

// ─── "Enter a name to unlock fields" hint ──────────────────────────────────────

export const HintBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
  padding: `${rem(11)} ${rem(14)}`,
  borderRadius: rem(10),
  border: `1px dashed ${floowColors.slate.light}`,
  color: theme.palette.grey[500],
  fontSize: rem(12.5),

  '& svg': {
    fontSize: rem(16),
    flexShrink: 0,
  },
}));
