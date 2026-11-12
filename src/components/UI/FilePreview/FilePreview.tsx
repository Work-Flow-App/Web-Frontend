import React, { useState } from 'react';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import MovieOutlinedIcon from '@mui/icons-material/MovieOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { getFileExtensionLabel, getFileKind, type FileKind } from '../../../utils/attachmentHelpers';
import { openOnPlainClick } from '../FileViewer';
import * as S from './FilePreview.styles';

const KIND_ICONS: Record<FileKind, React.ReactNode> = {
  image: <ImageOutlinedIcon />,
  pdf: <PictureAsPdfOutlinedIcon />,
  word: <DescriptionOutlinedIcon />,
  sheet: <TableChartOutlinedIcon />,
  video: <MovieOutlinedIcon />,
  other: <InsertDriveFileOutlinedIcon />,
};

interface FilePreviewProps {
  fileUrl?: string;
  thumbnailUrl?: string;
  fileName?: string;
  fileType?: string;
  /** Width / height of the preview area. */
  aspectRatio?: string;
  /** Opens the in-app viewer. Without it, or on a modified click, the file opens in a new tab. */
  onOpen?: () => void;
}

/**
 * The large preview at the top of a file card: the server's thumbnail (or the image
 * itself), otherwise a big file-type icon. Opens the file in a new tab.
 */
export const FilePreview: React.FC<FilePreviewProps> = ({
  fileUrl,
  thumbnailUrl,
  fileName,
  fileType,
  aspectRatio = '16 / 10',
  onOpen,
}) => {
  const kind = getFileKind(fileType, fileName);
  // An image can fall back to the full file; anything else only has its thumbnail
  const candidates = [thumbnailUrl, kind === 'image' ? fileUrl : undefined].filter((url): url is string =>
    Boolean(url)
  );
  const [attempt, setAttempt] = useState(0);
  const shown = candidates[attempt];

  return (
    <S.Frame
      href={fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${fileName || 'file'}`}
      onClick={openOnPlainClick(onOpen)}
      kind={kind}
      aspectRatio={aspectRatio}
    >
      {shown ? (
        // The file name is shown beside every preview, so the image itself is decorative
        <S.PreviewImage
          src={shown}
          alt=""
          loading="lazy"
          isDocument={kind !== 'image'}
          onError={() => setAttempt((n) => n + 1)}
        />
      ) : (
        <S.TypeIcon kind={kind}>{KIND_ICONS[kind]}</S.TypeIcon>
      )}
      <S.TypeBadge>{getFileExtensionLabel(fileName)}</S.TypeBadge>
    </S.Frame>
  );
};
