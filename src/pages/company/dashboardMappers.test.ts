import { describe, expect, it } from 'vitest';
import { toJobLocationMarkers, toRecentWorkflowActivity, toStepEventGroups } from './dashboardMappers';

describe('toStepEventGroups', () => {
  const templateSteps = [
    { stepId: 2, name: 'Install', orderIndex: 1 },
    { stepId: 1, name: 'Survey', orderIndex: 0 },
  ];

  it('keeps template steps with no jobs when groups only lists occupied steps', () => {
    const groups = toStepEventGroups({
      templateSteps,
      groups: [{ stepName: 'Install', orderIndex: 1, jobCount: 1, jobs: [{ jobId: 7 }] }],
    });

    expect(groups.map((g) => [g.stepName, g.count])).toEqual([
      ['Survey', 0],
      ['Install', 1],
    ]);
    expect(groups[1].jobs).toEqual([{ jobId: 7 }]);
  });

  it('does not double count when groups already lists every template step', () => {
    const groups = toStepEventGroups({
      templateSteps,
      groups: [
        { stepName: 'Survey', orderIndex: 0, jobCount: 0, jobs: [] },
        { stepName: 'Install', orderIndex: 1, jobCount: 2, jobs: [{ jobId: 7 }, { jobId: 8 }] },
      ],
    });

    expect(groups.map((g) => g.count)).toEqual([0, 2]);
  });

  it('keeps a group whose step is no longer in the template', () => {
    const groups = toStepEventGroups({
      templateSteps,
      groups: [{ stepName: 'Old step', orderIndex: 5, jobCount: 1, jobs: [{ jobId: 9 }] }],
    });

    expect(groups.map((g) => g.stepName)).toEqual(['Survey', 'Install', 'Old step']);
  });

  it('falls back to the number of jobs when jobCount is missing', () => {
    const [group] = toStepEventGroups({ groups: [{ stepName: 'Survey', jobs: [{ jobId: 1 }, { jobId: 2 }] }] });

    expect(group.count).toBe(2);
  });

  it('colours a step by its template position, whatever order the server sends', () => {
    const shuffled = toStepEventGroups({ templateSteps });
    const sorted = toStepEventGroups({ templateSteps: [...templateSteps].reverse() });

    expect(shuffled.map((g) => g.color)).toEqual(sorted.map((g) => g.color));
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
