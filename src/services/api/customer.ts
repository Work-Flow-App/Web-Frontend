import { CustomersApi, Configuration } from '../../../workflow-api';
import type {
  CustomerResponse,
  CustomerCreateRequest,
  CustomerUpdateRequest,
} from '../../../workflow-api';
import { env } from '../../config/env';
import { axiosInstance } from './axiosConfig';

export type { CustomerResponse, CustomerCreateRequest, CustomerUpdateRequest };

function getCustomerApi(): CustomersApi {
  const config = new Configuration({
    basePath: env.apiBaseUrl,
  });
  return new CustomersApi(config, env.apiBaseUrl, axiosInstance);
}

export const customerService = {
  async getAllCustomers() {
    return await getCustomerApi().getAllCustomers();
  },

  async getCustomerById(id: number) {
    return await getCustomerApi().getCustomerById(id);
  },

  async createCustomer(data: CustomerCreateRequest) {
    return await getCustomerApi().createCustomer(data);
  },

  async updateCustomer(id: number, data: CustomerUpdateRequest) {
    return await getCustomerApi().updateCustomer(id, data);
  },

  async deleteCustomer(id: number) {
    return await getCustomerApi().deleteCustomer(id);
  },
};

export default customerService;
