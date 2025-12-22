import { AssetControllerApi, AssetAssignmentControllerApi, Configuration } from '../../../workflow-api';
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

/**
 * Asset API Service
 * Provides CRUD operations for asset management
 */

/**
 * Get a configured AssetControllerApi instance
 */
function getAssetApi(): AssetControllerApi {
  const config = new Configuration({
    basePath: env.apiBaseUrl,
  });
  return new AssetControllerApi(config, env.apiBaseUrl, axiosInstance);
}

/**
 * Get a configured AssetAssignmentControllerApi instance
 */
function getAssetAssignmentApi(): AssetAssignmentControllerApi {
  const config = new Configuration({
    basePath: env.apiBaseUrl,
  });
  return new AssetAssignmentControllerApi(config, env.apiBaseUrl, axiosInstance);
}

export const assetService = {
  /**
   * Get all assets with pagination and filters
   */
  async getAllAssets(
    page: number = 0,
    size: number = 20,
    archived?: boolean,
    available?: boolean,
    sort?: string,
    dir?: string
  ) {
    return await getAssetApi().list(page, size, archived, available, sort, dir);
  },

  /**
   * Get asset by ID
   */
  async getAssetById(id: number) {
    return await getAssetApi().get1(id);
  },

  /**
   * Create a new asset
   */
  async createAsset(data: AssetCreateRequest) {
    return await getAssetApi().create1(data);
  },

  /**
   * Update an existing asset
   */
  async updateAsset(id: number, data: AssetUpdateRequest) {
    return await getAssetApi().update1(id, data);
  },

  /**
   * Archive an asset (only if not assigned)
   */
  async archiveAsset(id: number) {
    return await getAssetApi().archive(id);
  },

  /**
   * Get asset's current depreciated value
   */
  async getAssetValue(id: number, asOfDate?: string) {
    return await getAssetApi().value(id, asOfDate);
  },

  /**
   * Get asset statistics (total, available, in-use counts, etc.)
   */
  async getAssetStatistics() {
    return await getAssetApi().stats();
  },

  // Asset Assignment Methods

  /**
   * Assign asset to job/worker
   */
  async assignAsset(data: AssetAssignmentCreateRequest) {
    return await getAssetAssignmentApi().assign(data);
  },

  /**
   * Return an assigned asset
   */
  async returnAsset(data: AssetAssignmentReturnRequest) {
    return await getAssetAssignmentApi().returnAsset(data);
  },

  /**
   * Get assignment history for an asset
   */
  async getAssetHistory(assetId: number) {
    return await getAssetAssignmentApi().history(assetId);
  },

  /**
   * Get all assets assigned to a job
   */
  async getJobAssignments(jobId: number, onlyActive: boolean = false) {
    return await getAssetAssignmentApi().jobAssignments(jobId, onlyActive);
  },
};

export default assetService;
