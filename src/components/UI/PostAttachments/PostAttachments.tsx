import React from 'react';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import { partitionAttachmentsByType, getFileExtensionLabel } from '../../../utils/attachmentHelpers';
import type { AttachmentLike } from '../../../utils/attachmentHelpers';
import {
  ImageGrid,
  ImageGridItem,
  ImageGridImg,
  ImageGridOverlay,
  FileList,
  FileItem,
  FileIconWrap,
  FileMeta,
  FileName,
  FileExtension,
} from './PostAttachments.styles';

const MAX_VISIBLE_IMAGES = 4;

interface PostAttachmentsProps {
  attachments: AttachmentLike[];
}

/**
 * Renders a post's attachments LinkedIn-style: images as a responsive grid
 * (capped at 4 tiles with a "+N" overlay), everything else as downloadable file rows.
 * Shared between the internal PostCard and the public, unauthenticated post view so
 * a shared post link looks identical to the in-app feed.
 */
export const PostAttachments: React.FC<PostAttachmentsProps> = ({ attachments }) => {
  const { images, files } = partitionAttachmentsByType(attachments);
  const visibleImages = images.slice(0, MAX_VISIBLE_IMAGES);
  const extraImagesCount = images.length - visibleImages.length;

  if (images.length === 0 && files.length === 0) return null;

  return (
    <>
      {visibleImages.length > 0 && (
        <ImageGrid count={visibleImages.length === 1 ? 1 : 2}>
          {visibleImages.map((image, index) => {
            const isLastVisible = index === visibleImages.length - 1;
            const spanFull = visibleImages.length === 1 || (visibleImages.length === 3 && index === 0);
            return (
              <ImageGridItem
                key={image.id}
                href={image.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                span={spanFull}
              >
                <ImageGridImg src={image.fileUrl} alt={image.fileName || 'Post attachment'} />
                {isLastVisible && extraImagesCount > 0 && <ImageGridOverlay>+{extraImagesCount}</ImageGridOverlay>}
              </ImageGridItem>
            );
          })}
        </ImageGrid>
      )}

      {files.length > 0 && (
        <FileList>
          {files.map((file) => (
            <FileItem key={file.id} href={file.fileUrl} target="_blank" rel="noopener noreferrer">
              <FileIconWrap>
                <InsertDriveFileOutlinedIcon />
              </FileIconWrap>
              <FileMeta>
                <FileName>{file.fileName || 'Attachment'}</FileName>
                <FileExtension>{getFileExtensionLabel(file.fileName)}</FileExtension>
              </FileMeta>
              <DownloadOutlinedIcon fontSize="small" />
            </FileItem>
          ))}
        </FileList>
      )}
    </>
  );
};
