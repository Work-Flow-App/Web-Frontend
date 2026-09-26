import React, { useCallback, useMemo, useState } from 'react';
import { CircularProgress } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import {
  useGlobalModalOuterContext,
  ModalSizes,
  ConfirmationModal,
} from '../../../../../components/UI/GlobalModal';
import { companyService } from '../../../../../services/api';
import type { CompanyPostGroupResponse, CompanyPostResponse } from '../../../../../services/api';
import { useFetch } from '../../../../../hooks/useFetch';
import { useSnackbar } from '../../../../../contexts/SnackbarContext';
import { useCompanyRole } from '../../../../../contexts/CompanyRoleContext';
import { extractErrorMessage } from '../../../../../utils/errorHandler';
import { getInitials } from '../../../../../utils/getInitials';
import { PostForm } from './PostForm';
import { PostCard } from './PostCard';
import { ManagePostGroups } from './ManagePostGroups';
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
  GroupFilterRow,
  GroupFilterChip,
  ManageGroupsButton,
} from './PostsTab.styles';

interface PostsTabProps {
  companyId?: number;
  companyName?: string;
}

export const PostsTab: React.FC<PostsTabProps> = ({ companyId, companyName }) => {
  const { showSuccess, showError } = useSnackbar();
  const { canEdit, canDelete } = useCompanyRole();
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();

  const [selectedGroupId, setSelectedGroupId] = useState<number | undefined>(undefined);

  const fetchPosts = useCallback(() => companyService.getPosts(selectedGroupId), [selectedGroupId]);
  const { data, loading, refetch } = useFetch<CompanyPostResponse[]>(fetchPosts, [selectedGroupId], {
    onError: (err) => showError(extractErrorMessage(err, 'Failed to load posts.')),
  });

  const fetchGroups = useCallback(() => companyService.getPostGroups(companyId!), [companyId]);
  const { data: groupsData, refetch: refetchGroups } = useFetch<CompanyPostGroupResponse[]>(fetchGroups, [companyId], {
    skip: !companyId,
    onError: (err) => showError(extractErrorMessage(err, 'Failed to load post groups.')),
  });

  const posts = useMemo(() => data || [], [data]);
  const groups = useMemo(() => groupsData || [], [groupsData]);

  const openManageGroups = useCallback(() => {
    if (!companyId) return;
    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.SMALL,
      fieldName: 'managePostGroups',
      children: (
        <ManagePostGroups
          companyId={companyId}
          groups={groups}
          onGroupsChange={() => {
            refetchGroups();
            // Renamed/deleted groups change groupName/groupId on existing posts.
            refetch();
          }}
          onClose={() => {
            resetGlobalModalOuterProps();
            // The selected filter may point at a group that was just deleted.
            setSelectedGroupId(undefined);
          }}
        />
      ),
    });
  }, [companyId, groups, setGlobalModalOuterProps, resetGlobalModalOuterProps, refetchGroups, refetch]);

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
            groups={groups}
            defaultGroupId={post ? undefined : selectedGroupId}
            onSuccess={() => {
              resetGlobalModalOuterProps();
              refetch();
            }}
            onCancel={() => resetGlobalModalOuterProps()}
          />
        ),
      });
    },
    [setGlobalModalOuterProps, resetGlobalModalOuterProps, refetch, companyName, groups, selectedGroupId]
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

      {(groups.length > 0 || (canEdit && companyId)) && (
        <GroupFilterRow>
          {groups.length > 0 && (
            <>
              <GroupFilterChip
                type="button"
                active={selectedGroupId === undefined}
                onClick={() => setSelectedGroupId(undefined)}
              >
                All
              </GroupFilterChip>
              {groups.map((group) => (
                <GroupFilterChip
                  key={group.id}
                  type="button"
                  active={selectedGroupId === group.id}
                  onClick={() => setSelectedGroupId(group.id)}
                >
                  {group.name}
                </GroupFilterChip>
              ))}
            </>
          )}
          {canEdit && companyId && (
            <ManageGroupsButton type="button" onClick={openManageGroups}>
              <SettingsOutlinedIcon />
              Manage groups
            </ManageGroupsButton>
          )}
        </GroupFilterRow>
      )}

      {loading ? (
        <LoadingContainer>
          <CircularProgress size={32} />
        </LoadingContainer>
      ) : posts.length === 0 ? (
        <EmptyState>{selectedGroupId !== undefined ? 'No posts in this group yet.' : 'No posts yet.'}</EmptyState>
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
