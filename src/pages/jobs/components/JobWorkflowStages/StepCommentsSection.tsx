import React, { useEffect, useState, useCallback } from 'react';
import { stepActivityService } from '../../../../services/api';
import type { StepCommentResponse } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { Loader } from '../../../../components/UI/Loader/Loader';
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
                <>
                  <S.StyledTextField
                    rows={2}
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <S.ButtonActionsRow>
                    <S.EventNoteEditButton
                      onClick={() => handleCancelEdit()}
                      className="cancel"
                    >
                      Cancel
                    </S.EventNoteEditButton>
                    <S.EventNoteEditButton
                      onClick={() => comment.id && handleSaveComment(comment.id)}
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </S.EventNoteEditButton>
                  </S.ButtonActionsRow>
                </>
              ) : (
                <>
                  <S.CommentContentRow>
                    <S.EventNoteContent>{comment.content}</S.EventNoteContent>
                    <S.CommentActionsRow>
                      <S.EventNoteEditButton onClick={(e) => handleEditComment(comment, e)}>
                        Edit
                      </S.EventNoteEditButton>
                      <S.EventNoteEditButton
                        onClick={() => comment.id && handleDeleteComment(comment.id)}
                        className="delete"
                      >
                        Delete
                      </S.EventNoteEditButton>
                    </S.CommentActionsRow>
                  </S.CommentContentRow>
                  {comment.createdAt && (
                    <S.CommentTimestamp>
                      {new Date(comment.createdAt).toLocaleString()}
                    </S.CommentTimestamp>
                  )}
                </>
              )}
            </S.CommentItemBox>
          ))}
        </S.CommentList>
      )}

      <S.NewCommentBox>
        <S.StyledTextField
          rows={2}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          onClick={(e) => e.stopPropagation()}
        />
        <S.ButtonActionsRow>
          <S.EventNoteEditButton
            onClick={handleAddComment}
            disabled={!newComment.trim() || addingNew}
          >
            {addingNew ? 'Adding...' : 'Add Comment'}
          </S.EventNoteEditButton>
        </S.ButtonActionsRow>
      </S.NewCommentBox>
    </S.EventNoteBox>
  );
};
