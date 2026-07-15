import { env } from '../../config/env';
import { axiosInstance } from './axiosConfig';

export const CertificateType = {
  License: 'LICENSE',
  Safety: 'SAFETY',
  TradeQualification: 'TRADE_QUALIFICATION',
  Insurance: 'INSURANCE',
  Other: 'OTHER',
} as const;
export type CertificateType = (typeof CertificateType)[keyof typeof CertificateType];

export const CERTIFICATE_TYPE_OPTIONS: { value: CertificateType; label: string }[] = [
  { value: CertificateType.License, label: 'License' },
  { value: CertificateType.Safety, label: 'Safety' },
  { value: CertificateType.TradeQualification, label: 'Trade Qualification' },
  { value: CertificateType.Insurance, label: 'Insurance' },
  { value: CertificateType.Other, label: 'Other' },
];

export interface CertificateResponse {
  id: number;
  workerId: number;
  workerName?: string;
  type: CertificateType;
  name: string;
  issuingAuthority?: string;
  issueDate?: string;
  expiryDate?: string;
  fileUrl?: string;
  fileName?: string;
  expiringSoon?: boolean;
  daysUntilExpiry?: number;
  createdAt?: string;
}

export interface CertificateUpdateRequest {
  type?: CertificateType;
  name?: string;
  issuingAuthority?: string;
  issueDate?: string;
  expiryDate?: string;
}

export interface CertificateUploadPayload {
  file: File;
  type: CertificateType;
  name: string;
  issuingAuthority?: string;
  issueDate?: string;
  expiryDate?: string;
}

export interface PagedCertificates {
  content: CertificateResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface ExpiringCertificatesGroup {
  workerId: number;
  workerName: string;
  certificates: CertificateResponse[];
}

const MULTIPART_HEADERS = { headers: { 'Content-Type': 'multipart/form-data' } };

function buildCertificateFormData(payload: CertificateUploadPayload): FormData {
  const form = new FormData();
  form.append('file', payload.file);
  form.append('type', payload.type);
  form.append('name', payload.name);
  if (payload.issuingAuthority) form.append('issuingAuthority', payload.issuingAuthority);
  if (payload.issueDate) form.append('issueDate', payload.issueDate);
  if (payload.expiryDate) form.append('expiryDate', payload.expiryDate);
  return form;
}

export const certificateService = {
  /**
   * Worker self-service
   */
  async getMyCertificates() {
    return axiosInstance.get<CertificateResponse[]>(`${env.apiBaseUrl}/api/v1/worker/certificates`);
  },

  async uploadMyCertificate(payload: CertificateUploadPayload) {
    return axiosInstance.post<CertificateResponse>(
      `${env.apiBaseUrl}/api/v1/worker/certificates`,
      buildCertificateFormData(payload),
      MULTIPART_HEADERS
    );
  },

  async updateMyCertificate(id: number, data: CertificateUpdateRequest) {
    return axiosInstance.patch<CertificateResponse>(`${env.apiBaseUrl}/api/v1/worker/certificates/${id}`, data);
  },

  async deleteMyCertificate(id: number) {
    return axiosInstance.delete(`${env.apiBaseUrl}/api/v1/worker/certificates/${id}`);
  },

  /**
   * Company admin
   */
  async getWorkerCertificates(workerId: number) {
    return axiosInstance.get<CertificateResponse[]>(`${env.apiBaseUrl}/api/v1/workers/${workerId}/certificates`);
  },

  async uploadWorkerCertificate(workerId: number, payload: CertificateUploadPayload) {
    return axiosInstance.post<CertificateResponse>(
      `${env.apiBaseUrl}/api/v1/workers/${workerId}/certificates`,
      buildCertificateFormData(payload),
      MULTIPART_HEADERS
    );
  },

  async deleteWorkerCertificate(workerId: number, id: number) {
    return axiosInstance.delete(`${env.apiBaseUrl}/api/v1/workers/${workerId}/certificates/${id}`);
  },

  async getAllCertificates(page = 0, size = 20) {
    return axiosInstance.get<PagedCertificates>(`${env.apiBaseUrl}/api/v1/workers/certificates`, {
      params: { page, size },
    });
  },

  async getExpiringCertificates(days = 30) {
    return axiosInstance.get<ExpiringCertificatesGroup[]>(`${env.apiBaseUrl}/api/v1/workers/certificates/expiring`, {
      params: { days },
    });
  },
};

export default certificateService;
