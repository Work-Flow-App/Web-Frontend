import React, { useRef } from 'react';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DrawIcon from '@mui/icons-material/Draw';
import { Button } from '../../../../components/UI/Button';
import { useGlobalModalOuterContext, ModalSizes } from '../../../../components/UI/GlobalModal';
import { SignaturePad } from '../SignaturePad';

export interface FileFieldUploadButtonProps {
  uploading: boolean;
  hasFile: boolean;
  onSelect: (file: File) => void;
}

/**
 * Button component doesn't forward `component="label"`, so the file input needs its own ref
 * + trigger (same pattern as AvatarUpload). Shared between the company and worker field views.
 *
 * Also offers "Draw Signature" as a second way to fill a FILE field: it opens a canvas pad in
 * the GlobalModal, exports the drawing as a PNG, and feeds it through the exact same
 * `onSelect` callback a picked file would use - so it rides the existing upload endpoint with
 * no backend changes.
 */
export const FileFieldUploadButton: React.FC<FileFieldUploadButtonProps> = ({ uploading, hasFile, onSelect }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();

  const handleDrawSignature = () => {
    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.SMALL,
      fieldName: 'drawSignature',
      children: (
        <SignaturePad
          onSave={(file) => {
            onSelect(file);
            resetGlobalModalOuterProps();
          }}
        />
      ),
    });
  };

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
      <Button
        variant="outlined"
        size="small"
        onClick={handleDrawSignature}
        disabled={uploading}
        startIcon={<DrawIcon />}
      >
        Draw Signature
      </Button>
    </>
  );
};
