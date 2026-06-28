import React from 'react';
import { CircularProgress } from '@mui/material';
import * as S from './Loader.styles';
import type { ILoader } from './ILoader';

/**
 * Loader component - A reusable loading indicator
 *
 * @component
 * @example
 * ```tsx
 * // Simple loader
 * <Loader />
 *
 * // Centered loader with custom size
 * <Loader size={60} centered />
 *
 * // Loader with custom min height
 * <Loader minHeight="400px" centered />
 *
 * // Loader with message
 * <Loader message="Loading data..." />
 * ```
 */
export const Loader: React.FC<ILoader> = ({
  size = 40,
  centered = true,
  fullScreen = false,
  minHeight = '200px',
  message,
  color = 'primary',
}) => {
  const content = (
    <>
      <CircularProgress size={size} color={color} />
      {message && <S.LoaderMessage>{message}</S.LoaderMessage>}
    </>
  );

  if (fullScreen) {
    return (
      <S.FullScreenLoader>
        {content}
      </S.FullScreenLoader>
    );
  }

  if (centered) {
    return (
      <S.CenteredLoader $minHeight={minHeight}>
        {content}
      </S.CenteredLoader>
    );
  }

  return <S.InlineLoader>{content}</S.InlineLoader>;
};

export default Loader;
