import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { FloowLogo } from '../../components/UI/FloowLogo';

const PageContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '2rem',
});

const ContentBox = styled(Box)({
  background: 'white',
  borderRadius: '16px',
  padding: '3rem 2rem',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  textAlign: 'center',
  maxWidth: '600px',
  width: '100%',
});

const LogoWrapper = styled(Box)({
  marginBottom: '2rem',
  display: 'flex',
  justifyContent: 'center',
});

const Title = styled(Typography)({
  fontSize: '2.5rem',
  fontWeight: 700,
  color: '#1a1a2e',
  marginBottom: '1rem',
});

const Subtitle = styled(Typography)({
  fontSize: '1.5rem',
  fontWeight: 600,
  color: '#667eea',
  marginBottom: '1.5rem',
});

const Message = styled(Typography)({
  fontSize: '1.125rem',
  color: '#6b7280',
  lineHeight: 1.6,
  marginBottom: '2rem',
});

const IconWrapper = styled(Box)({
  fontSize: '4rem',
  marginBottom: '1.5rem',
});

export const WorkerPage: React.FC = () => {
  return (
    <PageContainer>
      <ContentBox>
        <LogoWrapper>
          <FloowLogo variant="light" showText={true} />
        </LogoWrapper>
        <IconWrapper>👷</IconWrapper>
        <Title>Worker Dashboard</Title>
        <Subtitle>Page Under Construction</Subtitle>
        <Message>
          We're working hard to bring you an amazing worker portal experience.
          This page is currently under construction and will be available soon.
        </Message>
        <Message style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
          Thank you for your patience!
        </Message>
      </ContentBox>
    </PageContainer>
  );
};
