import React, { useCallback } from 'react';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import { companyService } from '../../../../../services/api';
import type { CompanyDashboardResponse } from '../../../../../services/api';
import { useFetch } from '../../../../../hooks/useFetch';
import {
  SnapshotGrid,
  SnapshotTile,
  SnapshotIconBadge,
  SnapshotTextGroup,
  SnapshotLabel,
  SnapshotValue,
} from './CompanySnapshot.styles';

const formatCount = (value?: number): string => (typeof value === 'number' ? value.toLocaleString() : '—');

const TILES = [
  { key: 'totalWorkers', label: 'Total Workers', icon: GroupsOutlinedIcon, accentColor: '#3b82f6' },
  { key: 'activeWorkers', label: 'Active Workers', icon: HowToRegOutlinedIcon, accentColor: '#10b981' },
  { key: 'archivedWorkers', label: 'Archived Workers', icon: Inventory2OutlinedIcon, accentColor: '#6b7280' },
  { key: 'totalClients', label: 'Total Clients', icon: BusinessCenterOutlinedIcon, accentColor: '#6366f1' },
] as const satisfies readonly {
  key: keyof CompanyDashboardResponse;
  label: string;
  icon: typeof GroupsOutlinedIcon;
  accentColor: string;
}[];

export const CompanySnapshot: React.FC = () => {
  const fetchDashboard = useCallback(() => companyService.getDashboard(), []);
  const { data, loading } = useFetch<CompanyDashboardResponse>(fetchDashboard);

  if (loading || !data) return null;

  return (
    <SnapshotGrid>
      {TILES.map(({ key, label, icon: Icon, accentColor }) => (
        <SnapshotTile key={key} accentcolor={accentColor}>
          <SnapshotIconBadge accentcolor={accentColor}>
            <Icon />
          </SnapshotIconBadge>
          <SnapshotTextGroup>
            <SnapshotLabel>{label}</SnapshotLabel>
            <SnapshotValue>{formatCount(data[key])}</SnapshotValue>
          </SnapshotTextGroup>
        </SnapshotTile>
      ))}
    </SnapshotGrid>
  );
};
