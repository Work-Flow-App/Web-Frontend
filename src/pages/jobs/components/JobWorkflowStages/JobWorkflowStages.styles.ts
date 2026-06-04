import type { SxProps, Theme } from '@mui/material';

export const styles = {
  // ─── Loading / Empty states ───────────────────────────────────────────────

  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    py: 4,
  } as SxProps<Theme>,

  // ─── Timeline list wrapper ────────────────────────────────────────────────

  timelineList: {
    px: 2,
    py: 1,
    overflowY: 'auto',
    flex: 1,
  } as SxProps<Theme>,

  // ─── Individual step row ──────────────────────────────────────────────────

  stepRow: {
    display: 'flex',
    position: 'relative',
  } as SxProps<Theme>,

  // ─── Vertical connector line between nodes ────────────────────────────────

  timelineLineCompleted: {
    position: 'absolute',
    left: 13,
    top: 28,
    bottom: 0,
    width: 2,
    backgroundColor: '#4CAF50',
  } as SxProps<Theme>,

  timelineLinePending: {
    position: 'absolute',
    left: 13,
    top: 28,
    bottom: 0,
    width: 2,
    backgroundColor: '#E0E0E0',
  } as SxProps<Theme>,

  // ─── Circular timeline node ───────────────────────────────────────────────

  timelineNodeBase: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666',
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
  } as SxProps<Theme>,

  timelineNodeCompleted: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    color: 'white',
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
  } as SxProps<Theme>,

  timelineNodeInProgress: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    color: 'white',
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
  } as SxProps<Theme>,

  timelineNodeDelayed: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F44336',
    color: 'white',
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
  } as SxProps<Theme>,

  timelineNodeDefault: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E0E0E0',
    color: '#666',
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
  } as SxProps<Theme>,

  // ─── Step content area ────────────────────────────────────────────────────

  stepContent: {
    ml: 1.5,
    flex: 1,
    pb: 2,
    minWidth: 0,
  } as SxProps<Theme>,

  stepDescription: {
    fontSize: 12,
    color: '#888',
    mb: 1,
  } as SxProps<Theme>,

  // ─── Status + chips row (clickable to toggle expand) ─────────────────────

  chipsRow: {
    display: 'flex',
    gap: 0.5,
    flexWrap: 'wrap',
    cursor: 'pointer',
  } as SxProps<Theme>,

  statusChip: {
    height: 24,
    fontSize: 11,
    fontWeight: 600,
    borderRadius: '4px',
  } as SxProps<Theme>,

  assignedChip: {
    height: 24,
    fontSize: 11,
    fontWeight: 600,
    backgroundColor: '#F5F5F5',
    color: '#616161',
    borderRadius: '4px',
  } as SxProps<Theme>,

  // ─── Expanded details panel ───────────────────────────────────────────────

  expandedPanel: {
    mt: 2,
    pt: 2,
    borderTop: '1px solid #eee',
  } as SxProps<Theme>,

  // ─── Duration edit row ────────────────────────────────────────────────────

  durationEditRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  } as SxProps<Theme>,

  durationLabel: {
    fontSize: 12,
  } as React.CSSProperties,

  durationValueText: {
    fontSize: 12,
    fontWeight: 500,
    color: '#333',
  } as React.CSSProperties,

  durationTextField: {
    width: 50,
    '& .MuiOutlinedInput-input': {
      py: 0.25,
      px: 0.5,
      fontSize: 12,
      textAlign: 'center',
    },
  } as SxProps<Theme>,

  durationEditIconButton: {
    p: 0.25,
  } as SxProps<Theme>,

  durationValueBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  } as SxProps<Theme>,

  // ─── Status select ────────────────────────────────────────────────────────

  statusSelect: {
    minWidth: 140,
  } as SxProps<Theme>,

  statusSelectInput: {
    fontSize: 12,
    '& .MuiSelect-select': {
      py: 0.5,
    },
  } as SxProps<Theme>,

  statusMenuItemChip: {
    height: 20,
    fontSize: 10,
    fontWeight: 600,
  } as SxProps<Theme>,

  // ─── Dates ────────────────────────────────────────────────────────────────

  dateValueText: {
    fontSize: 12,
    fontWeight: 500,
    color: '#333',
  } as React.CSSProperties,

  // ─── Workflow name header ─────────────────────────────────────────────────

  workflowNameTextField: {
    '& .MuiOutlinedInput-root': {
      fontSize: 14,
      fontWeight: 600,
    },
    '& .MuiOutlinedInput-input': {
      py: 0.5,
      px: 1,
    },
  } as SxProps<Theme>,

  workflowNameAvatarRow: {
    display: 'inline-flex',
    gap: 0.5,
    ml: 1,
  } as SxProps<Theme>,

  workerAvatar: {
    width: 24,
    height: 24,
    borderRadius: '50%',
    backgroundColor: 'primary.main',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 10,
    fontWeight: 600,
  } as SxProps<Theme>,

  workflowNameEditButtons: {
    display: 'flex',
    gap: 0.5,
  } as SxProps<Theme>,

  // ─── Step name inline edit ────────────────────────────────────────────────

  stepNameTextField: {
    flex: 1,
    '& .MuiOutlinedInput-root': {
      fontSize: 14,
      fontWeight: 600,
    },
    '& .MuiOutlinedInput-input': {
      py: 0.25,
      px: 0.5,
    },
  } as SxProps<Theme>,

  // ─── Notes / event notes ──────────────────────────────────────────────────

  notesTextField: {
    '& .MuiOutlinedInput-root': {
      fontSize: 12,
    },
  } as SxProps<Theme>,

  notesEditButtonRow: {
    display: 'flex',
    gap: 1,
  } as SxProps<Theme>,
};