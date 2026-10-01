import React from 'react';
import { Drawer, Checkbox, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { WidgetConfig, WidgetId, QuickActionConfig, QuickActionId } from '../types';
import * as S from './DashboardCustomizerDrawer.styles';

interface DashboardCustomizerDrawerProps {
  open: boolean;
  onClose: () => void;
  configs: WidgetConfig[];
  onToggle: (id: WidgetId) => void;
  quickActionConfigs: QuickActionConfig[];
  onToggleQuickAction: (id: QuickActionId) => void;
  onReset: () => void;
}

export const DashboardCustomizerDrawer: React.FC<DashboardCustomizerDrawerProps> = ({
  open,
  onClose,
  configs,
  onToggle,
  quickActionConfigs,
  onToggleQuickAction,
  onReset,
}) => {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <S.DrawerContent>
        <S.DrawerHeader>
          <S.DrawerTitle variant="h6">Customize Dashboard</S.DrawerTitle>
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </S.DrawerHeader>
        <S.DrawerSubtitle variant="body2">
          Toggle the switches below to select which widgets and quick action buttons you would like to display on your dashboard layout.
        </S.DrawerSubtitle>
        
        <S.WidgetsList>
          {/* Section 1: Widgets */}
          <S.SectionHeader variant="caption">Dashboard Widgets</S.SectionHeader>
          {configs.map((widget) => (
            <S.WidgetItemRow key={widget.id}>
              <S.WidgetInfoText variant="subtitle2">{widget.label}</S.WidgetInfoText>
              <Checkbox
                checked={widget.visible}
                onChange={() => onToggle(widget.id)}
                color="primary"
                size="small"
              />
            </S.WidgetItemRow>
          ))}

          {/* Section 2: Quick Actions */}
          <S.SectionHeader variant="caption">Quick Actions Strip</S.SectionHeader>
          {quickActionConfigs.map((action) => (
            <S.WidgetItemRow key={action.id}>
              <S.WidgetInfoText variant="subtitle2">{action.label}</S.WidgetInfoText>
              <Checkbox
                checked={action.visible}
                onChange={() => onToggleQuickAction(action.id)}
                color="primary"
                size="small"
              />
            </S.WidgetItemRow>
          ))}
        </S.WidgetsList>
        
        <S.Footer>
          <S.FooterButton primary onClick={onClose}>
            Save Changes
          </S.FooterButton>
          <S.FooterButton onClick={onReset}>
            Reset to Default
          </S.FooterButton>
        </S.Footer>
      </S.DrawerContent>
    </Drawer>
  );
};
