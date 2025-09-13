import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useTokenRefresh } from './useTokenRefresh';

// Mock dependencies
const mockSetProfile = vi.fn();
const mockLogout = vi.fn();
const mockProfile = {
  token: 'old-token',
  email: 'test@example.com',
  name: 'Test User',
};

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    profile: mockProfile,
    setProfile: mockSetProfile,
    logout: mockLogout,
  })),
}));

const mockUser = {
  getIdToken: vi.fn(),
};

vi.mock('../../../lib/firebase', () => ({
  useAuthentication: vi.fn(() => ({
    user: mockUser,
  })),
}));

// Mock universal-cookie
const mockCookieSet = vi.fn();
const mockCookieInstance = {
  set: mockCookieSet,
};

vi.mock('universal-cookie', () => ({
  default: vi.fn(() => mockCookieInstance),
}));

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock process.env
const originalEnv = process.env;

describe('useTokenRefresh', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    vi.restoreAllMocks();
    process.env = originalEnv;
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const newToken = 'new-refreshed-token';
      mockUser.getIdToken.mockResolvedValue(newToken);

      const { result } = renderHook(() => useTokenRefresh());

      let refreshedToken;
      await act(async () => {
        refreshedToken = await result.current.refreshToken();
      });

      expect(refreshedToken).toBe(newToken);
      expect(mockUser.getIdToken).toHaveBeenCalledWith(true);
      expect(mockSetProfile).toHaveBeenCalledWith({
        ...mockProfile,
        token: newToken,
      });
      expect(mockCookieSet).toHaveBeenCalledWith('token', newToken, {
        path: '/',
        secure: false, // NODE_ENV is not production in test
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60,
      });
    });

    it('should set secure cookie in production', async () => {
      process.env.NODE_ENV = 'production';
      const newToken = 'new-refreshed-token';
      mockUser.getIdToken.mockResolvedValue(newToken);

      const { result } = renderHook(() => useTokenRefresh());

      await act(async () => {
        await result.current.refreshToken();
      });

      expect(mockCookieSet).toHaveBeenCalledWith('token', newToken, {
        path: '/',
        secure: true,
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60,
      });
    });

    it('should return null when no user is available', async () => {
      const { useAuthentication } = await import('../../../lib/firebase');
      (useAuthentication as any).mockReturnValue({ user: null });

      const { result } = renderHook(() => useTokenRefresh());

      let refreshedToken;
      await act(async () => {
        refreshedToken = await result.current.refreshToken();
      });

      expect(refreshedToken).toBeNull();
      expect(mockUser.getIdToken).not.toHaveBeenCalled();
      expect(mockSetProfile).not.toHaveBeenCalled();
    });

    it('should return null when no profile is available', async () => {
      const { useAuth } = await import('../context/AuthContext');
      (useAuth as any).mockReturnValue({
        profile: null,
        setProfile: mockSetProfile,
        logout: mockLogout,
      });

      const newToken = 'new-refreshed-token';
      mockUser.getIdToken.mockResolvedValue(newToken);

      const { result } = renderHook(() => useTokenRefresh());

      let refreshedToken;
      await act(async () => {
        refreshedToken = await result.current.refreshToken();
      });

      expect(refreshedToken).toBe(newToken);
      expect(mockSetProfile).not.toHaveBeenCalled();
      expect(mockCookieSet).not.toHaveBeenCalled();
    });

    it('should handle token refresh errors gracefully', async () => {
      mockUser.getIdToken.mockRejectedValue(new Error('Token refresh failed'));

      const { result } = renderHook(() => useTokenRefresh());

      let refreshedToken;
      await act(async () => {
        refreshedToken = await result.current.refreshToken();
      });

      expect(refreshedToken).toBeNull();
      expect(mockSetProfile).not.toHaveBeenCalled();
    });
  });

  describe('fetchWithTokenRefresh', () => {
    const testUrl = 'https://api.example.com/data';
    const testOptions = {
      method: 'POST',
      body: JSON.stringify({ data: 'test' }),
    };

    it('should make successful request with current token', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useTokenRefresh());

      let response;
      await act(async () => {
        response = await result.current.fetchWithTokenRefresh(testUrl, testOptions);
      });

      expect(response).toBe(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(testUrl, {
        ...testOptions,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer old-token',
        },
      });
    });

    it('should make request without authorization header when no token', async () => {
      const { useAuth } = await import('../context/AuthContext');
      (useAuth as any).mockReturnValue({
        profile: null,
        setProfile: mockSetProfile,
        logout: mockLogout,
      });

      const mockResponse = { ok: true, status: 200 };
      mockFetch.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useTokenRefresh());

      await act(async () => {
        await result.current.fetchWithTokenRefresh(testUrl, testOptions);
      });

      expect(mockFetch).toHaveBeenCalledWith(testUrl, {
        ...testOptions,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('should preserve existing headers', async () => {
      const mockResponse = { ok: true, status: 200 };
      mockFetch.mockResolvedValue(mockResponse);
      const optionsWithHeaders = {
        ...testOptions,
        headers: {
          'Custom-Header': 'custom-value',
          Authorization: 'Bearer should-be-overridden',
        },
      };

      const { result } = renderHook(() => useTokenRefresh());

      await act(async () => {
        await result.current.fetchWithTokenRefresh(testUrl, optionsWithHeaders);
      });

      expect(mockFetch).toHaveBeenCalledWith(testUrl, {
        ...testOptions,
        headers: {
          'Content-Type': 'application/json',
          'Custom-Header': 'custom-value',
          Authorization: 'Bearer old-token',
        },
      });
    });

    it('should retry with refreshed token on 401 error', async () => {
      const unauthorizedResponse = { ok: false, status: 401 };
      const successResponse = { ok: true, status: 200 };
      const newToken = 'new-refreshed-token';

      mockFetch.mockResolvedValueOnce(unauthorizedResponse).mockResolvedValueOnce(successResponse);
      mockUser.getIdToken.mockResolvedValue(newToken);

      const { result } = renderHook(() => useTokenRefresh());

      let response;
      await act(async () => {
        response = await result.current.fetchWithTokenRefresh(testUrl, testOptions);
      });

      expect(response).toBe(successResponse);
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch).toHaveBeenNthCalledWith(1, testUrl, {
        ...testOptions,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer old-token',
        },
      });
      expect(mockFetch).toHaveBeenNthCalledWith(2, testUrl, {
        ...testOptions,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer new-refreshed-token',
        },
      });
    });

    it('should logout user when token refresh fails after 401', async () => {
      const unauthorizedResponse = { ok: false, status: 401 };
      mockFetch.mockResolvedValue(unauthorizedResponse);
      mockUser.getIdToken.mockResolvedValue(null);

      const { result } = renderHook(() => useTokenRefresh());

      await act(async () => {
        await expect(result.current.fetchWithTokenRefresh(testUrl, testOptions)).rejects.toThrow(
          'Authentication failed. Please log in again.'
        );
      });

      expect(mockLogout).toHaveBeenCalled();
    });

    it('should not retry on non-401 errors', async () => {
      const serverErrorResponse = { ok: false, status: 500 };
      mockFetch.mockResolvedValue(serverErrorResponse);

      const { result } = renderHook(() => useTokenRefresh());

      let response;
      await act(async () => {
        response = await result.current.fetchWithTokenRefresh(testUrl, testOptions);
      });

      expect(response).toBe(serverErrorResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockUser.getIdToken).not.toHaveBeenCalled();
    });

    it('should not retry when no user is available', async () => {
      const { useAuthentication } = await import('../../../lib/firebase');
      (useAuthentication as any).mockReturnValue({ user: null });

      const unauthorizedResponse = { ok: false, status: 401 };
      mockFetch.mockResolvedValue(unauthorizedResponse);

      const { result } = renderHook(() => useTokenRefresh());

      let response;
      await act(async () => {
        response = await result.current.fetchWithTokenRefresh(testUrl, testOptions);
      });

      expect(response).toBe(unauthorizedResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockUser.getIdToken).not.toHaveBeenCalled();
    });

    it('should handle fetch errors gracefully', async () => {
      const fetchError = new Error('Network error');
      mockFetch.mockRejectedValue(fetchError);

      const { result } = renderHook(() => useTokenRefresh());

      await act(async () => {
        await expect(result.current.fetchWithTokenRefresh(testUrl, testOptions)).rejects.toThrow(
          'Network error'
        );
      });
    });

    it('should work with default options', async () => {
      const mockResponse = { ok: true, status: 200 };
      mockFetch.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useTokenRefresh());

      let response;
      await act(async () => {
        response = await result.current.fetchWithTokenRefresh(testUrl);
      });

      expect(response).toBe(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(testUrl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer old-token',
        },
      });
    });
  });

  describe('integration tests', () => {
    it('should handle complete token refresh flow', async () => {
      const unauthorizedResponse = { ok: false, status: 401 };
      const successResponse = {
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: 'success' }),
      };
      const newToken = 'completely-new-token';

      mockFetch.mockResolvedValueOnce(unauthorizedResponse).mockResolvedValueOnce(successResponse);
      mockUser.getIdToken.mockResolvedValue(newToken);

      const { result } = renderHook(() => useTokenRefresh());

      let response;
      await act(async () => {
        response = await result.current.fetchWithTokenRefresh('https://api.example.com/protected');
      });

      expect(response).toBe(successResponse);
      expect(mockSetProfile).toHaveBeenCalledWith({
        ...mockProfile,
        token: newToken,
      });
      expect(mockCookieSet).toHaveBeenCalledWith('token', newToken, expect.any(Object));
    });
  });
});
