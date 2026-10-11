import React from 'react';
import { Skeleton } from '@mui/material';
import DOMPurify from 'dompurify';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import { PostAttachments } from '../../../../../components/UI/PostAttachments';
import { formatRelativeTime } from '../../../../../utils/formatRelativeTime';
import { getInitials } from '../../../../../utils/getInitials';
import type { CompanyPostResponse } from '../../../../../services/api';
import * as S from './CompanyAnnouncementsWidget.styles';

interface CompanyAnnouncementsWidgetProps {
  onViewAllAnnouncements: () => void;
  posts?: CompanyPostResponse[];
  loading?: boolean;
}

export const CompanyAnnouncementsWidget: React.FC<CompanyAnnouncementsWidgetProps> = ({
  onViewAllAnnouncements,
  posts = [],
  loading = false,
}) => {
  return (
    <S.Container>
      <S.Header>
        <S.TitleText variant="h6">Company Announcements</S.TitleText>
        <S.ActionLink onClick={onViewAllAnnouncements}>View All Announcements</S.ActionLink>
      </S.Header>
      <S.AnnouncementsList>
        {loading ? (
          // Skeleton placeholders — 5 to match the visible post count
          Array.from({ length: 5 }).map((_, index) => (
            <S.AnnouncementItem key={`skeleton-${index}`}>
              <S.SkeletonHeader>
                <Skeleton variant="circular" width={36} height={36} animation="wave" />
                <S.SkeletonMeta>
                  <Skeleton variant="text" width="40%" height={16} animation="wave" />
                  <Skeleton variant="text" width="55%" height={12} animation="wave" />
                </S.SkeletonMeta>
              </S.SkeletonHeader>
              <Skeleton variant="text" width="90%" height={14} animation="wave" style={{ marginTop: 6 }} />
              <Skeleton variant="text" width="70%" height={14} animation="wave" />
            </S.AnnouncementItem>
          ))
        ) : posts.length === 0 ? (
          <S.AnnouncementItem style={{ justifyContent: 'center', padding: '40px 0' }}>
            <S.EmptyText>No company announcements posted</S.EmptyText>
          </S.AnnouncementItem>
        ) : (
          posts.map((post) => {
            // "NULLLLLLLL" is a backend sentinel for attachment-only posts —
            // never show it to the user (same guard used in PostCard.tsx).
            const rawContent = post.content === 'NULLLLLLLL' ? '' : (post.content || '');
            const sanitizedContent = DOMPurify.sanitize(rawContent);

            return (
              <S.AnnouncementItem key={post.id}>
                {/* Card header: avatar, author, time, visibility, group */}
                <S.PostHeader>
                  <S.AuthorAvatar>{getInitials(post.authorName)}</S.AuthorAvatar>
                  <S.AuthorBlock>
                    <S.AuthorName>{post.authorName || 'Company'}</S.AuthorName>
                    <S.AuthorMeta>
                      <span>{formatRelativeTime(post.createdAt)}</span>
                      <S.MetaDot />
                      {post.isPublic ? <PublicOutlinedIcon /> : <LockOutlinedIcon />}
                      <span>{post.isPublic ? 'Public' : 'Private'}</span>
                      {post.groupName && (
                        <>
                          <S.MetaDot />
                          <FolderOutlinedIcon />
                          <span>{post.groupName}</span>
                        </>
                      )}
                    </S.AuthorMeta>
                  </S.AuthorBlock>
                </S.PostHeader>

                {/* Rich-text content (HTML from TipTap editor) */}
                {sanitizedContent && (
                  <S.RichContent dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
                )}

                {/* Photos and file attachments */}
                <PostAttachments attachments={post.attachments || []} />
              </S.AnnouncementItem>
            );
          })
        )}
      </S.AnnouncementsList>
    </S.Container>
  );
};
