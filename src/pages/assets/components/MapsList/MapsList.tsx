import React, { useState, useEffect, useMemo } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { PageWrapper } from '../../../../components/UI/PageWrapper';
import GoogleMap from '../../../../components/UI/GoogleMap/GoogleMap';
import type { PlaceDetails } from '../../../../components/UI/GoogleMap';
import { GOOGLE_MAPS_CONFIG } from '../../../../config/googleMaps';
import { jobService } from '../../../../services/api/job';
import { workerService } from '../../../../services/api/worker';
import { companyClientService } from '../../../../services/api/companyClient';
import { customerService } from '../../../../services/api/customer';
import { prepareWorkerJobMarkers, prepareJobLocationMarkers } from '../../../../utils/mapDataHelpers';
import type { JobResponse, WorkerResponse, ClientResponse, CustomerResponse } from '../../../../services/api';
import {
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Box,
  Typography,
  Chip,
  Tooltip,
} from '@mui/material';
import * as S from './MapsList.styles';

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  NEW: { color: '#9c27b0', label: 'New' },
  PENDING: { color: '#ff9800', label: 'Pending' },
  IN_PROGRESS: { color: '#2196f3', label: 'In Progress' },
  COMPLETED: { color: '#4caf50', label: 'Completed' },
  CANCELLED: { color: '#f44336', label: 'Cancelled' },
};

const ALL_STATUSES = ['ALL', 'NEW', 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

export const MapsList: React.FC = () => {
  const { isLoaded: mapsApiLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_CONFIG.apiKey,
    libraries: GOOGLE_MAPS_CONFIG.libraries,
  });

  const [jobMarkers, setJobMarkers] = useState<PlaceDetails[]>([]);
  const [workerMarkers, setWorkerMarkers] = useState<PlaceDetails[]>([]);
  // Raw data fetched independently of Maps API
  const [rawData, setRawData] = useState<{
    jobs: JobResponse[];
    workers: WorkerResponse[];
    clients: ClientResponse[];
    customers: CustomerResponse[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'jobs' | 'workers'>('jobs');
  const [statusFilter, setStatusFilter] = useState('IN_PROGRESS');
  const [searchedLocation, setSearchedLocation] = useState<PlaceDetails | null>(null);
  const [focusedMarker, setFocusedMarker] = useState<PlaceDetails | null>(null);

  // Step 1: fetch raw API data (no Maps API needed)
  useEffect(() => {
    const fetchRawData = async () => {
      try {
        const [jobsRes, workersRes, clientsRes, customersRes] = await Promise.all([
          jobService.getAllJobs(),
          workerService.getAllWorkers(),
          companyClientService.getAllClients(),
          customerService.getAllCustomers(),
        ]);
        setRawData({
          jobs: jobsRes.data || [],
          workers: workersRes.data || [],
          clients: clientsRes.data || [],
          customers: customersRes.data || [],
        });
      } catch (err) {
        console.error('Error fetching map data:', err);
        setError('Failed to load map data. Please try again.');
        setLoading(false);
      }
    };
    fetchRawData();
  }, []);

  // Step 2: prepare markers once BOTH raw data and Google Maps API are ready.
  // Uses Google Maps Geocoder — far more reliable than Nominatim for addresses
  // that don't already have stored lat/lng coordinates.
  useEffect(() => {
    if (!rawData || !mapsApiLoaded) return;

    const googleGeocode = (address: string): Promise<{ lat: number; lng: number } | null> =>
      new Promise((resolve) => {
        const geocoder = new google.maps.Geocoder();
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

    const buildMarkers = async () => {
      try {
        const { jobs, workers, clients, customers } = rawData;
        const [jobPins, workerPins] = await Promise.all([
          prepareJobLocationMarkers(jobs, workers, clients, customers, googleGeocode),
          prepareWorkerJobMarkers(jobs, workers, clients),
        ]);

        setJobMarkers(jobPins);
        setWorkerMarkers(workerPins);

        // Default to IN_PROGRESS view; fall back to ALL if no in-progress jobs have a location
        const hasInProgress = jobPins.some((m) => m.jobLocationData?.status === 'IN_PROGRESS');
        setStatusFilter(hasInProgress ? 'IN_PROGRESS' : 'ALL');
      } catch (err) {
        console.error('Error building markers:', err);
        setError('Failed to prepare map markers. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    buildMarkers();
  }, [rawData, mapsApiLoaded]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: jobMarkers.length };
    jobMarkers.forEach((m) => {
      const s = m.jobLocationData?.status || 'UNKNOWN';
      counts[s] = (counts[s] || 0) + 1;
    });
    return counts;
  }, [jobMarkers]);

  const filteredJobMarkers = useMemo(() => {
    if (statusFilter === 'ALL') return jobMarkers;
    return jobMarkers.filter((m) => m.jobLocationData?.status === statusFilter);
  }, [jobMarkers, statusFilter]);

  const displayMarkers = useMemo(() => {
    const base = viewMode === 'jobs' ? filteredJobMarkers : workerMarkers;
    if (!searchedLocation) return base;
    const overlaps = base.some(
      (m) =>
        Math.abs(m.location.lat - searchedLocation.location.lat) < 0.001 &&
        Math.abs(m.location.lng - searchedLocation.location.lng) < 0.001
    );
    return overlaps ? base : [...base, searchedLocation];
  }, [viewMode, filteredJobMarkers, workerMarkers, searchedLocation]);

  const handleLocationSelect = (location: PlaceDetails) => {
    setSearchedLocation(location);
    setFocusedMarker(null);
  };

  const handleJobRowClick = (marker: PlaceDetails) => {
    setFocusedMarker(marker);
  };

  if (loading) {
    return (
      <PageWrapper title="Maps" description="View job locations" showSearch={false}>
        <S.ContentSection style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </S.ContentSection>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper title="Maps" description="View job locations" showSearch={false}>
        <S.ContentSection>
          <Alert severity="error">{error}</Alert>
        </S.ContentSection>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Maps" description="View job locations" showSearch={false}>
      <S.ContentSection>
        <S.MapSection>
          <GoogleMap
            markers={displayMarkers}
            onLocationSelect={handleLocationSelect}
            selectedLocation={searchedLocation}
            focusedMarker={focusedMarker}
            autoFitBounds
            showSearchBox
            showDirections
            height="100%"
          />
        </S.MapSection>

        <S.SidePanel>
          <S.SidePanelPaper elevation={0}>
            {/* View Mode Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={viewMode} onChange={(_e, v) => { setViewMode(v); setFocusedMarker(null); }}>
                <Tab label="Jobs" value="jobs" />
                <Tab label="Workers" value="workers" />
              </Tabs>
            </Box>

            {/* Status Filter — Jobs mode only */}
            {viewMode === 'jobs' && (
              <Box sx={{ px: 2, pt: 1.5, pb: 1, display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                {ALL_STATUSES.map((s) => {
                  const cfg = STATUS_CONFIG[s];
                  const count = statusCounts[s] ?? 0;
                  const active = statusFilter === s;
                  return (
                    <Chip
                      key={s}
                      label={`${cfg ? cfg.label : 'All'} ${count > 0 ? `(${count})` : ''}`}
                      size="small"
                      onClick={() => setStatusFilter(s)}
                      sx={{
                        fontSize: '0.7rem',
                        height: 24,
                        backgroundColor: active
                          ? (cfg ? cfg.color : '#1976d2')
                          : 'transparent',
                        color: active ? '#fff' : (cfg ? cfg.color : '#555'),
                        border: `1.5px solid ${cfg ? cfg.color : '#1976d2'}`,
                        fontWeight: active ? 700 : 500,
                        '&:hover': {
                          backgroundColor: cfg ? `${cfg.color}22` : '#1976d222',
                        },
                      }}
                    />
                  );
                })}
              </Box>
            )}

            {/* Map Legend */}
            {viewMode === 'jobs' && (
              <Box sx={{ px: 2, pb: 1, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Typography variant="caption" sx={{ color: '#888', fontWeight: 600 }}>
                  Map legend:
                </Typography>
                {Object.entries(STATUS_CONFIG).map(([status, cfg]) => (
                  <Box key={status} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {/* Teardrop pin shape matching the map markers */}
                    <Box
                      component="svg"
                      viewBox="0 0 24 24"
                      sx={{ width: status === 'IN_PROGRESS' ? 16 : 13, height: status === 'IN_PROGRESS' ? 16 : 13, flexShrink: 0 }}
                    >
                      <path
                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                        fill={cfg.color}
                        stroke="#fff"
                        strokeWidth="1"
                      />
                    </Box>
                    <Typography variant="caption" sx={{ color: '#666', fontSize: '0.65rem' }}>
                      {cfg.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}

            {/* Divider */}
            <Box sx={{ borderBottom: '1px solid #e0e0e0' }} />

            {/* Content List */}
            <S.LocationInfo style={{ flex: 1, overflowY: 'auto', padding: 0 }}>
              {viewMode === 'jobs' ? (
                <>
                  {filteredJobMarkers.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#999' }}>
                        No jobs with a location found
                        {statusFilter !== 'ALL' ? ` for status "${STATUS_CONFIG[statusFilter]?.label}"` : ''}.
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      {/* Column Headers */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          px: 2,
                          py: 0.75,
                          backgroundColor: '#fafafa',
                          borderBottom: '1px solid #e0e0e0',
                          position: 'sticky',
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        <Typography variant="caption" sx={{ width: 60, fontWeight: 700, color: '#555', fontSize: '0.65rem', textTransform: 'uppercase' }}>Job</Typography>
                        <Typography variant="caption" sx={{ width: 90, fontWeight: 700, color: '#555', fontSize: '0.65rem', textTransform: 'uppercase' }}>Status</Typography>
                        <Typography variant="caption" sx={{ width: 110, fontWeight: 700, color: '#555', fontSize: '0.65rem', textTransform: 'uppercase' }}>Client</Typography>
                        <Typography variant="caption" sx={{ flex: 1, fontWeight: 700, color: '#555', fontSize: '0.65rem', textTransform: 'uppercase' }}>Address</Typography>
                      </Box>

                      {filteredJobMarkers.map((marker) => {
                        const jd = marker.jobLocationData!;
                        const cfg = STATUS_CONFIG[jd.status];
                        const isActive = focusedMarker === marker;
                        const isInProgress = jd.status === 'IN_PROGRESS';

                        return (
                          <Tooltip
                            key={jd.jobId}
                            title={
                              <Box>
                                <div><b>Job #{jd.jobId}</b></div>
                                {jd.customerName && <div>Customer: {jd.customerName}</div>}
                                {jd.workerName && <div>Worker: {jd.workerName}</div>}
                                {jd.scheduledTime && <div>Scheduled: {jd.scheduledTime}</div>}
                                <div>{marker.address}</div>
                              </Box>
                            }
                            placement="left"
                            arrow
                          >
                            <Box
                              onClick={() => handleJobRowClick(marker)}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                px: 2,
                                py: 1,
                                borderBottom: '1px solid #f0f0f0',
                                cursor: 'pointer',
                                backgroundColor: isActive
                                  ? '#e3f2fd'
                                  : isInProgress
                                    ? '#fff8e1'
                                    : 'transparent',
                                borderLeft: isActive
                                  ? '3px solid #1976d2'
                                  : isInProgress
                                    ? '3px solid #ff9800'
                                    : '3px solid transparent',
                                transition: 'background-color 0.15s',
                                '&:hover': { backgroundColor: isActive ? '#bbdefb' : '#f5f5f5' },
                              }}
                            >
                              {/* Job ID */}
                              <Typography
                                variant="caption"
                                sx={{ width: 60, fontWeight: 700, color: '#1976d2', fontSize: '0.75rem', flexShrink: 0 }}
                              >
                                #{jd.jobId}
                              </Typography>

                              {/* Status */}
                              <Box sx={{ width: 90, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Box
                                  component="svg"
                                  viewBox="0 0 24 24"
                                  sx={{ width: isInProgress ? 13 : 11, height: isInProgress ? 13 : 11, flexShrink: 0 }}
                                >
                                  <path
                                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                                    fill={cfg?.color ?? '#9e9e9e'}
                                    stroke="#fff"
                                    strokeWidth="1"
                                  />
                                </Box>
                                <Typography variant="caption" sx={{ color: cfg?.color ?? '#666', fontWeight: isInProgress ? 700 : 500, fontSize: '0.68rem' }}>
                                  {cfg?.label ?? jd.status}
                                </Typography>
                              </Box>

                              {/* Client */}
                              <Typography
                                variant="caption"
                                sx={{
                                  width: 110,
                                  flexShrink: 0,
                                  color: '#444',
                                  fontSize: '0.7rem',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {jd.clientName || '—'}
                              </Typography>

                              {/* Address */}
                              <Typography
                                variant="caption"
                                sx={{
                                  flex: 1,
                                  color: '#777',
                                  fontSize: '0.68rem',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {marker.address}
                              </Typography>
                            </Box>
                          </Tooltip>
                        );
                      })}
                    </>
                  )}
                </>
              ) : (
                /* Workers View — existing implementation */
                <>
                  {workerMarkers.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#999' }}>
                        No workers with assigned jobs found.
                      </Typography>
                    </Box>
                  ) : (
                    workerMarkers.map(
                      (marker) =>
                        marker.workerData && (
                          <div key={marker.workerData.workerId} style={{ borderBottom: '1px solid #e0e0e0' }}>
                            <Box
                              sx={{
                                px: 2,
                                py: 1.25,
                                backgroundColor: '#f5f5f5',
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                '&:hover': { backgroundColor: '#eeeeee' },
                              }}
                              onClick={() => handleJobRowClick(marker)}
                            >
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, flex: 1 }}>
                                {marker.workerData.workerName}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#888', fontSize: '0.7rem' }}>
                                {marker.workerData.jobs.length} job{marker.workerData.jobs.length !== 1 ? 's' : ''}
                              </Typography>
                            </Box>

                            {/* Jobs under this worker */}
                            {marker.workerData.jobs.map((job) => {
                              const cfg = STATUS_CONFIG[job.status];
                              return (
                                <Box
                                  key={job.jobId}
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    px: 2,
                                    py: 0.75,
                                    borderBottom: '1px solid #f0f0f0',
                                    '&:hover': { backgroundColor: '#fafafa' },
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: 8,
                                      height: 8,
                                      borderRadius: '50%',
                                      backgroundColor: cfg?.color ?? '#9e9e9e',
                                      flexShrink: 0,
                                    }}
                                  />
                                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#1976d2', width: 50 }}>
                                    #{job.jobId}
                                  </Typography>
                                  {job.clientName && (
                                    <Typography variant="caption" sx={{ color: '#555', flex: 1 }}>{job.clientName}</Typography>
                                  )}
                                  <Chip
                                    label={cfg?.label ?? job.status}
                                    size="small"
                                    sx={{
                                      height: 18,
                                      fontSize: '0.6rem',
                                      backgroundColor: cfg?.color ?? '#9e9e9e',
                                      color: '#fff',
                                      ml: 'auto',
                                    }}
                                  />
                                </Box>
                              );
                            })}
                          </div>
                        )
                    )
                  )}
                </>
              )}
            </S.LocationInfo>
          </S.SidePanelPaper>
        </S.SidePanel>
      </S.ContentSection>
    </PageWrapper>
  );
};
