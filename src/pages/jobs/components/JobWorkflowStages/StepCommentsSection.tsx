import React, { useEffect, useState, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import MicIcon from '@mui/icons-material/Mic';
import { stepActivityService } from '../../../../services/api';
import type { StepCommentResponse } from '../../../../services/api';
import { StepCommentCreateRequestTypeEnum } from '../../../../../workflow-api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { useFormSubmit } from '../../../../hooks';
import { Loader } from '../../../../components/UI/Loader/Loader';
import { TextArea } from '../../../../components/UI/Forms/TextArea';
import { VoiceInputSheet } from '../../../../components/UI/VoiceInputSheet';
import { rem } from '../../../../components/UI/Typography/utility';
import * as S from '../../JobDetailsPage.styles';

interface StepCommentsSectionProps {
  stepId: number;
  stepName?: string;
  onUpdate?: () => void;
}

interface EditCommentFormValues {
  editContent: string;
}

const compactTextAreaStyles = {
  input: {
    minHeight: rem(60),
    fontSize: rem(12),
    padding: rem(8),
  },
};

export const StepCommentsSection: React.FC<StepCommentsSectionProps> = ({ stepId, stepName, onUpdate }) => {
  const { showSuccess, showError } = useSnackbar();
  const [comments, setComments] = useState<StepCommentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [commentSheetOpen, setCommentSheetOpen] = useState(false);
  const { saving, withSaving } = useFormSubmit();

  const editCommentMethods = useForm<EditCommentFormValues>({
    defaultValues: {
      editContent: '',
    },
  });

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await stepActivityService.getComments(stepId);
      setComments(response.data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [stepId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleEditComment = (comment: StepCommentResponse, e: React.MouseEvent) => {
    e.stopPropagation();
    if (comment.id) {
      editCommentMethods.reset({ editContent: comment.content || '' });
      setEditingCommentId(comment.id);
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    editCommentMethods.reset();
  };

  const handleSaveComment = async (commentId: number) => {
    const editContent = editCommentMethods.getValues('editContent');
    try {
      await withSaving(async () => {
        await stepActivityService.updateComment(commentId, { content: editContent, type: StepCommentCreateRequestTypeEnum.InternalNote });
        showSuccess('Comment updated successfully');
        setEditingCommentId(null);
        editCommentMethods.reset();
        fetchComments();
        onUpdate?.();
      });
    } catch (error) {
      console.error('Error updating comment:', error);
      showError('Failed to update comment');
    }
  };

  const handleAddComment = async (content: string) => {
    try {
      await stepActivityService.addComment(stepId, { content, type: StepCommentCreateRequestTypeEnum.InternalNote });
      showSuccess('Comment added successfully');
      fetchComments();
      onUpdate?.();
      return true;
    } catch (error) {
      console.error('Error adding comment:', error);
      showError('Failed to add comment');
      return false;
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await stepActivityService.deleteComment(commentId);
      showSuccess('Comment deleted successfully');
      fetchComments();
      onUpdate?.();
    } catch (error) {
      console.error('Error deleting comment:', error);
      showError('Failed to delete comment');
    }
  };

  return (
    <S.EventNoteBox>
      <S.EventNoteHeader>
        <S.EventNoteTitle>Comments</S.EventNoteTitle>
      </S.EventNoteHeader>

      {loading ? (
        <Loader size={20} centered minHeight="60px" />
      ) : comments.length === 0 ? (
        <S.EventNoteContent>No comments yet.</S.EventNoteContent>
      ) : (
        <S.CommentList>
          {comments.map((comment) => (
            <S.CommentItemBox key={comment.id}>
              {editingCommentId === comment.id ? (
                <FormProvider {...editCommentMethods}>
                  <div onClick={(e) => e.stopPropagation()}>
                    <TextArea name="editContent" rows={2} fullWidth styles={compactTextAreaStyles} />
                    <S.ButtonActionsRow>
                      <S.EventNoteEditButton onClick={() => handleCancelEdit()} className="cancel">
                        Cancel
                      </S.EventNoteEditButton>
                      <S.EventNoteEditButton
                        onClick={() => comment.id && handleSaveComment(comment.id)}
                        disabled={saving}
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </S.EventNoteEditButton>
                    </S.ButtonActionsRow>
                  </div>
                </FormProvider>
              ) : (
                <>
                  <S.CommentContentRow>
                    <S.EventNoteContent>{comment.content}</S.EventNoteContent>
                    <S.CommentActionsRow>
                      <S.EventNoteEditButton onClick={(e) => handleEditComment(comment, e)}>Edit</S.EventNoteEditButton>
                      <S.EventNoteEditButton
                        onClick={() => comment.id && handleDeleteComment(comment.id)}
                        className="delete"
                      >
                        Delete
                      </S.EventNoteEditButton>
                    </S.CommentActionsRow>
                  </S.CommentContentRow>
                  {comment.createdAt && (
                    <S.CommentTimestamp>{new Date(comment.createdAt).toLocaleString()}</S.CommentTimestamp>
                  )}
                </>
              )}
            </S.CommentItemBox>
          ))}
        </S.CommentList>
      )}

      <S.NewCommentBox onClick={(e) => e.stopPropagation()}>
        <S.NewCommentTrigger type="button" onClick={() => setCommentSheetOpen(true)}>
          Add a comment...
          <MicIcon />
        </S.NewCommentTrigger>
        <VoiceInputSheet
          open={commentSheetOpen}
          onClose={() => setCommentSheetOpen(false)}
          title="Add Comment"
          subtitle={stepName}
          placeholder="Add a comment..."
          submitLabel="Post Comment"
          onSubmit={handleAddComment}
        />
      </S.NewCommentBox>
    </S.EventNoteBox>
  );
};
