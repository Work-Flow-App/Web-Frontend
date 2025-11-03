import { env } from '../../config/env';

/**
 * API Client for making HTTP requests to the backend
 */

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = env.apiBaseUrl;
    this.timeout = env.apiTimeout;
  }

  /**
   * Get authorization token from storage
   */
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Get default headers for requests
   */
  private getHeaders(customHeaders?: HeadersInit): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    if (!response.ok) {
      const error: ApiError = {
        message: 'An error occurred',
        status: response.status,
      };

      if (isJson) {
        const errorData = await response.json();
        error.message = errorData.message || error.message;
        error.errors = errorData.errors;
      } else {
        error.message = response.statusText;
      }

      throw error;
    }

    const data = isJson ? await response.json() : null;

    return {
      data: data as T,
      status: response.status,
      message: data?.message,
    };
  }

  /**
   * Make a GET request
   */
  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(options?.headers),
        signal: controller.signal,
        ...options,
      });

      return await this.handleResponse<T>(response);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Make a POST request
   */
  async post<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(options?.headers),
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
        ...options,
      });

      return await this.handleResponse<T>(response);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Make a PUT request
   */
  async put<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(options?.headers),
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
        ...options,
      });

      return await this.handleResponse<T>(response);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Make a PATCH request
   */
  async patch<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PATCH',
        headers: this.getHeaders(options?.headers),
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
        ...options,
      });

      return await this.handleResponse<T>(response);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(options?.headers),
        signal: controller.signal,
        ...options,
      });

      return await this.handleResponse<T>(response);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  /**
   * Clear authentication token
   */
  clearAuthToken(): void {
    localStorage.removeItem('auth_token');
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
