import { describe, expect, it, vi } from 'vitest';
import {
  geocodeUnlocatedJobs,
  selectUnlocatedJobs,
  toJobLocationMarkers,
  toRecentWorkflowActivity,
  toStepEventGroups,
} from './dashboardMappers';

describe('toStepEventGroups', () => {
  it('keeps the server order, including steps with no jobs', () => {
    const groups = toStepEventGroups({
      groups: [
        { stepName: 'Survey', orderIndex: 0, jobCount: 0, jobs: [] },
        { stepName: 'Install', orderIndex: 1, jobCount: 2, jobs: [{ jobId: 7 }, { jobId: 8 }] },
        { stepName: 'Off template', orderIndex: 1, jobCount: 1, jobs: [{ jobId: 9 }] },
      ],
    });

    expect(groups.map((g) => [g.stepName, g.count])).toEqual([
      ['Survey', 0],
      ['Install', 2],
      ['Off template', 1],
    ]);
    expect(groups[1].jobs).toEqual([{ jobId: 7 }, { jobId: 8 }]);
  });

  it('assigns colours by position in the array', () => {
    const groups = toStepEventGroups({ groups: Array.from({ length: 9 }, (_, i) => ({ stepName: `Step ${i}` })) });

    expect(groups[0].color).not.toBe(groups[1].color);
    expect(groups[8].color).toBe(groups[0].color); // the palette has 8 colours, then repeats
  });

  it('falls back to the number of jobs when jobCount is missing', () => {
    const [group] = toStepEventGroups({ groups: [{ stepName: 'Survey', jobs: [{ jobId: 1 }, { jobId: 2 }] }] });

    expect(group.count).toBe(2);
  });

  it('returns nothing for an empty response', () => {
    expect(toStepEventGroups({})).toEqual([]);
  });
});

describe('selectUnlocatedJobs', () => {
  it('keeps rows with an address and a missing coordinate', () => {
    const unlocated = selectUnlocatedJobs([
      { jobId: 1, lat: 1, lng: 2, address: 'Located' },
      { jobId: 2, address: 'No coordinates' },
      { jobId: 3, lat: 5, address: 'One coordinate' },
      { jobId: 4 },
      { jobId: 5, address: '   ' },
    ]);

    expect(unlocated.map((job) => job.jobId)).toEqual([2, 3]);
  });
});

describe('geocodeUnlocatedJobs', () => {
  it('geocodes a row with null coordinates by its address, keeping the rest of the row', async () => {
    const geocode = vi.fn().mockResolvedValue({ lat: 1, lng: 2 });
    const [located] = await geocodeUnlocatedJobs(
      [
        {
          jobId: 12,
          jobRef: 3,
          status: 'NEW',
          address: '1 High St, London, E1',
          clientName: 'Acme',
          customerName: 'Sam',
          workerNames: ['Ana'],
          scheduledTime: '2026-11-16T10:00:00',
        },
      ],
      geocode
    );

    expect(geocode).toHaveBeenCalledWith('1 High St, London, E1');
    expect(located).toEqual({
      jobId: 12,
      jobRef: 3,
      status: 'NEW',
      lat: 1,
      lng: 2,
      address: '1 High St, London, E1',
      clientName: 'Acme',
      customerName: 'Sam',
      workerNames: ['Ana'],
      scheduledTime: '2026-11-16T10:00:00',
    });
  });

  it('leaves rows that already have coordinates to the stored pins, without geocoding them', async () => {
    const geocode = vi.fn();
    const located = await geocodeUnlocatedJobs([{ jobId: 1, lat: 0, lng: 0, address: '1 High St' }], geocode);

    expect(geocode).not.toHaveBeenCalled();
    expect(located).toEqual([]);
  });

  it('skips an address that cannot be geocoded and carries on', async () => {
    const geocode = vi.fn().mockResolvedValueOnce(null).mockResolvedValueOnce({ lat: 1, lng: 2 });
    const located = await geocodeUnlocatedJobs(
      [
        { jobId: 1, address: 'Nowhere' },
        { jobId: 2, address: '1 High St' },
      ],
      geocode
    );

    expect(located.map((job) => job.jobId)).toEqual([2]);
  });

  it('produces locations that become ordinary map pins, with worker names', async () => {
    const located = await geocodeUnlocatedJobs(
      [{ jobId: 12, jobRef: 3, address: '1 High St', workerNames: ['Ana', 'Bo'] }],
      vi.fn().mockResolvedValue({ lat: 1, lng: 2 })
    );
    const [marker] = toJobLocationMarkers(located);

    expect(marker.name).toBe('Job #3');
    expect(marker.location).toEqual({ lat: 1, lng: 2 });
    expect(marker.jobLocationData?.workerName).toBe('Ana, Bo');
  });
});

describe('toJobLocationMarkers', () => {
  it('maps a location onto a marker, labelled by job ref', () => {
    const [marker] = toJobLocationMarkers([
      { jobId: 12, jobRef: 3, status: 'IN_PROGRESS', lat: 51.5, lng: -0.1, address: '1 High St', workerNames: ['Ana', 'Bo'] },
    ]);

    expect(marker.location).toEqual({ lat: 51.5, lng: -0.1 });
    expect(marker.name).toBe('Job #3');
    expect(marker.jobLocationData).toMatchObject({ jobId: 3, status: 'IN_PROGRESS', workerName: 'Ana, Bo' });
  });

  it('accepts a coordinate of exactly zero', () => {
    const [marker] = toJobLocationMarkers([{ jobId: 1, lat: 0, lng: 0 }]);

    expect(marker.location).toEqual({ lat: 0, lng: 0 });
  });

  it('skips anything without coordinates', () => {
    expect(toJobLocationMarkers([{ jobId: 1 }, { jobId: 2, lat: 1 }, { jobId: 3, address: 'Nowhere' }])).toEqual([]);
  });

  it('leaves workerName unset when nobody is assigned', () => {
    const [marker] = toJobLocationMarkers([{ jobId: 1, lat: 1, lng: 1, workerNames: [] }]);

    expect(marker.jobLocationData?.workerName).toBeUndefined();
  });

  describe('scheduledTime', () => {
    const scheduledTimeOf = (scheduledTime?: string | null) =>
      toJobLocationMarkers([{ jobId: 1, lat: 1, lng: 1, scheduledTime: scheduledTime as string | undefined }])[0]
        .jobLocationData?.scheduledTime;

    it('formats a DATE field value with its time', () => {
      expect(scheduledTimeOf('2026-11-16T10:00:00')).toBe('16 Nov 2026, 10:00');
    });

    it('shows only the date at midnight, since DATE fields are entered without a time', () => {
      expect(scheduledTimeOf('2026-11-16T00:00:00')).toBe('16 Nov 2026');
    });

    it('shows other field types as entered', () => {
      expect(scheduledTimeOf('Tuesday 9am')).toBe('Tuesday 9am');
    });

    it('is unset when the job has no scheduled time', () => {
      expect(scheduledTimeOf(null)).toBeUndefined();
      expect(scheduledTimeOf(undefined)).toBeUndefined();
    });
  });
});

describe('toRecentWorkflowActivity', () => {
  it('maps the response onto the widget shape', () => {
    expect(
      toRecentWorkflowActivity({
        activityId: 5,
        jobId: 12,
        jobRef: 3,
        workflowName: 'Install',
        stepId: 9,
        stepName: 'Survey',
        stepStatus: 'STARTED',
        activityType: 'COMMENT_ADDED',
        message: 'On site',
        actorUsername: 'ana',
        createdAt: '2026-11-01T10:00:00Z',
      })
    ).toEqual({
      id: 5,
      jobId: 12,
      jobRef: 3,
      workflowName: 'Install',
      stepId: 9,
      stepName: 'Survey',
      status: 'started',
      activityType: 'COMMENT_ADDED',
      message: 'On site',
      actorUsername: 'ana',
      updatedAt: '2026-11-01T10:00:00Z',
    });
  });

  it('falls back to the job id when the job has no ref', () => {
    expect(toRecentWorkflowActivity({ jobId: 12 }).jobRef).toBe(12);
  });
});
