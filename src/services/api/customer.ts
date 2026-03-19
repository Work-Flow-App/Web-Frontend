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
    return await getCustomerApi().customerGetAllCustomers();
  },

  async getCustomerById(id: number) {
    return await getCustomerApi().customerGetCustomerById(id);
  },

  async createCustomer(data: CustomerCreateRequest) {
    return await getCustomerApi().customerCreateCustomer(data);
  },

  async updateCustomer(id: number, data: CustomerUpdateRequest) {
    return await getCustomerApi().customerUpdateCustomer(id, data);
  },

  async deleteCustomer(id: number) {
    return await getCustomerApi().customerDeleteCustomer(id);
  },
};

export default customerService;
