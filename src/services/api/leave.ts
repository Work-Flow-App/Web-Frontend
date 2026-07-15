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

export interface LeaveRequestResponse {
  id: number;
  workerId: number;
  workerName?: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason?: string;
  status: LeaveStatus;
  decisionNote?: string;
  createdAt?: string;
}

export interface LeaveRequestCreatePayload {
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface LeaveCalendarEntry {
  workerId: number;
  workerName: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
}

export interface CompanyLeaveRequestFilters {
  status?: LeaveStatus;
  page?: number;
  size?: number;
}

export interface PagedLeaveRequests {
  content: LeaveRequestResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export const leaveService = {
  /**
   * Worker self-service
   */
  async getMyLeaveRequests() {
    return axiosInstance.get<LeaveRequestResponse[]>(`${env.apiBaseUrl}/api/v1/worker/leave-requests`);
  },

  async submitLeaveRequest(data: LeaveRequestCreatePayload) {
    return axiosInstance.post<LeaveRequestResponse>(`${env.apiBaseUrl}/api/v1/worker/leave-requests`, data);
  },

  async updateLeaveRequest(id: number, data: Partial<LeaveRequestCreatePayload>) {
    return axiosInstance.patch<LeaveRequestResponse>(`${env.apiBaseUrl}/api/v1/worker/leave-requests/${id}`, data);
  },

  async cancelLeaveRequest(id: number) {
    return axiosInstance.delete(`${env.apiBaseUrl}/api/v1/worker/leave-requests/${id}`);
  },

  /**
   * Company admin
   */
  async getCompanyLeaveRequests(filters: CompanyLeaveRequestFilters = {}) {
    const { status, page = 0, size = 20 } = filters;
    return axiosInstance.get<PagedLeaveRequests>(`${env.apiBaseUrl}/api/v1/workers/leave-requests`, {
      params: { status, page, size },
    });
  },

  async approveLeaveRequest(id: number, note?: string) {
    return axiosInstance.post<LeaveRequestResponse>(`${env.apiBaseUrl}/api/v1/workers/leave-requests/${id}/approve`, {
      note,
    });
  },

  async rejectLeaveRequest(id: number, decisionNote: string) {
    return axiosInstance.post<LeaveRequestResponse>(`${env.apiBaseUrl}/api/v1/workers/leave-requests/${id}/reject`, {
      decisionNote,
    });
  },

  async getLeaveCalendar(from: string, to: string) {
    return axiosInstance.get<LeaveCalendarEntry[]>(`${env.apiBaseUrl}/api/v1/workers/leave-requests/calendar`, {
      params: { from, to },
    });
  },
};

export default leaveService;
