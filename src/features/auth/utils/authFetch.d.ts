/**
 * Auth-aware fetch wrapper that automatically adds authentication headers
 * This ensures ALL API calls to backend services include proper authentication
 */
type Service = 'data' | 'llm' | 'content-gen' | 'campaign-manager';
interface AuthFetchOptions extends RequestInit {
  service?: Service;
  skipAuth?: boolean;
}
/**
 * Get the authentication token from localStorage or sessionStorage
 * This matches how the auth context stores the token
 */
export declare const getAuthToken: () => string | null;
/**
 * Enhanced fetch that automatically adds authentication headers
 * Use this instead of regular fetch for all API calls
 */
export declare const authFetch: (url: string, options?: AuthFetchOptions) => Promise<Response>;
/**
 * Helper function to make authenticated API calls to specific services
 */
export declare const serviceAuthFetch: (
  service: Service,
  path: string,
  options?: AuthFetchOptions
) => Promise<Response>;
/**
 * Convenience methods for common HTTP methods
 */
export declare const authApi: {
  get: (url: string, options?: AuthFetchOptions) => Promise<Response>;
  post: (url: string, body?: unknown, options?: AuthFetchOptions) => Promise<Response>;
  put: (url: string, body?: unknown, options?: AuthFetchOptions) => Promise<Response>;
  delete: (url: string, options?: AuthFetchOptions) => Promise<Response>;
  patch: (url: string, body?: unknown, options?: AuthFetchOptions) => Promise<Response>;
};
/**
 * Service-specific auth fetch helpers
 */
export declare const dataApi: {
  get: (path: string, options?: AuthFetchOptions) => Promise<Response>;
  post: (path: string, body?: unknown, options?: AuthFetchOptions) => Promise<Response>;
};
export declare const contentGenApi: {
  get: (path: string, options?: AuthFetchOptions) => Promise<Response>;
  post: (path: string, body?: unknown, options?: AuthFetchOptions) => Promise<Response>;
};
export declare const llmApi: {
  get: (path: string, options?: AuthFetchOptions) => Promise<Response>;
  post: (path: string, body?: unknown, options?: AuthFetchOptions) => Promise<Response>;
};
export declare const campaignManagerApi: {
  get: (path: string, options?: AuthFetchOptions) => Promise<Response>;
  post: (path: string, body?: unknown, options?: AuthFetchOptions) => Promise<Response>;
};
export { getAuthToken as getToken };
export default authFetch;
