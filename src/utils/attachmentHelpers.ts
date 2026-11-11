const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'avif'];

const getExtension = (fileName?: string): string | undefined => fileName?.split('.').pop()?.toLowerCase();

export const isImageAttachment = (fileType?: string, fileName?: string): boolean => {
  if (fileType?.toLowerCase().startsWith('image/')) return true;
  const extension = getExtension(fileName);
  return Boolean(extension && IMAGE_EXTENSIONS.includes(extension));
};

export interface AttachmentLike {
  id?: number;
  fileUrl?: string;
  thumbnailUrl?: string;
  fileName?: string;
  fileType?: string;
}

export const partitionAttachmentsByType = <T extends AttachmentLike>(
  attachments: T[]
): { images: T[]; files: T[] } => {
  const images: T[] = [];
  const files: T[] = [];
  attachments.forEach((attachment) => {
    if (isImageAttachment(attachment.fileType, attachment.fileName)) {
      images.push(attachment);
    } else {
      files.push(attachment);
    }
  });
  return { images, files };
};

export const getFileExtensionLabel = (fileName?: string): string => getExtension(fileName)?.toUpperCase() || 'FILE';

export type FileKind = 'image' | 'pdf' | 'word' | 'sheet' | 'video' | 'other';

/** Which kind of file this is, for choosing its icon and how its preview is fitted. */
export const getFileKind = (fileType?: string, fileName?: string): FileKind => {
  if (isImageAttachment(fileType, fileName)) return 'image';
  const type = fileType?.toLowerCase() ?? '';
  const extension = getExtension(fileName) ?? '';
  if (type === 'application/pdf' || extension === 'pdf') return 'pdf';
  if (type.includes('word') || ['doc', 'docx', 'odt', 'rtf'].includes(extension)) return 'word';
  if (type.includes('sheet') || type.includes('excel') || ['xls', 'xlsx', 'csv', 'ods'].includes(extension)) {
    return 'sheet';
  }
  if (type.startsWith('video/') || ['mp4', 'mov', 'webm', 'avi', 'mkv'].includes(extension)) return 'video';
  return 'other';
};
