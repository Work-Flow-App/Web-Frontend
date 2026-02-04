import React, { useState, useRef } from 'react';
import { IconButton as MuiIconButton, Collapse, Tooltip } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SaveIcon from '@mui/icons-material/Save';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import type { JobResponse } from '../../../../services/api';
import { Button } from '../../../../components/UI/Button';
import { IconButton } from '../../../../components/UI/Button/IconButton';
import { TextArea } from '../../../../components/UI/Forms/TextArea';
import * as S from '../../JobDetailsPage.styles';

interface AdditionalInformationSectionProps {
  job: JobResponse;
  defaultExpanded?: boolean;
}

interface AttachmentFile {
  id: string;
  name: string;
  type: string;
  size: number;
  file?: File;
}

interface AdditionalInfoFormValues {
  description: string;
}

const getFileIcon = (fileType: string) => {
  if (fileType.startsWith('image/')) {
    return <ImageIcon fontSize="small" sx={{ color: 'success.main' }} />;
  }
  if (fileType === 'application/pdf') {
    return <PictureAsPdfIcon fontSize="small" sx={{ color: 'error.main' }} />;
  }
  if (fileType.includes('word') || fileType.includes('document')) {
    return <DescriptionIcon fontSize="small" sx={{ color: 'info.main' }} />;
  }
  return <InsertDriveFileIcon fontSize="small" sx={{ color: 'text.secondary' }} />;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const AdditionalInformationSection: React.FC<AdditionalInformationSectionProps> = ({
  job,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const methods = useForm<AdditionalInfoFormValues>({
    defaultValues: {
      description: '',
    },
  });

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      addFiles(Array.from(files));
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addFiles = (files: File[]) => {
    const newAttachments: AttachmentFile[] = files.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: file.type,
      size: file.size,
      file: file,
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id));
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;
    if (files) {
      addFiles(Array.from(files));
    }
  };

  const handleSave = (data: AdditionalInfoFormValues) => {
    // Mock save functionality - will be replaced with actual API call later
    console.log('Saving additional information:', {
      jobId: job.id,
      description: data.description,
      attachments: attachments.map((att) => ({ name: att.name, type: att.type, size: att.size })),
    });
    alert('Additional information saved successfully! (Mock - no API yet)');
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <S.CollapsibleSection>
      <S.CollapsibleSectionHeader onClick={toggleExpanded}>
        <S.CollapsibleSectionTitle>Additional Information</S.CollapsibleSectionTitle>
        <S.CollapsibleSectionActions>
          <MuiIconButton
            size="small"
            sx={{
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
          >
            <ExpandMoreIcon fontSize="small" />
          </MuiIconButton>
        </S.CollapsibleSectionActions>
      </S.CollapsibleSectionHeader>

      <Collapse in={isExpanded}>
        <S.CollapsibleSectionContent>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSave)}>
              <S.AdditionalInfoContainer>
                {/* Description Text Area */}
                <TextArea
                  name="description"
                  label="Description"
                  placeholder="Enter additional information or notes about this job..."
                  rows={4}
                  fullWidth
                />

                {/* File Attachments */}
                <div>
                  <S.FormLabel>Attachments</S.FormLabel>

                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    multiple
                    style={{ display: 'none' }}
                  />

                  {/* Upload Dropzone */}
                  {attachments.length === 0 ? (
                    <S.UploadArea
                      onClick={handleUploadClick}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      isDragging={isDragging}
                    >
                      <CloudUploadIcon sx={{ fontSize: 32, color: 'grey.400', mb: 1 }} />
                      <S.UploadText>
                        <S.UploadHighlight>Click to upload</S.UploadHighlight> or drag and drop
                      </S.UploadText>
                      <S.UploadSubtext>Any file type supported</S.UploadSubtext>
                    </S.UploadArea>
                  ) : (
                    <>
                      <S.AttachmentList>
                        {attachments.map((attachment) => (
                          <S.AttachmentItem key={attachment.id}>
                            {getFileIcon(attachment.type)}
                            <S.AttachmentFileName>
                              <div className="name">{attachment.name}</div>
                              <div className="date">{formatFileSize(attachment.size)}</div>
                            </S.AttachmentFileName>
                            <S.AttachmentActions>
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  variant="text"
                                  color="error"
                                  onClick={() => handleRemoveAttachment(attachment.id)}
                                  aria-label="Delete attachment"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </S.AttachmentActions>
                          </S.AttachmentItem>
                        ))}
                      </S.AttachmentList>

                      <S.AddMoreButton onClick={handleUploadClick}>
                        <AttachFileIcon sx={{ fontSize: 14 }} />
                        Add more
                      </S.AddMoreButton>
                    </>
                  )}
                </div>

                {/* Save Button */}
                <S.ButtonActionsRow>
                  <Button
                    variant="contained"
                    color="primary"
                    size="medium"
                    type="submit"
                    startIcon={<SaveIcon />}
                  >
                    Save
                  </Button>
                </S.ButtonActionsRow>
              </S.AdditionalInfoContainer>
            </form>
          </FormProvider>
        </S.CollapsibleSectionContent>
      </Collapse>
    </S.CollapsibleSection>
  );
};
