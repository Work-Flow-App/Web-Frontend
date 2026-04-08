import React from 'react';
import { useTheme } from '@mui/material';
import * as S from './FloowLogo.styled';
import floowLogoLightSvg from '../../../assets/logo/workflowwLogo/WorkFloow Log1o.svg';
import floowLogoWhiteSvg from '../../../assets/logo/workflowwLogo/WorkFloow Logo.svg';
import floowLogoIconSvg from '../../../assets/logo/workflowwLogo/Connect Shape.svg';
import type { FloowLogoProps } from './FloowLogo.types';

function FloowLogo({ width, height, variant = 'light', iconOnly = false }: FloowLogoProps): React.ReactElement {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const logoStyle = {
    ...(width && { width }),
    ...(height && { height }),
  };

  const logoSrc = iconOnly
    ? floowLogoIconSvg
    : variant === 'white'
      ? floowLogoWhiteSvg
      : isDark
        ? floowLogoWhiteSvg
        : floowLogoLightSvg;

  const iconStyle = iconOnly
    ? { ...logoStyle, height: logoStyle.height ?? '32px', width: 'auto' }
    : logoStyle;

  return (
    <S.Container variant={variant}>
      <S.LogoIcon src={logoSrc} alt="Workfloww Icon" style={iconStyle} />
    </S.Container>
  );
}

export { FloowLogo as default, FloowLogo };
