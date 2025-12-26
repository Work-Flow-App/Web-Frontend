import React, { useState, useEffect } from 'react';
import { PageWrapper } from '../../../../components/UI/PageWrapper';
import { LeafletMap } from '../../../../components/UI/LeafletMap';
import type { PlaceDetails } from '../../../../components/UI/LeafletMap';
import { LEAFLET_CONFIG } from '../../../../config/googleMaps';
import { jobService } from '../../../../services/api/job';
import { workerService } from '../../../../services/api/worker';
import { companyClientService } from '../../../../services/api/companyClient';
import { prepareWorkerJobMarkers } from '../../../../utils/mapDataHelpers';
import { CircularProgress, Alert, Tabs, Tab, TextField, Box, Checkbox, Typography } from '@mui/material';
import * as S from './MapsList.styles';

export const MapsList: React.FC = () => {
  const [mapCenter, setMapCenter] = useState(LEAFLET_CONFIG.defaultCenter);
  const [markers, setMarkers] = useState<PlaceDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(1); // 0 for Current Activity, 1 for Schedule
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchedLocation, setSearchedLocation] = useState<PlaceDetails | null>(null);

  // Fetch jobs, workers, and clients on component mount
  useEffect(() => {
    const fetchMapData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all required data in parallel
        const [jobsResponse, workersResponse, clientsResponse] = await Promise.all([
          jobService.getAllJobs(),
          workerService.getAllWorkers(),
          companyClientService.getAllClients(),
        ]);

        const jobs = jobsResponse.data || [];
        const workers = workersResponse.data || [];
        const clients = clientsResponse.data || [];

        // Prepare worker-job markers
        const workerMarkers = await prepareWorkerJobMarkers(jobs, workers, clients);
        setMarkers(workerMarkers);

        // Center map on first marker if available
        if (workerMarkers.length > 0) {
          setMapCenter(workerMarkers[0].location);
        }
      } catch (err) {
        console.error('Error fetching map data:', err);
        setError('Failed to load map data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMapData();
  }, []);

  // Handle location selection from map search
  const handleLocationSelect = (location: PlaceDetails) => {
    setSearchedLocation(location);
    setMapCenter(location.location);

    // Check if this location has any workers assigned
    const hasWorkers = markers.some(
      (marker) => marker.location.lat === location.location.lat && marker.location.lng === location.location.lng
    );

    if (!hasWorkers) {
      console.log('No workers assigned to this location:', location.address);
    }
  };

  // Combine worker markers with searched location marker
  const displayMarkers = React.useMemo(() => {
    const allMarkers = [...markers];

    // Add searched location as a marker if it exists and doesn't overlap with existing markers
    if (searchedLocation) {
      const hasExistingMarker = markers.some(
        (marker) =>
          Math.abs(marker.location.lat - searchedLocation.location.lat) < 0.001 &&
          Math.abs(marker.location.lng - searchedLocation.location.lng) < 0.001
      );

      if (!hasExistingMarker) {
        allMarkers.push(searchedLocation);
      }
    }

    return allMarkers;
  }, [markers, searchedLocation]);

  if (loading) {
    return (
      <PageWrapper title="Worker Jobs Map" description="View worker locations and job assignments" showSearch={false}>
        <S.ContentSection style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </S.ContentSection>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper title="Worker Jobs Map" description="View worker locations and job assignments" showSearch={false}>
        <S.ContentSection>
          <Alert severity="error">{error}</Alert>
        </S.ContentSection>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Jobs location " description="View worker locations and job assignments" showSearch={false}>
      <S.ContentSection>
        <S.MapSection>
          <LeafletMap
            center={mapCenter}
            markers={displayMarkers}
            onLocationSelect={handleLocationSelect}
            selectedLocation={searchedLocation}
            showSearchBox
            height="100%"
          />
        </S.MapSection>

        <S.SidePanel>
          <S.SidePanelPaper elevation={0}>
            {/* Tabs for Current Activity and Schedule */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={activeTab} onChange={(_e, newValue) => setActiveTab(newValue)}>
                <Tab label="Current Activity" />
                <Tab label="Schedule" />
              </Tabs>
            </Box>

            {/* Date Selector */}
            <Box sx={{ padding: '16px', borderBottom: '1px solid #e0e0e0' }}>
              <TextField
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                size="small"
                fullWidth
                slotProps={{
                  input: {
                    sx: { fontSize: '14px' },
                  },
                }}
              />
            </Box>

            {/* Worker and Jobs List */}
            <S.LocationInfo style={{ maxHeight: 'calc(100vh - 280px)', overflowY: 'auto', padding: '0' }}>
              {/* Show searched location info when location is selected */}
              {searchedLocation && (
                <Box
                  sx={{
                    padding: '16px',
                    backgroundColor: '#f0f7ff',
                    borderBottom: '2px solid #1976d2',
                    marginBottom: '8px',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1976d2', marginBottom: '4px' }}>
                    Selected Location
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                    {searchedLocation.address}
                  </Typography>
                  {!markers.some(
                    (marker) =>
                      Math.abs(marker.location.lat - searchedLocation.location.lat) < 0.001 &&
                      Math.abs(marker.location.lng - searchedLocation.location.lng) < 0.001
                  ) && (
                    <Typography
                      variant="caption"
                      sx={{ color: '#d32f2f', display: 'block', marginTop: '8px', fontWeight: 'bold' }}
                    >
                      ⚠️ No workers assigned to this location
                    </Typography>
                  )}
                </Box>
              )}

              {markers.length === 0 && !searchedLocation && (
                <Box sx={{ padding: '24px', textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ marginBottom: '8px', color: '#666' }}>
                    No Jobs Scheduled
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#999' }}>
                    There are no jobs assigned to workers for the selected date
                  </Typography>
                </Box>
              )}

              {markers.map(
                (marker) =>
                  marker.workerData && (
                    <div key={marker.workerData.workerId} style={{ borderBottom: '1px solid #e0e0e0' }}>
                      {/* Worker Name Header with Collapse Button */}
                      <Box
                        sx={{
                          padding: '12px 16px',
                          backgroundColor: '#f5f5f5',
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                          '&:hover': { backgroundColor: '#eeeeee' },
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', flex: 1 }}>
                          {marker.workerData.workerName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          ▲
                        </Typography>
                      </Box>

                      {/* Table Headers */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '8px 12px',
                          backgroundColor: '#fafafa',
                          borderBottom: '1px solid #e0e0e0',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          color: '#666',
                        }}
                      >
                        <Box sx={{ width: '30px' }}></Box> {/* Checkbox space */}
                        <Box sx={{ width: '35px' }}>Map</Box>
                        <Box sx={{ width: '60px' }}>ID</Box>
                        <Box sx={{ width: '100px' }}>Scheduled</Box>
                        <Box sx={{ width: '90px' }}>Status</Box>
                        <Box sx={{ width: '100px' }}>Customer</Box>
                        <Box sx={{ flex: 1, minWidth: '120px' }}>Site</Box>
                      </Box>

                      {/* Jobs Table Rows */}
                      {marker.workerData.jobs.map((job) => (
                        <Box
                          key={job.jobId}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '10px 12px',
                            borderBottom: '1px solid #f0f0f0',
                            '&:hover': { backgroundColor: '#fafafa' },
                          }}
                        >
                          {/* Checkbox */}
                          <Box sx={{ width: '30px' }}>
                            <Checkbox size="small" sx={{ padding: 0 }} />
                          </Box>

                          {/* Map Pin Icon */}
                          <Box
                            sx={{
                              width: '35px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <span style={{ color: '#1976d2', fontSize: '14px' }}>📍</span>
                          </Box>

                          {/* ID Column */}
                          <Box sx={{ width: '60px' }}>
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '11px' }}
                            >
                              #{job.jobId}
                            </Typography>
                          </Box>

                          {/* Scheduled Column */}
                          <Box sx={{ width: '100px' }}>
                            <Typography variant="caption" sx={{ color: '#333', fontSize: '10px' }}>
                              {job.scheduledTime || 'Not scheduled'}
                            </Typography>
                          </Box>

                          {/* Status Column */}
                          <Box sx={{ width: '90px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Box
                              sx={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor:
                                  job.status === 'COMPLETED'
                                    ? '#4caf50'
                                    : job.status === 'IN_PROGRESS'
                                      ? '#2196f3'
                                      : job.status === 'PENDING'
                                        ? '#ff9800'
                                        : '#9e9e9e',
                              }}
                            />
                            <Typography variant="caption" sx={{ color: '#666', fontSize: '9px' }}>
                              {job.status}
                            </Typography>
                          </Box>

                          {/* Customer Column */}
                          <Box sx={{ width: '100px' }}>
                            <Typography
                              variant="caption"
                              sx={{
                                color: '#333',
                                fontSize: '10px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {job.clientName || 'No client'}
                            </Typography>
                          </Box>

                          {/* Site Column */}
                          <Box sx={{ flex: 1, minWidth: '120px' }}>
                            <Typography
                              variant="caption"
                              sx={{
                                color: '#666',
                                fontSize: '10px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {marker.address || 'No address'}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </div>
                  )
              )}
            </S.LocationInfo>
          </S.SidePanelPaper>
        </S.SidePanel>
      </S.ContentSection>
    </PageWrapper>
  );
};
