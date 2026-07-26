import React, { useState } from 'react';
import { Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { PostAttachments } from '../../../../../components/UI/PostAttachments';
import { formatRelativeTime } from '../../../../../utils/formatRelativeTime';
import { getInitials } from '../../../../../utils/getInitials';
import type { CompanyPostResponse } from '../../../../../services/api';
import {
  Card,
  CardHeader,
  HeaderLeft,
  Avatar,
  AuthorBlock,
  AuthorName,
  AuthorMeta,
  MetaDot,
  HeaderActions,
  KebabButton,
  PostContent,
} from './PostCard.styles';

interface PostCardProps {
  post: CompanyPostResponse;
  canEdit: boolean;
  canDelete: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, canEdit, canDelete, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const showMenu = canEdit || canDelete;

  return (
    <Card>
      <CardHeader>
        <HeaderLeft>
          <Avatar>{getInitials(post.authorName)}</Avatar>
          <AuthorBlock>
            <AuthorName>{post.authorName || 'Company'}</AuthorName>
            <AuthorMeta>
              <span>{formatRelativeTime(post.createdAt)}</span>
              <MetaDot />
              {post.isPublic ? <PublicOutlinedIcon /> : <LockOutlinedIcon />}
              <span>{post.isPublic ? 'Public' : 'Private'}</span>
            </AuthorMeta>
          </AuthorBlock>
        </HeaderLeft>
        {showMenu && (
          <HeaderActions>
            <KebabButton
              type="button"
              aria-label="Post actions"
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <MoreVertIcon fontSize="small" />
            </KebabButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
              {canEdit && (
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    onEdit();
                  }}
                >
                  Edit post
                </MenuItem>
              )}
              {canDelete && (
                <MenuItem
                  sx={{ color: 'error.main' }}
                  onClick={() => {
                    setAnchorEl(null);
                    onDelete();
                  }}
                >
                  Delete post
                </MenuItem>
              )}
            </Menu>
          </HeaderActions>
        )}
      </CardHeader>

      <PostContent>{post.content}</PostContent>

      <PostAttachments attachments={post.attachments || []} />
    </Card>
  );
};
