import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

interface CenteredLoaderProps {
  $minHeight?: string;
}

export const CenteredLoader = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$minHeight',
})<CenteredLoaderProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  min-height: ${({ $minHeight }) => $minHeight || '200px'};
  width: 100%;
`;

export const FullScreenLoader = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.palette.background.default};
  z-index: ${({ theme }) => theme.zIndex.modal + 1};
`;

export const InlineLoader = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const LoaderMessage = styled(Box)`
  color: ${({ theme }) => theme.palette.text.secondary};
  font-size: ${({ theme }) => theme.typography.body2.fontSize};
  text-align: center;
`;
