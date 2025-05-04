import { API_BASE_URL, AUTH_TOKEN_KEY } from '../constants/Config';
import { getItem } from '../context/SecureStoreWrapper';
import { Platform } from 'react-native';
import Logger from '../utils/LogUtil';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
  mode?: RequestMode;
  timeout?: number; // Timeout in milliseconds
}

/**
 * API service for making authenticated and non-authenticated requests
 */
export const apiRequest = async <T>(endpoint: string, options: ApiOptions = {}): Promise<T> => {
  const {
    method = 'GET',
    body,
    headers = {},
    requiresAuth = true,
    mode = 'cors', // Default to 'cors' mode
    timeout = 30000, // Default timeout of 30 seconds
  } = options;

  // Log API request attempt
  Logger.info(`API Request: ${method} ${endpoint}`, { 
    url: `${API_BASE_URL}${endpoint}`,
    platform: Platform.OS 
  });

  // Build request headers
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...headers,
  };

  // Add auth token if required
  if (requiresAuth) {
    try {
      const token = await getItem(AUTH_TOKEN_KEY);
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
        Logger.debug('Added auth token to request');
      } else {
        Logger.warn('Auth token required but not found');
      }
    } catch (error) {
      Logger.error('Error retrieving auth token', error);
    }
  }

  // Build request options
  const requestOptions: RequestInit = {
    method,
    headers: requestHeaders,
  };

  // Only set mode for web platform to prevent issues on native
  if (Platform.OS === 'web') {
    requestOptions.mode = mode;
    // Add credentials for web
    requestOptions.credentials = 'include';
  }

  // Add body if provided
  if (body) {
    requestOptions.body = JSON.stringify(body);
  }

  // Create an AbortController for request timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
    Logger.error(`API request timeout after ${timeout}ms`, {
      method,
      url: `${API_BASE_URL}${endpoint}`
    });
  }, timeout);

  // Set the signal on the request
  requestOptions.signal = controller.signal;

  try {
    Logger.debug(`Sending request to ${API_BASE_URL}${endpoint}`, {
      method,
      headers: requestOptions.headers,
      body: body ? JSON.stringify(body) : undefined,
      platform: Platform.OS,
      platformVersion: Platform.Version,
      timeout
    });
    
    // Make the request with timeout
    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);
    
    // Clear the timeout since the request completed
    clearTimeout(timeoutId);
    
    Logger.info(`Response status: ${response.status} ${response.statusText}`, {
      endpoint,
      status: response.status,
      platform: Platform.OS
    });
    
    // Parse the response
    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      Logger.debug('Received JSON response', {
        data,
        endpoint,
        platform: Platform.OS
      });
    } else {
      const text = await response.text();
      Logger.debug('Received text response', {
        text,
        endpoint,
        platform: Platform.OS
      });
      
      try {
        // Try to parse as JSON anyway
        data = JSON.parse(text);
      } catch (e) {
        data = { message: text };
      }
    }
    
    // Check if the response is successful
    if (!response.ok) {
      Logger.error('API Error response', { 
        status: response.status, 
        statusText: response.statusText,
        data,
        platform: Platform.OS,
        endpoint,
        url: `${API_BASE_URL}${endpoint}`
      });
      
      throw {
        status: response.status,
        message: data.message || 'An error occurred',
        data
      };
    }
    
    return data as T;
  } catch (error: any) {
    // Clear the timeout in case of error
    clearTimeout(timeoutId);
    
    // Handle specific error types
    if (error.name === 'AbortError') {
      Logger.error('Request aborted by timeout', {
        method,
        url: `${API_BASE_URL}${endpoint}`,
        platform: Platform.OS
      });
      throw new Error('The request timed out. Please try again.');
    }
    
    // Log specific CORS errors
    if (error instanceof TypeError && error.message.includes('Network request failed')) {
      Logger.error('Network error (possible CORS/SSL issue)', { 
        url: `${API_BASE_URL}${endpoint}`,
        method,
        errorMessage: error.message,
        platform: Platform.OS
      });
      
      // iOS specific error handling with better user message
      if (Platform.OS === 'ios') {
        throw new Error('Connection failed. Please check your network settings and ensure the server is accessible.');
      }
    } else {
      Logger.error('API request error', {
        ...error,
        platform: Platform.OS,
        endpoint,
        method,
        url: `${API_BASE_URL}${endpoint}`
      });
    }
    
    throw error;
  }
};

/**
 * Convenience methods for common HTTP methods
 */
export const apiService = {
  get: <T>(endpoint: string, options?: Omit<ApiOptions, 'method' | 'body'>) => 
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),
    
  post: <T>(endpoint: string, body: any, options?: Omit<ApiOptions, 'method'>) => 
    apiRequest<T>(endpoint, { ...options, method: 'POST', body }),
    
  put: <T>(endpoint: string, body: any, options?: Omit<ApiOptions, 'method'>) => 
    apiRequest<T>(endpoint, { ...options, method: 'PUT', body }),
    
  patch: <T>(endpoint: string, body: any, options?: Omit<ApiOptions, 'method'>) => 
    apiRequest<T>(endpoint, { ...options, method: 'PATCH', body }),
    
  delete: <T>(endpoint: string, options?: Omit<ApiOptions, 'method'>) => 
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
}; 