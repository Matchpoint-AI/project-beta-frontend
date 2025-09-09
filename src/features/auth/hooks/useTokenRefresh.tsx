import { useAuth } from '../context/AuthContext';
import { useAuthentication } from '../firebase';

/**
 * Custom hook for handling token refresh and API request retry logic
 */
export const useTokenRefresh = () => {
  const { profile, setProfile, logout } = useAuth();
  const { user } = useAuthentication();

  /**
   * Attempts to refresh the current token
   * @returns Promise<string | null> - New token or null if refresh failed
   */
  const refreshToken = async (): Promise<string | null> => {
    if (!user) {
      console.warn('Cannot refresh token: no Firebase user');
      return null;
    }

    try {
      console.log('Refreshing token...');
      const newToken = await user.getIdToken(true); // Force refresh
      
      if (profile) {
        const updatedProfile = { ...profile, token: newToken };
        setProfile(updatedProfile);
        
        // Store new token in cookie
        const cookies = await import('universal-cookie');
        const cookieInstance = new cookies.default();
        cookieInstance.set('token', newToken, {
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 30 * 24 * 60 * 60, // 30 days
        });
      }
      
      console.log('Token refreshed successfully');
      return newToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
    }
  };

  /**
   * Makes an API request with automatic token refresh retry on 401 errors
   * @param url - API endpoint URL
   * @param options - fetch options
   * @returns Promise<Response>
   */
  const fetchWithTokenRefresh = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const makeRequest = async (token: string | undefined) => {
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      return fetch(url, {
        ...options,
        headers,
      });
    };

    // First attempt with current token
    let response = await makeRequest(profile?.token);
    
    // If we get a 401, try refreshing the token once
    if (response.status === 401 && user) {
      console.log('Got 401, attempting token refresh...');
      const newToken = await refreshToken();
      
      if (newToken) {
        // Retry with new token
        response = await makeRequest(newToken);
      } else {
        // Token refresh failed, logout user
        console.error('Token refresh failed, logging out user');
        logout();
        throw new Error('Authentication failed. Please log in again.');
      }
    }

    return response;
  };

  return {
    refreshToken,
    fetchWithTokenRefresh,
  };
};