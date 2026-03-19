import { AssetsApi, AssetAssignmentsApi, Configuration } from '../../../workflow-api';
import type {
  AssetResponse,
  AssetCreateRequest,
  AssetUpdateRequest,
  AssetValueResponse,
  AssetAssignmentResponse,
  AssetAssignmentCreateRequest,
  AssetAssignmentReturnRequest,
  PageAssetResponse,
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
  PageAssetResponse,
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
};

export default assetService;
