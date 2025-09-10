/**
 * Custom hook for handling token refresh and API request retry logic
 */
export declare const useTokenRefresh: () => {
  refreshToken: () => Promise<string | null>;
  fetchWithTokenRefresh: (url: string, options?: RequestInit) => Promise<Response>;
};
