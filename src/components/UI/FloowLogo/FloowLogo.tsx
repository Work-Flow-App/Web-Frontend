import React from 'react';
import * as S from './FloowLogo.styled';
import floowLogoLightSvg from '../../../assets/logo/floow/floow_logo.svg';
import floowLogoWhiteSvg from '../../../assets/logo/floow/floow_logo_white.svg';
import type { FloowLogoProps } from './FloowLogo.types';

function FloowLogo({ showText = true, width, height, variant = 'light' }: FloowLogoProps): React.ReactElement {
  const logoStyle = {
    ...(width && { width }),
    ...(height && { height }),
  };

  const logoSrc = variant === 'white' ? floowLogoWhiteSvg : floowLogoLightSvg;

  return (
    <S.Container variant={variant}>
      <S.LogoIcon src={logoSrc} alt="Floow Logo" style={logoStyle} />
      {showText && <S.LogoText variant={variant}>Floow</S.LogoText>}
    </S.Container>
  );
}

export { FloowLogo as default, FloowLogo };
