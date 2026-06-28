import type { ReactNode } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import EventNoteIcon from '@mui/icons-material/EventNote';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import UpdateIcon from '@mui/icons-material/Update';
import TimelineIcon from '@mui/icons-material/Timeline';
import { floowColors } from '../theme/colors';

export interface ActivityConfigEntry {
  color: string;
  icon: ReactNode;
  label: string;
}

const { activity } = floowColors;

export const ACTIVITY_CONFIG: Record<string, ActivityConfigEntry> = {
  STEP_CREATED:       { color: activity.stepCreated,      icon: <AddCircleOutlineIcon sx={{ fontSize: 10 }} />, label: 'Created'    },
  STATUS_CHANGED:     { color: activity.statusChanged,    icon: <SwapHorizIcon sx={{ fontSize: 10 }} />,        label: 'Status'     },
  WORKER_ASSIGNED:    { color: activity.workerAssigned,   icon: <PersonAddIcon sx={{ fontSize: 10 }} />,        label: 'Assigned'   },
  WORKER_UNASSIGNED:  { color: activity.workerUnassigned, icon: <PersonIcon sx={{ fontSize: 10 }} />,           label: 'Unassigned' },
  STEP_UPDATED:       { color: activity.stepUpdated,      icon: <EditIcon sx={{ fontSize: 10 }} />,             label: 'Updated'    },
  ATTACHMENT_ADDED:   { color: activity.attachmentAdded,  icon: <UploadFileIcon sx={{ fontSize: 10 }} />,       label: 'Attachment' },
  ATTACHMENT_REMOVED: { color: activity.removed,          icon: <AttachFileIcon sx={{ fontSize: 10 }} />,       label: 'Removed'    },
  ATTACHMENT_DELETED: { color: activity.removed,          icon: <DeleteOutlineIcon sx={{ fontSize: 10 }} />,    label: 'Deleted'    },
  COMMENT:            { color: activity.comment,          icon: <ChatBubbleOutlineIcon sx={{ fontSize: 10 }} />, label: 'Comment'   },
  COMMENT_ADDED:      { color: activity.comment,          icon: <ChatBubbleOutlineIcon sx={{ fontSize: 10 }} />, label: 'Comment'   },
  VISIT_LOGGED:       { color: activity.visitLogged,      icon: <EventNoteIcon sx={{ fontSize: 10 }} />,        label: 'Visit'      },
  VISIT_DELETED:      { color: activity.visitDeleted,     icon: <EventBusyIcon sx={{ fontSize: 10 }} />,        label: 'Visit del.' },
  VISIT_UPDATED:      { color: activity.visitUpdated,     icon: <UpdateIcon sx={{ fontSize: 10 }} />,           label: 'Visit upd.' },
};

export const getActivityConfig = (type?: string): ActivityConfigEntry =>
  ACTIVITY_CONFIG[type || ''] ?? {
    color: '#9CA3AF',
    icon: <TimelineIcon sx={{ fontSize: 10 }} />,
    label: type?.replace(/_/g, ' ') || 'Activity',
  };
