import React, { useEffect, useState, useCallback } from 'react';
import MicIcon from '@mui/icons-material/Mic';
import { workerJobWorkflowService } from '../../../services/api';
import type { StepCommentResponse } from '../../../services/api';
import { StepCommentCreateRequestTypeEnum } from '../../../../workflow-api';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { tidyTextHandler } from '../../../services/ai/tidyText';
import { Loader } from '../../../components/UI/Loader/Loader';
import { VoiceInputSheet } from '../../../components/UI/VoiceInputSheet';
import * as S from '../../jobs/JobDetailsPage.styles';

interface WorkerStepCommentsProps {
  stepId: number;
  stepName?: string;
  onUpdate?: () => void;
}

export const WorkerStepComments: React.FC<WorkerStepCommentsProps> = ({ stepId, stepName, onUpdate }) => {
  const { showSuccess, showError } = useSnackbar();
  const [comments, setComments] = useState<StepCommentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentSheetOpen, setCommentSheetOpen] = useState(false);

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

  const handleAddComment = async (content: string) => {
    try {
      await workerJobWorkflowService.addComment(stepId, {
        content,
        type: StepCommentCreateRequestTypeEnum.General,
      });
      showSuccess('Comment added');
      fetchComments();
      onUpdate?.();
      return true;
    } catch (error) {
      console.error('Error adding comment:', error);
      showError('Failed to add comment');
      return false;
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
          onTidy={tidyTextHandler(stepName)}
        />
      </S.NewCommentBox>
    </S.EventNoteBox>
  );
};
