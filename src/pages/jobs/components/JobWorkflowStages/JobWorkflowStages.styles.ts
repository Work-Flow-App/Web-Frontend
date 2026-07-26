import { styled } from '@mui/material/styles';
import { Box, Chip, Button, IconButton, TextField, FormControl, Select } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import AddIcon from '@mui/icons-material/Add';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import AttachFileIcon from '@mui/icons-material/AttachFile';

// ─── Containers & Layout ───────────────────────────────────────────────────

export const TimelineListWrapper = styled(Box)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(2),
  overflowY: 'auto',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0),
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

export const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

export const EmptyStateContainer = styled(Box)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
}));

// ─── Step Item Row & Rail ──────────────────────────────────────────────────

export const StepRowContainer = styled(Box)(() => ({
  display: 'flex',
  position: 'relative',
  transition: 'background-color 0.15s ease',
}));

export const TimelineLineCompleted = styled(Box)(() => ({
  position: 'absolute',
  left: 13,
  top: 28,
  bottom: 0,
  width: 2,
  backgroundColor: '#4CAF50',
}));

export const TimelineLinePending = styled(Box)(() => ({
  position: 'absolute',
  left: 13,
  top: 28,
  bottom: 0,
  width: 2,
  backgroundColor: '#E0E0E0',
}));

export const StepDragGrip = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.grey[400],
  cursor: 'grab',
  paddingRight: theme.spacing(0.5),
  '&:hover': {
    color: theme.palette.grey[700],
  },
  '&:active': {
    cursor: 'grabbing',
  },
}));

export const ReorderDragRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  width: '100%',
  padding: theme.spacing(1.25, 1.5),
  marginBottom: theme.spacing(0.75),
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: '#FFFFFF',
  cursor: 'grab',
  userSelect: 'none',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  transition: 'box-shadow 0.15s ease, background-color 0.15s ease',
  '&:hover': {
    backgroundColor: '#F5F8FF',
    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
  },
  '&:active': {
    cursor: 'grabbing',
    backgroundColor: '#EEF3FF',
  },
}));

export const ReorderDragIndex = styled('span')(({ theme }) => ({
  minWidth: 22,
  height: 22,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  color: '#FFFFFF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.7rem',
  fontWeight: 700,
  flexShrink: 0,
}));

export const ReorderDragTitle = styled('span')(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: 600,
  color: theme.palette.text.primary,
  flex: 1,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

export const DragIcon = styled(DragIndicatorIcon)(() => ({
  fontSize: 18,
}));

// ─── Timeline Nodes ────────────────────────────────────────────────────────

interface NodeProps {
  statusVariant?: 'completed' | 'inProgress' | 'delayed' | 'default';
}

export const TimelineNode = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'statusVariant',
})<NodeProps>(({ statusVariant }) => {
  let bg = '#E0E0E0';
  let color = '#666';

  if (statusVariant === 'completed' || statusVariant === 'inProgress') {
    bg = '#4CAF50';
    color = '#FFFFFF';
  } else if (statusVariant === 'delayed') {
    bg = '#F44336';
    color = '#FFFFFF';
  }

  return {
    width: 28,
    height: 28,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: bg,
    color,
    fontSize: 12,
    fontWeight: 600,
    flexShrink: 0,
    cursor: 'pointer',
    position: 'relative',
    zIndex: 1,
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  };
});

// ─── Icons ────────────────────────────────────────────────────────────────

export const NodeIconCheck = styled(CheckIcon)(() => ({
  fontSize: 16,
}));

export const NodeIconPlay = styled(PlayArrowIcon)(() => ({
  fontSize: 16,
}));

export const NodeIconClose = styled(CloseIcon)(() => ({
  fontSize: 16,
}));

export const SmallIconEdit = styled(EditIcon)(() => ({
  fontSize: 14,
}));

export const SmallIconSave = styled(SaveIcon)(() => ({
  fontSize: 14,
}));

export const SmallIconDelete = styled(DeleteIcon)(() => ({
  fontSize: 14,
}));

export const SmallIconClose = styled(CloseIcon)(() => ({
  fontSize: 14,
}));

export const SmallIconAdd = styled(AddIcon)(() => ({
  fontSize: 16,
  marginRight: 4,
}));

// ─── Step Content & Header ─────────────────────────────────────────────────

export const StepContentBox = styled(Box)(({ theme }) => ({
  marginLeft: theme.spacing(1.5),
  flex: 1,
  paddingBottom: theme.spacing(2),
  minWidth: 0,
  [theme.breakpoints.down('sm')]: {
    marginLeft: theme.spacing(1),
  },
}));

export const StepTitleHeaderRow = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
}));

export const StepTitleEditWrapper = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  flex: 1,
}));

export const StepTitleIndexSpan = styled('span')(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

export const StepTitleTextField = styled(TextField)(() => ({
  flex: 1,
  '& .MuiOutlinedInput-root': {
    fontSize: 14,
    fontWeight: 600,
  },
  '& .MuiOutlinedInput-input': {
    padding: '2px 6px',
  },
}));

export const DraggableTitleWrapper = styled(Box)<{ isreordering?: string }>(({ theme, isreordering }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  flex: 1,
  cursor: isreordering === 'true' ? 'grab' : 'pointer',
  userSelect: isreordering === 'true' ? 'none' : 'auto',
  '&:active': {
    cursor: isreordering === 'true' ? 'grabbing' : 'pointer',
  },
}));

export const StepActionButtonsBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
}));

export const ActionIconButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0.5),
  color: theme.palette.grey[600],
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.text.primary,
  },
}));

export const DeleteActionButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0.5),
  color: theme.palette.error.main,
  '&:hover': {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.dark,
  },
}));

export const StepDescriptionText = styled(Box)(({ theme }) => ({
  fontSize: 12,
  color: theme.palette.grey[600],
  marginBottom: theme.spacing(1),
  wordBreak: 'break-word',
}));

export const ChipsRowBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0.5),
  flexWrap: 'wrap',
  cursor: 'pointer',
}));

export const StyledStatusChip = styled(Chip)<{ chipbg?: string; chipcolor?: string }>(({ chipbg, chipcolor }) => ({
  height: 24,
  fontSize: 11,
  fontWeight: 600,
  borderRadius: '4px',
  backgroundColor: chipbg || '#F5F5F5',
  color: chipcolor || '#616161',
}));

export const AssignedYouChip = styled(Chip)(() => ({
  height: 24,
  fontSize: 11,
  fontWeight: 600,
  backgroundColor: '#F5F5F5',
  color: '#616161',
  borderRadius: '4px',
}));

// ─── Expanded Panel ────────────────────────────────────────────────────────

export const ExpandedPanelBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  paddingTop: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.grey[200]}`,
}));

export const DurationEditRowBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
}));

export const DurationUnitText = styled('span')(({ theme }) => ({
  fontSize: 12,
  color: theme.palette.text.secondary,
}));

export const DurationValueText = styled('span')(({ theme }) => ({
  fontSize: 12,
  fontWeight: 500,
  color: theme.palette.text.primary,
}));

export const DurationNumberInput = styled(TextField)(() => ({
  width: 50,
  '& .MuiOutlinedInput-input': {
    padding: '2px 4px',
    fontSize: 12,
    textAlign: 'center',
  },
}));

export const DurationValueBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const StatusSelectControl = styled(FormControl)(() => ({
  minWidth: 140,
}));

export const StatusSelectComponent = styled(Select)(() => ({
  fontSize: 12,
  '& .MuiSelect-select': {
    paddingTop: 4,
    paddingBottom: 4,
  },
}));

export const StatusMenuItemChip = styled(Chip)<{ chipbg?: string; chipcolor?: string }>(({ chipbg, chipcolor }) => ({
  height: 20,
  fontSize: 10,
  fontWeight: 600,
  backgroundColor: chipbg,
  color: chipcolor,
}));

export const DateValueText = styled('span')(({ theme }) => ({
  fontSize: 12,
  fontWeight: 500,
  color: theme.palette.text.primary,
}));

// ─── Header Controls & Buttons (White Background) ──────────────────────────

export const HeaderActionsBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const ReOrderWhiteButton = styled(Button)<{ isreordering?: string }>(({ theme, isreordering }) => ({
  textTransform: 'none',
  fontSize: '0.8125rem',
  fontWeight: 600,
  borderRadius: theme.spacing(0.75),
  padding: '4px 12px',
  backgroundColor: '#FFFFFF',
  borderColor: isreordering === 'true' ? theme.palette.primary.main : theme.palette.grey[300],
  color: isreordering === 'true' ? theme.palette.primary.main : theme.palette.text.primary,
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  '&:hover': {
    backgroundColor: '#FAFAFA',
    borderColor: theme.palette.primary.main,
  },
}));

export const AddStepWhiteButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontSize: '0.8125rem',
  fontWeight: 600,
  borderRadius: theme.spacing(0.75),
  padding: '4px 12px',
  backgroundColor: '#FFFFFF',
  borderColor: theme.palette.grey[300],
  color: theme.palette.primary.main,
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: '#F8FAFC',
    borderColor: theme.palette.primary.main,
  },
}));

export const WorkflowNameInput = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    fontSize: 14,
    fontWeight: 600,
  },
  '& .MuiOutlinedInput-input': {
    padding: '2px 6px',
  },
}));

export const WorkerAvatarBox = styled(Box)(({ theme }) => ({
  width: 24,
  height: 24,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 10,
  fontWeight: 600,
}));

export const WorkerAvatarsRow = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  gap: theme.spacing(0.5),
  marginLeft: theme.spacing(1),
}));

export const HeaderButtonsRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0.5),
}));

// ─── Add Step Button Card (At bottom of timeline) ───────────────────────────

export const AddStepCardButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  width: '100%',
  marginTop: theme.spacing(1.5),
  padding: theme.spacing(1, 2),
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.primary.main}`,
  backgroundColor: '#FFFFFF',
  color: theme.palette.primary.main,
  fontWeight: 600,
  fontSize: '0.875rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
  '&:hover': {
    backgroundColor: '#F0F7FF',
    borderColor: theme.palette.primary.dark,
  },
}));

// ─── Notes & Event Notes ───────────────────────────────────────────────────

export const NotesTextField = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    fontSize: 12,
  },
}));

export const NotesEditButtonsRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
}));

// ─── File Icons & Hidden File Input ─────────────────────────────────────────

export const StyledImageIcon = styled(ImageIcon)(({ theme }) => ({
  fontSize: 18,
  color: theme.palette.success.main,
}));

export const StyledPdfIcon = styled(PictureAsPdfIcon)(({ theme }) => ({
  fontSize: 18,
  color: theme.palette.error.main,
}));

export const StyledDocIcon = styled(DescriptionIcon)(({ theme }) => ({
  fontSize: 18,
  color: theme.palette.info.main,
}));

export const StyledGenericFileIcon = styled(InsertDriveFileIcon)(({ theme }) => ({
  fontSize: 18,
  color: theme.palette.text.secondary,
}));

export const StyledAttachFileIcon = styled(AttachFileIcon)(({ theme }) => ({
  fontSize: 24,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0.5),
}));

export const StyledAttachFileSmallIcon = styled(AttachFileIcon)(() => ({
  fontSize: 14,
}));

export const HiddenFileInput = styled('input')(() => ({
  display: 'none',
}));

// ─── Legacy style object export for backwards compatibility ────────────────

export const styles = {};