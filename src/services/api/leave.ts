import type { AxiosResponse } from 'axios';
import { CompanyLeaveRequestsApi, WorkerLeaveRequestsSelfServiceApi, Configuration } from '../../../workflow-api';
import type { PageMetadata } from '../../../workflow-api';
import { env } from '../../config/env';
import { axiosInstance } from './axiosConfig';

export const LeaveType = {
  Annual: 'ANNUAL',
  Sick: 'SICK',
  Unpaid: 'UNPAID',
  Other: 'OTHER',
} as const;
export type LeaveType = (typeof LeaveType)[keyof typeof LeaveType];

export const LEAVE_TYPE_OPTIONS: { value: LeaveType; label: string }[] = [
  { value: LeaveType.Annual, label: 'Annual' },
  { value: LeaveType.Sick, label: 'Sick' },
  { value: LeaveType.Unpaid, label: 'Unpaid' },
  { value: LeaveType.Other, label: 'Other' },
];

export const LeaveStatus = {
  Pending: 'PENDING',
  Approved: 'APPROVED',
  Rejected: 'REJECTED',
  Cancelled: 'CANCELLED',
} as const;
export type LeaveStatus = (typeof LeaveStatus)[keyof typeof LeaveStatus];

export const LEAVE_STATUS_OPTIONS: { value: LeaveStatus; label: string }[] = [
  { value: LeaveStatus.Pending, label: 'Pending' },
  { value: LeaveStatus.Approved, label: 'Approved' },
  { value: LeaveStatus.Rejected, label: 'Rejected' },
  { value: LeaveStatus.Cancelled, label: 'Cancelled' },
];

// The generated LeaveRequestResponse marks every field optional (Jackson's nullable-by-default
// stance), but a successful response always carries these - narrowed here so callers don't need
// optional chaining for data that's always present.
export interface LeaveRequestResponse {
  id: number;
  workerId: number;
  workerName?: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason?: string;
  status: LeaveStatus;
  decisionNote?: string;
  createdAt?: string;
}

export interface LeaveRequestCreatePayload {
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason?: string;
}

// Matches LeaveRequestUpdateRequest - the backend doesn't allow changing leaveType after submission.
export interface LeaveRequestUpdatePayload {
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface LeaveCalendarEntry {
  workerId: number;
  workerName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
}

export interface CompanyLeaveRequestFilters {
  status?: LeaveStatus;
  page?: number;
  size?: number;
}

// PagedModelLeaveRequestResponse nests pagination info under `page` (Spring HATEOAS shape).
export interface PagedLeaveRequests {
  content: LeaveRequestResponse[];
  page?: PageMetadata;
}

function getLeaveApi(): CompanyLeaveRequestsApi {
  const config = new Configuration({ basePath: env.apiBaseUrl });
  return new CompanyLeaveRequestsApi(config, env.apiBaseUrl, axiosInstance);
}

function getLeaveSelfApi(): WorkerLeaveRequestsSelfServiceApi {
  const config = new Configuration({ basePath: env.apiBaseUrl });
  return new WorkerLeaveRequestsSelfServiceApi(config, env.apiBaseUrl, axiosInstance);
}

export const leaveService = {
  /**
   * Worker self-service
   */
  async getMyLeaveRequests(): Promise<AxiosResponse<LeaveRequestResponse[]>> {
    return (await getLeaveSelfApi().workerLeaveRequestSelfGetOwnLeaveRequests()) as AxiosResponse<LeaveRequestResponse[]>;
  },

  async submitLeaveRequest(data: LeaveRequestCreatePayload): Promise<AxiosResponse<LeaveRequestResponse>> {
    return (await getLeaveSelfApi().workerLeaveRequestSelfSubmitLeaveRequest(data)) as AxiosResponse<LeaveRequestResponse>;
  },

  async updateLeaveRequest(id: number, data: LeaveRequestUpdatePayload): Promise<AxiosResponse<LeaveRequestResponse>> {
    return (await getLeaveSelfApi().workerLeaveRequestSelfUpdateOwnLeaveRequest(id, data)) as AxiosResponse<LeaveRequestResponse>;
  },

  async cancelLeaveRequest(id: number) {
    return await getLeaveSelfApi().workerLeaveRequestSelfCancelOwnLeaveRequest(id);
  },

  /**
   * Company admin
   */
  async getCompanyLeaveRequests(filters: CompanyLeaveRequestFilters = {}): Promise<AxiosResponse<PagedLeaveRequests>> {
    const { status, page = 0, size = 20 } = filters;
    return (await getLeaveApi().companyLeaveRequestListLeaveRequests(status, page, size)) as AxiosResponse<PagedLeaveRequests>;
  },

  async approveLeaveRequest(id: number, decisionNote?: string): Promise<AxiosResponse<LeaveRequestResponse>> {
    return (await getLeaveApi().companyLeaveRequestApproveLeaveRequest(
      id,
      decisionNote !== undefined ? { decisionNote } : undefined
    )) as AxiosResponse<LeaveRequestResponse>;
  },

  async rejectLeaveRequest(id: number, decisionNote: string): Promise<AxiosResponse<LeaveRequestResponse>> {
    return (await getLeaveApi().companyLeaveRequestRejectLeaveRequest(id, { decisionNote })) as AxiosResponse<LeaveRequestResponse>;
  },

  async getLeaveCalendar(from: string, to: string): Promise<AxiosResponse<LeaveCalendarEntry[]>> {
    return (await getLeaveApi().companyLeaveRequestGetLeaveCalendar(from, to)) as AxiosResponse<LeaveCalendarEntry[]>;
  },
};

export default leaveService;
