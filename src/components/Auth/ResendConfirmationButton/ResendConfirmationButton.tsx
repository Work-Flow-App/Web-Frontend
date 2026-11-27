import React, { useEffect, useState } from 'react';
import { Button } from '../../UI/Button';
import { authService } from '../../../services/api';
import { getErrorStatus } from '../../../utils/authFlow';
import { Wrapper, StatusText } from './ResendConfirmationButton.styles';
import type { ResendConfirmationButtonProps } from './ResendConfirmationButton.types';

const COOLDOWN_SECONDS = 60;

export const ResendConfirmationButton: React.FC<ResendConfirmationButtonProps> = ({
  email,
  variant = 'outlined',
  label = 'Send the confirmation email again',
}) => {
  const [sending, setSending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [status, setStatus] = useState<'idle' | 'sent' | 'rate-limited'>('idle');

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const handleClick = async () => {
    setSending(true);
    try {
      await authService.resendVerification(email);
      setStatus('sent');
    } catch (error: unknown) {
      // The backend answers 200 whether or not the address exists; only rate limiting surfaces
      setStatus(getErrorStatus(error) === 429 ? 'rate-limited' : 'sent');
    } finally {
      setSending(false);
      setSecondsLeft(COOLDOWN_SECONDS);
    }
  };

  const buttonText = sending
    ? 'Sending...'
    : secondsLeft > 0
      ? `Send again in ${secondsLeft}s`
      : label;

  return (
    <Wrapper>
      <Button
        type="button"
        variant={variant}
        color="primary"
        size="large"
        fullWidth
        disabled={sending || secondsLeft > 0 || !email}
        onClick={handleClick}
      >
        {buttonText}
      </Button>
      {status === 'sent' && (
        <StatusText tone="success">Sent. Check your inbox and spam folder for an email from Workfloow.</StatusText>
      )}
      {status === 'rate-limited' && (
        <StatusText tone="warning">Too many attempts. Please wait a minute and try again.</StatusText>
      )}
    </Wrapper>
  );
};
