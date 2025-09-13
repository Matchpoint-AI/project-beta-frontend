import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { authFetch, getAuthToken, authApi } from './authFetch';
import { getServiceURL } from '../../../shared/utils/getServiceURL';

// Mock dependencies
vi.mock('../../../shared/utils/getServiceURL', () => ({
  getServiceURL: vi.fn((service) => `http://localhost:8000/${service}`),
}));

// Mock global fetch
global.fetch = vi.fn();

describe('authFetch', () => {
  beforeEach(() => {
    // Arrange - Reset mocks and storage
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
    (global.fetch as any).mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('getAuthToken', () => {
    it('should retrieve token from localStorage profile', () => {
      // Arrange
      const profile = {
        token: 'localStorage-token',
        email: 'user@example.com',
      };
      localStorage.setItem('profile', JSON.stringify(profile));

      // Act
      const token = getAuthToken();

      // Assert
      expect(token).toBe('localStorage-token');
    });

    it('should retrieve token from sessionStorage when not in localStorage', () => {
      // Arrange
      const profile = {
        token: 'sessionStorage-token',
        email: 'user@example.com',
      };
      sessionStorage.setItem('profile', JSON.stringify(profile));

      // Act
      const token = getAuthToken();

      // Assert
      expect(token).toBe('sessionStorage-token');
    });

    it('should prioritize localStorage over sessionStorage', () => {
      // Arrange
      const localProfile = { token: 'local-token' };
      const sessionProfile = { token: 'session-token' };
      localStorage.setItem('profile', JSON.stringify(localProfile));
      sessionStorage.setItem('profile', JSON.stringify(sessionProfile));

      // Act
      const token = getAuthToken();

      // Assert
      expect(token).toBe('local-token');
    });

    it('should return null when no token is found', () => {
      // Arrange - No token in storage

      // Act
      const token = getAuthToken();

      // Assert
      expect(token).toBeNull();
    });

    it('should handle invalid JSON in localStorage gracefully', () => {
      // Arrange
      localStorage.setItem('profile', 'invalid-json');

      // Act
      const token = getAuthToken();

      // Assert
      expect(token).toBeNull();
    });

    it('should handle invalid JSON in sessionStorage gracefully', () => {
      // Arrange
      sessionStorage.setItem('profile', 'invalid-json');

      // Act
      const token = getAuthToken();

      // Assert
      expect(token).toBeNull();
    });

    it('should handle profile without token field', () => {
      // Arrange
      const profile = { email: 'user@example.com' };
      localStorage.setItem('profile', JSON.stringify(profile));

      // Act
      const token = getAuthToken();

      // Assert
      expect(token).toBeNull();
    });

    it('should handle storage access errors gracefully', () => {
      // Arrange
      const originalLocalStorage = global.localStorage;
      const mockStorage = {
        getItem: vi.fn(() => {
          throw new Error('Storage access denied');
        }),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
        length: 0,
        key: vi.fn(),
      };

      Object.defineProperty(global, 'localStorage', {
        value: mockStorage,
        configurable: true,
      });

      // Act
      const token = getAuthToken();

      // Assert
      expect(token).toBeNull();

      // Cleanup
      Object.defineProperty(global, 'localStorage', {
        value: originalLocalStorage,
        configurable: true,
      });
    });

    it('should handle undefined window object', () => {
      // Arrange
      const originalWindow = global.window;
      const originalLocalStorage = global.localStorage;
      const originalSessionStorage = global.sessionStorage;

      // @ts-expect-error - Testing without window object
      delete global.window;
      // @ts-expect-error - Testing without storage
      delete global.localStorage;
      // @ts-expect-error - Testing without storage
      delete global.sessionStorage;

      // Act
      const token = getAuthToken();

      // Assert
      expect(token).toBeNull();

      // Cleanup
      global.window = originalWindow;
      global.localStorage = originalLocalStorage;
      global.sessionStorage = originalSessionStorage;
    });
  });

  describe('authFetch', () => {
    it('should add Authorization header when token exists', async () => {
      // Arrange
      const profile = { token: 'test-token' };
      localStorage.setItem('profile', JSON.stringify(profile));
      (global.fetch as any).mockResolvedValue(new Response('{}'));

      // Act
      await authFetch('http://api.example.com/data');

      // Assert
      expect(global.fetch).toHaveBeenCalledWith(
        'http://api.example.com/data',
        expect.objectContaining({
          headers: expect.any(Headers),
        })
      );
      const call = (global.fetch as any).mock.calls[0];
      expect(call[1].headers.get('Authorization')).toBe('Bearer test-token');
    });

    it('should not add Authorization header when skipAuth is true', async () => {
      // Arrange
      const profile = { token: 'test-token' };
      localStorage.setItem('profile', JSON.stringify(profile));
      (global.fetch as any).mockResolvedValue(new Response('{}'));

      // Act
      await authFetch('http://api.example.com/data', { skipAuth: true });

      // Assert
      const call = (global.fetch as any).mock.calls[0];
      expect(call[1].headers.get('Authorization')).toBeNull();
    });

    it('should not add Authorization header when no token exists', async () => {
      // Arrange - No token in storage
      (global.fetch as any).mockResolvedValue(new Response('{}'));

      // Act
      await authFetch('http://api.example.com/data');

      // Assert
      const call = (global.fetch as any).mock.calls[0];
      expect(call[1].headers.get('Authorization')).toBeNull();
    });

    it('should preserve existing headers', async () => {
      // Arrange
      const profile = { token: 'test-token' };
      localStorage.setItem('profile', JSON.stringify(profile));
      (global.fetch as any).mockResolvedValue(new Response('{}'));

      // Act
      await authFetch('http://api.example.com/data', {
        headers: {
          'Content-Type': 'application/json',
          'X-Custom-Header': 'custom-value',
        },
      });

      // Assert
      const call = (global.fetch as any).mock.calls[0];
      expect(call[1].headers.get('Content-Type')).toBe('application/json');
      expect(call[1].headers.get('X-Custom-Header')).toBe('custom-value');
      expect(call[1].headers.get('Authorization')).toBe('Bearer test-token');
    });

    it('should pass through all fetch options', async () => {
      // Arrange
      (global.fetch as any).mockResolvedValue(new Response('{}'));

      // Act
      await authFetch('http://api.example.com/data', {
        method: 'POST',
        body: JSON.stringify({ test: 'data' }),
        credentials: 'include',
      });

      // Assert
      expect(global.fetch).toHaveBeenCalledWith(
        'http://api.example.com/data',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ test: 'data' }),
          credentials: 'include',
        })
      );
    });

    it('should handle fetch errors', async () => {
      // Arrange
      const fetchError = new Error('Network error');
      (global.fetch as any).mockRejectedValue(fetchError);

      // Act & Assert
      await expect(authFetch('http://api.example.com/data')).rejects.toThrow('Network error');
    });

    it('should work with relative URLs', async () => {
      // Arrange
      (global.fetch as any).mockResolvedValue(new Response('{}'));

      // Act
      await authFetch('/api/data');

      // Assert
      expect(global.fetch).toHaveBeenCalledWith('/api/data', expect.any(Object));
    });

    it('should handle Headers object in options', async () => {
      // Arrange
      const profile = { token: 'test-token' };
      localStorage.setItem('profile', JSON.stringify(profile));
      (global.fetch as any).mockResolvedValue(new Response('{}'));

      const headers = new Headers();
      headers.set('X-Custom', 'value');

      // Act
      await authFetch('http://api.example.com/data', { headers });

      // Assert
      const call = (global.fetch as any).mock.calls[0];
      expect(call[1].headers.get('X-Custom')).toBe('value');
      expect(call[1].headers.get('Authorization')).toBe('Bearer test-token');
    });
  });

  describe('authApi', () => {
    it('should make GET requests', async () => {
      // Arrange
      (global.fetch as any).mockResolvedValue(new Response('{}'));

      // Act
      await authApi.get('http://api.example.com/data');

      // Assert
      expect(global.fetch).toHaveBeenCalledWith(
        'http://api.example.com/data',
        expect.objectContaining({
          method: 'GET',
        })
      );
    });

    it('should make POST requests with JSON body', async () => {
      // Arrange
      const data = { test: 'data' };
      (global.fetch as any).mockResolvedValue(new Response('{}'));

      // Act
      await authApi.post('http://api.example.com/data', data);

      // Assert
      const call = (global.fetch as any).mock.calls[0];
      expect(call[1].method).toBe('POST');
      expect(call[1].body).toBe(JSON.stringify(data));
      expect(call[1].headers.get('Content-Type')).toBe('application/json');
    });

    it('should make PUT requests', async () => {
      // Arrange
      const data = { update: 'data' };
      (global.fetch as any).mockResolvedValue(new Response('{}'));

      // Act
      await authApi.put('http://api.example.com/data/123', data);

      // Assert
      const call = (global.fetch as any).mock.calls[0];
      expect(call[1].method).toBe('PUT');
      expect(call[1].body).toBe(JSON.stringify(data));
    });

    it('should make DELETE requests', async () => {
      // Arrange
      (global.fetch as any).mockResolvedValue(new Response('{}'));

      // Act
      await authApi.delete('http://api.example.com/data/123');

      // Assert
      expect(global.fetch).toHaveBeenCalledWith(
        'http://api.example.com/data/123',
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });

    it('should make PATCH requests', async () => {
      // Arrange
      const data = { patch: 'data' };
      (global.fetch as any).mockResolvedValue(new Response('{}'));

      // Act
      await authApi.patch('http://api.example.com/data/123', data);

      // Assert
      const call = (global.fetch as any).mock.calls[0];
      expect(call[1].method).toBe('PATCH');
      expect(call[1].body).toBe(JSON.stringify(data));
    });

    it('should preserve auth functionality in API methods', async () => {
      // Arrange
      const profile = { token: 'test-token' };
      localStorage.setItem('profile', JSON.stringify(profile));
      (global.fetch as any).mockResolvedValue(new Response('{}'));

      // Act
      await authApi.post('http://api.example.com/data', { test: 'data' });

      // Assert
      const call = (global.fetch as any).mock.calls[0];
      expect(call[1].headers.get('Authorization')).toBe('Bearer test-token');
    });
  });

  describe('Service URL Integration', () => {
    it('should work with service URLs', async () => {
      // Arrange
      (global.fetch as any).mockResolvedValue(new Response('{}'));
      (getServiceURL as any).mockReturnValue('http://data-service.local');

      // Act
      const serviceUrl = getServiceURL('data');
      await authFetch(`${serviceUrl}/api/endpoint`);

      // Assert
      expect(global.fetch).toHaveBeenCalledWith(
        'http://data-service.local/api/endpoint',
        expect.any(Object)
      );
    });

    it('should handle different service types', async () => {
      // Arrange
      const services = ['data', 'llm', 'content-gen', 'campaign-manager'];
      (global.fetch as any).mockResolvedValue(new Response('{}'));

      // Act
      for (const service of services) {
        (getServiceURL as any).mockReturnValue(`http://${service}.local`);
        const url = getServiceURL(service as any);
        await authFetch(`${url}/api/test`);
      }

      // Assert
      expect(global.fetch).toHaveBeenCalledTimes(services.length);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined options', async () => {
      // Arrange
      (global.fetch as any).mockResolvedValue(new Response('{}'));

      // Act
      await authFetch('http://api.example.com/data', undefined);

      // Assert
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should handle null headers in options', async () => {
      // Arrange
      (global.fetch as any).mockResolvedValue(new Response('{}'));

      // Act
      await authFetch('http://api.example.com/data', { headers: null as any });

      // Assert
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should handle array headers format', async () => {
      // Arrange
      const profile = { token: 'test-token' };
      localStorage.setItem('profile', JSON.stringify(profile));
      (global.fetch as any).mockResolvedValue(new Response('{}'));

      // Act
      await authFetch('http://api.example.com/data', {
        headers: [['X-Custom', 'value']] as any,
      });

      // Assert
      const call = (global.fetch as any).mock.calls[0];
      expect(call[1].headers.get('Authorization')).toBe('Bearer test-token');
    });

    it('should handle concurrent requests', async () => {
      // Arrange
      const profile = { token: 'test-token' };
      localStorage.setItem('profile', JSON.stringify(profile));
      (global.fetch as any).mockResolvedValue(new Response('{}'));

      // Act
      const requests = [
        authFetch('http://api.example.com/1'),
        authFetch('http://api.example.com/2'),
        authFetch('http://api.example.com/3'),
      ];
      await Promise.all(requests);

      // Assert
      expect(global.fetch).toHaveBeenCalledTimes(3);
      for (let i = 0; i < 3; i++) {
        const call = (global.fetch as any).mock.calls[i];
        expect(call[1].headers.get('Authorization')).toBe('Bearer test-token');
      }
    });

    it('should handle token change between requests', async () => {
      // Arrange
      const profile1 = { token: 'token-1' };
      localStorage.setItem('profile', JSON.stringify(profile1));
      (global.fetch as any).mockResolvedValue(new Response('{}'));

      // Act - First request
      await authFetch('http://api.example.com/1');

      // Change token
      const profile2 = { token: 'token-2' };
      localStorage.setItem('profile', JSON.stringify(profile2));

      // Second request
      await authFetch('http://api.example.com/2');

      // Assert
      const call1 = (global.fetch as any).mock.calls[0];
      const call2 = (global.fetch as any).mock.calls[1];
      expect(call1[1].headers.get('Authorization')).toBe('Bearer token-1');
      expect(call2[1].headers.get('Authorization')).toBe('Bearer token-2');
    });
  });
});
