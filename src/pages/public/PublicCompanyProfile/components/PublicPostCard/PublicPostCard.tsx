import React from 'react';
import DOMPurify from 'dompurify';
import { PostAttachments } from '../../../../../components/UI/PostAttachments';
import { formatRelativeTime } from '../../../../../utils/formatRelativeTime';
import { getInitials } from '../../../../../utils/getInitials';
import type { CompanyPostResponse } from '../../../../../services/api';
import { Card, CardHeader, Avatar, AuthorBlock, AuthorName, PostDate, PostContent } from './PublicPostCard.styles';

interface PublicPostCardProps {
  post: CompanyPostResponse;
}

export const PublicPostCard: React.FC<PublicPostCardProps> = ({ post }) => {
  // NULLLLLLLL is a backend sentinel for attachment-only posts — never display it to the user.
  const rawContent = post.content === 'NULLLLLLLL' ? '' : (post.content || '');
  const sanitizedContent = DOMPurify.sanitize(rawContent);

  return (
    <Card>
      <CardHeader>
        <Avatar>{getInitials(post.authorName)}</Avatar>
        <AuthorBlock>
          <AuthorName>{post.authorName || 'Company'}</AuthorName>
          <PostDate>
            {formatRelativeTime(post.createdAt)}
            {post.groupName && ` · ${post.groupName}`}
          </PostDate>
        </AuthorBlock>
      </CardHeader>

      {sanitizedContent && (
        <PostContent dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
      )}

      <PostAttachments attachments={post.attachments || []} />
    </Card>
  );
};
