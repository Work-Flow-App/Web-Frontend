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
