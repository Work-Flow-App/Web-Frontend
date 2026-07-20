import React from 'react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { IconButton } from '../../../../../components/UI/Button';
import { Badge } from '../../../../../components/UI/Badge';
import type { CompanyPostResponse } from '../../../../../services/api';
import {
  Card,
  CardHeader,
  AuthorBlock,
  AuthorName,
  PostDate,
  HeaderActions,
  PostContent,
  AttachmentsRow,
  AttachmentChip,
} from './PostCard.styles';

interface PostCardProps {
  post: CompanyPostResponse;
  canEdit: boolean;
  canDelete: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, canEdit, canDelete, onEdit, onDelete }) => {
  return (
    <Card>
      <CardHeader>
        <AuthorBlock>
          <AuthorName>{post.authorName || 'Company'}</AuthorName>
          <PostDate>{post.createdAt ? new Date(post.createdAt).toLocaleString() : ''}</PostDate>
        </AuthorBlock>
        <HeaderActions>
          <Badge variant={post.isPublic ? 'success' : 'default'}>{post.isPublic ? 'Public' : 'Private'}</Badge>
          {canEdit && (
            <IconButton size="small" variant="text" color="secondary" aria-label="Edit post" onClick={onEdit}>
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          )}
          {canDelete && (
            <IconButton size="small" variant="text" color="error" aria-label="Delete post" onClick={onDelete}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          )}
        </HeaderActions>
      </CardHeader>

      <PostContent>{post.content}</PostContent>

      {post.attachments && post.attachments.length > 0 && (
        <AttachmentsRow>
          {post.attachments.map((attachment) => (
            <AttachmentChip key={attachment.id} href={attachment.fileUrl} target="_blank" rel="noopener noreferrer">
              <AttachFileIcon sx={{ fontSize: 14 }} />
              {attachment.fileName || 'Attachment'}
            </AttachmentChip>
          ))}
        </AttachmentsRow>
      )}
    </Card>
  );
};
