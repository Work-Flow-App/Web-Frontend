import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/UI/Button';
import { authService } from '../../services/api/auth';
import { getRoleFromToken } from '../../utils/jwt';
import notFoundImage from '../../assets/logo/404.png';
import {
  NotFoundContainer,
  ContentWrapper,
  ImageWrapper,
  TextWrapper,
  Title,
  Subtitle,
  ButtonWrapper,
} from './NotFound.styles';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    // Get user role from token (same pattern as Layout component)
    const token = authService.getAccessToken();

    if (!token) {
      // If no token, redirect to login
      navigate('/login');
      return;
    }

    const userRole = getRoleFromToken(token);

    // Navigate to appropriate dashboard based on user role
    if (userRole === 'ROLE_COMPANY' || userRole === 'COMPANY') {
      navigate('/company');
    } else if (userRole === 'ROLE_WORKER' || userRole === 'WORKER') {
      navigate('/worker');
    } else {
      // If no valid role found, redirect to login
      navigate('/login');
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <NotFoundContainer>
      <ContentWrapper>
        <ImageWrapper>
          <img src={notFoundImage} alt="404 - Page Not Found" />
        </ImageWrapper>

        <TextWrapper>
          <Title>Page Not Found</Title>
          <Subtitle>
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </Subtitle>
        </TextWrapper>

        <ButtonWrapper>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={handleGoBack}
          >
            Go Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleGoToDashboard}
          >
            Go to Dashboard
          </Button>
        </ButtonWrapper>
      </ContentWrapper>
    </NotFoundContainer>
  );
};
