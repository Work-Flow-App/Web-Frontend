import {
  EstimatesApi, InvoicesApi, EstimateDocumentsApi, Configuration,
  EstimateLineItemResponseStatusEnum,
  LineItemStatusUpdateRequestStatusEnum,
} from '../../../workflow-api';
import type {
  EstimateResponse,
  EstimateUpdateRequest,
  EstimateLineItemResponse,
  LineItemCreateRequest,
  LineItemUpdateRequest,
  LineItemStatusUpdateRequest,
  InvoiceCreateRequest,
  InvoiceResponse,
  EstimateDocumentCreateRequest,
  EstimateDocumentResponse,
  EstimateDocumentLineItemSnapshotResponse,
} from '../../../workflow-api';

export { EstimateLineItemResponseStatusEnum, LineItemStatusUpdateRequestStatusEnum };
export type { LineItemStatusUpdateRequest };
import { env } from '../../config/env';
import { axiosInstance } from './axiosConfig';

export type {
  EstimateResponse,
  EstimateUpdateRequest,
  EstimateLineItemResponse,
  LineItemCreateRequest,
  LineItemUpdateRequest,
  InvoiceCreateRequest,
  InvoiceResponse,
  EstimateDocumentCreateRequest,
  EstimateDocumentResponse,
  EstimateDocumentLineItemSnapshotResponse,
};

function getEstimatesApi(): EstimatesApi {
  const config = new Configuration({ basePath: env.apiBaseUrl });
  return new EstimatesApi(config, env.apiBaseUrl, axiosInstance);
}

function getInvoicesApi(): InvoicesApi {
  const config = new Configuration({ basePath: env.apiBaseUrl });
  return new InvoicesApi(config, env.apiBaseUrl, axiosInstance);
}

function getEstimateDocumentsApi(): EstimateDocumentsApi {
  const config = new Configuration({ basePath: env.apiBaseUrl });
  return new EstimateDocumentsApi(config, env.apiBaseUrl, axiosInstance);
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

  updateLineItem(estimateId: number, estimateLineItemId: number, data: LineItemUpdateRequest) {
    return getEstimatesApi().estimateUpdateEstimateLineItem(estimateId, estimateLineItemId, data);
  },

  updateLineItemStatus(estimateId: number, estimateLineItemId: number, data: LineItemStatusUpdateRequest) {
    return getEstimatesApi().estimateUpdateEstimateLineItemStatus(estimateId, estimateLineItemId, data);
  },

  linkExistingLineItem(estimateId: number, lineItemId: number) {
    return getEstimatesApi().estimateLinkExisting(estimateId, lineItemId);
  },

  unlinkLineItem(estimateId: number, estimateLineItemId: number) {
    return getEstimatesApi().estimateUnlink(estimateId, estimateLineItemId);
  },

  generateInvoice(estimateId: number, data: InvoiceCreateRequest) {
    return getInvoicesApi().invoiceGenerate(estimateId, data);
  },

  listInvoicesForEstimate(estimateId: number) {
    return getInvoicesApi().invoiceListForEstimate(estimateId);
  },

  generateEstimateDocument(estimateId: number, data: EstimateDocumentCreateRequest) {
    return getEstimateDocumentsApi().estimateDocumentGenerate(estimateId, data);
  },

  listEstimateDocuments(estimateId: number) {
    return getEstimateDocumentsApi().estimateDocumentListForEstimate(estimateId);
  },

  getEstimateDocument(documentId: number) {
    return getEstimateDocumentsApi().estimateDocumentGet(documentId);
  },
};
