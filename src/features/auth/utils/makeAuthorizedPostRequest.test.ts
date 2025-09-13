import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import makeAuthorizedPostRequest from './makeAuthorizedPostRequest';
import RequestInput from '../../../interfaces/RequestInput';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('makeAuthorizedPostRequest', () => {
  const mockEndpoint = 'https://api.example.com/endpoint';
  const mockAudience = 'test-audience';
  const mockData: RequestInput = {
    entity_name: 'test-entity',
    entity_data: {
      auth: 'test-auth-token',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('successful requests', () => {
    it('should make authorized POST request with correct headers and body', async () => {
      // Arrange
      const mockResponse = new Response('{"success": true}', {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
      mockFetch.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await makeAuthorizedPostRequest(mockEndpoint, mockAudience, mockData);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(mockEndpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: expect.any(Headers),
        body: JSON.stringify(mockData),
      });

      // Verify headers
      const headers = mockFetch.mock.calls[0][1].headers;
      expect(headers.get('Content-Type')).toBe('application/json');
      expect(headers.get('Authorization')).toBe('Bearer YOUR_ACTUAL_TOKEN');
      expect(result).toBe(mockResponse);
    });

    it('should handle different endpoint URLs', async () => {
      // Arrange
      const customEndpoint = 'https://custom-api.example.com/v2/data';
      const mockResponse = new Response('success');
      mockFetch.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await makeAuthorizedPostRequest(customEndpoint, mockAudience, mockData);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        customEndpoint,
        expect.objectContaining({
          method: 'POST',
        })
      );
      expect(result).toBe(mockResponse);
    });

    it('should handle different request data structures', async () => {
      // Arrange
      const complexData: RequestInput = {
        entity_name: 'complex-entity',
        entity_data: {
          auth: 'complex-auth-token-with-special-chars!@#$%^&*()',
        },
      };
      const mockResponse = new Response('{"processed": true}');
      mockFetch.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await makeAuthorizedPostRequest(mockEndpoint, mockAudience, complexData);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        mockEndpoint,
        expect.objectContaining({
          body: JSON.stringify(complexData),
        })
      );
      expect(result).toBe(mockResponse);
    });
  });

  describe('request configuration', () => {
    it('should use no-cors mode', async () => {
      // Arrange
      const mockResponse = new Response('test');
      mockFetch.mockResolvedValueOnce(mockResponse);

      // Act
      await makeAuthorizedPostRequest(mockEndpoint, mockAudience, mockData);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        mockEndpoint,
        expect.objectContaining({
          mode: 'no-cors',
        })
      );
    });

    it('should use POST method', async () => {
      // Arrange
      const mockResponse = new Response('test');
      mockFetch.mockResolvedValueOnce(mockResponse);

      // Act
      await makeAuthorizedPostRequest(mockEndpoint, mockAudience, mockData);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        mockEndpoint,
        expect.objectContaining({
          method: 'POST',
        })
      );
    });

    it('should set correct headers', async () => {
      // Arrange
      const mockResponse = new Response('test');
      mockFetch.mockResolvedValueOnce(mockResponse);

      // Act
      await makeAuthorizedPostRequest(mockEndpoint, mockAudience, mockData);

      // Assert
      const headers = mockFetch.mock.calls[0][1].headers;
      expect(headers).toBeInstanceOf(Headers);
      expect(headers.get('Content-Type')).toBe('application/json');
      expect(headers.get('Authorization')).toBe('Bearer YOUR_ACTUAL_TOKEN');
    });
  });

  describe('input parameter handling', () => {
    it('should handle empty endpoint string', async () => {
      // Arrange
      const mockResponse = new Response('test');
      mockFetch.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await makeAuthorizedPostRequest('', mockAudience, mockData);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith('', expect.any(Object));
      expect(result).toBe(mockResponse);
    });

    it('should handle empty audience parameter', async () => {
      // Arrange
      const mockResponse = new Response('test');
      mockFetch.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await makeAuthorizedPostRequest(mockEndpoint, '', mockData);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(mockEndpoint, expect.any(Object));
      expect(result).toBe(mockResponse);
    });

    it('should handle minimal data structure', async () => {
      // Arrange
      const minimalData: RequestInput = {
        entity_name: '',
        entity_data: {
          auth: '',
        },
      };
      const mockResponse = new Response('test');
      mockFetch.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await makeAuthorizedPostRequest(mockEndpoint, mockAudience, minimalData);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        mockEndpoint,
        expect.objectContaining({
          body: JSON.stringify(minimalData),
        })
      );
      expect(result).toBe(mockResponse);
    });

    it('should handle special characters in endpoint URL', async () => {
      // Arrange
      const specialEndpoint = 'https://api.example.com/endpoint?param=value&special=!@#$%^&*()';
      const mockResponse = new Response('test');
      mockFetch.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await makeAuthorizedPostRequest(specialEndpoint, mockAudience, mockData);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(specialEndpoint, expect.any(Object));
      expect(result).toBe(mockResponse);
    });

    it('should handle unicode characters in data', async () => {
      // Arrange
      const unicodeData: RequestInput = {
        entity_name: '测试实体名称',
        entity_data: {
          auth: 'トークン123',
        },
      };
      const mockResponse = new Response('test');
      mockFetch.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await makeAuthorizedPostRequest(mockEndpoint, mockAudience, unicodeData);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        mockEndpoint,
        expect.objectContaining({
          body: JSON.stringify(unicodeData),
        })
      );
      expect(result).toBe(mockResponse);
    });
  });

  describe('error handling', () => {
    it('should handle network errors', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      // Act & Assert
      await expect(
        makeAuthorizedPostRequest(mockEndpoint, mockAudience, mockData)
      ).rejects.toThrow('Network error');
    });

    it('should handle fetch timeout errors', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error('Request timeout'));

      // Act & Assert
      await expect(
        makeAuthorizedPostRequest(mockEndpoint, mockAudience, mockData)
      ).rejects.toThrow('Request timeout');
    });

    it('should handle DNS resolution errors', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error('getaddrinfo ENOTFOUND'));

      // Act & Assert
      await expect(
        makeAuthorizedPostRequest(mockEndpoint, mockAudience, mockData)
      ).rejects.toThrow('getaddrinfo ENOTFOUND');
    });

    it('should handle CORS errors gracefully due to no-cors mode', async () => {
      // Arrange - In no-cors mode, CORS errors typically result in opaque responses
      // We can't create a Response with status 0, so we simulate a network-level CORS error
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

      // Act & Assert
      await expect(
        makeAuthorizedPostRequest(mockEndpoint, mockAudience, mockData)
      ).rejects.toThrow('Failed to fetch');
    });
  });

  describe('response handling', () => {
    it('should return successful response object', async () => {
      // Arrange
      const mockResponse = new Response('{"data": "success"}', {
        status: 200,
        statusText: 'OK',
        headers: { 'Content-Type': 'application/json' },
      });
      mockFetch.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await makeAuthorizedPostRequest(mockEndpoint, mockAudience, mockData);

      // Assert
      expect(result).toBe(mockResponse);
      expect(result.status).toBe(200);
      expect(result.statusText).toBe('OK');
    });

    it('should return error response object without throwing', async () => {
      // Arrange
      const mockResponse = new Response('{"error": "Bad Request"}', {
        status: 400,
        statusText: 'Bad Request',
      });
      mockFetch.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await makeAuthorizedPostRequest(mockEndpoint, mockAudience, mockData);

      // Assert
      expect(result).toBe(mockResponse);
      expect(result.status).toBe(400);
      expect(result.statusText).toBe('Bad Request');
    });

    it('should return server error response object', async () => {
      // Arrange
      const mockResponse = new Response('Internal Server Error', {
        status: 500,
        statusText: 'Internal Server Error',
      });
      mockFetch.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await makeAuthorizedPostRequest(mockEndpoint, mockAudience, mockData);

      // Assert
      expect(result).toBe(mockResponse);
      expect(result.status).toBe(500);
    });

    it('should handle empty response body', async () => {
      // Arrange - 204 No Content responses don't have a body
      const mockResponse = new Response(null);
      Object.defineProperty(mockResponse, 'status', { value: 204, writable: false });
      mockFetch.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await makeAuthorizedPostRequest(mockEndpoint, mockAudience, mockData);

      // Assert
      expect(result).toBe(mockResponse);
    });
  });

  describe('JSON serialization', () => {
    it('should properly serialize complex data structures', async () => {
      // Arrange
      const complexData: RequestInput = {
        entity_name: 'complex-entity-with-nested-data',
        entity_data: {
          auth: 'complex-auth-token',
        },
      };
      const mockResponse = new Response('test');
      mockFetch.mockResolvedValueOnce(mockResponse);

      // Act
      await makeAuthorizedPostRequest(mockEndpoint, mockAudience, complexData);

      // Assert
      const expectedBody = JSON.stringify(complexData);
      expect(mockFetch).toHaveBeenCalledWith(
        mockEndpoint,
        expect.objectContaining({
          body: expectedBody,
        })
      );
    });

    it('should handle data with special characters in JSON serialization', async () => {
      // Arrange
      const specialData: RequestInput = {
        entity_name: 'entity"with\'quotes',
        entity_data: {
          auth: 'token\nwith\tspecial\rcharacters',
        },
      };
      const mockResponse = new Response('test');
      mockFetch.mockResolvedValueOnce(mockResponse);

      // Act
      await makeAuthorizedPostRequest(mockEndpoint, mockAudience, specialData);

      // Assert
      const expectedBody = JSON.stringify(specialData);
      expect(mockFetch).toHaveBeenCalledWith(
        mockEndpoint,
        expect.objectContaining({
          body: expectedBody,
        })
      );
      // Verify that JSON.stringify properly escapes special characters
      expect(expectedBody).toContain('\\"');
      expect(expectedBody).toContain('\\n');
      expect(expectedBody).toContain('\\t');
      expect(expectedBody).toContain('\\r');
    });

    it('should handle null and undefined values in data', async () => {
      // Arrange - Note: This tests how the function handles edge case data
      const edgeCaseData = {
        entity_name: null,
        entity_data: {
          auth: undefined,
        },
      } as any as RequestInput;
      const mockResponse = new Response('test');
      mockFetch.mockResolvedValueOnce(mockResponse);

      // Act
      await makeAuthorizedPostRequest(mockEndpoint, mockAudience, edgeCaseData);

      // Assert
      const expectedBody = JSON.stringify(edgeCaseData);
      expect(mockFetch).toHaveBeenCalledWith(
        mockEndpoint,
        expect.objectContaining({
          body: expectedBody,
        })
      );
    });
  });

  describe('authentication token handling', () => {
    it('should use hardcoded bearer token', async () => {
      // Arrange
      const mockResponse = new Response('test');
      mockFetch.mockResolvedValueOnce(mockResponse);

      // Act
      await makeAuthorizedPostRequest(mockEndpoint, mockAudience, mockData);

      // Assert
      const headers = mockFetch.mock.calls[0][1].headers;
      expect(headers.get('Authorization')).toBe('Bearer YOUR_ACTUAL_TOKEN');
    });

    it('should include authorization header regardless of audience parameter', async () => {
      // Arrange
      const mockResponse = new Response('test');
      mockFetch.mockResolvedValueOnce(mockResponse);

      // Act
      await makeAuthorizedPostRequest(mockEndpoint, 'different-audience', mockData);

      // Assert
      const headers = mockFetch.mock.calls[0][1].headers;
      expect(headers.get('Authorization')).toBe('Bearer YOUR_ACTUAL_TOKEN');
    });
  });

  describe('Headers object handling', () => {
    it('should create and use Headers object correctly', async () => {
      // Arrange
      const mockResponse = new Response('test');
      mockFetch.mockResolvedValueOnce(mockResponse);

      // Act
      await makeAuthorizedPostRequest(mockEndpoint, mockAudience, mockData);

      // Assert
      const headers = mockFetch.mock.calls[0][1].headers;
      expect(headers).toBeInstanceOf(Headers);
      expect(headers.has('Content-Type')).toBe(true);
      expect(headers.has('Authorization')).toBe(true);
    });

    it('should handle headers case-insensitively', async () => {
      // Arrange
      const mockResponse = new Response('test');
      mockFetch.mockResolvedValueOnce(mockResponse);

      // Act
      await makeAuthorizedPostRequest(mockEndpoint, mockAudience, mockData);

      // Assert
      const headers = mockFetch.mock.calls[0][1].headers;
      expect(headers.get('content-type')).toBe('application/json'); // lowercase
      expect(headers.get('AUTHORIZATION')).toBe('Bearer YOUR_ACTUAL_TOKEN'); // uppercase
    });
  });
});