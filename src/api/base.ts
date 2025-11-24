/**
 * Base HTTP Client Configuration
 * Provides reusable HTTP client with interceptors, error handling, and retry logic
 */

export interface ApiConfig {
  baseURL: string;
  useMockData: boolean;
  timeout?: number;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

export interface RequestConfig extends RequestInit {
  skipAuth?: boolean;
  retries?: number;
  timeout?: number;
}

// Configuration
export const apiConfig: ApiConfig = {
  baseURL: import.meta.env.VITE_API_URL || 'https://handmade-backend-981536694150.asia-south1.run.app/api',
  useMockData: import.meta.env.VITE_USE_MOCK_DATA !== 'false',
  timeout: 30000, // 30 seconds
};

/**
 * Get tenant ID from storage
 */
export const getTenantId = (): string => {
  return localStorage.getItem('tenantId') || sessionStorage.getItem('tenantId') || 'default-tenant';
};

/**
 * Get authentication token from storage
 */
export const getAuthToken = (): string => {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || '';
};

/**
 * Add authentication headers to request config
 */
export const withAuthHeaders = (config: RequestConfig = {}): RequestConfig => {
  const headers = {
    'Content-Type': 'application/json',
    ...config.headers,
  };

  if (!config.skipAuth) {
    const token = getAuthToken();
    const tenantId = getTenantId();
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (tenantId) {
      headers['X-Tenant-ID'] = tenantId;
    }
  }

  return {
    ...config,
    headers,
  };
};

/**
 * Format API errors consistently
 */
export const handleApiError = (error: any): ApiError => {
  if (error instanceof Response) {
    return {
      message: error.statusText || 'Request failed',
      status: error.status,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: typeof error === 'string' ? error : 'An unknown error occurred',
  };
};

/**
 * Handle authentication errors (401, 403)
 */
const handleAuthError = (status: number): void => {
  if (status === 401 || status === 403) {
    // Clear auth data from both storages
    localStorage.removeItem('authToken');
    localStorage.removeItem('tenantId');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('tenantId');
    
    // Redirect to login
    const currentPath = window.location.pathname;
    const tenantMatch = currentPath.match(/^\/([^\/]+)\/admin/);
    const tenant = tenantMatch ? tenantMatch[1] : 'default';
    window.location.href = `/${tenant}/admin/login`;
  }
};

/**
 * Retry request with exponential backoff
 */
export const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: any;

  for (let i = 0; i < retries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on auth errors or client errors (4xx)
      if (error instanceof Response && error.status >= 400 && error.status < 500) {
        throw error;
      }

      // Wait before retrying with exponential backoff
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }

  throw lastError;
};

/**
 * Request with timeout
 */
const requestWithTimeout = async (
  url: string,
  config: RequestConfig,
  timeout: number = apiConfig.timeout!
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

/**
 * Log API performance (optional, can be enabled for monitoring)
 */
export const logApiPerformance = (endpoint: string, duration: number): void => {
  if (import.meta.env.DEV) {
    console.log(`[API Performance] ${endpoint}: ${duration}ms`);
  }
};

/**
 * Core HTTP client
 */
export class HttpClient {
  private baseURL: string;

  constructor(baseURL: string = apiConfig.baseURL) {
    this.baseURL = baseURL;
  }

  /**
   * Make HTTP request
   */
  async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const startTime = performance.now();

    try {
      const requestConfig = withAuthHeaders(config);
      const retries = config.retries ?? 3;

      const response = await retryRequest(
        () => requestWithTimeout(url, requestConfig, config.timeout),
        retries
      );

      // Log performance
      const duration = performance.now() - startTime;
      logApiPerformance(endpoint, duration);

      // Handle error responses
      if (!response.ok) {
        handleAuthError(response.status);
        
        const errorText = await response.text();
        throw new Error(errorText || `Request failed with status ${response.status}`);
      }

      // Parse JSON response
      const data = await response.json();
      return data;
    } catch (error) {
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  /**
   * Upload file (multipart/form-data)
   */
  async upload<T>(endpoint: string, formData: FormData, config?: RequestConfig): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const startTime = performance.now();

    try {
      const headers: HeadersInit = {
        'X-Tenant-ID': getTenantId(),
        'Authorization': `Bearer ${getAuthToken()}`,
        ...config?.headers,
      };

      // Don't set Content-Type for FormData - browser sets it with boundary
      delete (headers as any)['Content-Type'];

      const response = await requestWithTimeout(
        url,
        {
          ...config,
          method: 'POST',
          headers,
          body: formData,
        },
        config?.timeout
      );

      const duration = performance.now() - startTime;
      logApiPerformance(endpoint, duration);

      if (!response.ok) {
        handleAuthError(response.status);
        const errorText = await response.text();
        throw new Error(errorText || 'Upload failed');
      }

      return response.json();
    } catch (error) {
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }
}

/**
 * Singleton HTTP client instance
 */
export const httpClient = new HttpClient();

/**
 * Mock delay helper for simulating API latency
 */
export const mockDelay = <T>(data: T, delay: number = 300): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay));
};
