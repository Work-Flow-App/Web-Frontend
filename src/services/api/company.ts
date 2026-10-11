import { CompanyApi, Configuration, PublicCompanyViewsApi } from '../../../workflow-api';
import type {
  CompanyProfileUpdateRequest,
  CompanyPostCreateRequest,
  CompanyPostUpdateRequest,
  CompanyPostGroupRequest,
  CompanyPostGroupResponse,
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
  CompanyPostGroupRequest,
  CompanyPostGroupResponse,
  PublicCompanyProfileResponse,
  UsageSummaryResponse,
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

function getPublicCompanyApi(): PublicCompanyViewsApi {
  const config = new Configuration({ basePath: env.apiBaseUrl });
  return new PublicCompanyViewsApi(config, env.apiBaseUrl, axiosInstance);
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

  async getUsage() {
    return await getCompanyApi().companyGetUsage();
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
  async getPosts(groupId?: number) {
    return await getCompanyApi().companyGetCompanyPosts(groupId);
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

  /**
   * Post groups
   */
  async getPostGroups(_companyId?: number) {
    return await axiosInstance.get<CompanyPostGroupResponse[]>('/api/v1/companies/post-groups');
  },

  async createPostGroup(dataOrCompanyId: CompanyPostGroupRequest | number, maybeData?: CompanyPostGroupRequest) {
    const data = typeof dataOrCompanyId === 'object' ? dataOrCompanyId : maybeData!;
    return await axiosInstance.post<CompanyPostGroupResponse>('/api/v1/companies/post-groups', data);
  },

  async updatePostGroup(
    firstArg: number,
    secondArg: CompanyPostGroupRequest | number,
    thirdArg?: CompanyPostGroupRequest
  ) {
    let groupId: number;
    let data: CompanyPostGroupRequest;
    if (typeof secondArg === 'number') {
      groupId = secondArg;
      data = thirdArg!;
    } else {
      groupId = firstArg;
      data = secondArg;
    }
    return await axiosInstance.put<CompanyPostGroupResponse>(`/api/v1/companies/post-groups/${groupId}`, data);
  },

  async deletePostGroup(firstArg: number, secondArg?: number) {
    const groupId = secondArg !== undefined ? secondArg : firstArg;
    return await axiosInstance.delete<void>(`/api/v1/companies/post-groups/${groupId}`);
  },

  /**
   * Public views — no authentication required, used for shareable company/post links
   */
  async getPublicProfile(companyId: number) {
    return await getPublicCompanyApi().publicCompanyGetPublicProfile(companyId);
  },

  async getPublicPosts(companyId: number, groupId?: number) {
    return await getPublicCompanyApi().publicCompanyGetPublicPosts(companyId, groupId);
  },

  async getPublicDocuments(companyId: number) {
    return await getPublicCompanyApi().publicCompanyGetPublicDocuments(companyId);
  },
};

export default companyService;
