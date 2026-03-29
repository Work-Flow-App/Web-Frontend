import { InvoicesApi, Configuration } from '../../../workflow-api';
import type { InvoiceResponse, InvoiceCreateRequest } from '../../../workflow-api';
import { env } from '../../config/env';
import { axiosInstance } from './axiosConfig';

export type { InvoiceResponse, InvoiceCreateRequest };

function getInvoicesApi(): InvoicesApi {
  const config = new Configuration({ basePath: env.apiBaseUrl });
  return new InvoicesApi(config, env.apiBaseUrl, axiosInstance);
}

export const invoiceService = {
  generate(estimateId: number, data: InvoiceCreateRequest) {
    return getInvoicesApi().invoiceGenerate(estimateId, data);
  },

  get(invoiceId: number) {
    return getInvoicesApi().invoiceGet(invoiceId);
  },

  listForEstimate(estimateId: number) {
    return getInvoicesApi().invoiceListForEstimate(estimateId);
  },
};
