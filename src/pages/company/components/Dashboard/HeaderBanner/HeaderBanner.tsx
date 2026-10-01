import React from 'react';
import { Skeleton } from '@mui/material';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import * as S from './HeaderBanner.styles';

interface HeaderBannerProps {
  companyName?: string;
  tagline?: string;
  logoUrl?: string;
  loading?: boolean;
  onCustomizeClick: () => void;
  onNewJobClick: () => void;
  onProfileClick: () => void;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  companyName = 'ACME Corp',
  tagline = 'Building better future',
  logoUrl,
  loading = false,
  onCustomizeClick,
  onNewJobClick,
  onProfileClick,
}) => {
  return (
    <S.BannerContainer>
      <S.LeftSection>
        {loading ? (
          <>
            <Skeleton variant="circular" width={56} height={56} animation="wave" />
            <S.TextContainer>
              <Skeleton variant="text" width={160} height={28} animation="wave" />
              <Skeleton variant="text" width={120} height={18} animation="wave" />
            </S.TextContainer>
          </>
        ) : (
          <>
            <S.LogoContainer>
              {logoUrl ? (
                <S.LogoImage src={logoUrl} alt={`${companyName} Logo`} />
              ) : (
                <S.FallbackLogo>{companyName.slice(0, 2).toUpperCase()}</S.FallbackLogo>
              )}
            </S.LogoContainer>
            <S.TextContainer>
              <S.CompanyNameText variant="h1" onClick={onProfileClick}>
                {companyName}
              </S.CompanyNameText>
              <S.CompanyTaglineText variant="body2">{tagline}</S.CompanyTaglineText>
            </S.TextContainer>
          </>
        )}
      </S.LeftSection>
      <S.RightSection>
        <S.ActionButton onClick={onCustomizeClick}>
          <SettingsOutlinedIcon fontSize="small" />
          <span>Customize Dashboard</span>
        </S.ActionButton>
        <S.ActionButton primary onClick={onNewJobClick}>
          <AddCircleOutlineOutlinedIcon fontSize="small" />
          <span>New Job</span>
        </S.ActionButton>
      </S.RightSection>
    </S.BannerContainer>
  );
};
