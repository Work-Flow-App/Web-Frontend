import React from 'react';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { StepCommentCreateRequestTypeEnum } from '../../../../../workflow-api';
import { floowColors } from '../../../../theme/colors';

// ─── Post / Filter configs ────────────────────────────────────────────────────

export const POST_TYPES = [
  { value: StepCommentCreateRequestTypeEnum.General,      label: 'General' },
  { value: StepCommentCreateRequestTypeEnum.Additional,   label: 'Additional' },
  { value: StepCommentCreateRequestTypeEnum.Complaint,    label: 'Complaint' },
  { value: StepCommentCreateRequestTypeEnum.InternalNote, label: 'Internal Note' },
];

export const FILTER_TYPES = [
  { value: 'GENERAL',       label: 'GENERAL',       dotColor: floowColors.blue.main },
  { value: 'ADDITIONAL',    label: 'ADDITIONAL',     dotColor: floowColors.chart.quinary },
  { value: 'COMPLAINT',     label: 'COMPLAINT',      dotColor: floowColors.warning.main },
  { value: 'INTERNAL_NOTE', label: 'INTERNAL NOTE',  dotColor: floowColors.chart.quaternary },
  { value: 'APPROVAL',      label: 'APPROVAL',       dotColor: floowColors.success.main },
  { value: 'REJECTION',     label: 'REJECTION',      dotColor: floowColors.red.main },
];

export const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  GENERAL:       { bg: '#E3F2FD',                           text: '#1565C0' },
  ADDITIONAL:    { bg: floowColors.green[50],               text: floowColors.green.main },
  COMPLAINT:     { bg: floowColors.statusBadge.inactive.bg, text: floowColors.red.dark },
  INTERNAL_NOTE: { bg: '#FFF8E1',                           text: '#F9A825' },
  APPROVAL:      { bg: floowColors.statusBadge.active.bg,   text: floowColors.green.main },
  REJECTION:     { bg: '#FCE4EC',                           text: '#AD1457' },
};

// ─── Color palettes ────────────────────────────────────────────────────────────

export const STEP_COLORS: string[] = [
  floowColors.dark.navy,
  floowColors.red.main,
  floowColors.warning.main,
  floowColors.success.main,
  floowColors.blue.light,
  floowColors.chart.quinary,
  floowColors.info.bg,
];

export const AVATAR_COLORS: string[] = [
  floowColors.indigo.main,
  floowColors.chart.secondary,
  floowColors.warning.main,
  floowColors.success.main,
  floowColors.blue.light,
  floowColors.chart.quinary,
  floowColors.info.main,
];

// ─── Color helpers ─────────────────────────────────────────────────────────────

export const getStepColor = (index: number): string =>
  STEP_COLORS[index % STEP_COLORS.length];

export const getTypeStyle = (type?: string): { bg: string; text: string } =>
  TYPE_COLORS[type || 'GENERAL'] ?? {
    bg: floowColors.statusBadge.default.bg,
    text: floowColors.statusBadge.default.text,
  };

export const getAvatarColor = (name?: string): string =>
  AVATAR_COLORS[(name?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];

// ─── Text formatters ───────────────────────────────────────────────────────────

export const getInitials = (name?: string): string =>
  name ? name.slice(0, 2).toUpperCase() : '?';

export const fmtTime = (d?: string): string =>
  d ? new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

export const fmtRelative = (d?: string): string => {
  if (!d) return '';
  const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

export const fmtDateGroup = (d?: string): string => {
  if (!d) return '';
  const dt = new Date(d);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  if (dt.toDateString() === today.toDateString())
    return `Today · ${dt.toLocaleDateString('en-GB', opts)}`;
  if (dt.toDateString() === yesterday.toDateString())
    return `Yesterday · ${dt.toLocaleDateString('en-GB', opts)}`;
  return dt.toLocaleDateString('en-GB', { weekday: 'long', ...opts });
};

// ─── File helpers ──────────────────────────────────────────────────────────────

export const getFileIcon = (fileName: string): React.ReactNode => {
  const lower = fileName.toLowerCase();
  if (lower.match(/\.(jpg|jpeg|png|gif|webp|svg)$/))
    return <ImageIcon fontSize="small" style={{ color: floowColors.success.main }} />;
  if (lower.endsWith('.pdf'))
    return <PictureAsPdfIcon fontSize="small" style={{ color: floowColors.red.main }} />;
  return <InsertDriveFileIcon fontSize="small" style={{ color: floowColors.slate.dark }} />;
};

export const extractFileName = (fileUrl?: string): string => {
  const raw = fileUrl?.split('?')[0].split('/').pop() || 'Attachment';
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
};
