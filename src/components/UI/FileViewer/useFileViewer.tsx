import React, { useState } from 'react';
import { FileViewer, type ViewerFile } from './FileViewer';

/**
 * The viewer for one list of files. Render `viewer` once in the list's component, and call
 * `openFile(index)` from a preview.
 */
export const useFileViewer = (files: ViewerFile[]) => {
  const [index, setIndex] = useState<number | null>(null);
  const viewer = <FileViewer files={files} index={index} onClose={() => setIndex(null)} onIndexChange={setIndex} />;
  return { openFile: setIndex, viewer };
};

/**
 * A link's click handler that opens the viewer on a plain left click. Ctrl, Cmd, Shift and
 * middle clicks keep their usual open-in-a-new-tab behaviour.
 */
export const openOnPlainClick = (onOpen?: () => void) => (e: React.MouseEvent) => {
  if (!onOpen || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  e.stopPropagation();
  onOpen();
};
