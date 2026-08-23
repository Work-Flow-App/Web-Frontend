import { Box, styled, Typography, IconButton, TextField } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { rem, Bold } from '../../../../../components/UI/Typography/utility';
import { floowColors } from '../../../../../theme/colors';
import { Button } from '../../../../../components/UI/Button';

// ─── Layout ───────────────────────────────────────────────────────────────────

export const StepActivityLayout = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  height: rem(640),
  minHeight: rem(500),
  border: `1px solid ${theme.palette.colors.grey_200}`,
  borderRadius: rem(12),
  overflow: 'hidden',
  backgroundColor: theme.palette.colors.white,
  position: 'relative',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    height: rem(580),
    minHeight: rem(480),
    border: 'none',
    borderRadius: 0,
    overflow: 'visible',
  },
}));

// ─── Steps sidebar ────────────────────────────────────────────────────────────

export const StepsSidebar = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$expanded',
})<{ $expanded?: boolean }>(({ theme, $expanded }) => ({
  width: rem(270),
  flexShrink: 0,
  borderRight: `1px solid ${theme.palette.colors.grey_200}`,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.colors.white,
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    position: 'absolute',
    left: `calc(-1 * (${theme.spacing(2)} + ${theme.spacing(2.5)}))`,
    top: rem(8),
    width: rem(56),
    borderRadius: rem(28),
    border: `1px solid ${theme.palette.colors.grey_200}`,
    boxShadow: `0 4px 16px rgba(0,0,0,0.12)`,
    zIndex: 100,
    transition: 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    height: $expanded ? `calc(80% - ${rem(16)})` : rem(96),
    maxHeight: $expanded ? '80vh' : rem(96),
    borderRight: 'none',
    borderBottom: 'none',
  },
}));

export const StepsSidebarHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 2.5),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${theme.palette.colors.grey_100}`,
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

export const StepsSidebarTitle = styled(Typography)(({ theme }) => ({
  fontSize: rem(15),
  fontWeight: theme.typography.fontWeightBold,
  color: theme.palette.text.primary,
}));

export const StepsCountBadge = styled(Box)(({ theme }) => ({
  minWidth: rem(24),
  height: rem(24),
  borderRadius: rem(12),
  backgroundColor: theme.palette.colors.grey_100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: `0 ${rem(6)}`,
  fontSize: rem(12),
  fontWeight: Bold._700,
  color: theme.palette.text.secondary,
}));

export const StepsScrollArea = styled(Box)(({ theme }) => ({
  overflowY: 'auto',
  flex: 1,
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(1, 0),
    gap: theme.spacing(1.5),
  },
}));

interface ActiveProps {
  isActive?: boolean;
}

export const StepRowItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<ActiveProps>(({ theme, isActive }) => ({
  padding: theme.spacing(1.5, 2.5),
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  borderLeft: `3px solid ${isActive ? theme.palette.primary.main : 'transparent'}`,
  backgroundColor: isActive ? floowColors.blue[50] : 'transparent',
  borderBottom: `1px solid ${theme.palette.colors.grey_100}`,
  transition: 'background-color 0.15s ease',
  '&:hover': {
    backgroundColor: isActive ? floowColors.blue[50] : theme.palette.colors.grey_50,
  },
  '&:last-child': {
    borderBottom: 'none',
  },
  [theme.breakpoints.down('md')]: {
    padding: 0,
    width: rem(44),
    height: rem(44),
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: `2px solid ${isActive ? theme.palette.primary.main : 'transparent'}`,
    backgroundColor: isActive ? floowColors.blue[50] : 'transparent',
    borderLeft: 'none',
    borderBottom: 'none',
    flexShrink: 0,
    '&:hover': {
      backgroundColor: isActive ? floowColors.blue[50] : 'transparent',
    },
  },
}));

export const StepCircleIcon = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'circleColor',
})<{ circleColor?: string }>(({ circleColor }) => ({
  width: rem(28),
  height: rem(28),
  borderRadius: '50%',
  backgroundColor: circleColor || floowColors.grey[400],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: floowColors.white,
  fontSize: rem(12),
  fontWeight: Bold._700,
  flexShrink: 0,
}));

export const StepTextGroup = styled(Box)(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

export const StepNameText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<ActiveProps>(({ theme, isActive }) => ({
  fontSize: rem(13),
  fontWeight: theme.typography.fontWeightSemiBold,
  color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

export const StepStatusText = styled(Typography)(({ theme }) => ({
  fontSize: rem(11),
  color: theme.palette.text.secondary,
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

export const StepItemCountBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<ActiveProps>(({ theme, isActive }) => ({
  minWidth: rem(22),
  height: rem(20),
  borderRadius: rem(10),
  backgroundColor: isActive ? theme.palette.primary.main : theme.palette.colors.grey_200,
  color: isActive ? floowColors.white : theme.palette.text.secondary,
  fontSize: rem(11),
  fontWeight: Bold._700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: `0 ${rem(6)}`,
  flexShrink: 0,
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

// ─── Chat panel ───────────────────────────────────────────────────────────────

export const ChatPanel = styled(Box)(() => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  minHeight: 0,
  backgroundColor: floowColors.tailwind.gray[50],
}));

export const ChatPanelHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.75, 3),
  backgroundColor: theme.palette.colors.white,
  borderBottom: `1px solid ${theme.palette.colors.grey_200}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1.25, 1.5),
  },
}));

export const ChatPanelHeaderLeft = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: {
    marginLeft: rem(28),
  },
}));

export const ChatPanelHeaderRight = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const ChatHeaderCircle = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'circleColor',
})<{ circleColor?: string }>(({ theme, circleColor }) => ({
  width: rem(32),
  height: rem(32),
  borderRadius: '50%',
  backgroundColor: circleColor || theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: floowColors.white,
  fontSize: rem(13),
  fontWeight: Bold._700,
  flexShrink: 0,
}));

export const ChatPanelTitle = styled(Typography)(({ theme }) => ({
  fontSize: rem(15),
  fontWeight: theme.typography.fontWeightBold,
  lineHeight: 1.25,
  color: theme.palette.text.primary,
}));

export const ChatPanelMeta = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  color: theme.palette.text.secondary,
  lineHeight: 1.4,
}));

export const NotifyTeamButton = styled('button')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(6),
  padding: `${rem(5)} ${rem(12)}`,
  border: `1px solid ${theme.palette.colors.grey_200}`,
  borderRadius: rem(8),
  backgroundColor: 'transparent',
  cursor: 'pointer',
  color: theme.palette.text.secondary,
  fontSize: rem(13),
  fontWeight: theme.typography.fontWeightMedium,
  transition: 'background-color 0.15s ease',
  '&:hover': {
    backgroundColor: theme.palette.colors.grey_50,
  },
}));

// ─── Messages area ────────────────────────────────────────────────────────────

export const MessagesArea = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(2, 3),
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1, 1.25),
  },
}));

export const EmptyFeedBox = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1.5),
  color: theme.palette.text.secondary,
}));

export const DateGroupDivider = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  margin: theme.spacing(2, 0),
}));

export const MessageBubbleActions = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  flexShrink: 0,
  marginLeft: theme.spacing(1),
  opacity: 0.7,
  transition: 'opacity 0.15s ease',
  '&:hover': {
    opacity: 1,
  },
}));

interface MessageProps {
  isMine?: boolean;
}

// ─── Message hover actions ────────────────────────────────────────────────────

export const MessageActionGroup = styled(Box)(({ theme }) => ({
  display: 'none',
  alignItems: 'center',
  gap: theme.spacing(0.25),
  alignSelf: 'center',
  flexShrink: 0,
}));

export const MessageRowWithActions = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isMine',
})<MessageProps>(({ isMine }) => ({
  display: 'flex',
  flexDirection: isMine ? 'row-reverse' : 'row',
  alignItems: 'flex-end',
  gap: rem(10),
  marginBottom: rem(16),
  [`&:hover .msg-action-group`]: {
    display: 'flex',
  },
}));

export const MessageEditIconBtn = styled('button')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: rem(26),
  height: rem(26),
  borderRadius: rem(6),
  border: `1px solid ${theme.palette.colors.grey_200}`,
  backgroundColor: theme.palette.colors.white,
  cursor: 'pointer',
  color: theme.palette.text.secondary,
  transition: 'all 0.15s ease',
  padding: 0,
  '&:hover': {
    backgroundColor: theme.palette.colors.grey_50,
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
  },
}));

export const MessageDeleteIconBtn = styled('button')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: rem(26),
  height: rem(26),
  borderRadius: rem(6),
  border: `1px solid ${theme.palette.colors.grey_200}`,
  backgroundColor: theme.palette.colors.white,
  cursor: 'pointer',
  color: theme.palette.error.main,
  transition: 'all 0.15s ease',
  padding: 0,
  '&:hover': {
    backgroundColor: '#FEF2F2',
    borderColor: theme.palette.error.main,
  },
}));

export const MessageEditInputRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'flex-end',
  marginTop: theme.spacing(0.5),
}));

export const MessageEditTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    fontSize: rem(13),
    borderRadius: rem(8),
    backgroundColor: theme.palette.colors.white,
    minWidth: rem(200),
  },
}));

export const MessageEditActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0.5),
  flexShrink: 0,
}));

export const DateGroupLine = styled(Box)(({ theme }) => ({
  flex: 1,
  height: rem(1),
  backgroundColor: theme.palette.colors.grey_200,
}));

export const DateGroupText = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  fontWeight: theme.typography.fontWeightMedium,
  color: theme.palette.text.secondary,
  whiteSpace: 'nowrap',
}));

// ─── Message bubbles ──────────────────────────────────────────────────────────

export const MessageRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isMine',
})<MessageProps>(({ isMine }) => ({
  display: 'flex',
  flexDirection: isMine ? 'row-reverse' : 'row',
  alignItems: 'flex-end',
  gap: rem(10),
  marginBottom: rem(16),
}));

export const MessageAvatarCircle = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'avatarColor',
})<{ avatarColor?: string }>(({ avatarColor, theme }) => ({
  width: rem(34),
  height: rem(34),
  borderRadius: '50%',
  backgroundColor: avatarColor || theme.palette.primary.main,
  color: floowColors.white,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: rem(11),
  fontWeight: Bold._700,
  flexShrink: 0,
  marginBottom: rem(2),
}));

export const MessageContentBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isMine',
})<MessageProps>(({ theme, isMine }) => ({
  maxWidth: '65%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: isMine ? 'flex-end' : 'flex-start',
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
    flex: 1,
    minWidth: 0,
    alignItems: 'stretch',
  },
}));

export const MessageMetaRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isMine',
})<MessageProps>(({ theme, isMine }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  marginBottom: theme.spacing(0.5),
  flexDirection: isMine ? 'row-reverse' : 'row',
  flexWrap: 'wrap',
}));

export const MessageSenderName = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  fontWeight: theme.typography.fontWeightBold,
  color: theme.palette.text.primary,
}));

export const MessageTimeText = styled(Typography)(({ theme }) => ({
  fontSize: rem(11),
  color: theme.palette.text.secondary,
}));

export const MessageStepBadge = styled(Box)(({ theme }) => ({
  padding: `${rem(1)} ${rem(6)}`,
  borderRadius: rem(4),
  backgroundColor: theme.palette.colors.grey_100,
  fontSize: rem(10),
  color: theme.palette.text.secondary,
  fontWeight: Bold._600,
}));

export const MessageTypeBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'typeBg' && prop !== 'typeText',
})<{ typeBg?: string; typeText?: string }>(({ typeBg, typeText }) => ({
  padding: `${rem(1)} ${rem(6)}`,
  borderRadius: rem(4),
  backgroundColor: typeBg || floowColors.statusBadge.default.bg,
  color: typeText || floowColors.statusBadge.default.text,
  fontSize: rem(10),
  fontWeight: Bold._700,
  letterSpacing: '0.4px',
  textTransform: 'uppercase',
}));

export const MessageBubble = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isMine',
})<MessageProps>(({ theme, isMine }) => ({
  padding: theme.spacing(1.25, 2),
  borderRadius: isMine
    ? `${rem(14)} ${rem(14)} ${rem(3)} ${rem(14)}`
    : `${rem(14)} ${rem(14)} ${rem(14)} ${rem(3)}`,
  backgroundColor: isMine ? theme.palette.primary.main : theme.palette.colors.white,
  color: isMine ? floowColors.white : theme.palette.text.primary,
  border: isMine ? 'none' : `1px solid ${theme.palette.colors.grey_200}`,
  boxShadow: isMine ? 'none' : `0 1px 4px ${floowColors.shadow.sm}`,
  fontSize: rem(13.5),
  lineHeight: 1.65,
  wordBreak: 'break-word',
  whiteSpace: 'pre-wrap',
  '& p': { margin: 0 },
  '& strong': { fontWeight: Bold._700 },
  [theme.breakpoints.down('md')]: {
    width: '100%',
    maxWidth: '100%',
  },
}));

export const AttachmentRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  minWidth: rem(180),
}));

export const AttachmentFileName = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isMine',
})<MessageProps>(({ isMine, theme }) => ({
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: rem(13),
  color: isMine ? floowColors.white : theme.palette.text.primary,
}));

// ─── Input area ───────────────────────────────────────────────────────────────

export const InputAreaWrapper = styled(Box)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.colors.grey_200}`,
  backgroundColor: theme.palette.colors.white,
  padding: theme.spacing(1.25, 2.5, 2),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1, 1.5, 1.5),
  },
}));

export const InputToolbar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  marginBottom: theme.spacing(1),
  flexWrap: 'wrap',
}));

export const ToolbarActionButton = styled('button')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(4),
  padding: `${rem(4)} ${rem(8)}`,
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  color: theme.palette.text.secondary,
  fontSize: rem(12),
  borderRadius: rem(6),
  whiteSpace: 'nowrap',
  '&:hover:not(:disabled)': {
    backgroundColor: theme.palette.colors.grey_100,
    color: theme.palette.text.primary,
  },
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
}));

export const ToolbarSelectGroup = styled(Box)(({ theme }) => ({
  marginLeft: 'auto',
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    marginLeft: 0,
    marginTop: theme.spacing(1.25),
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: theme.spacing(1.25),
    '& > *': {
      width: '100%',
      flex: 'none',
    },
  },
}));

export const InputRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1.5),
  alignItems: 'flex-end',
}));


export const MessageTextField = styled(TextField)(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  '& .MuiOutlinedInput-root': {
    fontSize: rem(14),
    borderRadius: rem(10),
    backgroundColor: theme.palette.colors.grey_50,
    [theme.breakpoints.down('md')]: {
      fontSize: rem(16),
    },
  },
}));

// ─── Filter screen (used inside GlobalModal) ──────────────────────────────────

export const FilterTypeRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(1.25, 0.75),
  cursor: 'pointer',
  borderRadius: rem(8),
  '&:hover': {
    backgroundColor: theme.palette.colors.grey_50,
  },
}));

export const FilterTypeDot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'dotColor',
})<{ dotColor?: string }>(({ dotColor }) => ({
  width: rem(11),
  height: rem(11),
  borderRadius: '50%',
  backgroundColor: dotColor || floowColors.grey[400],
  flexShrink: 0,
}));

export const FilterTypeLabel = styled(Typography)(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: theme.typography.fontWeightMedium,
  letterSpacing: '0.3px',
}));

// Styled components to eliminate inline sx props in TSX
export const ActivityEmptyFeedBox = styled(EmptyFeedBox)(() => ({
  minHeight: rem(300),
}));

export const EmptyFeedIcon = styled(ChatBubbleOutlineIcon)(({ theme }) => ({
  fontSize: rem(48),
  color: theme.palette.colors.grey_200,
}));

export const CheckIconStyled = styled(CheckIcon)(() => ({
  fontSize: rem(14),
}));

export const CloseIconStyled = styled(CloseIcon)(() => ({
  fontSize: rem(14),
}));

export const DownloadIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'isMine',
})<{ isMine?: boolean }>(({ isMine, theme }) => ({
  color: isMine ? 'rgba(255, 255, 255, 0.8)' : theme.palette.text.secondary,
}));

export const MessageEditIcon = styled(EditIcon)(() => ({
  fontSize: rem(13),
}));

export const MessageDeleteIcon = styled(DeleteIcon)(() => ({
  fontSize: rem(13),
}));

export const SidebarEmptyIcon = styled(ChatBubbleOutlineIcon)(() => ({
  fontSize: rem(14),
}));

export const HeaderEmptyIcon = styled(ChatBubbleOutlineIcon)(() => ({
  fontSize: rem(15),
}));

export const AttachIconStyled = styled(AttachFileIcon)(() => ({
  fontSize: rem(16),
}));

export const SendButton = styled(Button)(({ theme }) => ({
  flexShrink: 0,
  borderRadius: rem(10),
  height: rem(40),
  paddingLeft: theme.spacing(2.5),
  paddingRight: theme.spacing(2.5),
}));

export const SidebarArrowButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  padding: rem(2),
  marginTop: rem(4),
  alignSelf: 'center',
  '&:hover': {
    backgroundColor: theme.palette.colors.grey_100,
  },
}));
