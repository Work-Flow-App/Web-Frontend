import React from 'react';
import * as S from './FloowLogo.styled';
import floowLogoLightSvg from '../../../assets/logo/workflowwLogo/2687_floow_SR-02.svg';
import floowLogoWhiteSvg from '../../../assets/logo/workflowwLogo/2687_floow_SR-01.svg';
import type { FloowLogoProps } from './FloowLogo.types';

function FloowLogo({ width, height, variant = 'light' }: FloowLogoProps): React.ReactElement {
  const logoStyle = {
    ...(width && { width }),
    ...(height && { height }),
  };

  const logoSrc = variant === 'white' ? floowLogoWhiteSvg : floowLogoLightSvg;

  return (
    <S.Container variant={variant}>
      <S.LogoIcon src={logoSrc} alt="Workfloww Logo" style={logoStyle} />
    </S.Container>
  );
}

export { FloowLogo as default, FloowLogo };
