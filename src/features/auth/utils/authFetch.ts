/**
 * Auth-aware fetch wrapper that automatically adds authentication headers
 * This ensures ALL API calls to backend services include proper authentication
 */

import { getServiceURL } from '../../../helpers/getServiceURL';

type Service = 'data' | 'llm' | 'content-gen' | 'campaign-manager';

interface AuthFetchOptions extends RequestInit {
  service?: Service;
  skipAuth?: boolean;
}

/**
 * Get the authentication token from localStorage or sessionStorage
 * This matches how the auth context stores the token
 */
export const getAuthToken = (): string | null => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }

  try {
    // Check if we have a profile with token in localStorage
    const profileStr = localStorage.getItem('profile');
    if (profileStr) {
      try {
        const profile = JSON.parse(profileStr);
        if (profile.token) {
          return profile.token;
        }
      } catch (e) {
        console.error('Failed to parse profile from localStorage:', e);
      }
    }

    // Fallback to sessionStorage if needed
    if (window.sessionStorage) {
      const sessionProfileStr = sessionStorage.getItem('profile');
      if (sessionProfileStr) {
        try {
          const profile = JSON.parse(sessionProfileStr);
          if (profile.token) {
            return profile.token;
          }
        } catch (e) {
          console.error('Failed to parse profile from sessionStorage:', e);
        }
      }
    }
  } catch (error) {
    // Handle cases where localStorage/sessionStorage access is blocked
    console.error('Failed to access storage:', error);
  }

  return null;
};

/**
 * Enhanced fetch that automatically adds authentication headers
 * Use this instead of regular fetch for all API calls
 */
export const authFetch = async (url: string, options: AuthFetchOptions = {}): Promise<Response> => {
  const { skipAuth = false, ...fetchOptions } = options;

  // Get the auth token
  const token = getAuthToken();

  // Initialize headers
  const headers = new Headers(fetchOptions.headers || {});

  // Add auth header if we have a token and skipAuth is false
  if (token && !skipAuth) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Add Content-Type if not present and body exists
  if (fetchOptions.body && !headers.has('Content-Type')) {
    // Check if body is FormData (for file uploads)
    if (!(fetchOptions.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }
  }

  // Log the request for debugging (only in development)
  if (process.env.NODE_ENV === 'development') {
  }

  // Make the fetch request with auth headers
  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  // Log response status for debugging
  if (process.env.NODE_ENV === 'development') {
    if (response.status === 401) {
      console.error('[AuthFetch] 401 Unauthorized - Token may be invalid or missing');
    }
  }

  return response;
};

/**
 * Helper function to make authenticated API calls to specific services
 */
export const serviceAuthFetch = async (
  service: Service,
  path: string,
  options: AuthFetchOptions = {}
): Promise<Response> => {
  const baseUrl = getServiceURL(service);
  const url = `${baseUrl}${path}`;

  return authFetch(url, { ...options, service });
};

/**
 * Convenience methods for common HTTP methods
 */
export const authApi = {
  get: (url: string, options?: AuthFetchOptions) => authFetch(url, { ...options, method: 'GET' }),

  post: (url: string, body?: any, options?: AuthFetchOptions) =>
    authFetch(url, {
      ...options,
      method: 'POST',
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),

  put: (url: string, body?: any, options?: AuthFetchOptions) =>
    authFetch(url, {
      ...options,
      method: 'PUT',
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),

  delete: (url: string, options?: AuthFetchOptions) =>
    authFetch(url, { ...options, method: 'DELETE' }),

  patch: (url: string, body?: any, options?: AuthFetchOptions) =>
    authFetch(url, {
      ...options,
      method: 'PATCH',
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
};

/**
 * Service-specific auth fetch helpers
 */
export const dataApi = {
  get: (path: string, options?: AuthFetchOptions) =>
    serviceAuthFetch('data', path, { ...options, method: 'GET' }),
  post: (path: string, body?: any, options?: AuthFetchOptions) =>
    serviceAuthFetch('data', path, {
      ...options,
      method: 'POST',
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
};

export const contentGenApi = {
  get: (path: string, options?: AuthFetchOptions) =>
    serviceAuthFetch('content-gen', path, { ...options, method: 'GET' }),
  post: (path: string, body?: any, options?: AuthFetchOptions) =>
    serviceAuthFetch('content-gen', path, {
      ...options,
      method: 'POST',
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
};

export const llmApi = {
  get: (path: string, options?: AuthFetchOptions) =>
    serviceAuthFetch('llm', path, { ...options, method: 'GET' }),
  post: (path: string, body?: any, options?: AuthFetchOptions) =>
    serviceAuthFetch('llm', path, {
      ...options,
      method: 'POST',
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
};

// Export campaignManagerApi for campaign management
export const campaignManagerApi = {
  get: (path: string, options?: AuthFetchOptions) =>
    serviceAuthFetch('campaign-manager', path, { ...options, method: 'GET' }),
  post: (path: string, body?: any, options?: AuthFetchOptions) =>
    serviceAuthFetch('campaign-manager', path, {
      ...options,
      method: 'POST',
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
};

// Export default for backward compatibility
// Export getAuthToken as getToken for backward compatibility
export { getAuthToken as getToken };

export default authFetch;
