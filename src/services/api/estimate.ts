import { EstimatesApi, Configuration } from '../../../workflow-api';
import type {
  EstimateResponse,
  EstimateUpdateRequest,
  LineItemResponse,
  LineItemCreateRequest,
} from '../../../workflow-api';
import { env } from '../../config/env';
import { axiosInstance } from './axiosConfig';

export type {
  EstimateResponse,
  EstimateUpdateRequest,
  LineItemResponse,
  LineItemCreateRequest,
};

function getEstimatesApi(): EstimatesApi {
  const config = new Configuration({ basePath: env.apiBaseUrl });
  return new EstimatesApi(config, env.apiBaseUrl, axiosInstance);
}

export const estimateService = {
  getByJobId(jobId: number) {
    return getEstimatesApi().estimateGetByJob(jobId);
  },

  updateNotes(estimateId: number, data: EstimateUpdateRequest) {
    return getEstimatesApi().estimateUpdate(estimateId, data);
  },

  createAndLinkLineItem(estimateId: number, data: LineItemCreateRequest) {
    return getEstimatesApi().estimateCreateAndLink(estimateId, data);
  },

  unlinkLineItem(estimateId: number, lineItemId: number) {
    return getEstimatesApi().estimateUnlink(estimateId, lineItemId);
  },
};
