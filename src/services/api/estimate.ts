import { EstimatesApi, InvoicesApi, Configuration } from '../../../workflow-api';
import type {
  EstimateResponse,
  EstimateUpdateRequest,
  LineItemResponse,
  LineItemCreateRequest,
  InvoiceCreateRequest,
  InvoiceResponse,
} from '../../../workflow-api';
import { env } from '../../config/env';
import { axiosInstance } from './axiosConfig';

export type {
  EstimateResponse,
  EstimateUpdateRequest,
  LineItemResponse,
  LineItemCreateRequest,
  InvoiceCreateRequest,
  InvoiceResponse,
};

function getEstimatesApi(): EstimatesApi {
  const config = new Configuration({ basePath: env.apiBaseUrl });
  return new EstimatesApi(config, env.apiBaseUrl, axiosInstance);
}

function getInvoicesApi(): InvoicesApi {
  const config = new Configuration({ basePath: env.apiBaseUrl });
  return new InvoicesApi(config, env.apiBaseUrl, axiosInstance);
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

  linkExistingLineItem(estimateId: number, lineItemId: number) {
    return getEstimatesApi().estimateLinkExisting(estimateId, lineItemId);
  },

  unlinkLineItem(estimateId: number, lineItemId: number) {
    return getEstimatesApi().estimateUnlink(estimateId, lineItemId);
  },

  generateInvoice(estimateId: number, data: InvoiceCreateRequest) {
    return getInvoicesApi().invoiceGenerate(estimateId, data);
  },

  listInvoicesForEstimate(estimateId: number) {
    return getInvoicesApi().invoiceListForEstimate(estimateId);
  },
};
