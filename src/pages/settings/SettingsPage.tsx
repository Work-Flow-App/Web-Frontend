import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { rem } from '../../components/UI/Typography/utility';
import comingSoonImage from '../../assets/logo/coming_soon.png';

const PageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100%',
  width: '100%',
  backgroundColor: theme.palette.colors?.grey_50 || theme.palette.background.default,
  padding: rem(40),
  '@media (max-width: 1536px)': {
    padding: rem(32),
  },
  '@media (max-width: 1366px)': {
    padding: rem(24),
  },
}));

const ContentBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: theme.palette.colors?.white || theme.palette.background.paper,
  borderRadius: rem(16),
  padding: rem(48),
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
  maxWidth: rem(700),
  width: '100%',
  gap: rem(24),
  '@media (max-width: 1536px)': {
    padding: rem(40),
    gap: rem(20),
    maxWidth: rem(650),
  },
  '@media (max-width: 1366px)': {
    padding: rem(32),
    gap: rem(16),
    maxWidth: rem(600),
  },
}));

const ImageWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  marginBottom: rem(8),
  '& img': {
    maxWidth: '100%',
    height: 'auto',
    maxHeight: rem(300),
    objectFit: 'contain',
  },
  '@media (max-width: 1536px)': {
    '& img': {
      maxHeight: rem(250),
    },
  },
  '@media (max-width: 1366px)': {
    '& img': {
      maxHeight: rem(220),
    },
  },
});

const Title = styled(Typography)(({ theme }) => ({
  fontSize: rem(32),
  fontWeight: theme.typography.fontWeightBold || 700,
  color: theme.palette.colors?.grey_900 || theme.palette.text.primary,
  lineHeight: 1.2,
  marginBottom: rem(8),
  '@media (max-width: 1536px)': {
    fontSize: rem(28),
  },
  '@media (max-width: 1366px)': {
    fontSize: rem(26),
  },
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  fontSize: rem(20),
  fontWeight: theme.typography.fontWeightMedium || 600,
  color: theme.palette.primary.main,
  marginBottom: rem(12),
  '@media (max-width: 1536px)': {
    fontSize: rem(18),
  },
  '@media (max-width: 1366px)': {
    fontSize: rem(16),
  },
}));

const Message = styled(Typography)(({ theme }) => ({
  fontSize: rem(16),
  fontWeight: 500,
  color: theme.palette.colors?.grey_700 || theme.palette.text.secondary,
  lineHeight: 1.6,
  maxWidth: rem(500),
  '@media (max-width: 1536px)': {
    fontSize: rem(15),
  },
  '@media (max-width: 1366px)': {
    fontSize: rem(14),
  },
}));

export const SettingsPage: React.FC = () => {
  return (
    <PageContainer>
      <ContentBox>
        <ImageWrapper>
          <img src={comingSoonImage} alt="Coming Soon" />
        </ImageWrapper>
        <Title>Settings Dashboard</Title>
        <Subtitle>Page Under Construction</Subtitle>
        <Message>
          We're working hard to bring you an amazing experience.
          This page is currently under construction and will be available soon.
        </Message>
        <Message>
          Thank you for your patience!
        </Message>
      </ContentBox>
    </PageContainer>
  );
};
