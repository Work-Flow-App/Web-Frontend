import { AssetsApi, AssetAssignmentsApi, Configuration } from '../../../workflow-api';
import type {
  AssetResponse,
  AssetCreateRequest,
  AssetUpdateRequest,
  AssetValueResponse,
  AssetAssignmentResponse,
  AssetAssignmentCreateRequest,
  AssetAssignmentReturnRequest,
  PagedModelAssetResponse,
} from '../../../workflow-api';
import { env } from '../../config/env';
import { axiosInstance } from './axiosConfig';

export type {
  AssetResponse,
  AssetCreateRequest,
  AssetUpdateRequest,
  AssetValueResponse,
  AssetAssignmentResponse,
  AssetAssignmentCreateRequest,
  AssetAssignmentReturnRequest,
  PagedModelAssetResponse,
};

function getAssetApi(): AssetsApi {
  const config = new Configuration({ basePath: env.apiBaseUrl });
  return new AssetsApi(config, env.apiBaseUrl, axiosInstance);
}

function getAssetAssignmentApi(): AssetAssignmentsApi {
  const config = new Configuration({ basePath: env.apiBaseUrl });
  return new AssetAssignmentsApi(config, env.apiBaseUrl, axiosInstance);
}

export const assetService = {
  async getAllAssets(page = 0, size = 20, archived?: boolean, available?: boolean, sort?: string, dir?: string) {
    return await getAssetApi().assetList(page, size, archived, available, sort, dir);
  },

  async getAssetById(id: number) {
    return await getAssetApi().assetGet(id);
  },

  async createAsset(data: AssetCreateRequest) {
    return await getAssetApi().assetCreate(data);
  },

  async updateAsset(id: number, data: AssetUpdateRequest) {
    return await getAssetApi().assetUpdate(id, data);
  },

  async archiveAsset(id: number) {
    return await getAssetApi().assetArchive(id);
  },

  async getAssetValue(id: number, asOfDate?: string) {
    return await getAssetApi().assetValue(id, asOfDate);
  },

  async getAssetStatistics() {
    return await getAssetApi().assetStats();
  },

  async assignAsset(data: AssetAssignmentCreateRequest) {
    return await getAssetAssignmentApi().assetAssignmentAssign(data);
  },

  async returnAsset(data: AssetAssignmentReturnRequest) {
    return await getAssetAssignmentApi().assetAssignmentReturnAsset(data);
  },

  async getAssetHistory(assetId: number) {
    return await getAssetAssignmentApi().assetAssignmentHistory(assetId);
  },

  async getJobAssignments(jobId: number, onlyActive = false) {
    return await getAssetAssignmentApi().assetAssignmentJobAssignments(jobId, onlyActive);
  },

  async updateAssignment(assignmentId: number, data: { assignedWorkerId?: number; notes?: string }) {
    return await axiosInstance.put(`/api/v1/asset-assignments/assign/${assignmentId}`, data);
  },

  async uploadAttachments(id: number, files: File[]) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    return await axiosInstance.post(`/api/v1/assets/${id}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async removeAttachment(id: number, fileUrl: string) {
    return await axiosInstance.delete(`/api/v1/assets/${id}/attachments`, {
      params: { fileUrl },
    });
  },
};

export default assetService;

