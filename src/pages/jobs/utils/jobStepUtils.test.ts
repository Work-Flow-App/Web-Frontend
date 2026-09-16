import { describe, it, expect } from 'vitest';
import { getCurrentStepName } from './jobStepUtils';
import type { JobResponse, JobWorkflowResponse, JobWorkflowStepResponse } from '../../../services/api';

describe('getCurrentStepName', () => {
  const sampleSteps: JobWorkflowStepResponse[] = [
    { id: 1, name: 'Initial Survey', orderIndex: 1, status: 'NOT_STARTED' },
    { id: 2, name: 'Material Preparation', orderIndex: 2, status: 'NOT_STARTED' },
    { id: 3, name: 'Installation', orderIndex: 3, status: 'NOT_STARTED' },
    { id: 4, name: 'Final Inspection & Handover', orderIndex: 4, status: 'NOT_STARTED' },
  ];

  it('returns "-" when jobWorkflow or steps are missing', () => {
    expect(getCurrentStepName(null, null)).toBe('-');
    expect(getCurrentStepName({ id: 1 } as JobResponse, null)).toBe('-');
    expect(getCurrentStepName({ id: 1 } as JobResponse, { id: 10, steps: [] } as JobWorkflowResponse)).toBe('-');
  });

  describe('Rule 1: When just created', () => {
    it('shows the first step when job status is NEW', () => {
      const job: JobResponse = { id: 1, status: 'NEW' };
      const jw: JobWorkflowResponse = {
        id: 10,
        status: 'INITIATED',
        steps: sampleSteps,
      };
      expect(getCurrentStepName(job, jw)).toBe('Initial Survey');
    });

    it('shows the first step when workflow is NOT_STARTED and no steps are started or completed', () => {
      const job: JobResponse = { id: 1, status: 'PENDING' };
      const jw: JobWorkflowResponse = {
        id: 10,
        status: 'NOT_STARTED',
        steps: sampleSteps,
      };
      expect(getCurrentStepName(job, jw)).toBe('Initial Survey');
    });
  });

  describe('Rule 2: When complete', () => {
    it('shows the last step when job status is COMPLETED', () => {
      const job: JobResponse = { id: 1, status: 'COMPLETED' };
      const jw: JobWorkflowResponse = {
        id: 10,
        status: 'COMPLETED',
        steps: sampleSteps.map((s) => ({ ...s, status: 'COMPLETED' })),
      };
      expect(getCurrentStepName(job, jw)).toBe('Final Inspection & Handover');
    });

    it('shows the last step when workflow status is COMPLETED even if some steps were skipped', () => {
      const job: JobResponse = { id: 1, status: 'IN_PROGRESS' };
      const jw: JobWorkflowResponse = {
        id: 10,
        status: 'COMPLETED',
        steps: [
          { id: 1, name: 'Initial Survey', orderIndex: 1, status: 'COMPLETED' },
          { id: 2, name: 'Material Preparation', orderIndex: 2, status: 'SKIPPED' },
          { id: 3, name: 'Installation', orderIndex: 3, status: 'COMPLETED' },
          { id: 4, name: 'Final Inspection & Handover', orderIndex: 4, status: 'COMPLETED' },
        ],
      };
      expect(getCurrentStepName(job, jw)).toBe('Final Inspection & Handover');
    });

    it('shows the last step when all steps are COMPLETED or SKIPPED', () => {
      const job: JobResponse = { id: 1, status: 'IN_PROGRESS' };
      const jw: JobWorkflowResponse = {
        id: 10,
        status: 'ONGOING',
        steps: [
          { id: 1, name: 'Step A', orderIndex: 1, status: 'COMPLETED' },
          { id: 2, name: 'Step B', orderIndex: 2, status: 'SKIPPED' },
        ],
      };
      expect(getCurrentStepName(job, jw)).toBe('Step B');
    });
  });

  describe('Rule 3: Mid-time (Ongoing / In-progress)', () => {
    it('shows the active step when a step is ONGOING', () => {
      const job: JobResponse = { id: 1, status: 'IN_PROGRESS' };
      const jw: JobWorkflowResponse = {
        id: 10,
        status: 'ONGOING',
        steps: [
          { id: 1, name: 'Initial Survey', orderIndex: 1, status: 'COMPLETED' },
          { id: 2, name: 'Material Preparation', orderIndex: 2, status: 'ONGOING', startedAt: '2026-09-10T10:00:00Z' },
          { id: 3, name: 'Installation', orderIndex: 3, status: 'PENDING' },
          { id: 4, name: 'Final Inspection & Handover', orderIndex: 4, status: 'NOT_STARTED' },
        ],
      };
      expect(getCurrentStepName(job, jw)).toBe('Material Preparation');
    });

    it('shows the most recent ongoing step when multiple steps are ongoing', () => {
      const job: JobResponse = { id: 1, status: 'IN_PROGRESS' };
      const jw: JobWorkflowResponse = {
        id: 10,
        status: 'ONGOING',
        steps: [
          { id: 1, name: 'Initial Survey', orderIndex: 1, status: 'STARTED', startedAt: '2026-09-10T09:00:00Z' },
          { id: 2, name: 'Material Preparation', orderIndex: 2, status: 'ONGOING', startedAt: '2026-09-11T14:00:00Z' },
          { id: 3, name: 'Installation', orderIndex: 3, status: 'PENDING' },
        ],
      };
      expect(getCurrentStepName(job, jw)).toBe('Material Preparation');
    });

    it('shows the next pending step when step 1 completed and step 2 not yet started', () => {
      const job: JobResponse = { id: 1, status: 'IN_PROGRESS' };
      const jw: JobWorkflowResponse = {
        id: 10,
        status: 'ONGOING',
        steps: [
          { id: 1, name: 'Initial Survey', orderIndex: 1, status: 'COMPLETED' },
          { id: 2, name: 'Material Preparation', orderIndex: 2, status: 'PENDING' },
          { id: 3, name: 'Installation', orderIndex: 3, status: 'NOT_STARTED' },
        ],
      };
      expect(getCurrentStepName(job, jw)).toBe('Material Preparation');
    });

    it('shows the updated ongoing step even if job.status in DB is still NEW', () => {
      const job: JobResponse = { id: 1, status: 'NEW' };
      const jw: JobWorkflowResponse = {
        id: 10,
        status: 'INITIATED',
        steps: [
          { id: 1, name: 'Step 1: Intake', orderIndex: 1, status: 'COMPLETED' },
          { id: 2, name: 'Step 2: Ongoing Work', orderIndex: 2, status: 'ONGOING' },
          { id: 3, name: 'Step 3: Final Delivery', orderIndex: 3, status: 'NOT_STARTED' },
        ],
      };
      expect(getCurrentStepName(job, jw)).toBe('Step 2: Ongoing Work');
    });

    it('shows the ongoing step when status has different casing or whitespace', () => {
      const job: JobResponse = { id: 1, status: 'IN_PROGRESS' };
      const jw: JobWorkflowResponse = {
        id: 10,
        steps: [
          { id: 1, name: 'Step 1', orderIndex: 1, status: 'not_started' as any },
          { id: 2, name: 'Step 2', orderIndex: 2, status: ' ongoing ' as any },
        ],
      };
      expect(getCurrentStepName(job, jw)).toBe('Step 2');
    });
  });

  describe('Template steps fallback (when jobWorkflow instance is not yet created)', () => {
    const templateSteps = [
      { id: 101, name: 'Step 1: Planning', orderIndex: 1 },
      { id: 102, name: 'Step 2: Execution', orderIndex: 2 },
      { id: 103, name: 'Step 3: Closure', orderIndex: 3 },
    ];

    it('shows the first step of template when job is just created or in progress without jobWorkflow', () => {
      const job: JobResponse = { id: 1, status: 'NEW' };
      expect(getCurrentStepName(job, null, templateSteps)).toBe('Step 1: Planning');
    });

    it('shows the last step of template when job is COMPLETED without jobWorkflow', () => {
      const job: JobResponse = { id: 1, status: 'COMPLETED' };
      expect(getCurrentStepName(job, null, templateSteps)).toBe('Step 3: Closure');
    });

    it('prefers runtime jobWorkflow over template steps when available', () => {
      const job: JobResponse = { id: 1, status: 'IN_PROGRESS' };
      const jw: JobWorkflowResponse = {
        id: 10,
        status: 'ONGOING',
        steps: [
          { id: 1, name: 'Runtime Step 1', orderIndex: 1, status: 'COMPLETED' },
          { id: 2, name: 'Runtime Step 2', orderIndex: 2, status: 'ONGOING' },
        ],
      };
      expect(getCurrentStepName(job, jw, templateSteps)).toBe('Runtime Step 2');
    });
  });
});
