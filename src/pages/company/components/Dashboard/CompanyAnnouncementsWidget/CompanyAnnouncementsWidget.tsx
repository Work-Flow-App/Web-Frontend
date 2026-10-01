import React from 'react';
import { Skeleton } from '@mui/material';
import type { Announcement } from '../types';
import * as S from './CompanyAnnouncementsWidget.styles';

interface CompanyAnnouncementsWidgetProps {
  onViewAllAnnouncements: () => void;
  announcements?: Announcement[];
  loading?: boolean;
}

export const CompanyAnnouncementsWidget: React.FC<CompanyAnnouncementsWidgetProps> = ({
  onViewAllAnnouncements,
  announcements = [],
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
          // Render skeleton announcements
          Array.from({ length: 2 }).map((_, index) => (
            <S.AnnouncementItem key={`skeleton-${index}`}>
              <S.ItemHeader>
                <Skeleton variant="text" width="40%" height={18} animation="wave" />
                <Skeleton variant="text" width="30%" height={14} animation="wave" />
              </S.ItemHeader>
              <Skeleton variant="text" width="90%" height={16} animation="wave" style={{ marginTop: '4px' }} />
              <Skeleton variant="text" width="60%" height={16} animation="wave" />
            </S.AnnouncementItem>
          ))
        ) : announcements.length === 0 ? (
          <S.AnnouncementItem style={{ justifyContent: 'center', padding: '40px 0' }}>
            <S.ItemContent style={{ textAlign: 'center', color: '#9CA3AF' }}>No company announcements posted</S.ItemContent>
          </S.AnnouncementItem>
        ) : (
          announcements.map((post) => (
            <S.AnnouncementItem key={post.id}>
              <S.ItemHeader>
                <S.ItemTitle variant="subtitle2">{post.title}</S.ItemTitle>
                <S.ItemMeta variant="caption">Posted by {post.author} • {post.date}</S.ItemMeta>
              </S.ItemHeader>
              <S.ItemContent variant="body2">{post.content}</S.ItemContent>
            </S.AnnouncementItem>
          ))
        )}
      </S.AnnouncementsList>
    </S.Container>
  );
};
