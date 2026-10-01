import type { AxiosResponse } from 'axios';
import { WorkerCertificatesApi, WorkerCertificatesSelfServiceApi, Configuration } from '../../../workflow-api';
import type { PageMetadata } from '../../../workflow-api';
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

// The generated WorkerCertificateResponse marks every field optional (Jackson's nullable-by-default
// stance), but a successful response always carries these - narrowed here so callers don't need
// optional chaining for data that's always present.
export interface CertificateResponse {
  id: number;
  workerId: number;
  workerName?: string;
  type: CertificateType;
  customTypeLabel?: string;
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

// Matches WorkerCertificateUpdateRequest - the backend doesn't allow changing type after upload.
export interface CertificateUpdateRequest {
  name?: string;
  issuingAuthority?: string;
  issueDate?: string;
  expiryDate?: string;
}

export interface CertificateUploadPayload {
  file: File;
  type: CertificateType;
  name: string;
  // Only meaningful (and required by the backend) when type is CertificateType.Other
  customTypeLabel?: string;
  issuingAuthority?: string;
  issueDate?: string;
  expiryDate?: string;
}

// PagedModelWorkerCertificateResponse nests pagination info under `page` (Spring HATEOAS shape).
export interface PagedCertificates {
  content: CertificateResponse[];
  page?: PageMetadata;
}

export interface ExpiringCertificateResponse {
  certificateId: number;
  workerId: number;
  workerName: string;
  type: CertificateType;
  name: string;
  expiryDate: string;
  daysUntilExpiry: number;
}

function getCertificateApi(): WorkerCertificatesApi {
  const config = new Configuration({ basePath: env.apiBaseUrl });
  return new WorkerCertificatesApi(config, env.apiBaseUrl, axiosInstance);
}

function getCertificateSelfApi(): WorkerCertificatesSelfServiceApi {
  const config = new Configuration({ basePath: env.apiBaseUrl });
  return new WorkerCertificatesSelfServiceApi(config, env.apiBaseUrl, axiosInstance);
}

export const certificateService = {
  /**
   * Worker self-service
   */
  async getMyCertificates(): Promise<AxiosResponse<CertificateResponse[]>> {
    return (await getCertificateSelfApi().workerCertificateSelfGetOwnCertificates()) as AxiosResponse<CertificateResponse[]>;
  },

  async uploadMyCertificate(payload: CertificateUploadPayload): Promise<AxiosResponse<CertificateResponse>> {
    return (await getCertificateSelfApi().workerCertificateSelfUploadOwnCertificate(
      payload.type,
      payload.name,
      payload.file,
      payload.customTypeLabel,
      payload.issuingAuthority,
      payload.issueDate,
      payload.expiryDate
    )) as AxiosResponse<CertificateResponse>;
  },

  async updateMyCertificate(id: number, data: CertificateUpdateRequest): Promise<AxiosResponse<CertificateResponse>> {
    return (await getCertificateSelfApi().workerCertificateSelfUpdateOwnCertificate(id, data)) as AxiosResponse<CertificateResponse>;
  },

  async deleteMyCertificate(id: number) {
    return await getCertificateSelfApi().workerCertificateSelfDeleteOwnCertificate(id);
  },

  /**
   * Company admin
   */
  async getWorkerCertificates(workerId: number): Promise<AxiosResponse<CertificateResponse[]>> {
    return (await getCertificateApi().workerCertificateGetCertificatesForWorker(workerId)) as AxiosResponse<CertificateResponse[]>;
  },

  async uploadWorkerCertificate(workerId: number, payload: CertificateUploadPayload): Promise<AxiosResponse<CertificateResponse>> {
    return (await getCertificateApi().workerCertificateUploadCertificateForWorker(
      workerId,
      payload.type,
      payload.name,
      payload.file,
      payload.customTypeLabel,
      payload.issuingAuthority,
      payload.issueDate,
      payload.expiryDate
    )) as AxiosResponse<CertificateResponse>;
  },

  async deleteWorkerCertificate(workerId: number, id: number) {
    return await getCertificateApi().workerCertificateDeleteCertificate(workerId, id);
  },

  async getAllCertificates(page = 0, size = 20): Promise<AxiosResponse<PagedCertificates>> {
    return (await getCertificateApi().workerCertificateListCompanyCertificates(page, size)) as AxiosResponse<PagedCertificates>;
  },

  async getExpiringCertificates(days = 30): Promise<AxiosResponse<ExpiringCertificateResponse[]>> {
    return (await getCertificateApi().workerCertificateGetExpiringCertificates(days)) as AxiosResponse<ExpiringCertificateResponse[]>;
  },
};

export default certificateService;
