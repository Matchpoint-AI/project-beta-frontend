import { describe, it, expect, vi, beforeEach } from 'vitest';
import useIntegrationApi, {
  integrationApi,
  authenticateApp,
  fetcheDataApp,
  revokeAuthApp,
  getAvailableIntegrations,
  getAppUser,
} from './api-integrations';

// Mock the service URL helper
vi.mock('../helpers/getServiceURL', () => ({
  getServiceURL: vi.fn(() => 'https://test-data-service.com'),
}));

// Mock axios
const mockAxios = {
  create: vi.fn(() => ({
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  })),
  get: vi.fn(),
  post: vi.fn(),
  delete: vi.fn(),
};

vi.mock('axios', () => ({
  default: mockAxios,
  create: mockAxios.create,
}));

// Mock useApi
const mockUseApi = vi.fn();
vi.mock('./useApi', () => ({
  default: mockUseApi,
}));

describe('api-integrations', () => {
  const mockAxiosInstance = {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockAxios.create.mockReturnValue(mockAxiosInstance);
  });

  describe('integrationApi function', () => {
    const mockToken = 'test-auth-token';

    it('should handle AUTHORIZE action for Instagram', async () => {
      const mockResponse = {
        data: {
          success: true,
          auth_url: 'https://instagram.com/oauth/authorize?client_id=123',
        },
      };

      mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

      const action = { type: 'AUTHORIZE', payload: 'instagram' };
      const result = await integrationApi(action, mockToken);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/instagram', {
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      });

      expect(result).toEqual(mockResponse.data);
    });

    it('should handle AUTHORIZE action for Facebook', async () => {
      const mockResponse = {
        data: {
          success: true,
          auth_url: 'https://facebook.com/oauth/authorize?client_id=456',
        },
      };

      mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

      const action = { type: 'AUTHORIZE', payload: 'facebook' };
      const result = await integrationApi(action, mockToken);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/facebook', {
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      });

      expect(result).toEqual(mockResponse.data);
    });

    it('should handle FETCH_DATA action for Instagram', async () => {
      const mockResponse = {
        data: {
          posts: [
            { id: '1', caption: 'Test post 1', likes: 100 },
            { id: '2', caption: 'Test post 2', likes: 150 },
          ],
          profile: {
            followers_count: 1000,
            following_count: 500,
          },
        },
      };

      mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

      const action = { type: 'FETCH_DATA', payload: 'instagram' };
      const result = await integrationApi(action, mockToken);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/instagram/data', {
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      });

      expect(result).toEqual(mockResponse.data);
    });

    it('should handle FETCH_DATA action for integrations overview', async () => {
      const mockResponse = {
        data: {
          integrations: [
            { app: 'instagram', status: 'connected', last_sync: '2023-01-01T00:00:00Z' },
            { app: 'facebook', status: 'disconnected', last_sync: null },
          ],
        },
      };

      mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

      const action = { type: 'FETCH_DATA', payload: 'integrations' };
      const result = await integrationApi(action, mockToken);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/integrations/data', {
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      });

      expect(result).toEqual(mockResponse.data);
    });

    it('should handle REVOKE_AUTH action', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Instagram authorization revoked successfully',
        },
      };

      mockAxiosInstance.delete.mockResolvedValueOnce(mockResponse);

      const action = { type: 'REVOKE_AUTH', payload: 'instagram' };
      const result = await integrationApi(action, mockToken);

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/instagram', {
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      });

      expect(result).toEqual(mockResponse.data);
    });

    it('should handle AVAILABLE action', async () => {
      const mockResponse = {
        data: {
          available_integrations: [
            {
              app: 'instagram',
              name: 'Instagram',
              description: 'Connect your Instagram account',
              features: ['posts', 'stories', 'insights'],
            },
            {
              app: 'facebook',
              name: 'Facebook',
              description: 'Connect your Facebook page',
              features: ['posts', 'insights'],
            },
          ],
        },
      };

      mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

      const action = { type: 'AVAILABLE', payload: 'integrations' };
      const result = await integrationApi(action, mockToken);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/integrations', {
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      });

      expect(result).toEqual(mockResponse.data);
    });

    it('should handle USER action', async () => {
      const mockResponse = {
        data: {
          user_info: {
            id: 'instagram_user_123',
            username: 'testuser',
            full_name: 'Test User',
            profile_picture_url: 'https://instagram.com/avatar.jpg',
            followers_count: 1500,
            following_count: 300,
            media_count: 50,
          },
        },
      };

      mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

      const action = { type: 'USER', payload: 'instagram' };
      const result = await integrationApi(action, mockToken);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/instagram/me', {
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      });

      expect(result).toEqual(mockResponse.data);
    });

    it('should handle unknown action types', async () => {
      const action = { type: 'UNKNOWN_ACTION', payload: 'instagram' };

      await expect(integrationApi(action, mockToken)).rejects.toThrow(
        'Unknown action type: UNKNOWN_ACTION'
      );
    });

    it('should handle missing authentication token', async () => {
      const action = { type: 'AUTHORIZE', payload: 'instagram' };

      await expect(integrationApi(action)).rejects.toThrow('No authentication token available');

      await expect(integrationApi(action, '')).rejects.toThrow('No authentication token available');

      await expect(integrationApi(action, undefined)).rejects.toThrow(
        'No authentication token available'
      );
    });

    it('should handle API errors from Instagram', async () => {
      const error = new Error('Instagram API: Invalid access token');
      mockAxiosInstance.get.mockRejectedValueOnce(error);

      const action = { type: 'AUTHORIZE', payload: 'instagram' };

      await expect(integrationApi(action, mockToken)).rejects.toThrow(
        'Instagram API: Invalid access token'
      );
    });

    it('should handle API errors from Facebook', async () => {
      const error = new Error('Facebook API: Rate limit exceeded');
      mockAxiosInstance.get.mockRejectedValueOnce(error);

      const action = { type: 'FETCH_DATA', payload: 'facebook' };

      await expect(integrationApi(action, mockToken)).rejects.toThrow(
        'Facebook API: Rate limit exceeded'
      );
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network Error: Connection timeout');
      mockAxiosInstance.get.mockRejectedValueOnce(networkError);

      const action = { type: 'AVAILABLE' };

      await expect(integrationApi(action, mockToken)).rejects.toThrow(
        'Network Error: Connection timeout'
      );
    });

    it('should handle actions with extra properties', async () => {
      const mockResponse = { data: { success: true } };
      mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

      const action = {
        type: 'AUTHORIZE',
        payload: 'instagram',
        extraProp: 'should-be-ignored',
        metadata: { timestamp: Date.now() },
      };

      const result = await integrationApi(action, mockToken);

      expect(result).toEqual(mockResponse.data);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/instagram', {
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      });
    });
  });

  describe('action creator functions', () => {
    describe('authenticateApp', () => {
      it('should create AUTHORIZE action for Instagram', () => {
        const action = authenticateApp('instagram');
        expect(action).toEqual({
          type: 'AUTHORIZE',
          payload: 'instagram',
        });
      });

      it('should create AUTHORIZE action for Facebook', () => {
        const action = authenticateApp('facebook');
        expect(action).toEqual({
          type: 'AUTHORIZE',
          payload: 'facebook',
        });
      });
    });

    describe('fetcheDataApp', () => {
      it('should create FETCH_DATA action for Instagram', () => {
        const action = fetcheDataApp('instagram');
        expect(action).toEqual({
          type: 'FETCH_DATA',
          payload: 'instagram',
        });
      });

      it('should create FETCH_DATA action for Facebook', () => {
        const action = fetcheDataApp('facebook');
        expect(action).toEqual({
          type: 'FETCH_DATA',
          payload: 'facebook',
        });
      });
    });

    describe('revokeAuthApp', () => {
      it('should create REVOKE_AUTH action for Instagram', () => {
        const action = revokeAuthApp('instagram');
        expect(action).toEqual({
          type: 'REVOKE_AUTH',
          payload: 'instagram',
        });
      });

      it('should create REVOKE_AUTH action for Facebook', () => {
        const action = revokeAuthApp('facebook');
        expect(action).toEqual({
          type: 'REVOKE_AUTH',
          payload: 'facebook',
        });
      });
    });

    describe('getAvailableIntegrations', () => {
      it('should create AVAILABLE action', () => {
        const action = getAvailableIntegrations();
        expect(action).toEqual({
          type: 'AVAILABLE',
        });
      });
    });

    describe('getAppUser', () => {
      it('should create USER action for Instagram', () => {
        const action = getAppUser('instagram');
        expect(action).toEqual({
          type: 'USER',
          payload: 'instagram',
        });
      });

      it('should create USER action for Facebook', () => {
        const action = getAppUser('facebook');
        expect(action).toEqual({
          type: 'USER',
          payload: 'facebook',
        });
      });
    });
  });

  describe('axios configuration', () => {
    it('should create axios instance with correct base URL', () => {
      // The module should have created an axios instance
      expect(mockAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://test-data-service.com/api/v1',
      });
    });
  });

  describe('useIntegrationApi hook integration', () => {
    it('should call useApi with integrationApi function', () => {
      const mockUseIntegrationApi = useIntegrationApi;
      const action = { type: 'AUTHORIZE' as const, payload: 'instagram' as const };
      const manual = 'TRIGGER';

      mockUseIntegrationApi(action, manual);

      expect(mockUseApi).toHaveBeenCalledWith(integrationApi, action, manual);
    });

    it('should call useApi without manual parameter', () => {
      const mockUseIntegrationApi = useIntegrationApi;
      const action = { type: 'FETCH_DATA' as const, payload: 'facebook' as const };

      mockUseIntegrationApi(action);

      expect(mockUseApi).toHaveBeenCalledWith(integrationApi, action, undefined);
    });
  });

  describe('integration scenarios', () => {
    const mockToken = 'integration-test-token';

    it('should handle complete Instagram integration flow', async () => {
      // Step 1: Authenticate
      const authResponse = { data: { success: true, auth_url: 'https://instagram.com/oauth' } };
      mockAxiosInstance.get.mockResolvedValueOnce(authResponse);

      const authAction = authenticateApp('instagram');
      const authResult = await integrationApi(authAction, mockToken);

      expect(authResult).toEqual(authResponse.data);

      // Step 2: Get user info
      const userResponse = {
        data: {
          user_info: {
            id: 'insta_123',
            username: 'testuser',
            followers_count: 1000,
          },
        },
      };
      mockAxiosInstance.get.mockResolvedValueOnce(userResponse);

      const userAction = getAppUser('instagram');
      const userResult = await integrationApi(userAction, mockToken);

      expect(userResult).toEqual(userResponse.data);

      // Step 3: Fetch data
      const dataResponse = {
        data: {
          posts: [{ id: '1', caption: 'Hello World!' }],
          profile: { followers_count: 1000 },
        },
      };
      mockAxiosInstance.get.mockResolvedValueOnce(dataResponse);

      const dataAction = fetcheDataApp('instagram');
      const dataResult = await integrationApi(dataAction, mockToken);

      expect(dataResult).toEqual(dataResponse.data);
    });

    it('should handle complete Facebook integration flow', async () => {
      // Step 1: Authenticate
      const authResponse = { data: { success: true, auth_url: 'https://facebook.com/oauth' } };
      mockAxiosInstance.get.mockResolvedValueOnce(authResponse);

      const authAction = authenticateApp('facebook');
      const authResult = await integrationApi(authAction, mockToken);

      expect(authResult).toEqual(authResponse.data);

      // Step 2: Revoke authorization
      const revokeResponse = { data: { success: true, message: 'Authorization revoked' } };
      mockAxiosInstance.delete.mockResolvedValueOnce(revokeResponse);

      const revokeAction = revokeAuthApp('facebook');
      const revokeResult = await integrationApi(revokeAction, mockToken);

      expect(revokeResult).toEqual(revokeResponse.data);
    });

    it('should handle checking available integrations', async () => {
      const availableResponse = {
        data: {
          available_integrations: [
            { app: 'instagram', name: 'Instagram', status: 'available' },
            { app: 'facebook', name: 'Facebook', status: 'available' },
          ],
        },
      };
      mockAxiosInstance.get.mockResolvedValueOnce(availableResponse);

      const availableAction = getAvailableIntegrations();
      const availableResult = await integrationApi(availableAction, mockToken);

      expect(availableResult).toEqual(availableResponse.data);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/integrations', {
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      });
    });
  });

  describe('error edge cases', () => {
    const mockToken = 'error-test-token';

    it('should handle malformed responses', async () => {
      // Response without .data property (axios typically wraps responses in .data)
      const malformedResponse = { success: true, message: 'No data wrapper' };
      mockAxiosInstance.get.mockResolvedValueOnce(malformedResponse);

      const action = { type: 'AUTHORIZE', payload: 'instagram' };
      const result = await integrationApi(action, mockToken);

      // Should return undefined since response.data is undefined
      expect(result).toBeUndefined();
    });

    it('should handle axios errors with response data', async () => {
      const axiosError = {
        response: {
          status: 401,
          statusText: 'Unauthorized',
          data: { error: 'Invalid token' },
        },
        message: 'Request failed with status code 401',
      };

      mockAxiosInstance.get.mockRejectedValueOnce(axiosError);

      const action = { type: 'USER', payload: 'instagram' };

      await expect(integrationApi(action, mockToken)).rejects.toEqual(axiosError);
    });

    it('should handle partial action objects', async () => {
      const mockResponse = { data: { success: true } };
      mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

      // Action with missing payload (should work for AVAILABLE action)
      const actionWithoutPayload = { type: 'AVAILABLE' };
      const result = await integrationApi(actionWithoutPayload, mockToken);

      expect(result).toEqual(mockResponse.data);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/integrations', {
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      });
    });
  });
});
