import type { JobResponse, WorkerResponse, ClientResponse } from '../../workflow-api';
import type { PlaceDetails, WorkerMarkerData, JobMarkerData } from '../components/UI/LeafletMap/LeafletMap.types';
import { NOMINATIM_CONFIG } from '../config/googleMaps';

/**
 * Geocode an address to get lat/lng coordinates using Nominatim
 */
export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  if (!address || address.trim() === '') {
    return null;
  }

  try {
    const params = new URLSearchParams({
      q: address,
      format: 'json',
      limit: '1',
    });

    const response = await fetch(`${NOMINATIM_CONFIG.baseUrl}/search?${params}`, {
      headers: {
        'User-Agent': 'WorkFlow App',
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      }
    }
  } catch (error) {
    console.error('Error geocoding address:', error);
  }

  return null;
}

/**
 * Prepare map markers from jobs, workers, and clients data
 * Groups jobs by worker and uses client address for location
 */
export async function prepareWorkerJobMarkers(
  jobs: JobResponse[],
  workers: WorkerResponse[],
  clients: ClientResponse[]
): Promise<PlaceDetails[]> {
  const markers: PlaceDetails[] = [];

  // Group jobs by worker
  const jobsByWorker = new Map<number, JobResponse[]>();

  jobs.forEach((job) => {
    if (job.assignedWorkerId) {
      const workerJobs = jobsByWorker.get(job.assignedWorkerId) || [];
      workerJobs.push(job);
      jobsByWorker.set(job.assignedWorkerId, workerJobs);
    }
  });

  // For each worker with jobs, create a marker
  for (const [workerId, workerJobs] of jobsByWorker.entries()) {
    const worker = workers.find((w) => w.id === workerId);
    if (!worker) continue;

    // Get the first job's client address as the worker's location
    // You could also aggregate multiple addresses or use worker's home address if available
    const firstJob = workerJobs[0];
    const client = clients.find((c) => c.id === firstJob.clientId);

    if (!client?.address) continue;

    // Geocode the client address
    const location = await geocodeAddress(client.address);
    if (!location) continue;

    // Prepare job data for this worker
    const jobMarkers: JobMarkerData[] = workerJobs.map((job) => {
      const jobClient = clients.find((c) => c.id === job.clientId);

      return {
        jobId: job.id || 0,
        status: job.status || 'UNKNOWN',
        scheduledTime: getScheduledTime(job),
        duration: getDuration(job),
        clientName: jobClient?.name,
        templateName: '', // You can add template name if needed
      };
    });

    // Create worker marker data
    const workerData: WorkerMarkerData = {
      workerId: worker.id || 0,
      workerName: worker.name || 'Unknown Worker',
      workerEmail: worker.email,
      workerPhone: worker.mobile || worker.telephone,
      jobs: jobMarkers,
    };

    // Create the marker
    markers.push({
      name: worker.name || 'Unknown Worker',
      address: client.address,
      location,
      workerData,
    });
  }

  return markers;
}

/**
 * Extract scheduled time from job field values
 * Looks for common time-related field names
 */
function getScheduledTime(job: JobResponse): string | undefined {
  if (!job.fieldValues) return undefined;

  // Look for common time field names
  const timeFields = ['scheduledTime', 'startTime', 'time', 'appointment', 'schedule'];

  for (const fieldName of timeFields) {
    const value = job.fieldValues[fieldName];
    if (value) {
      return String(value);
    }
  }

  return undefined;
}

/**
 * Extract duration from job field values
 * Looks for common duration-related field names
 */
function getDuration(job: JobResponse): string | undefined {
  if (!job.fieldValues) return undefined;

  // Look for common duration field names
  const durationFields = ['duration', 'estimatedDuration', 'timeEstimate', 'hours'];

  for (const fieldName of durationFields) {
    const value = job.fieldValues[fieldName];
    if (value) {
      return String(value);
    }
  }

  return undefined;
}
