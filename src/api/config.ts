/** API Configuration */

// Get the base API URL from environment or use default
export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://api.matchpointai.com'
    : 'http://localhost:8080');

// V2 API URL - uses Vite environment variable
// In production, this will be set by terraform from Cloud Run service URL
export const V2_PUBLIC_API_URL =
  import.meta.env.VITE_V2_PUBLIC_API_URL || process.env.REACT_APP_V2_PUBLIC_API_URL || API_BASE_URL; // Fallback to V1 API URL if V2 not configured
