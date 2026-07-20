import { CompanyApi, Configuration } from '../../../workflow-api';
import type {
  CompanyProfileUpdateRequest,
  CompanyPostCreateRequest,
  CompanyPostUpdateRequest,
  CompanyUploadDocumentTypeEnum,
  CompanyUpdateDocumentTypeEnum,
} from '../../../workflow-api';
import { env } from '../../config/env';
import { axiosInstance } from './axiosConfig';

export type {
  CompanyProfileResponse,
  CompanyProfileUpdateRequest,
  CompanyDashboardResponse,
  CompanyDocumentResponse,
  CompanyPostResponse,
  CompanyPostCreateRequest,
  CompanyPostUpdateRequest,
  CompanyPostAttachmentResponse,
} from '../../../workflow-api';

export interface CompanyDocumentUploadPayload {
  title: string;
  type: CompanyUploadDocumentTypeEnum;
  isPublic: boolean;
  file: File;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface CompanyDocumentUpdatePayload {
  title?: string;
  description?: string;
  type?: CompanyUpdateDocumentTypeEnum;
  startDate?: string;
  endDate?: string;
  isPublic?: boolean;
  file?: File;
}

function getCompanyApi(): CompanyApi {
  const config = new Configuration({ basePath: env.apiBaseUrl });
  return new CompanyApi(config, env.apiBaseUrl, axiosInstance);
}

export const companyService = {
  async getProfile() {
    return await getCompanyApi().companyGetProfile();
  },

  async updateProfile(data: CompanyProfileUpdateRequest) {
    return await getCompanyApi().companyUpdateProfile(data);
  },

  async getDashboard() {
    return await getCompanyApi().companyGetDashboard();
  },

  /**
   * Logo
   */
  async uploadLogo(file: File) {
    return await getCompanyApi().companyUploadLogo(file);
  },

  async deleteLogo() {
    return await getCompanyApi().companyDeleteLogo();
  },

  /**
   * Documents
   */
  async getDocuments() {
    return await getCompanyApi().companyGetCompanyDocuments();
  },

  async uploadDocument(payload: CompanyDocumentUploadPayload) {
    return await getCompanyApi().companyUploadDocument(
      payload.title,
      payload.type,
      payload.isPublic,
      payload.file,
      payload.description,
      payload.startDate,
      payload.endDate
    );
  },

  async updateDocument(documentId: number, payload: CompanyDocumentUpdatePayload) {
    return await getCompanyApi().companyUpdateDocument(
      documentId,
      payload.title,
      payload.description,
      payload.type,
      payload.startDate,
      payload.endDate,
      payload.isPublic,
      payload.file
    );
  },

  async deleteDocument(documentId: number) {
    return await getCompanyApi().companyDeleteDocument(documentId);
  },

  /**
   * Posts
   */
  async getPosts() {
    return await getCompanyApi().companyGetCompanyPosts();
  },

  async createPost(data: CompanyPostCreateRequest, files?: File[]) {
    return await getCompanyApi().companyCreatePost(data, files);
  },

  async updatePost(postId: number, data?: CompanyPostUpdateRequest, newFiles?: File[]) {
    return await getCompanyApi().companyUpdatePost(postId, data, newFiles);
  },

  async deletePost(postId: number) {
    return await getCompanyApi().companyDeletePost(postId);
  },
};

export default companyService;
