import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Box, Alert } from '@mui/material';
import { useJsApiLoader } from '@react-google-maps/api';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import GoogleMap from '../../../components/UI/GoogleMap/GoogleMap';
import type { PlaceDetails } from '../../../components/UI/GoogleMap';
import { GOOGLE_MAPS_CONFIG, isGoogleMapsConfigured } from '../../../config/googleMaps';
import { workerJobWorkflowService } from '../../../services/api';
import type { WorkerAssignedStepResponse } from '../../../services/api';
import { JobWorkflowStepResponseStatusEnum } from '../../../../workflow-api';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import * as M from '../styles/WorkerMobile.styles';

type StatusKey =
  | 'INITIATED'
  | 'NOT_STARTED'
  | 'PENDING'
  | 'ONGOING'
  | 'STARTED'
  | 'COMPLETED'
  | 'SKIPPED';

interface StatusMeta {
  key: StatusKey;
  label: string;
  iconBg: string;
  iconFg: string;
  bar: string;
  Icon: React.ElementType;
}

const STATUS_META: StatusMeta[] = [
  {
    key: 'INITIATED',
    label: 'Initiated',
    iconBg: 'rgba(139, 92, 246, 0.14)',
    iconFg: '#7C3AED',
    bar: '#8B5CF6',
    Icon: AutoAwesomeIcon,
  },
  {
    key: 'NOT_STARTED',
    label: 'Not Started',
    iconBg: 'rgba(107, 114, 128, 0.16)',
    iconFg: '#374151',
    bar: '#4B5563',
    Icon: AccessTimeIcon,
  },
  {
    key: 'PENDING',
    label: 'Pending',
    iconBg: 'rgba(239, 68, 68, 0.14)',
    iconFg: '#B91C1C',
    bar: '#EF4444',
    Icon: ReportProblemOutlinedIcon,
  },
  {
    key: 'ONGOING',
    label: 'Ongoing',
    iconBg: 'rgba(59, 130, 246, 0.14)',
    iconFg: '#1D4ED8',
    bar: '#3B82F6',
    Icon: AutorenewIcon,
  },
  {
    key: 'STARTED',
    label: 'Started',
    iconBg: 'rgba(37, 99, 235, 0.14)',
    iconFg: '#1E40AF',
    bar: '#2563EB',
    Icon: PlayCircleFilledWhiteIcon,
  },
  {
    key: 'COMPLETED',
    label: 'Completed',
    iconBg: 'rgba(16, 185, 129, 0.16)',
    iconFg: '#047857',
    bar: '#10B981',
    Icon: CheckCircleIcon,
  },
  {
    key: 'SKIPPED',
    label: 'Skipped',
    iconBg: 'rgba(156, 163, 175, 0.18)',
    iconFg: '#4B5563',
    bar: '#9CA3AF',
    Icon: SkipNextIcon,
  },
];

const FINISHED_STATUSES = new Set<string>([
  JobWorkflowStepResponseStatusEnum.Completed,
  JobWorkflowStepResponseStatusEnum.Skipped,
]);

type LocationFilter = 'ALL' | StatusKey;

const LOCATION_FILTERS: { key: LocationFilter; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'ONGOING', label: 'Ongoing' },
  { key: 'STARTED', label: 'Started' },
  { key: 'INITIATED', label: 'Initiated' },
  { key: 'NOT_STARTED', label: 'Not Started' },
  { key: 'COMPLETED', label: 'Completed' },
];

interface LocationItem {
  key: string;
  title: string;
  subtitle: string;
  customer: string;
  status: StatusKey;
  latitude?: number;
  longitude?: number;
  addressString: string;
  stepId?: number;
  jobRef?: number;
}

const formatAddress = (addr?: WorkerAssignedStepResponse['jobAddress']): string => {
  if (!addr) return '';
  return [addr.street, addr.city, addr.postalCode, addr.country].filter(Boolean).join(', ');
};

// Map worker status → marker color bucket used by the shared GoogleMap component
const toMarkerStatus = (status: StatusKey): string => {
  if (status === 'COMPLETED') return 'COMPLETED';
  if (status === 'STARTED' || status === 'ONGOING') return 'IN_PROGRESS';
  if (status === 'NOT_STARTED' || status === 'PENDING' || status === 'INITIATED') return 'PENDING';
  return 'CANCELLED';
};

export const WorkerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { showError } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [allAssignedSteps, setAllAssignedSteps] = useState<WorkerAssignedStepResponse[]>([]);
  const [locationFilter, setLocationFilter] = useState<LocationFilter>('ALL');
  const [markers, setMarkers] = useState<PlaceDetails[]>([]);
  const [focusedMarker, setFocusedMarker] = useState<PlaceDetails | null>(null);

  const { isLoaded: mapsApiLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_CONFIG.apiKey,
    libraries: GOOGLE_MAPS_CONFIG.libraries,
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const stepsRes = await workerJobWorkflowService.getMyAssignedSteps();
        setAllAssignedSteps(Array.isArray(stepsRes.data) ? stepsRes.data : []);
      } catch (err) {
        console.error('Failed to load worker dashboard:', err);
        showError('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [showError]);

  const counts = useMemo(() => {
    const map: Record<StatusKey, number> = {
      INITIATED: 0,
      NOT_STARTED: 0,
      PENDING: 0,
      ONGOING: 0,
      STARTED: 0,
      COMPLETED: 0,
      SKIPPED: 0,
    };
    allAssignedSteps.forEach((s) => {
      const key = (s.step?.status || 'NOT_STARTED').toUpperCase() as StatusKey;
      if (key in map) map[key] += 1;
    });
    return map;
  }, [allAssignedSteps]);

  const totalSteps = allAssignedSteps.length;
  const finishedSteps = allAssignedSteps.filter((s) =>
    FINISHED_STATUSES.has(s.step?.status ?? ''),
  ).length;
  const completionPct =
    totalSteps > 0 ? Math.round((finishedSteps / totalSteps) * 1000) / 10 : 0;
  const maxBarValue = Math.max(...Object.values(counts), 1);

  const locations: LocationItem[] = useMemo(() => {
    const seen = new Map<string, LocationItem>();
    allAssignedSteps.forEach((s) => {
      const formatted = formatAddress(s.jobAddress);
      if (!formatted) return;
      const status = (s.step?.status || 'NOT_STARTED').toUpperCase() as StatusKey;
      // Group by address; keep the most "active" status if duplicate addresses
      const existing = seen.get(formatted);
      if (existing) {
        const priority: StatusKey[] = ['ONGOING', 'STARTED', 'INITIATED', 'PENDING', 'NOT_STARTED', 'COMPLETED', 'SKIPPED'];
        if (priority.indexOf(status) < priority.indexOf(existing.status)) {
          existing.status = status;
          existing.stepId = s.step?.id;
        }
        return;
      }
      seen.set(formatted, {
        key: formatted,
        title: s.jobAddress?.street || s.customer?.name || 'Job site',
        subtitle: formatted,
        customer: s.customer?.name || '',
        status,
        latitude: s.jobAddress?.latitude ?? undefined,
        longitude: s.jobAddress?.longitude ?? undefined,
        addressString: formatted,
        stepId: s.step?.id,
        jobRef: s.jobRef ?? s.jobId,
      });
    });
    return Array.from(seen.values());
  }, [allAssignedSteps]);

  const filteredLocations = useMemo(() => {
    if (locationFilter === 'ALL') return locations;
    return locations.filter((l) => l.status === locationFilter);
  }, [locations, locationFilter]);

  // Build PlaceDetails markers (geocoding any addresses without coordinates)
  useEffect(() => {
    if (!mapsApiLoaded || locations.length === 0) {
      setMarkers([]);
      return;
    }

    let cancelled = false;
    const geocoder = new google.maps.Geocoder();

    const geocodeOne = (address: string): Promise<{ lat: number; lng: number } | null> =>
      new Promise((resolve) => {
        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK' && results?.[0]?.geometry?.location) {
            resolve({
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng(),
            });
          } else {
            resolve(null);
          }
        });
      });

    const build = async () => {
      const resolved: PlaceDetails[] = [];
      for (const loc of locations) {
        let lat = loc.latitude;
        let lng = loc.longitude;
        if (lat == null || lng == null) {
          const geo = await geocodeOne(loc.addressString);
          if (!geo) continue;
          lat = geo.lat;
          lng = geo.lng;
        }
        resolved.push({
          address: loc.addressString,
          name: loc.customer || loc.title,
          location: { lat, lng },
          jobLocationData: {
            jobId: loc.jobRef ?? 0,
            status: toMarkerStatus(loc.status),
            customerName: loc.customer || undefined,
          },
        });
      }
      if (!cancelled) setMarkers(resolved);
    };

    build();
    return () => {
      cancelled = true;
    };
  }, [mapsApiLoaded, locations]);

  const filteredMarkers = useMemo(() => {
    if (locationFilter === 'ALL') return markers;
    const allowedAddresses = new Set(filteredLocations.map((l) => l.addressString));
    return markers.filter((m) => allowedAddresses.has(m.address));
  }, [markers, locationFilter, filteredLocations]);

  const handleLocationCardClick = useCallback(
    (loc: LocationItem) => {
      const marker = markers.find((m) => m.address === loc.addressString);
      if (marker) {
        setFocusedMarker(marker);
        // Smooth-scroll the map into view on mobile so user sees the focus
        const mapEl = document.getElementById('worker-job-locations-map');
        if (mapEl) mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      if (loc.stepId) navigate(`/worker/steps/${loc.stepId}`);
    },
    [markers, navigate],
  );

  if (loading) {
    return (
      <M.WorkerShell>
        <M.LoadingBox>
          <CircularProgress size={28} />
        </M.LoadingBox>
      </M.WorkerShell>
    );
  }

  const showMap = isGoogleMapsConfigured() && locations.length > 0;

  return (
    <M.WorkerShell>
      <M.WorkerHeader>
        <h1>Task Overview</h1>
      </M.WorkerHeader>

      <M.HeroCompletionCard>
        <span className="label">Overall Completion</span>
        <span className="value">{completionPct}%</span>
        <M.HeroProgressTrack>
          <M.HeroProgressFill pct={completionPct} />
        </M.HeroProgressTrack>
        <span className="meta">
          {finishedSteps} of {totalSteps} task{totalSteps === 1 ? '' : 's'} finished
        </span>
      </M.HeroCompletionCard>

      <M.SectionTitle>Task Breakdown</M.SectionTitle>

      <M.BreakdownGrid>
        {STATUS_META.map(({ key, label, iconBg, iconFg, Icon }) => (
          <M.BreakdownTile key={key} iconBg={iconBg} iconFg={iconFg}>
            <div className="icon">
              <Icon />
            </div>
            <span className="count">{counts[key]}</span>
            <span className="name">{label}</span>
          </M.BreakdownTile>
        ))}
      </M.BreakdownGrid>

      <M.DistributionCard>
        <h3>Status Distribution</h3>
        {STATUS_META.map(({ key, label, bar }) => {
          const value = counts[key];
          const pct = (value / maxBarValue) * 100;
          return (
            <M.DistributionRow key={key}>
              <span className="label">{label}</span>
              <M.DistributionBar>
                <M.DistributionBarFill pct={pct} fg={bar} />
              </M.DistributionBar>
              <span className="count">{value}</span>
            </M.DistributionRow>
          );
        })}
      </M.DistributionCard>

      <M.SectionTitle>Job Locations</M.SectionTitle>

      <M.FilterTabs>
        {LOCATION_FILTERS.map(({ key, label }) => (
          <M.FilterTab
            key={key}
            active={locationFilter === key}
            onClick={() => setLocationFilter(key)}
          >
            {label}
          </M.FilterTab>
        ))}
      </M.FilterTabs>

      {showMap && (
        <Box
          id="worker-job-locations-map"
          sx={{
            position: 'relative',
            height: { xs: 260, sm: 360 },
            borderRadius: '14px',
            overflow: 'hidden',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          }}
        >
          <GoogleMap
            markers={filteredMarkers}
            focusedMarker={focusedMarker}
            autoFitBounds
            showSearchBox={false}
            showDirections
            height="100%"
          />
        </Box>
      )}

      {!isGoogleMapsConfigured() && locations.length > 0 && (
        <Alert severity="info" sx={{ borderRadius: '12px', fontSize: 13 }}>
          Map view is disabled — Google Maps API key is not configured.
        </Alert>
      )}

      {filteredLocations.length === 0 ? (
        <M.EmptyState>
          <WorkOutlineIcon />
          <span>No job locations match this filter.</span>
        </M.EmptyState>
      ) : (
        <M.TaskList>
          {filteredLocations.map((loc) => (
            <M.LocationCard key={loc.key} onClick={() => handleLocationCardClick(loc)}>
              <div className="icon">
                <LocationOnOutlinedIcon />
              </div>
              <div className="body">
                <span className="title">{loc.customer || loc.title}</span>
                <span className="meta">{loc.subtitle}</span>
              </div>
              <span className="chevron">
                <ChevronRightIcon />
              </span>
            </M.LocationCard>
          ))}
        </M.TaskList>
      )}
    </M.WorkerShell>
  );
};

export default WorkerDashboard;
