import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useForm, useController, FormProvider } from 'react-hook-form';
import type { Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import { Button } from '../../../../../../components/UI/Button';
import { IconButton } from '../../../../../../components/UI/Button';
import { useGlobalModalInnerContext } from '../../../../../../components/UI/GlobalModal';
import { RichTextEditor } from '../../../../../../components/UI/Forms/RichTextEditor/RichTextEditor';
import { companyService } from '../../../../../../services/api';
import type { CompanyPostGroupResponse, CompanyPostResponse } from '../../../../../../services/api';
import { useSnackbar } from '../../../../../../contexts/SnackbarContext';
import { useFormSubmit } from '../../../../../../hooks/useFormSubmit';
import { useSchema } from '../../../../../../utils/validation';
import { extractErrorMessage } from '../../../../../../utils/errorHandler';
import { getInitials } from '../../../../../../utils/getInitials';
import { PostFormSchema } from './PostFormSchema';
import type { PostFormValues } from './IPostForm';
import {
  FormWrapper,
  ComposerIdentityRow,
  ComposerAvatar,
  ComposerName,
  PillRow,
  AudiencePill,
  AudienceOptionItem,
  AudienceOptionTitle,
  AudienceOptionDescription,
  AttachmentSection,
  AttachmentSectionLabel,
  AttachmentList,
  AttachmentItem,
  StyledMenu,
  HiddenFileInput,
} from './PostForm.styles';

interface PostFormProps {
  post?: CompanyPostResponse;
  companyName?: string;
  groups?: CompanyPostGroupResponse[];
  /** Pre-selected group for new posts, e.g. the group the feed is currently filtered by. */
  defaultGroupId?: number;
  onSuccess: () => void;
  onCancel?: () => void;
}

export const PostForm: React.FC<PostFormProps> = ({
  post,
  companyName,
  groups = [],
  defaultGroupId,
  onSuccess,
  onCancel,
}) => {
  const isEditMode = Boolean(post);
  // New posts start in the group the feed is filtered by; edits hydrate from the post itself.
  const schemaSource = useMemo(
    () => post ?? (defaultGroupId !== undefined ? { groupId: defaultGroupId } : undefined),
    [post, defaultGroupId]
  );
  const { fieldRules, defaultValues } = useSchema(PostFormSchema, schemaSource);

  const methods = useForm<PostFormValues>({
    // useSchema's rules are typed for any object; narrow the resolver to this form's values.
    resolver: yupResolver(fieldRules) as unknown as Resolver<PostFormValues>,
    defaultValues,
  });

  const {
    control,
    handleSubmit,
  } = methods;
  const {
    field: { value: isPublic, onChange: setIsPublic },
  } = useController({ control, name: 'isPublic', defaultValue: false });
  const [audienceAnchor, setAudienceAnchor] = useState<HTMLElement | null>(null);
  const {
    field: { value: groupId, onChange: setGroupId },
  } = useController({ control, name: 'groupId' });
  const [groupAnchor, setGroupAnchor] = useState<HTMLElement | null>(null);
  const selectedGroup = groups.find((g) => g.id === groupId);
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
    // Check if rich text editor has non-empty text (stripping basic HTML tags if present)
    const strippedContent = (data.content || '').replace(/<[^>]*>/g, '').trim();
    const hasContent = strippedContent.length > 0;
    const hasAttachments = newFiles.length > 0 || existingAttachments.length > 0;

    if (!hasContent && !hasAttachments) {
      showError('Please add text content or an attachment to your post.');
      return;
    }

    // Use a sentinel value for attachment-only posts so the backend non-empty validation passes.
    // The frontend strips this sentinel when displaying posts (see PostCard.tsx).
    const EMPTY_CONTENT_SENTINEL = 'NULLLLLLLL';
    const contentToSend = hasContent ? data.content : EMPTY_CONTENT_SENTINEL;

    await withSaving(async () => {
      try {
        if (isEditMode && post?.id) {
          await companyService.updatePost(
            post.id,
            {
              content: contentToSend,
              isPublic: data.isPublic,
              groupId: data.groupId ?? undefined,
              removeGroup: post.groupId != null && data.groupId == null ? true : undefined,
              attachmentIdsToDelete: attachmentIdsToDelete.length ? attachmentIdsToDelete : undefined,
            },
            newFiles.length ? newFiles : undefined
          );
          showSuccess('Post updated successfully.');
        } else {
          await companyService.createPost(
            { content: contentToSend, isPublic: data.isPublic, groupId: data.groupId ?? undefined },
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
            <PillRow>
              <AudiencePill type="button" onClick={(e) => setAudienceAnchor(e.currentTarget)}>
                {isPublic ? <PublicOutlinedIcon fontSize="small" /> : <LockOutlinedIcon fontSize="small" />}
                {isPublic ? 'Anyone' : 'Private'}
                <ExpandMoreIcon fontSize="small" />
              </AudiencePill>
              {groups.length > 0 && (
                <AudiencePill type="button" onClick={(e) => setGroupAnchor(e.currentTarget)}>
                  <FolderOutlinedIcon fontSize="small" />
                  {selectedGroup?.name || post?.groupName || 'No group'}
                  <ExpandMoreIcon fontSize="small" />
                </AudiencePill>
              )}
            </PillRow>
            <StyledMenu
              anchorEl={groupAnchor}
              open={Boolean(groupAnchor)}
              onClose={() => setGroupAnchor(null)}
            >
              <MenuItem
                selected={groupId == null}
                onClick={() => {
                  setGroupId(null);
                  setGroupAnchor(null);
                }}
              >
                No group
              </MenuItem>
              {groups.map((group) => (
                <MenuItem
                  key={group.id}
                  selected={groupId === group.id}
                  onClick={() => {
                    setGroupId(group.id);
                    setGroupAnchor(null);
                  }}
                >
                  {group.name}
                </MenuItem>
              ))}
            </StyledMenu>
            <StyledMenu
              anchorEl={audienceAnchor}
              open={Boolean(audienceAnchor)}
              onClose={() => setAudienceAnchor(null)}
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
            </StyledMenu>
          </div>
        </ComposerIdentityRow>

        <RichTextEditor name="content" label="Content" placeholder="Share an update with your team..." />

        <AttachmentSection>
          <AttachmentSectionLabel>Attachments</AttachmentSectionLabel>
          <HiddenFileInput type="file" ref={fileInputRef} multiple onChange={handleFilesChange} />

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
