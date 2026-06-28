import React from 'react';
import { Tooltip as MuiTooltip } from '@mui/material';
import { InfoTooltipWrapper, StyledInfoIcon } from './InfoTooltip.styles';
import type { InfoTooltipProps } from './InfoTooltip.types';

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ message }) => {
  return (
    <MuiTooltip title={message} arrow placement="top">
      <InfoTooltipWrapper>
        <StyledInfoIcon />
      </InfoTooltipWrapper>
    </MuiTooltip>
  );
};
