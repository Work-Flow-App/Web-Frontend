import { LineItemsApi, Configuration } from '../../../workflow-api';
import type {
  LineItemResponse,
  LineItemCreateRequest,
  LineItemUpdateRequest,
} from '../../../workflow-api';
import { env } from '../../config/env';
import { axiosInstance } from './axiosConfig';

export type { LineItemResponse, LineItemCreateRequest, LineItemUpdateRequest };

function getLineItemsApi(): LineItemsApi {
  const config = new Configuration({ basePath: env.apiBaseUrl });
  return new LineItemsApi(config, env.apiBaseUrl, axiosInstance);
}

export const lineItemService = {
  getAll() {
    return getLineItemsApi().lineItemGetAll();
  },

  getById(id: number) {
    return getLineItemsApi().lineItemGet(id);
  },

  create(data: LineItemCreateRequest) {
    return getLineItemsApi().lineItemCreate(data);
  },

  update(id: number, data: LineItemUpdateRequest) {
    return getLineItemsApi().lineItemUpdate(id, data);
  },

  delete(id: number) {
    return getLineItemsApi().lineItemDelete(id);
  },
};
