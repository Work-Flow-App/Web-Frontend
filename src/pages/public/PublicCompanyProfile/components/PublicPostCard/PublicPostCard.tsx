import React from 'react';
import { PostAttachments } from '../../../../../components/UI/PostAttachments';
import { formatRelativeTime } from '../../../../../utils/formatRelativeTime';
import { getInitials } from '../../../../../utils/getInitials';
import type { CompanyPostResponse } from '../../../../../services/api';
import { Card, CardHeader, Avatar, AuthorBlock, AuthorName, PostDate, PostContent } from './PublicPostCard.styles';

interface PublicPostCardProps {
  post: CompanyPostResponse;
}

export const PublicPostCard: React.FC<PublicPostCardProps> = ({ post }) => {
  return (
    <Card>
      <CardHeader>
        <Avatar>{getInitials(post.authorName)}</Avatar>
        <AuthorBlock>
          <AuthorName>{post.authorName || 'Company'}</AuthorName>
          <PostDate>{formatRelativeTime(post.createdAt)}</PostDate>
        </AuthorBlock>
      </CardHeader>

      <PostContent>{post.content}</PostContent>

      <PostAttachments attachments={post.attachments || []} />
    </Card>
  );
};
