import React, { useEffect, useState, useCallback } from 'react';
import { Box, TextField, CircularProgress } from '@mui/material';
import { stepActivityService } from '../../../../services/api';
import type { StepCommentResponse } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import * as S from '../../JobDetailsPage.styles';

interface StepCommentsSectionProps {
  stepId: number;
}

export const StepCommentsSection: React.FC<StepCommentsSectionProps> = ({ stepId }) => {
  const { showSuccess, showError } = useSnackbar();
  const [comments, setComments] = useState<StepCommentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [newComment, setNewComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [addingNew, setAddingNew] = useState(false);

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
      setEditingCommentId(comment.id);
      setEditingContent(comment.content || '');
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingContent('');
  };

  const handleSaveComment = async (commentId: number) => {
    try {
      setSaving(true);
      await stepActivityService.updateComment(commentId, { content: editingContent });
      showSuccess('Comment updated successfully');
      setEditingCommentId(null);
      setEditingContent('');
      fetchComments();
    } catch (error) {
      console.error('Error updating comment:', error);
      showError('Failed to update comment');
    } finally {
      setSaving(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setAddingNew(true);
      await stepActivityService.addComment(stepId, { content: newComment.trim() });
      showSuccess('Comment added successfully');
      setNewComment('');
      fetchComments();
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
    } catch (error) {
      console.error('Error deleting comment:', error);
      showError('Failed to delete comment');
    }
  };

  if (loading) {
    return (
      <S.EventNoteBox>
        <S.EventNoteHeader>
          <S.EventNoteTitle>Comments</S.EventNoteTitle>
        </S.EventNoteHeader>
        <Box display="flex" justifyContent="center" py={2}>
          <CircularProgress size={20} />
        </Box>
      </S.EventNoteBox>
    );
  }

  return (
    <S.EventNoteBox>
      <S.EventNoteHeader>
        <S.EventNoteTitle>Comments</S.EventNoteTitle>
      </S.EventNoteHeader>

      {/* Existing comments */}
      {comments.length === 0 ? (
        <S.EventNoteContent>No comments yet.</S.EventNoteContent>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 1.5 }}>
          {comments.map((comment) => (
            <Box key={comment.id} sx={{ borderBottom: '1px solid #eee', pb: 1 }}>
              {editingCommentId === comment.id ? (
                <>
                  <TextField
                    multiline
                    rows={2}
                    fullWidth
                    size="small"
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontSize: 12,
                      },
                    }}
                  />
                  <Box sx={{ display: 'flex', gap: 1, mt: 1, justifyContent: 'flex-end' }}>
                    <S.EventNoteEditButton
                      onClick={() => handleCancelEdit()}
                      style={{ color: '#666' }}
                    >
                      Cancel
                    </S.EventNoteEditButton>
                    <S.EventNoteEditButton
                      onClick={() => comment.id && handleSaveComment(comment.id)}
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </S.EventNoteEditButton>
                  </Box>
                </>
              ) : (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <S.EventNoteContent sx={{ flex: 1 }}>
                      {comment.content}
                    </S.EventNoteContent>
                    <Box sx={{ display: 'flex', gap: 1, ml: 1 }}>
                      <S.EventNoteEditButton onClick={(e) => handleEditComment(comment, e)}>
                        Edit
                      </S.EventNoteEditButton>
                      <S.EventNoteEditButton
                        onClick={() => comment.id && handleDeleteComment(comment.id)}
                        style={{ color: '#F44336' }}
                      >
                        Delete
                      </S.EventNoteEditButton>
                    </Box>
                  </Box>
                  {comment.createdAt && (
                    <Box sx={{ fontSize: 10, color: 'text.secondary', mt: 0.5 }}>
                      {new Date(comment.createdAt).toLocaleString()}
                    </Box>
                  )}
                </>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Add new comment */}
      <Box sx={{ mt: 1 }}>
        <TextField
          multiline
          rows={2}
          fullWidth
          size="small"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          onClick={(e) => e.stopPropagation()}
          sx={{
            '& .MuiOutlinedInput-root': {
              fontSize: 12,
            },
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
          <S.EventNoteEditButton
            onClick={handleAddComment}
            disabled={!newComment.trim() || addingNew}
          >
            {addingNew ? 'Adding...' : 'Add Comment'}
          </S.EventNoteEditButton>
        </Box>
      </Box>
    </S.EventNoteBox>
  );
};
