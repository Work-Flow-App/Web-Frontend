import {
  Box,
  styled,
  Typography,
  IconButton,
  Checkbox,
  Chip,
  Tabs,
  MenuItem,
  TextField,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LockIcon from '@mui/icons-material/Lock';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import { rem } from '../../../../../components/UI/Typography/utility';
import {
  StyledHeaderCell,
  StyledTableCell,
  ActionsCell,
  StyledTableRow,
} from '../../../../../components/UI/Table/Table.styles';

// ─── Layout & Container Styled Components ─────────────────────────────────────

export const TabContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const SummaryCardsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
}));

export const SummaryCardLabel = styled(Typography)(({ theme }) => ({
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  fontSize: '0.7rem',
  fontWeight: theme.typography.fontWeightBold,
}));

export const SummaryCardValue = styled(Typography)<{ color?: string }>(({ color }) => ({
  marginTop: '4px',
  fontWeight: 700,
  ...(color ? { color } : {}),
}));

export const SectionHeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1.5, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  flexWrap: 'wrap',
  gap: theme.spacing(1),
}));

export const SectionHeaderLeft = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
}));

export const SectionHeaderRight = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
}));

export const MobileHeaderLeftBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const MobileCardsContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5, 0.5),
}));

export const MobileEditBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}));

export const FlexGap1Box = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
}));

export const CardHeaderRight = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const MobileAddCardBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}));

export const DocIconBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
}));

export const CollapseBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.action.hover,
  padding: theme.spacing(1, 2),
}));

export const QuickActionsContainer = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
}));

export const ActionsBoxGap05 = styled(Box)(() => ({
  display: 'flex',
  gap: '4px',
}));

export const AddRowButtonBox = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '4px 12px',
  borderRadius: '4px',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

export const TotalsFooterBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: theme.spacing(3),
  padding: theme.spacing(1, 2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.action.hover,
}));

export const DocTabsHeader = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
}));

export const DocTabBody = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

export const Mb2Box = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

// ─── Typography Styled Components ─────────────────────────────────────────────

export const EmptyStateText = styled(Typography)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  textAlign: 'center',
}));

export const DocTitle = styled(Typography)(() => ({
  fontSize: 'inherit',
  fontWeight: 600,
}));

export const DocCaption = styled(Typography)(() => ({
  display: 'block',
}));

export const CollapseCaption = styled(Typography)(() => ({
  display: 'block',
  marginBottom: '6px',
  fontWeight: 600,
}));

export const DocSubheader = styled(Typography)(() => ({
  display: 'block',
  marginBottom: '8px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  fontWeight: 600,
}));

export const AddRowButtonText = styled(Typography)(() => ({
  fontSize: '0.8125rem',
  fontWeight: 500,
  color: 'inherit',
}));

export const MobileCardTitle = styled(Typography)(() => ({
  fontWeight: 600,
}));

// ─── Table Styled Components ──────────────────────────────────────────────────

export const CompactHeaderCell = styled(StyledHeaderCell)(() => ({
  paddingTop: '5px',
  paddingBottom: '5px',
  paddingLeft: '10px',
  paddingRight: '10px',
  fontSize: '0.8125rem',
}));

export const CheckboxHeaderCell = styled(StyledHeaderCell)(() => ({
  paddingTop: '5px',
  paddingBottom: '5px',
  paddingLeft: '8px',
  paddingRight: '8px',
  fontSize: '0.8125rem',
  width: 36,
}));

export const CompactTableCell = styled(StyledTableCell)(() => ({
  paddingTop: '5px',
  paddingBottom: '5px',
  paddingLeft: '10px',
  paddingRight: '10px',
  fontSize: '0.8125rem',
}));

export const CheckboxTableCell = styled(StyledTableCell)(() => ({
  paddingTop: '5px',
  paddingBottom: '5px',
  paddingLeft: '8px',
  paddingRight: '8px',
  fontSize: '0.8125rem',
  width: 36,
}));

export const CheckboxTableCellWidth36 = styled(StyledTableCell)(() => ({
  paddingTop: '5px',
  paddingBottom: '5px',
  paddingLeft: '10px',
  paddingRight: '10px',
  fontSize: '0.8125rem',
  width: 36,
}));

export const TotalTableCell = styled(StyledTableCell)(() => ({
  paddingTop: '5px',
  paddingBottom: '5px',
  paddingLeft: '10px',
  paddingRight: '10px',
  fontSize: '0.8125rem',
  fontWeight: 600,
}));

export const CollapseTableCell = styled(StyledTableCell)(() => ({
  padding: 0,
  border: 0,
}));

export const EmptyTableCell = styled(StyledTableCell)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  paddingLeft: '10px',
  paddingRight: '10px',
  fontSize: '0.8125rem',
  color: theme.palette.text.secondary,
}));

export const MutedTableCell = styled(StyledTableCell)(({ theme }) => ({
  paddingTop: '5px',
  paddingBottom: '5px',
  paddingLeft: '10px',
  paddingRight: '10px',
  fontSize: '0.8125rem',
  color: theme.palette.text.secondary,
}));

export const TruncatedDescTableCell = styled(StyledTableCell)(() => ({
  paddingTop: '5px',
  paddingBottom: '5px',
  paddingLeft: '10px',
  paddingRight: '10px',
  fontSize: '0.8125rem',
  maxWidth: 260,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

export const CellMin130 = styled(StyledTableCell)(() => ({
  paddingTop: '5px',
  paddingBottom: '5px',
  paddingLeft: '10px',
  paddingRight: '10px',
  fontSize: '0.8125rem',
  minWidth: 130,
}));

export const CellMin150 = styled(StyledTableCell)(() => ({
  paddingTop: '5px',
  paddingBottom: '5px',
  paddingLeft: '10px',
  paddingRight: '10px',
  fontSize: '0.8125rem',
  minWidth: 150,
}));

export const CellMin160 = styled(StyledTableCell)(() => ({
  paddingTop: '5px',
  paddingBottom: '5px',
  paddingLeft: '10px',
  paddingRight: '10px',
  fontSize: '0.8125rem',
  minWidth: 160,
}));

export const CellMin110 = styled(StyledTableCell)(() => ({
  paddingTop: '5px',
  paddingBottom: '5px',
  paddingLeft: '10px',
  paddingRight: '10px',
  fontSize: '0.8125rem',
  minWidth: 110,
}));

export const CellMin120 = styled(StyledTableCell)(() => ({
  paddingTop: '5px',
  paddingBottom: '5px',
  paddingLeft: '10px',
  paddingRight: '10px',
  fontSize: '0.8125rem',
  minWidth: 120,
}));

export const CellMin80 = styled(StyledTableCell)(() => ({
  paddingTop: '5px',
  paddingBottom: '5px',
  paddingLeft: '10px',
  paddingRight: '10px',
  fontSize: '0.8125rem',
  minWidth: 80,
}));

export const CellMin85 = styled(StyledTableCell)(() => ({
  paddingTop: '5px',
  paddingBottom: '5px',
  paddingLeft: '10px',
  paddingRight: '10px',
  fontSize: '0.8125rem',
  minWidth: 85,
}));

export const CellMin90 = styled(StyledTableCell)(() => ({
  paddingTop: '5px',
  paddingBottom: '5px',
  paddingLeft: '10px',
  paddingRight: '10px',
  fontSize: '0.8125rem',
  minWidth: 90,
}));

export const AddRowCell = styled(StyledTableCell)(() => ({
  paddingTop: '8px',
  paddingBottom: '8px',
  paddingLeft: '10px',
  paddingRight: '10px',
  fontSize: '0.8125rem',
}));

export const CompactActionsCell = styled(ActionsCell)(() => ({
  paddingTop: '5px',
  paddingBottom: '5px',
  paddingLeft: '10px',
  paddingRight: '10px',
  fontSize: '0.8125rem',
}));

// ─── Table Row Styled Components ──────────────────────────────────────────────

export const ClickableTableRow = styled(StyledTableRow)(() => ({
  cursor: 'pointer',
}));

export const SelectableTableRow = styled(StyledTableRow)<{ invoiced?: boolean; isSelected?: boolean }>(({ theme, invoiced, isSelected }) => ({
  cursor: invoiced ? 'default' : 'pointer',
  opacity: invoiced ? 0.7 : 1,
  ...(isSelected ? { backgroundColor: theme.palette.action.selected } : {}),
}));

export const AddRowClickableTableRow = styled(StyledTableRow)(({ theme }) => ({
  cursor: 'pointer',
  '&:hover td': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const EmptyTableRow = styled(StyledTableRow)(() => ({
  '&:hover': {
    background: 'inherit',
  },
}));

// ─── Input & Control Styled Components ────────────────────────────────────────

export const ZeroPaddingIconButton = styled(IconButton)(() => ({
  padding: 0,
}));

export const ZeroPaddingCheckbox = styled(Checkbox)(() => ({
  padding: 0,
}));

export const SuccessIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.success.main,
  padding: '2px',
}));

export const ErrorIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.error.main,
  padding: '2px',
}));

export const StyledChip = styled(Chip)(() => ({
  height: 20,
  fontSize: '0.65rem',
  fontWeight: 600,
}));

export const StyledTabs = styled(Tabs)(() => ({
  minHeight: 40,
  '& .MuiTab-root': {
    minHeight: 40,
    fontSize: '0.8125rem',
    paddingTop: '4px',
    paddingBottom: '4px',
  },
}));

export const StyledMenuItem = styled(MenuItem)(() => ({
  fontSize: '0.8125rem',
}));

export const StyledDeleteMenuItem = styled(MenuItem)(({ theme }) => ({
  color: theme.palette.error.main,
  fontSize: '0.8125rem',
}));

export const StyledField = styled(TextField)(() => ({
  '& .MuiInputBase-root': {
    fontSize: '0.8125rem',
  },
}));

export const FlexField = styled(StyledField)(() => ({
  flex: 1,
}));

export const EditPriceInput = styled(StyledField)(() => ({
  width: 100,
  '& input': { textAlign: 'right' },
}));

export const EditQtyInput = styled(StyledField)(() => ({
  width: 70,
  '& input': { textAlign: 'right' },
}));

export const EditVatInput = styled(StyledField)(() => ({
  width: 75,
  '& input': { textAlign: 'right' },
}));

export const AddPriceInput = styled(StyledField)(() => ({
  width: 110,
  '& input': { textAlign: 'right' },
}));

export const AddQtyInput = styled(StyledField)(() => ({
  width: 75,
  '& input': { textAlign: 'right' },
}));

export const AddVatInput = styled(StyledField)(() => ({
  width: 80,
  '& input': { textAlign: 'right' },
}));

// ─── Icon Styled Components ───────────────────────────────────────────────────

export const SmallArrowDownIcon = styled(KeyboardArrowDownIcon)(() => ({
  fontSize: '1rem',
}));

export const SmallArrowRightIcon = styled(KeyboardArrowRightIcon)(() => ({
  fontSize: '1rem',
}));

export const PdfIcon = styled(PictureAsPdfIcon)(({ theme }) => ({
  fontSize: '0.9rem',
  color: theme.palette.text.secondary,
}));

export const SmallOpenInNewIcon = styled(OpenInNewIcon)(() => ({
  fontSize: '1rem',
}));

export const ButtonStartIcon = styled(ReceiptLongIcon)(() => ({
  fontSize: '1rem',
  marginRight: '4px',
}));

export const LockItemIcon = styled(LockIcon)(({ theme }) => ({
  fontSize: '0.85rem',
  color: theme.palette.text.disabled,
}));

export const MoreVertSmallIcon = styled(MoreVertIcon)(() => ({
  fontSize: '1rem',
}));

export const ActionCheckIcon = styled(CheckIcon)(() => ({
  fontSize: '1.2rem',
}));

export const ActionCloseIcon = styled(CloseIcon)(() => ({
  fontSize: '1.2rem',
}));

export const SmallCheckIcon = styled(CheckIcon)(() => ({
  fontSize: '1rem',
}));

export const SmallCloseIcon = styled(CloseIcon)(() => ({
  fontSize: '1rem',
}));

export const QuickActionCheckIcon = styled(CheckIcon)(() => ({
  fontSize: '1.1rem',
}));

export const QuickActionCloseIcon = styled(CloseIcon)(() => ({
  fontSize: '1.1rem',
}));

export const AddIconSmall = styled(AddIcon)(() => ({
  fontSize: '0.9rem',
}));

export const MenuItemIcon = styled(EditIcon)(() => ({
  fontSize: '1rem',
  marginRight: '8px',
}));

export const MenuItemLinkOffIcon = styled(LinkOffIcon)(() => ({
  fontSize: '1rem',
  marginRight: '8px',
}));

// ─── Mobile Styled Components ────────────────────────────────────────────────

export const MobileHeaderControls = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1.5, 2),
  backgroundColor: theme.palette.colors.grey_50,
  borderBottom: `1px solid ${theme.palette.colors.grey_200}`,
  gap: theme.spacing(1.5),
  flexWrap: 'wrap',
}));

export const EstimateMobileCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.colors.white,
  border: `1px solid ${theme.palette.colors.grey_200}`,
  borderRadius: rem(8),
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1.5),
  boxShadow: `0 1px 3px rgba(0, 0, 0, 0.05)`,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.25),
  },
}));

export const EstimateMobileEditCard = styled(EstimateMobileCard)(({ theme }) => ({
  borderLeft: `4px solid ${theme.palette.primary.main}`,
}));

export const EstimateMobileDashedCard = styled(EstimateMobileCard)(({ theme }) => ({
  border: `1px dashed ${theme.palette.primary.main}`,
}));

export const SelectableEstimateMobileCard = styled(EstimateMobileCard)<{ invoiced?: boolean; isSelected?: boolean }>(({ theme, invoiced, isSelected }) => ({
  cursor: invoiced ? 'default' : 'pointer',
  opacity: invoiced ? 0.8 : 1,
  backgroundColor: isSelected ? theme.palette.action.selected : theme.palette.background.paper,
}));

export const EstimateCardHeader = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  gap: rem(8),
}));

export const EstimateCardHeaderLeft = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
}));

export const EstimateCardGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: theme.spacing(1.5),
  fontSize: rem(13),
}));

export const EstimateGridItem = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(2),
}));

export const Span2GridItem = styled(EstimateGridItem)(() => ({
  gridColumn: 'span 2',
}));

export const EstimateGridLabel = styled(Typography)(({ theme }) => ({
  fontSize: rem(11),
  fontWeight: theme.typography.fontWeightBold,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.4px',
}));

export const EstimateGridValue = styled(Typography)(({ theme }) => ({
  fontSize: rem(13),
  fontWeight: theme.typography.fontWeightMedium,
  color: theme.palette.text.primary,
}));

export const BoldGridValue = styled(EstimateGridValue)(() => ({
  fontWeight: 600,
}));

export const EstimateCardActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: theme.spacing(1),
  alignItems: 'center',
  borderTop: `1px solid ${theme.palette.colors.grey_100}`,
  paddingTop: theme.spacing(1.5),
  marginTop: theme.spacing(0.5),
}));
