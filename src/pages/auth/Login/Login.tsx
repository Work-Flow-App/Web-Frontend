import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import type { ObjectSchema } from 'yup';
import { GoogleLogin } from '@react-oauth/google';
import { Box, Link, useMediaQuery, useTheme } from '@mui/material';
import { getRoleFromToken } from '../../../utils/jwt';
import { extractErrorMessage } from '../../../utils/errorHandler';
import { useAuth } from '../../../contexts/AuthContext';
import { useSchema } from '../../../utils/validation';
import { LoginFormSchema } from './LoginSchema';
import { SUPPORT_EMAIL } from './constants';
import { useGreeting } from './useGreeting';
import { useFormRouteProgress } from './useFormRouteProgress';
import { RouteMapDesktop } from './RouteMapDesktop';
import { RouteMapPhone } from './RouteMapPhone';
import { AuthShell } from './AuthShell';
import { RLInput, RLForm } from './styles';
import * as styles from './styles';
import type { LoginFormData } from './ILogin';

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function redirectByRole(role: string | null, navigate: ReturnType<typeof useNavigate>): void {
  if (role === 'ROLE_COMPANY' || role === 'COMPANY') {
    navigate('/company');
  } else if (role === 'ROLE_WORKER' || role === 'WORKER') {
    navigate('/worker');
  } else {
    navigate('/company');
  }
}

// ─── Google SVG icon ──────────────────────────────────────────────────────────

const GoogleIcon = () => (
  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 48 48">
    <path
      fill="#FFC107"
      d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34.1 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z"
    />
    <path
      fill="#FF3D00"
      d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z"
    />
  </svg>
);

// ─── Success content ───────────────────────────────────────────────────────────

// ─── Main component ───────────────────────────────────────────────────────────

export const Login: React.FC = () => {
  const { fieldRules, defaultValues } = useSchema(LoginFormSchema);

  const methods = useForm<LoginFormData>({
    resolver: yupResolver(fieldRules as unknown as ObjectSchema<LoginFormData>),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;

  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.down('md'));
  const greeting = useGreeting();

  // ── UI state ────────────────────────────────────────────────────────────────
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [signupName, setSignupName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResendLink, setShowResendLink] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);

  // ── Watch form values for route progress ────────────────────────────────────
  const watchedUserName = watch('userName') ?? '';
  const watchedPassword = watch('password') ?? '';

  // ── Dynamic Heading and Subheading ──────────────────────────────────────────
  const firstName = useMemo(() => {
    return signupName.trim() ? signupName.trim().split(' ')[0] : '';
  }, [signupName]);

  const heading = useMemo(() => {
    if (mode === 'signup') {
      if (firstName) {
        return isPhone ? `Hi ${firstName}!` : `Hi ${firstName}, let's set you up`;
      }
      return 'Start free today';
    }
    return greeting || 'Good afternoon';
  }, [mode, firstName, isPhone, greeting]);

  const subheading = useMemo(() => {
    if (mode === 'signup') {
      return isPhone
        ? 'Free for 14 days. No card needed.'
        : 'Free for 14 days. No card needed. Takes about a minute.';
    }
    return 'Log in to see today\u2019s jobs. Your day fills in as you type.';
  }, [mode, isPhone]);

  // ── Route progress for phone ────────────────────────────────────────────────
  const routeProgress = useFormRouteProgress({
    name: signupName,
    userName: watchedUserName,
    password: watchedPassword,
    mode,
  });

  // ── Handlers ────────────────────────────────────────────────────────────────

  const onSubmit = async (data: LoginFormData) => {
    if (mode === 'signup') {
      if (!signupName.trim()) {
        setErrorMsg('Add your name so we know what to call you.');
        return;
      }
      if (!data.userName.trim()) {
        setErrorMsg('Add your email or mobile number.');
        return;
      }
      if (!data.password.trim() || data.password.length < 8) {
        setErrorMsg('Make a password to keep your account safe.');
        return;
      }
      navigate('/signup', {
        state: { name: signupName.trim(), email: data.userName.trim() },
      });
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setShowResendLink(false);

    try {
      const response = await login({ userName: data.userName, password: data.password });
      const role = response.data.accessToken
        ? getRoleFromToken(response.data.accessToken)
        : null;
      if (role) localStorage.setItem('user_role', role);

      // Directly redirect to dashboard
      redirectByRole(role, navigate);
    } catch (error: unknown) {
      const msg = extractErrorMessage(error, 'Failed to sign in. Please try again.');
      if (msg === 'User is disabled') {
        setShowResendLink(true);
        setErrorMsg('Please verify your email before logging in.');
      } else {
        setErrorMsg(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credential: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await loginWithGoogle(credential);
      const role = response.data.accessToken
        ? getRoleFromToken(response.data.accessToken)
        : null;
      if (role) localStorage.setItem('user_role', role);

      // Directly redirect to dashboard
      redirectByRole(role, navigate);
    } catch (error: unknown) {
      setErrorMsg(extractErrorMessage(error, 'Google sign-in failed. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  // ── Shared UI sub-elements ──────────────────────────────────────────────────

  const FormHeading = (
    <Box sx={styles.headingBox}>
      <Box component="h1" sx={styles.h1Style}>
        {heading}
      </Box>
      <Box component="p" sx={styles.subStyle}>
        {subheading}
      </Box>
    </Box>
  );

  const TabGroup = (
    <Box role="tablist" aria-label="Log in or start free" sx={styles.tabGroup}>
      <Box
        component="button"
        type="button"
        role="tab"
        aria-selected={mode === 'login'}
        sx={mode === 'login' ? styles.tabBtnActive : styles.tabBtnInactive}
        onClick={() => {
          setMode('login');
          setErrorMsg(null);
        }}
      >
        I have an account
      </Box>
      <Box
        component="button"
        type="button"
        role="tab"
        aria-selected={mode === 'signup'}
        sx={mode === 'signup' ? styles.tabBtnActive : styles.tabBtnInactive}
        onClick={() => {
          setMode('signup');
          setErrorMsg(null);
        }}
      >
        I&apos;m new here
      </Box>
    </Box>
  );

  const GoogleWrapper = (
    <Box component="div" sx={styles.googleBtn}>
      <GoogleIcon />
      <Box component="span">Continue with Google</Box>
      <Box sx={styles.googleIframeOverlay}>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            if (credentialResponse.credential) {
              handleGoogleSuccess(credentialResponse.credential);
            }
          }}
          onError={() => {
            setErrorMsg('Google sign-in was cancelled or failed.');
          }}
          width="100%"
          text="signin_with"
          shape="rectangular"
          theme="outline"
        />
      </Box>
    </Box>
  );

  const DividerEl = (
    <Box aria-hidden="true" sx={styles.dividerRow}>
      <Box sx={styles.dividerLine} />
      <Box component="span">or</Box>
      <Box sx={styles.dividerLine} />
    </Box>
  );

  const hasError = !!(errorMsg || errors.userName || errors.password);
  const errorText =
    errorMsg ??
    errors.userName?.message ??
    errors.password?.message ??
    null;

  const FormBody = (
    <RLForm onSubmit={handleSubmit(onSubmit)} noValidate>
      <Box sx={styles.formStack}>
        {/* Name field (signup mode only) */}
        {mode === 'signup' && (
          <Box sx={styles.fieldWrapper}>
            <Box component="label" htmlFor="rl-name" sx={styles.fieldLabel}>
              Your name
            </Box>
            <RLInput
              id="rl-name"
              type="text"
              autoComplete="name"
              placeholder="Sam Taylor"
              value={signupName}
              onChange={(e) => {
                setSignupName(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
            />
          </Box>
        )}

        {/* Username/Email field */}
        <Box sx={styles.fieldWrapper}>
          <Box component="label" htmlFor="rl-user" sx={styles.fieldLabel}>
            {mode === 'signup' ? 'Email or mobile number' : 'Username'}
          </Box>
          <RLInput
            id="rl-user"
            type="text"
            autoComplete="username"
            placeholder={mode === 'signup' ? 'sam@taylorplumbing.com' : 'Enter your username'}
            aria-invalid={!!errors.userName}
            {...methods.register('userName')}
          />
        </Box>

        {/* Password field */}
        <Box sx={styles.fieldWrapper}>
          <Box component="label" htmlFor="rl-pass" sx={styles.fieldLabel}>
            {mode === 'signup' ? 'Create a password' : 'Password'}
          </Box>
          <Box sx={styles.passWrapper}>
            <RLInput
              id="rl-pass"
              type={showPass ? 'text' : 'password'}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              placeholder={mode === 'signup' ? 'At least 8 letters or numbers' : 'Enter your password'}
              aria-invalid={!!errors.password}
              {...methods.register('password')}
            />
            <Box
              component="button"
              type="button"
              aria-pressed={showPass}
              sx={styles.eyeBtn}
              onClick={() => setShowPass((s) => !s)}
            >
              {showPass ? 'Hide' : 'Show'}
            </Box>
          </Box>
        </Box>

        {/* Error Alert */}
        {hasError && errorText && (
          <Box role="alert" sx={styles.errorAlert}>
            <Box
              component="svg"
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
              sx={styles.errorAlertIcon}
            >
              <circle cx="10" cy="10" r="8" stroke="#8A1C12" strokeWidth="1.8" />
              <line x1="10" y1="6" x2="10" y2="11" stroke="#8A1C12" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="10" cy="14" r="1" fill="#8A1C12" />
            </Box>
            <Box component="span" sx={styles.errorAlertText}>
              {errorText}
              {showResendLink && (
                <>
                  {' '}
                  <Link
                    href={`/resend-verification?email=${encodeURIComponent(watchedUserName)}`}
                    sx={styles.resendLink}
                  >
                    Resend verification email
                  </Link>
                </>
              )}
            </Box>
          </Box>
        )}

        {/* Submit button with arrow */}
        <Box
          component="button"
          type="submit"
          disabled={isLoading}
          sx={styles.submitBtn}
        >
          <Box component="span">
            {isLoading
              ? 'Checking...'
              : mode === 'signup'
              ? 'Continue'
              : 'Log in'}
          </Box>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Box>

        {/* Reset link (login mode only) */}
        {mode === 'login' && (
          <Box
            component="button"
            type="button"
            sx={styles.resetLink}
            onClick={() => navigate('/forgot-password')}
          >
            Can&apos;t get in? Reset your password
          </Box>
        )}
      </Box>
    </RLForm>
  );

  const SupportCard = (
    <Box sx={styles.supportCard}>
      <Box sx={styles.supportIconBox}>
        <Box
          component="svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0B0E0B"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          sx={styles.supportSvg}
        >
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </Box>
      </Box>
      <Box sx={styles.supportTextStack}>
        <Box component="span" sx={styles.supportTitle}>
          Stuck? Just mail us.
        </Box>
        <Box
          component="a"
          href={`mailto:${SUPPORT_EMAIL}?subject=Help%20with%20logging%20in`}
          sx={styles.supportEmailText}
        >
          {SUPPORT_EMAIL}
        </Box>
      </Box>
    </Box>
  );

  const PrivacyNote = (
    <Box component="p" sx={styles.privacyRow}>
      <svg
        aria-hidden="true"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </svg>
      <Box component="span">Your jobs and customer details are kept private</Box>
    </Box>
  );

  const DesktopMap = <RouteMapDesktop />;

  const PhoneMap = (
    <RouteMapPhone
      seg1={routeProgress.seg1}
      seg2={routeProgress.seg2}
      seg3={routeProgress.seg3}
      pin1Fill={routeProgress.pin1Fill}
      pin1Stroke={routeProgress.pin1Stroke}
      pin2Fill={routeProgress.pin2Fill}
      pin2Stroke={routeProgress.pin2Stroke}
      pin3Fill={routeProgress.pin3Fill}
      pin3Stroke={routeProgress.pin3Stroke}
      lit={routeProgress.lit}
    />
  );

  return (
    <AuthShell
      desktopMap={DesktopMap}
      phoneMap={PhoneMap}
      footer={
        <>
          {SupportCard}
          {PrivacyNote}
        </>
      }
    >
      {FormHeading}
      {TabGroup}
      {GoogleWrapper}
      {DividerEl}
      {FormBody}
    </AuthShell>
  );
};
export default Login;
