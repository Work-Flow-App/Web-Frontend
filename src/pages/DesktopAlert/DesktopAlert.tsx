import React, { useState, useEffect } from 'react';
import { useMediaQuery } from '@mui/material';
import {
  Overlay,
  CardContainer,
  AlertBanner,
  ContentContainer,
  Title,
  Description,
  Separator,
  TipSection,
  TipIconBadge,
  TipDescription,
  GotItButton,
} from './DesktopAlert.styles';

export const DesktopAlert: React.FC = () => {
  const isSmallScreen = useMediaQuery('(max-width: 1280px), (max-height: 700px)');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem('desktop_alert_dismissed');
    if (!isDismissed) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('desktop_alert_dismissed', 'true');
  };

  if (!isSmallScreen || !isOpen) {
    return null;
  }

  return (
    <Overlay onClick={handleClose}>
      <CardContainer onClick={(e) => e.stopPropagation()}>
        <AlertBanner onClose={handleClose} />

        <ContentContainer>
          <Title>For the best experience,</Title>
          <Description>
            Please continue using a laptop or desktop computer to access the
            full range of features.
          </Description>

          <Separator />

          <TipSection>
            <TipIconBadge>i</TipIconBadge>
            <TipDescription>
              If the layout appears too large, adjust your browser&apos;s zoom settings.
            </TipDescription>
          </TipSection>

          <GotItButton onClick={handleClose}>Got it!</GotItButton>
        </ContentContainer>
      </CardContainer>
    </Overlay>
  );
};
