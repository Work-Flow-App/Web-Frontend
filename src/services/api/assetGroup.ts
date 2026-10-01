import { AssetGroupsApi, Configuration } from '../../../workflow-api';
import type { AssetGroupResponse, AssetGroupCreateRequest, PagedModelAssetGroupResponse } from '../../../workflow-api';
import { env } from '../../config/env';
import { axiosInstance } from './axiosConfig';

export type { AssetGroupResponse, AssetGroupCreateRequest, PagedModelAssetGroupResponse };

function getAssetGroupApi(): AssetGroupsApi {
  const config = new Configuration({ basePath: env.apiBaseUrl });
  return new AssetGroupsApi(config, env.apiBaseUrl, axiosInstance);
}

export const assetGroupService = {
  async getAllAssetGroups(page = 0, size = 100) {
    return await getAssetGroupApi().assetGroupList(page, size);
  },

  async createAssetGroup(data: AssetGroupCreateRequest) {
    return await getAssetGroupApi().assetGroupCreate(data);
  },

  async updateAssetGroup(id: number, data: AssetGroupCreateRequest) {
    return await getAssetGroupApi().assetGroupUpdate(id, data);
  },

  async deleteAssetGroup(id: number) {
    return await getAssetGroupApi().assetGroupDelete(id);
  },
};

export default assetGroupService;
