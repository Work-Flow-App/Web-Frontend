import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FloowLogo } from '../../../components/UI/FloowLogo';
import { Button } from '../../../components/UI/Button';
import { AuthRightSection } from '../../../components/Auth/AuthRightSection';
import { authService } from '../../../services/api';
import { getRoleFromToken } from '../../../utils/jwt';
import { extractErrorMessage } from '../../../utils/errorHandler';
import {
  VerifyEmailContainer,
  LeftSection,
  FormContainer,
  HeaderSection,
  Title,
  Subtitle,
  ActionContainer,
  BackToLoginLink,
} from './VerifyEmail.styles';

type VerifyStatus = 'loading' | 'success' | 'error';

export const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<VerifyStatus>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setErrorMessage('No verification token found. Please use the link from your email.');
      setStatus('error');
      return;
    }

    authService
      .verifyEmail(token)
      .then((response) => {
        const accessToken = response.data.accessToken;
        let userRole: string | null = null;

        if (accessToken) {
          userRole = getRoleFromToken(accessToken);
          if (userRole) localStorage.setItem('user_role', userRole);
        }

        setStatus('success');

        setTimeout(() => {
          if (userRole === 'ROLE_COMPANY' || userRole === 'COMPANY') {
            navigate('/company');
          } else if (userRole === 'ROLE_WORKER' || userRole === 'WORKER') {
            navigate('/worker');
          } else {
            navigate('/company');
          }
        }, 1500);
      })
      .catch((error: unknown) => {
        setErrorMessage(
          extractErrorMessage(error, 'Verification failed. The link may be invalid or expired.')
        );
        setStatus('error');
      });
  }, [token, navigate]);

  const handleResend = () => {
    navigate('/resend-verification');
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <VerifyEmailContainer>
      <LeftSection>
        <FormContainer>
          <HeaderSection>
            <FloowLogo variant="light" showText={true} />

            {status === 'loading' && (
              <>
                <Title>Verifying your email...</Title>
                <Subtitle>Please wait while we verify your email address.</Subtitle>
              </>
            )}

            {status === 'success' && (
              <>
                <Title>Email Verified!</Title>
                <Subtitle>
                  Your email has been verified successfully. Redirecting you to the dashboard...
                </Subtitle>
              </>
            )}

            {status === 'error' && (
              <>
                <Title>Verification Failed</Title>
                <Subtitle>{errorMessage}</Subtitle>
                <ActionContainer>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    onClick={handleResend}
                  >
                    Resend Verification Email
                  </Button>
                  <BackToLoginLink onClick={handleBackToLogin}>
                    Back to Login
                  </BackToLoginLink>
                </ActionContainer>
              </>
            )}
          </HeaderSection>
        </FormContainer>
      </LeftSection>

      <AuthRightSection />
    </VerifyEmailContainer>
  );
};
