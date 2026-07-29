import React, { useEffect, useRef, useState } from 'react';
import { useForm, useController, FormProvider } from 'react-hook-form';
import type { FieldError } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Menu, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button } from '../../../../../../components/UI/Button';
import { IconButton } from '../../../../../../components/UI/Button';
import { useGlobalModalInnerContext } from '../../../../../../components/UI/GlobalModal';
import { companyService } from '../../../../../../services/api';
import type { CompanyPostResponse } from '../../../../../../services/api';
import { useSnackbar } from '../../../../../../contexts/SnackbarContext';
import { useFormSubmit } from '../../../../../../hooks/useFormSubmit';
import { useSchema } from '../../../../../../utils/validation';
import { extractErrorMessage } from '../../../../../../utils/errorHandler';
import { getInitials } from '../../../../../../utils/getInitials';
import { SchemaField } from '../../SchemaField';
import { PostFormSchema } from './PostFormSchema';
import type { PostFormValues } from './IPostForm';
import {
  FormWrapper,
  ComposerIdentityRow,
  ComposerAvatar,
  ComposerName,
  AudiencePill,
  AudienceOptionItem,
  AudienceOptionTitle,
  AudienceOptionDescription,
  AttachmentSection,
  AttachmentSectionLabel,
  AttachmentList,
  AttachmentItem,
} from './PostForm.styles';

interface PostFormProps {
  post?: CompanyPostResponse;
  companyName?: string;
  onSuccess: () => void;
  onCancel?: () => void;
}

export const PostForm: React.FC<PostFormProps> = ({ post, companyName, onSuccess, onCancel }) => {
  const isEditMode = Boolean(post);
  const { fieldRules, defaultValues } = useSchema(PostFormSchema, post);

  const methods = useForm<PostFormValues>({
    resolver: yupResolver(fieldRules),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;
  const {
    field: { value: isPublic, onChange: setIsPublic },
  } = useController({ control, name: 'isPublic', defaultValue: false });
  const [audienceAnchor, setAudienceAnchor] = useState<HTMLElement | null>(null);
  const { showSuccess, showError } = useSnackbar();
  const { saving, withSaving } = useFormSubmit();
  const { updateModalTitle, updateGlobalModalInnerConfig, updateOnClose, updateOnConfirm } =
    useGlobalModalInnerContext();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [existingAttachments, setExistingAttachments] = useState(post?.attachments || []);
  const [attachmentIdsToDelete, setAttachmentIdsToDelete] = useState<number[]>([]);

  // handleSubmit(onSubmit) is only re-registered with the modal when [saving, isEditMode]
  // change, so onSubmit's closure over newFiles/attachmentIdsToDelete would otherwise go stale
  // as soon as the user adds or removes an attachment. Route through a ref that's always current.
  const onSubmitRef = useRef<(data: PostFormValues) => void>(() => {});

  useEffect(() => {
    updateModalTitle(isEditMode ? 'Edit Post' : 'New Post');
    updateGlobalModalInnerConfig({
      confirmModalButtonText: saving ? 'Saving...' : isEditMode ? 'Save Changes' : 'Publish Post',
      cancelButtonText: 'Cancel',
      isConfirmDisabled: saving,
    });
    updateOnClose(() => onCancel?.());
    updateOnConfirm(() => {
      handleSubmit((data) => onSubmitRef.current(data))();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saving, isEditMode]);

  const handleAddFiles = () => fileInputRef.current?.click();

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) setNewFiles((prev) => [...prev, ...files]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingAttachment = (attachmentId?: number) => {
    if (!attachmentId) return;
    setAttachmentIdsToDelete((prev) => [...prev, attachmentId]);
    setExistingAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
  };

  const onSubmit = async (data: PostFormValues) => {
    await withSaving(async () => {
      try {
        if (isEditMode && post?.id) {
          await companyService.updatePost(
            post.id,
            {
              content: data.content,
              isPublic: data.isPublic,
              attachmentIdsToDelete: attachmentIdsToDelete.length ? attachmentIdsToDelete : undefined,
            },
            newFiles.length ? newFiles : undefined
          );
          showSuccess('Post updated successfully.');
        } else {
          await companyService.createPost(
            { content: data.content, isPublic: data.isPublic },
            newFiles.length ? newFiles : undefined
          );
          showSuccess('Post published successfully.');
        }
        onSuccess();
      } catch (error) {
        showError(extractErrorMessage(error, 'Failed to save post.'));
      }
    });
  };

  onSubmitRef.current = onSubmit;

  return (
    <FormProvider {...methods}>
      <FormWrapper>
        <ComposerIdentityRow>
          <ComposerAvatar>{getInitials(companyName)}</ComposerAvatar>
          <div>
            <ComposerName>{companyName || 'Company'}</ComposerName>
            <AudiencePill type="button" onClick={(e) => setAudienceAnchor(e.currentTarget)}>
              {isPublic ? <PublicOutlinedIcon fontSize="small" /> : <LockOutlinedIcon fontSize="small" />}
              {isPublic ? 'Anyone' : 'Private'}
              <ExpandMoreIcon fontSize="small" />
            </AudiencePill>
            <Menu
              anchorEl={audienceAnchor}
              open={Boolean(audienceAnchor)}
              onClose={() => setAudienceAnchor(null)}
              sx={{ zIndex: 9000 }}
            >
              <MenuItem
                selected={Boolean(isPublic)}
                onClick={() => {
                  setIsPublic(true);
                  setAudienceAnchor(null);
                }}
              >
                <AudienceOptionItem>
                  <PublicOutlinedIcon fontSize="small" />
                  <div>
                    <AudienceOptionTitle>Anyone</AudienceOptionTitle>
                    <AudienceOptionDescription>
                      Anyone can view this post, even without logging in
                    </AudienceOptionDescription>
                  </div>
                </AudienceOptionItem>
              </MenuItem>
              <MenuItem
                selected={!isPublic}
                onClick={() => {
                  setIsPublic(false);
                  setAudienceAnchor(null);
                }}
              >
                <AudienceOptionItem>
                  <LockOutlinedIcon fontSize="small" />
                  <div>
                    <AudienceOptionTitle>Private</AudienceOptionTitle>
                    <AudienceOptionDescription>
                      Only people signed in to your company can see this post
                    </AudienceOptionDescription>
                  </div>
                </AudienceOptionItem>
              </MenuItem>
            </Menu>
          </div>
        </ComposerIdentityRow>

        <SchemaField
          name="content"
          field={PostFormSchema.content}
          error={errors.content as FieldError | undefined}
          disablePortal
        />

        <AttachmentSection>
          <AttachmentSectionLabel>Attachments</AttachmentSectionLabel>
          <input type="file" ref={fileInputRef} multiple onChange={handleFilesChange} style={{ display: 'none' }} />

          {(existingAttachments.length > 0 || newFiles.length > 0) && (
            <AttachmentList>
              {existingAttachments.map((attachment) => (
                <AttachmentItem key={`existing-${attachment.id}`}>
                  {attachment.fileName || 'Attachment'}
                  <IconButton
                    size="small"
                    variant="text"
                    color="secondary"
                    aria-label="Remove attachment"
                    onClick={() => removeExistingAttachment(attachment.id)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </AttachmentItem>
              ))}
              {newFiles.map((file, index) => (
                <AttachmentItem key={`new-${file.name}-${index}`}>
                  {file.name}
                  <IconButton
                    size="small"
                    variant="text"
                    color="secondary"
                    aria-label="Remove attachment"
                    onClick={() => removeNewFile(index)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </AttachmentItem>
              ))}
            </AttachmentList>
          )}

          <Button
            variant="outlined"
            color="secondary"
            size="small"
            type="button"
            startIcon={<AttachFileIcon fontSize="small" />}
            onClick={handleAddFiles}
          >
            Add Files
          </Button>
        </AttachmentSection>
      </FormWrapper>
    </FormProvider>
  );
};
