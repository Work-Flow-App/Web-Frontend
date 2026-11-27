import {
  AssetsApi,
  AssetAssignmentsApi,
  WorkerAssetsApi,
  Configuration,
  AssetResponseLocationTypeEnum,
  AssetAssignmentCreateRequestExplicitLocationTypeEnum,
} from '../../../workflow-api';
import type {
  AssetResponse,
  AssetCreateRequest,
  AssetUpdateRequest,
  AssetValueResponse,
  AssetAssignmentResponse,
  AssetAssignmentResponseLocationTypeEnum,
  AssetAssignmentCreateRequest,
  AssetAssignmentUpdateRequest,
  AssetAssignmentReturnRequest,
  AssetAttachmentDto,
  AddressRequest,
  AddressResponse,
  PagedModelAssetResponse,
} from '../../../workflow-api';
import { env } from '../../config/env';
import { axiosInstance } from './axiosConfig';

export { AssetResponseLocationTypeEnum, AssetAssignmentCreateRequestExplicitLocationTypeEnum };
export type {
  AssetResponse,
  AssetCreateRequest,
  AssetUpdateRequest,
  AssetValueResponse,
  AssetAssignmentResponse,
  AssetAssignmentResponseLocationTypeEnum,
  AssetAssignmentCreateRequest,
  AssetAssignmentUpdateRequest,
  AssetAssignmentReturnRequest,
  AssetAttachmentDto,
  AddressRequest,
  AddressResponse,
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

function getWorkerAssetSelfApi(): WorkerAssetsApi {
  const config = new Configuration({ basePath: env.apiBaseUrl });
  return new WorkerAssetsApi(config, env.apiBaseUrl, axiosInstance);
}

// The most the backend returns per page, whatever size is asked for
const ASSET_PAGE_SIZE = 100;
const PAGES_PER_BATCH = 5;

export interface AssetListFilters {
  /** True for archived assets only; otherwise only active assets are returned. */
  archived?: boolean;
  /** Active assets that are (true) or are not (false) available. */
  available?: boolean;
  groupId?: number;
}

export const assetService = {
  /** One page of assets. Use `getAllAssetPages` for screens that list or look up assets. */
  async getAllAssets(page = 0, size = 20, archived?: boolean, available?: boolean, groupId?: number, sort?: string, dir?: string) {
    return await getAssetApi().assetList(page, size, archived, available, groupId, sort, dir);
  },

  /**
   * Every asset matching the filters, from all pages. The list endpoint has no search,
   * so screens load the whole list and search it in the browser.
   */
  async getAllAssetPages({ archived, available, groupId }: AssetListFilters = {}): Promise<{ data: AssetResponse[] }> {
    // GET /assets ignores `available` whenever `archived` is sent, and archived=true also
    // returns active assets, so send only one of the two and filter archived ones here.
    const archivedParam = available == null ? archived : undefined;
    const fetchPage = async (page: number) =>
      (await getAssetApi().assetList(page, ASSET_PAGE_SIZE, archivedParam, available, groupId)).data;

    const first = await fetchPage(0);
    const pages = [first];
    const totalPages = first.page?.totalPages ?? 1;
    for (let start = 1; start < totalPages; start += PAGES_PER_BATCH) {
      const batch = Array.from({ length: Math.min(PAGES_PER_BATCH, totalPages - start) }, (_, i) => start + i);
      pages.push(...(await Promise.all(batch.map(fetchPage))));
    }

    const assets = pages.flatMap((page) => page.content ?? []);
    return { data: archived ? assets.filter((asset) => asset.archived) : assets };
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

  async updateAssignment(assignmentId: number, data: AssetAssignmentUpdateRequest) {
    return await getAssetAssignmentApi().assetAssignmentUpdateAssignment(assignmentId, data);
  },

  async uploadAttachments(id: number, files: File[]) {
    return await getAssetApi().assetAddAttachments(id, files);
  },

  async removeAttachment(id: number, fileUrl: string) {
    return await getAssetApi().assetRemoveAttachment(id, fileUrl);
  },

  /**
   * Worker self-service
   */
  async getMyAssignedAssets() {
    return await getWorkerAssetSelfApi().workerAssetGetMyAssignedAssets();
  },

  async getMyAssignedAssetDetails(assetId: number) {
    return await getWorkerAssetSelfApi().workerAssetGetAssignedAssetDetails(assetId);
  },

  async updateMyAssetAddress(assignmentId: number, data: AddressRequest) {
    return await getWorkerAssetSelfApi().workerAssetUpdateAssetAddress(assignmentId, data);
  },
};

export default assetService;

