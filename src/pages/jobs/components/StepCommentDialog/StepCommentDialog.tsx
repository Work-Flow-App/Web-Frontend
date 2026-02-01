import React, { useState, useEffect, useCallback } from 'react';
import { IconButton, CircularProgress, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SendIcon from '@mui/icons-material/Send';
import type { JobWorkflowStepResponse, StepCommentResponse } from '../../../../services/api';
import { stepActivityService } from '../../../../services/api';
import * as S from '../../JobDetailsPage.styles';

interface StepCommentDialogProps {
  step: JobWorkflowStepResponse;
  onClose: () => void;
}

const getAvatarColor = (authorId?: number) => {
  const colors = ['#1976D2', '#D4A017', '#4CAF50', '#E91E63', '#9C27B0', '#FF5722'];
  return colors[(authorId || 0) % colors.length];
};

const formatTimeAgo = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return diffMinutes <= 1 ? 'Just now' : `${diffMinutes} minutes ago`;
    }
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  }
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
};

export const StepCommentDialog: React.FC<StepCommentDialogProps> = ({ step, onClose }) => {
  const [comments, setComments] = useState<StepCommentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    if (!step.id) return;

    try {
      setLoading(true);
      const response = await stepActivityService.getComments(step.id);
      setComments(response.data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [step.id]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmitComment = async () => {
    if (!step.id || !newComment.trim() || submitting) return;

    try {
      setSubmitting(true);
      await stepActivityService.addComment(step.id, { content: newComment.trim() });
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  return (
    <S.CommentDialog>
      <S.CommentDialogHeader>
        <S.CommentDialogTitle>Comment</S.CommentDialogTitle>
        <S.CommentDialogActions>
          <IconButton size="small">
            <MoreHorizIcon fontSize="small" />
          </IconButton>
          <IconButton size="small">
            <CheckCircleOutlineIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </S.CommentDialogActions>
      </S.CommentDialogHeader>

      <S.CommentsList>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={4}>
            <CircularProgress size={24} />
          </Box>
        ) : comments.length === 0 ? (
          <Box px={2} py={4} textAlign="center">
            <S.PlaceholderText>No comments yet. Be the first to comment!</S.PlaceholderText>
          </Box>
        ) : (
          comments.map((comment) => (
            <S.CommentItem key={comment.id}>
              <S.CommentHeader>
                <S.CommentAuthorAvatar bgColor={getAvatarColor(comment.authorId)}>
                  {comment.authorId ? `U${comment.authorId}`.substring(0, 2) : 'U'}
                </S.CommentAuthorAvatar>
                <S.CommentAuthorName>User {comment.authorId}</S.CommentAuthorName>
                <S.CommentTime>{formatTimeAgo(comment.createdAt)}</S.CommentTime>
                <IconButton size="small" sx={{ ml: 'auto', p: 0.25 }}>
                  <MoreHorizIcon fontSize="small" />
                </IconButton>
              </S.CommentHeader>
              <S.CommentContent>{comment.content}</S.CommentContent>
            </S.CommentItem>
          ))
        )}
      </S.CommentsList>

      <S.CommentInputContainer>
        <S.CommentAuthorAvatar bgColor="#D4A017">D</S.CommentAuthorAvatar>
        <S.CommentInput
          placeholder="Reply"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={submitting}
        />
        <S.CommentSendButton
          onClick={handleSubmitComment}
          disabled={!newComment.trim() || submitting}
        >
          {submitting ? <CircularProgress size={16} /> : <SendIcon fontSize="small" />}
        </S.CommentSendButton>
      </S.CommentInputContainer>
    </S.CommentDialog>
  );
};
