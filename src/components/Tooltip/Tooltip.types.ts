import type { TooltipProps as MuiTooltipProps } from '@mui/material';

export interface TooltipProps extends Omit<MuiTooltipProps, 'children'> {
  children: React.ReactElement;
  title: string | React.ReactNode;
}
