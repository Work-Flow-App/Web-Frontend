import React, { useCallback, useMemo } from 'react';
import { CircularProgress } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import {
  useGlobalModalOuterContext,
  ModalSizes,
  ConfirmationModal,
} from '../../../../../components/UI/GlobalModal';
import { companyService } from '../../../../../services/api';
import type { CompanyPostResponse } from '../../../../../services/api';
import { useFetch } from '../../../../../hooks/useFetch';
import { useSnackbar } from '../../../../../contexts/SnackbarContext';
import { useCompanyRole } from '../../../../../contexts/CompanyRoleContext';
import { extractErrorMessage } from '../../../../../utils/errorHandler';
import { getInitials } from '../../../../../utils/getInitials';
import { PostForm } from './PostForm';
import { PostCard } from './PostCard';
import {
  TabHeader,
  TabHeaderText,
  TabTitle,
  TabDescription,
  ComposeBox,
  ComposeAvatar,
  FeedList,
  EmptyState,
  LoadingContainer,
} from './PostsTab.styles';

interface PostsTabProps {
  companyName?: string;
}

export const PostsTab: React.FC<PostsTabProps> = ({ companyName }) => {
  const { showSuccess, showError } = useSnackbar();
  const { canEdit, canDelete } = useCompanyRole();
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();

  const fetchPosts = useCallback(() => companyService.getPosts(), []);
  const { data, loading, refetch } = useFetch<CompanyPostResponse[]>(fetchPosts, [], {
    onError: (err) => showError(extractErrorMessage(err, 'Failed to load posts.')),
  });

  const posts = useMemo(() => data || [], [data]);

  const openPostForm = useCallback(
    (post?: CompanyPostResponse) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.MEDIUM,
        fieldName: 'companyPostForm',
        children: (
          <PostForm
            post={post}
            companyName={companyName}
            onSuccess={() => {
              resetGlobalModalOuterProps();
              refetch();
            }}
            onCancel={() => resetGlobalModalOuterProps()}
          />
        ),
      });
    },
    [setGlobalModalOuterProps, resetGlobalModalOuterProps, refetch, companyName]
  );

  const handleDelete = useCallback(
    (post: CompanyPostResponse) => {
      if (!post.id) return;
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.SMALL,
        fieldName: 'deleteCompanyPost',
        children: (
          <ConfirmationModal
            title="Delete Post"
            message="Delete this post?"
            description="This action cannot be undone."
            variant="danger"
            confirmButtonText="Delete"
            cancelButtonText="Cancel"
            onConfirm={async () => {
              try {
                await companyService.deletePost(post.id!);
                showSuccess('Post deleted.');
                resetGlobalModalOuterProps();
                refetch();
              } catch (error) {
                showError(extractErrorMessage(error, 'Failed to delete post.'));
                resetGlobalModalOuterProps();
              }
            }}
            onCancel={() => resetGlobalModalOuterProps()}
          />
        ),
      });
    },
    [setGlobalModalOuterProps, resetGlobalModalOuterProps, showSuccess, showError, refetch]
  );

  return (
    <>
      <TabHeader>
        <TabHeaderText>
          <TabTitle>Company Posts</TabTitle>
          <TabDescription>Share updates and announcements — mark a post public to let anyone view it without logging in.</TabDescription>
        </TabHeaderText>
      </TabHeader>

      {canEdit && (
        <ComposeBox type="button" onClick={() => openPostForm()}>
          <ComposeAvatar>{getInitials(companyName)}</ComposeAvatar>
          <span>Share an update...</span>
          <AttachFileIcon fontSize="small" />
        </ComposeBox>
      )}

      {loading ? (
        <LoadingContainer>
          <CircularProgress size={32} />
        </LoadingContainer>
      ) : posts.length === 0 ? (
        <EmptyState>No posts yet.</EmptyState>
      ) : (
        <FeedList>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              canEdit={canEdit}
              canDelete={canDelete}
              onEdit={() => openPostForm(post)}
              onDelete={() => handleDelete(post)}
            />
          ))}
        </FeedList>
      )}
    </>
  );
};
