import { createClientApi } from './factories';
import type { ClientResponse, ClientCreateRequest, ClientUpdateRequest } from '../../../workflow-api';

// Export types from workflowapi
export type { ClientResponse, ClientCreateRequest, ClientUpdateRequest };

/**
 * Client API Service
 * Provides client management operations
 */

export const clientService = {
  /**
   * Get all clients
   */
  async getAllClients() {
    return await createClientApi().getAllClients();
  },

  /**
   * Get client by ID
   */
  async getClientById(id: number) {
    return await createClientApi().getClientById(id);
  },

  /**
   * Create a new client
   */
  async createClient(data: ClientCreateRequest) {
    return await createClientApi().createClient(data);
  },

  /**
   * Update an existing client
   */
  async updateClient(id: number, data: ClientUpdateRequest) {
    return await createClientApi().updateClient(id, data);
  },

  /**
   * Delete a client
   */
  async deleteClient(id: number) {
    return await createClientApi().deleteClient(id);
  },
};

export default clientService;
