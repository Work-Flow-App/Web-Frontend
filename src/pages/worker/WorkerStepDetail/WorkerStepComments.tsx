import React, { useEffect, useState, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { workerJobWorkflowService } from '../../../services/api';
import type { StepCommentResponse } from '../../../services/api';
import { StepCommentCreateRequestTypeEnum } from '../../../../workflow-api';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { Loader } from '../../../components/UI/Loader/Loader';
import { TextArea } from '../../../components/UI/Forms/TextArea';
import { rem } from '../../../components/UI/Typography/utility';
import * as S from '../../jobs/JobDetailsPage.styles';

interface WorkerStepCommentsProps {
  stepId: number;
  onUpdate?: () => void;
}

interface NewCommentFormValues {
  newComment: string;
}

const compactTextAreaStyles = {
  input: {
    minHeight: rem(60),
    fontSize: rem(12),
    padding: rem(8),
  },
};

export const WorkerStepComments: React.FC<WorkerStepCommentsProps> = ({ stepId, onUpdate }) => {
  const { showSuccess, showError } = useSnackbar();
  const [comments, setComments] = useState<StepCommentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingNew, setAddingNew] = useState(false);

  const newCommentMethods = useForm<NewCommentFormValues>({
    defaultValues: { newComment: '' },
  });

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await workerJobWorkflowService.getStepComments(stepId);
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

  const handleAddComment = async () => {
    const newComment = newCommentMethods.getValues('newComment');
    if (!newComment.trim()) return;

    try {
      setAddingNew(true);
      await workerJobWorkflowService.addComment(stepId, {
        content: newComment.trim(),
        type: StepCommentCreateRequestTypeEnum.General,
      });
      showSuccess('Comment added');
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
              <S.CommentContentRow>
                <S.EventNoteContent>{comment.content}</S.EventNoteContent>
              </S.CommentContentRow>
              {comment.createdAt && (
                <S.CommentTimestamp>{new Date(comment.createdAt).toLocaleString()}</S.CommentTimestamp>
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
