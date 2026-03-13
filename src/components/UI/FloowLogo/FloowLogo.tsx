import React from 'react';
import * as S from './FloowLogo.styled';
import floowLogoLightSvg from '../../../assets/logo/workflowwLogo/2687_floow_SR-02.svg';
import floowLogoWhiteSvg from '../../../assets/logo/workflowwLogo/2687_floow_SR-01.svg';
import floowLogoIconSvg from '../../../assets/logo/workflowwLogo/2687_floow_SR-03.svg';
import type { FloowLogoProps } from './FloowLogo.types';

function FloowLogo({ width, height, variant = 'light', iconOnly = false }: FloowLogoProps): React.ReactElement {
  const logoStyle = {
    ...(width && { width }),
    ...(height && { height }),
  };

  const logoSrc = iconOnly
    ? floowLogoIconSvg
    : variant === 'white'
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
