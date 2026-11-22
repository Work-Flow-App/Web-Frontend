import React from 'react';
import { Box } from '@mui/material';
import darkLogoSvg from '../../../assets/logo/workflowwLogo/WorkFloow Log1o.svg';
import * as styles from './styles';

export interface BrandLogoProps {
  variant?: 'desktop' | 'phone';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ variant = 'desktop' }) => {
  const isPhone = variant === 'phone';
  return (
    <Box
      component="img"
      src={darkLogoSvg}
      alt="Workfloow"
      sx={isPhone ? styles.brandLogoImgPhone : styles.brandLogoImgDesktop}
    />
  );
};
