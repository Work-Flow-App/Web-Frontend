import { ClientControllerApi, Configuration } from '../../../workflow-api';
import type {
  ClientResponse,
  ClientCreateRequest,
  ClientUpdateRequest,
} from '../../../workflow-api';
import { env } from '../../config/env';
import { axiosInstance } from './axiosConfig';

export type { ClientResponse, ClientCreateRequest, ClientUpdateRequest };

/**
 * Company Client API Service
 * Provides CRUD operations for client management
 * Note: Renamed to 'companyClient' to distinguish from the old HTTP client.ts
 */

/**
 * Get a configured ClientControllerApi instance with the access token
 * Note: Don't pass accessToken to Configuration - the axios interceptor handles it
 */
function getClientApi(): ClientControllerApi {
  const config = new Configuration({
    basePath: env.apiBaseUrl,
  });
  return new ClientControllerApi(config, env.apiBaseUrl, axiosInstance);
}

export const companyClientService = {
  /**
   * Get all clients
   */
  async getAllClients() {
    return await getClientApi().getAllClients();
  },

  /**
   * Get client by ID
   */
  async getClientById(id: number) {
    return await getClientApi().getClientById(id);
  },

  /**
   * Create a new client
   */
  async createClient(data: ClientCreateRequest) {
    return await getClientApi().createClient(data);
  },

  /**
   * Update an existing client
   */
  async updateClient(id: number, data: ClientUpdateRequest) {
    return await getClientApi().updateClient(id, data);
  },

  /**
   * Delete a client
   */
  async deleteClient(id: number) {
    return await getClientApi().deleteClient(id);
  },
};

export default companyClientService;
