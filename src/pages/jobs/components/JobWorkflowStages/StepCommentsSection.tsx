import React, { useEffect, useState, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { stepActivityService } from '../../../../services/api';
import type { StepCommentResponse } from '../../../../services/api';
import { StepCommentCreateRequestTypeEnum } from '../../../../../workflow-api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { Loader } from '../../../../components/UI/Loader/Loader';
import { TextArea } from '../../../../components/UI/Forms/TextArea';
import { rem } from '../../../../components/UI/Typography/utility';
import * as S from '../../JobDetailsPage.styles';

interface StepCommentsSectionProps {
  stepId: number;
  onUpdate?: () => void;
}

interface NewCommentFormValues {
  newComment: string;
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

export const StepCommentsSection: React.FC<StepCommentsSectionProps> = ({ stepId, onUpdate }) => {
  const { showSuccess, showError } = useSnackbar();
  const [comments, setComments] = useState<StepCommentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [addingNew, setAddingNew] = useState(false);

  const newCommentMethods = useForm<NewCommentFormValues>({
    defaultValues: {
      newComment: '',
    },
  });

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
      setSaving(true);
      await stepActivityService.updateComment(commentId, { content: editContent, type: StepCommentCreateRequestTypeEnum.InternalNote });
      showSuccess('Comment updated successfully');
      setEditingCommentId(null);
      editCommentMethods.reset();
      fetchComments();
      onUpdate?.();
    } catch (error) {
      console.error('Error updating comment:', error);
      showError('Failed to update comment');
    } finally {
      setSaving(false);
    }
  };

  const handleAddComment = async () => {
    const newComment = newCommentMethods.getValues('newComment');
    if (!newComment.trim()) return;

    try {
      setAddingNew(true);
      await stepActivityService.addComment(stepId, { content: newComment.trim(), type: StepCommentCreateRequestTypeEnum.InternalNote });
      showSuccess('Comment added successfully');
      newCommentMethods.reset();
      fetchComments();
      onUpdate?.();
    } catch (error) {
      console.error('Error adding comment:', error);
      showError('Failed to add comment');
    } finally {
      setAddingNew(false);
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

  const newCommentValue = newCommentMethods.watch('newComment');

  if (loading) {
    return (
      <S.EventNoteBox>
        <S.EventNoteHeader>
          <S.EventNoteTitle>Comments</S.EventNoteTitle>
        </S.EventNoteHeader>
        <Loader size={20} centered minHeight="60px" />
      </S.EventNoteBox>
    );
  }

  return (
    <S.EventNoteBox>
      <S.EventNoteHeader>
        <S.EventNoteTitle>Comments</S.EventNoteTitle>
      </S.EventNoteHeader>

      {comments.length === 0 ? (
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

      <S.NewCommentBox>
        <FormProvider {...newCommentMethods}>
          <div onClick={(e) => e.stopPropagation()}>
            <TextArea
              name="newComment"
              rows={2}
              placeholder="Add a comment..."
              fullWidth
              styles={compactTextAreaStyles}
            />
            <S.ButtonActionsRow>
              <S.EventNoteEditButton onClick={handleAddComment} disabled={!newCommentValue?.trim() || addingNew}>
                {addingNew ? 'Adding...' : 'Add Comment'}
              </S.EventNoteEditButton>
            </S.ButtonActionsRow>
          </div>
        </FormProvider>
      </S.NewCommentBox>
    </S.EventNoteBox>
  );
};
