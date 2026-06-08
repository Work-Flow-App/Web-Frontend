import React from 'react';
import { Tooltip as MuiTooltip } from '@mui/material';
import { ToolTipWrapper, StyledInfoIcon } from './ToolTip.styles';
import type { TollTipProps } from './IToolTip';

export const TollTip: React.FC<TollTipProps> = ({ message }) => {
  return (
    <MuiTooltip title={message} arrow placement="top">
      <ToolTipWrapper>
        <StyledInfoIcon />
      </ToolTipWrapper>
    </MuiTooltip>
  );
};
