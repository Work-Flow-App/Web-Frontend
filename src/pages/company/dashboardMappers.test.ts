import { describe, expect, it } from 'vitest';
import { toJobLocationMarkers, toRecentWorkflowActivity, toStepEventGroups } from './dashboardMappers';

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
