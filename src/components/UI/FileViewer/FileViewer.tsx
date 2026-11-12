import React, { useId, useState } from 'react';
import { Button, CircularProgress, Dialog } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { getFileKind } from '../../../utils/attachmentHelpers';
import * as S from './FileViewer.styles';

export interface ViewerFile {
  fileUrl?: string;
  thumbnailUrl?: string;
  fileName?: string;
  fileType?: string;
}

interface FileViewerProps {
  files: ViewerFile[];
  /** The file being shown, or null when the viewer is closed. */
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

const Spinner = () => (
  <S.Spinner>
    <CircularProgress size={32} color="inherit" />
  </S.Spinner>
);

const ViewerContent: React.FC<{ file: ViewerFile; name: string }> = ({ file, name }) => {
  const kind = getFileKind(file.fileType, file.fileName);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (file.fileUrl && kind === 'image' && !failed) {
    return (
      <>
        {!loaded && <Spinner />}
        <S.Image
          src={file.fileUrl}
          alt={name}
          loaded={loaded}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      </>
    );
  }

  if (file.fileUrl && kind === 'pdf') {
    return (
      <>
        {!loaded && <Spinner />}
        <S.PdfFrame src={file.fileUrl} title={name} onLoad={() => setLoaded(true)} />
      </>
    );
  }

  // Office files, videos and images the browser can't show (e.g. HEIC)
  return (
    <S.NoPreview>
      {file.thumbnailUrl ? (
        <S.NoPreviewThumbnail src={file.thumbnailUrl} alt="" />
      ) : (
        <InsertDriveFileOutlinedIcon sx={{ fontSize: 72 }} />
      )}
      <S.NoPreviewText>This file can&apos;t be previewed here.</S.NoPreviewText>
      {file.fileUrl && (
        <Button
          variant="outlined"
          sx={S.headerButtonSx}
          href={file.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          startIcon={<OpenInNewIcon />}
        >
          Open in new tab
        </Button>
      )}
    </S.NoPreview>
  );
};

/** Full-screen preview of images and PDFs, with arrows between the files of one list. */
export const FileViewer: React.FC<FileViewerProps> = ({ files, index, onClose, onIndexChange }) => {
  const titleId = useId();
  const file = index != null ? files[index] : undefined;
  if (!file || index == null) return null;

  const count = files.length;
  const name = file.fileName || 'File';
  const step = (delta: number) => onIndexChange((index + delta + count) % count);

  return (
    <Dialog
      open
      fullScreen
      onClose={onClose}
      aria-labelledby={titleId}
      slotProps={{ paper: { sx: S.paperSx } }}
      // The viewer is drawn in a portal, but React still bubbles its events to the component that opened
      // it, which can sit inside a clickable step row
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (count < 2) return;
        if (e.key === 'ArrowRight') step(1);
        if (e.key === 'ArrowLeft') step(-1);
      }}
    >
      <S.Header>
        <S.Title id={titleId} title={name}>
          {name}
        </S.Title>
        {count > 1 && (
          <S.Counter>
            {index + 1} of {count}
          </S.Counter>
        )}
        <S.HeaderActions>
          {file.fileUrl && (
            <Button
              variant="outlined"
              sx={S.headerButtonSx}
              href={file.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<OpenInNewIcon />}
            >
              Open in new tab
            </Button>
          )}
          <S.IconAction aria-label="Close preview" onClick={onClose}>
            <CloseIcon />
          </S.IconAction>
        </S.HeaderActions>
      </S.Header>

      <S.Stage>
        {count > 1 && (
          <S.NavButton side="left" aria-label="Previous file" onClick={() => step(-1)}>
            <ChevronLeftIcon />
          </S.NavButton>
        )}
        <ViewerContent key={`${index}-${file.fileUrl}`} file={file} name={name} />
        {count > 1 && (
          <S.NavButton side="right" aria-label="Next file" onClick={() => step(1)}>
            <ChevronRightIcon />
          </S.NavButton>
        )}
      </S.Stage>
    </Dialog>
  );
};
