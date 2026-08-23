import type { JobResponse, WorkerResponse, ClientResponse, CustomerResponse, FieldValueResponse } from '../../workflow-api';
import type { PlaceDetails, WorkerMarkerData, JobMarkerData, JobLocationMarkerData } from '../components/UI/GoogleMap/GoogleMap.types';
import { geocodeAddress as googleGeocodeAddress } from './googleGeocoding';
import { extractFieldValue } from './fieldValueHelper';

// Kept as a re-export so existing imports of `geocodeAddress` from this file
// keep working — the implementation itself lives in the single shared
// geocoding module (Google only; the previous Nominatim-based version here
// was a second, less accurate, unrelated geocoding backend).
export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  const result = await googleGeocodeAddress(address);
  return result?.location ?? null;
}

/**
 * Prepare map markers from jobs, workers, and clients data.
 * Groups jobs by worker and places one pin per worker.
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
    (job.assignedWorkerIds ?? []).forEach((workerId) => {
      const workerJobs = jobsByWorker.get(workerId) || [];
      workerJobs.push(job);
      jobsByWorker.set(workerId, workerJobs);
    });
  });

  // For each worker with jobs, create a single marker at their most relevant
  // job's location — preferring an in-progress job (where they most likely
  // are right now), then falling back to whichever assigned job resolves to
  // a location first. A worker with several jobs still only gets one pin;
  // all of their jobs are listed in that pin's info window.
  for (const [workerId, workerJobs] of jobsByWorker.entries()) {
    const worker = workers.find((w) => w.id === workerId);
    if (!worker) continue;

    const orderedJobs = [...workerJobs].sort((a, b) =>
      a.status === 'IN_PROGRESS' && b.status !== 'IN_PROGRESS' ? -1 : 0
    );

    let location: { lat: number; lng: number } | null = null;
    let locatedJob: JobResponse | null = null;

    for (const job of orderedJobs) {
      // Prefer the job's own site address (structured, has stored coordinates)
      // over the client's address string — a job's actual work location can
      // differ from the client's billing/contact address.
      if (job.address?.latitude != null && job.address?.longitude != null) {
        location = { lat: job.address.latitude, lng: job.address.longitude };
        locatedJob = job;
        break;
      }

      const jobAddressParts = [
        job.address?.street,
        job.address?.city,
        job.address?.state,
        job.address?.postalCode,
        job.address?.country,
      ].filter(Boolean);

      if (jobAddressParts.length > 0) {
        location = await googleGeocodeAddress(jobAddressParts.join(', ')).then((r) => r?.location ?? null);
        if (location) {
          locatedJob = job;
          break;
        }
      }

      const client = clients.find((c) => c.id === job.clientId);
      if (client?.address) {
        location = await googleGeocodeAddress(client.address).then((r) => r?.location ?? null);
        if (location) {
          locatedJob = job;
          break;
        }
      }
    }

    if (!location || !locatedJob) continue;

    const client = clients.find((c) => c.id === locatedJob!.clientId);
    const displayAddress =
      [locatedJob.address?.street, locatedJob.address?.city, locatedJob.address?.state, locatedJob.address?.postalCode, locatedJob.address?.country]
        .filter(Boolean)
        .join(', ') || client?.address || '';

    // Prepare job data for this worker
    const jobMarkers: JobMarkerData[] = workerJobs.map((job) => {
      const jobClient = clients.find((c) => c.id === job.clientId);

      return {
        jobId: job.id || 0,
        status: job.status || 'UNKNOWN',
        scheduledTime: getScheduledTime(job),
        duration: getDuration(job),
        clientName: jobClient?.name,
        templateName: job.templateName,
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
      address: displayAddress,
      location,
      workerData,
    });
  }

  return markers;
}

/**
 * Prepare individual job location markers from jobs data.
 * Each job with a resolvable address gets its own pin on the map.
 * Uses stored lat/lng when available, otherwise geocodes the address.
 */
export async function prepareJobLocationMarkers(
  jobs: JobResponse[],
  workers: WorkerResponse[],
  clients: ClientResponse[],
  customers: CustomerResponse[] = [],
  geocodeFn: (address: string) => Promise<{ lat: number; lng: number } | null> = geocodeAddress
): Promise<PlaceDetails[]> {
  const markers: PlaceDetails[] = [];

  for (const job of jobs) {
    if (!job.address) continue;

    let location: { lat: number; lng: number } | null = null;

    // Prefer stored coordinates — no geocoding needed
    if (job.address.latitude != null && job.address.longitude != null) {
      location = { lat: job.address.latitude, lng: job.address.longitude };
    } else {
      const addressParts = [
        job.address.street,
        job.address.city,
        job.address.state,
        job.address.postalCode,
        job.address.country,
      ].filter(Boolean);

      if (addressParts.length === 0) continue;
      location = await geocodeFn(addressParts.join(', '));
    }

    if (!location) continue;

    const client = clients.find((c) => c.id === job.clientId);
    const customer = customers.find((c) => c.id === job.customerId);
    const worker = workers.find((w) => (job.assignedWorkerIds ?? []).includes(w.id!));

    const addressParts = [
      job.address.street,
      job.address.city,
      job.address.state,
      job.address.postalCode,
      job.address.country,
    ].filter(Boolean);

    const jobLocationData: JobLocationMarkerData = {
      jobId: job.id || 0,
      status: job.status || 'UNKNOWN',
      clientName: client?.name,
      customerName: customer?.name,
      workerName: worker?.name,
      scheduledTime: getScheduledTime(job),
      templateName: job.templateName,
    };

    markers.push({
      address: addressParts.join(', '),
      name: `Job #${job.id}`,
      location,
      jobLocationData,
    });
  }

  return markers;
}

/** A job's fieldValues map is keyed by field ID, and each entry carries the
 * template field's own `name`/`label` — never the outer map key — so any
 * lookup by a literal field name (e.g. "scheduledTime") must scan the
 * FieldValueResponse metadata, not the map's keys. */
function findFieldValueByName(job: JobResponse, candidateNames: string[]): string | undefined {
  if (!job.fieldValues) return undefined;

  const wanted = candidateNames.map((n) => n.toLowerCase());
  for (const fv of Object.values(job.fieldValues) as FieldValueResponse[]) {
    const fieldName = (fv?.name || fv?.label || '').toLowerCase();
    if (fieldName && wanted.some((w) => fieldName.includes(w))) {
      const value = extractFieldValue(fv);
      if (value) return value;
    }
  }
  return undefined;
}

/** Extract scheduled time from a job's custom field values, matching by field name/label. */
function getScheduledTime(job: JobResponse): string | undefined {
  return findFieldValueByName(job, ['scheduledTime', 'startTime', 'time', 'appointment', 'schedule']);
}

/** Extract duration from a job's custom field values, matching by field name/label. */
function getDuration(job: JobResponse): string | undefined {
  return findFieldValueByName(job, ['duration', 'estimatedDuration', 'timeEstimate', 'hours']);
}
