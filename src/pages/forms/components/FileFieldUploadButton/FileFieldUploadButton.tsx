import React, { useRef } from 'react';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Button } from '../../../../components/UI/Button';

export interface FileFieldUploadButtonProps {
  uploading: boolean;
  hasFile: boolean;
  onSelect: (file: File) => void;
}

/**
 * Button component doesn't forward `component="label"`, so the file input needs its own ref
 * + trigger (same pattern as AvatarUpload). Shared between the company and worker field views.
 */
export const FileFieldUploadButton: React.FC<FileFieldUploadButtonProps> = ({ uploading, hasFile, onSelect }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        ref={inputRef}
        type="file"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (inputRef.current) inputRef.current.value = '';
          if (file) onSelect(file);
        }}
      />
      <Button
        variant="outlined"
        size="small"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        startIcon={<UploadFileIcon />}
      >
        {uploading ? 'Uploading...' : hasFile ? 'Replace' : 'Upload'}
      </Button>
    </>
  );
};
