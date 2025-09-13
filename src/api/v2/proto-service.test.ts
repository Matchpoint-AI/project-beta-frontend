import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ProtoService } from './proto-service';

// Mock the config module
vi.mock('../config', () => ({
  V2_PUBLIC_API_URL: 'https://test-api-v2.com',
}));

// Test implementation of ProtoService
class TestProtoService extends ProtoService {
  constructor(config?: { serviceName?: string; baseUrl?: string; timeout?: number }) {
    super({
      serviceName: config?.serviceName || 'Test Service',
      baseUrl: config?.baseUrl,
      timeout: config?.timeout,
    });
  }

  // Expose protected methods for testing
  public async testGet<T>(
    endpoint: string,
    responseMessagePath: { package: string; message: string },
    options?: any
  ) {
    return this.get<T>(endpoint, responseMessagePath, options);
  }

  public async testPost<TRequest, TResponse>(
    endpoint: string,
    data: TRequest,
    requestMessagePath: { package: string; message: string },
    responseMessagePath: { package: string; message: string },
    options?: any
  ) {
    return this.post<TRequest, TResponse>(
      endpoint,
      data,
      requestMessagePath,
      responseMessagePath,
      options
    );
  }

  public async testPut<TRequest, TResponse>(
    endpoint: string,
    data: TRequest,
    requestMessagePath: { package: string; message: string },
    responseMessagePath: { package: string; message: string },
    options?: any
  ) {
    return this.put<TRequest, TResponse>(
      endpoint,
      data,
      requestMessagePath,
      responseMessagePath,
      options
    );
  }

  public async testDelete<TResponse>(
    endpoint: string,
    responseMessagePath: { package: string; message: string },
    options?: any
  ) {
    return this.delete<TResponse>(endpoint, responseMessagePath, options);
  }

  public async testCreateMultipartFormData(
    fields: Record<string, unknown>,
    protoFields: Record<string, { data: unknown; package: string; message: string }>
  ) {
    return this.createMultipartFormData(fields, protoFields);
  }

  public async testValidateMessage(packageName: string, messageName: string, data: unknown) {
    return this.validateMessage(packageName, messageName, data);
  }
}

describe('ProtoService', () => {
  let service: TestProtoService;
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = mockFetch;
    service = new TestProtoService();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with default configuration', () => {
      const service = new TestProtoService();
      expect((service as any).baseUrl).toBe('https://test-api-v2.com');
      expect((service as any).serviceName).toBe('Test Service');
      expect((service as any).defaultTimeout).toBe(30000);
    });

    it('should initialize with custom configuration', () => {
      const service = new TestProtoService({
        serviceName: 'Custom Service',
        baseUrl: 'https://custom-api.com',
        timeout: 60000,
      });

      expect((service as any).baseUrl).toBe('https://custom-api.com');
      expect((service as any).serviceName).toBe('Custom Service');
      expect((service as any).defaultTimeout).toBe(60000);
    });

    it('should use defaults when configuration is partial', () => {
      const service = new TestProtoService({
        serviceName: 'Partial Service',
      });

      expect((service as any).serviceName).toBe('Partial Service');
      expect((service as any).baseUrl).toBe('https://test-api-v2.com');
      expect((service as any).defaultTimeout).toBe(30000);
    });
  });

  describe('GET requests', () => {
    it('should make successful GET request', async () => {
      const mockResponse = { data: 'test-data', success: true };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await service.testGet(
        '/test-endpoint',
        { package: 'test', message: 'TestMessage' },
        { token: 'test-token' }
      );

      expect(mockFetch).toHaveBeenCalledWith('https://test-api-v2.com/test-endpoint', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer test-token',
        },
        signal: expect.any(AbortSignal),
      });

      expect(result).toEqual(mockResponse);
    });

    it('should make GET request without token', async () => {
      const mockResponse = { public: 'data' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await service.testGet('/public-endpoint', {
        package: 'test',
        message: 'Public',
      });

      expect(mockFetch).toHaveBeenCalledWith('https://test-api-v2.com/public-endpoint', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        signal: expect.any(AbortSignal),
      });

      expect(result).toEqual(mockResponse);
    });

    it('should include custom headers in GET request', async () => {
      const mockResponse = { data: 'custom-headers' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await service.testGet(
        '/custom-headers',
        { package: 'test', message: 'Custom' },
        {
          token: 'test-token',
          headers: {
            'X-Custom-Header': 'custom-value',
            'X-Another-Header': 'another-value',
          },
        }
      );

      expect(mockFetch).toHaveBeenCalledWith('https://test-api-v2.com/custom-headers', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer test-token',
          'X-Custom-Header': 'custom-value',
          'X-Another-Header': 'another-value',
        },
        signal: expect.any(AbortSignal),
      });

      expect(result).toEqual(mockResponse);
    });
  });

  describe('POST requests', () => {
    it('should make successful POST request with JSON body', async () => {
      const mockResponse = { created: true, id: 'new-id' };
      const requestData = { name: 'Test Item', value: 42 };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await service.testPost(
        '/create-endpoint',
        requestData,
        { package: 'test', message: 'CreateRequest' },
        { package: 'test', message: 'CreateResponse' },
        { token: 'test-token' }
      );

      expect(mockFetch).toHaveBeenCalledWith('https://test-api-v2.com/create-endpoint', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        },
        body: JSON.stringify(requestData),
        signal: expect.any(AbortSignal),
      });

      expect(result).toEqual(mockResponse);
    });

    it('should handle POST request with null data', async () => {
      const mockResponse = { success: true };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await service.testPost(
        '/empty-post',
        {},
        { package: 'test', message: 'EmptyRequest' },
        { package: 'test', message: 'EmptyResponse' },
        { token: 'test-token' }
      );

      expect(mockFetch).toHaveBeenCalledWith('https://test-api-v2.com/empty-post', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer test-token',
        },
        body: undefined,
        signal: expect.any(AbortSignal),
      });

      expect(result).toEqual(mockResponse);
    });

    it('should handle complex nested data structures', async () => {
      const complexData = {
        user: {
          name: 'John Doe',
          preferences: {
            theme: 'dark',
            notifications: ['email', 'push'],
          },
        },
        metadata: {
          timestamp: '2023-01-01T00:00:00Z',
          version: '1.0.0',
        },
        items: [
          { id: 1, type: 'product' },
          { id: 2, type: 'service' },
        ],
      };

      const mockResponse = { processed: true };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await service.testPost(
        '/complex-data',
        complexData,
        { package: 'test', message: 'ComplexRequest' },
        { package: 'test', message: 'ComplexResponse' }
      );

      const call = mockFetch.mock.calls[0];
      const body = JSON.parse(call[1].body);
      expect(body).toEqual(complexData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('PUT requests', () => {
    it('should make successful PUT request', async () => {
      const mockResponse = { updated: true, version: 2 };
      const updateData = { name: 'Updated Item', value: 100 };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await service.testPut(
        '/update-endpoint/123',
        updateData,
        { package: 'test', message: 'UpdateRequest' },
        { package: 'test', message: 'UpdateResponse' },
        { token: 'test-token' }
      );

      expect(mockFetch).toHaveBeenCalledWith('https://test-api-v2.com/update-endpoint/123', {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        },
        body: JSON.stringify(updateData),
        signal: expect.any(AbortSignal),
      });

      expect(result).toEqual(mockResponse);
    });
  });

  describe('DELETE requests', () => {
    it('should make successful DELETE request', async () => {
      const mockResponse = { deleted: true, id: '123' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await service.testDelete(
        '/delete-endpoint/123',
        { package: 'test', message: 'DeleteResponse' },
        { token: 'test-token' }
      );

      expect(mockFetch).toHaveBeenCalledWith('https://test-api-v2.com/delete-endpoint/123', {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer test-token',
        },
        body: undefined,
        signal: expect.any(AbortSignal),
      });

      expect(result).toEqual(mockResponse);
    });
  });

  describe('error handling', () => {
    it('should handle HTTP error with JSON error response', async () => {
      const errorData = {
        detail: 'Validation failed: Name is required',
        code: 'VALIDATION_ERROR',
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        headers: new Map([['content-type', 'application/json']]),
        json: async () => errorData,
      });

      await expect(
        service.testGet('/error-endpoint', { package: 'test', message: 'Error' })
      ).rejects.toThrow('Validation failed: Name is required');
    });

    it('should handle HTTP error with message field in JSON', async () => {
      const errorData = {
        message: 'Resource not found',
        status: 404,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        headers: new Map([['content-type', 'application/json']]),
        json: async () => errorData,
      });

      await expect(
        service.testGet('/not-found', { package: 'test', message: 'NotFound' })
      ).rejects.toThrow('Resource not found');
    });

    it('should handle HTTP error with text response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: new Map([['content-type', 'text/plain']]),
        text: async () => 'Internal server error occurred',
      });

      await expect(
        service.testGet('/server-error', { package: 'test', message: 'ServerError' })
      ).rejects.toThrow('Internal server error occurred');
    });

    it('should handle HTTP error with no response body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable',
        headers: new Map(),
        json: async () => {
          throw new Error('No JSON');
        },
        text: async () => {
          throw new Error('No text');
        },
      });

      await expect(
        service.testGet('/unavailable', { package: 'test', message: 'Unavailable' })
      ).rejects.toThrow('Test Service API error: 503 Service Unavailable');
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network connection failed');
      mockFetch.mockRejectedValueOnce(networkError);

      await expect(
        service.testGet('/network-error', { package: 'test', message: 'NetworkError' })
      ).rejects.toThrow('Network connection failed');
    });

    it('should handle JSON parsing errors in error responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        headers: new Map([['content-type', 'application/json']]),
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      await expect(
        service.testGet('/json-error', { package: 'test', message: 'JsonError' })
      ).rejects.toThrow('Test Service API error: 400 Bad Request');
    });
  });

  describe('timeout handling', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should timeout after default timeout period', async () => {
      // Mock a request that never resolves
      const neverResolve = new Promise(() => {});
      mockFetch.mockReturnValueOnce(neverResolve);

      const requestPromise = service.testGet('/timeout-test', {
        package: 'test',
        message: 'Timeout',
      });

      // Advance timers to trigger timeout
      vi.advanceTimersByTime(30000);

      await expect(requestPromise).rejects.toThrow('Request timeout after 30000ms');
    });

    it('should timeout after custom timeout period', async () => {
      const customService = new TestProtoService({ timeout: 5000 });
      const neverResolve = new Promise(() => {});
      mockFetch.mockReturnValueOnce(neverResolve);

      const requestPromise = customService.testGet('/custom-timeout', {
        package: 'test',
        message: 'CustomTimeout',
      });

      // Advance timers to trigger custom timeout
      vi.advanceTimersByTime(5000);

      await expect(requestPromise).rejects.toThrow('Request timeout after 5000ms');
    });

    it('should use request-specific timeout over default', async () => {
      const neverResolve = new Promise(() => {});
      mockFetch.mockReturnValueOnce(neverResolve);

      const requestPromise = service.testGet(
        '/request-timeout',
        { package: 'test', message: 'RequestTimeout' },
        { timeout: 2000 }
      );

      // Advance timers to trigger request-specific timeout
      vi.advanceTimersByTime(2000);

      await expect(requestPromise).rejects.toThrow('Request timeout after 2000ms');
    });

    it('should clear timeout on successful response', async () => {
      const mockResponse = { success: true };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await service.testGet('/success', { package: 'test', message: 'Success' });

      expect(result).toEqual(mockResponse);

      // Advance timers past timeout period - should not cause issues
      vi.advanceTimersByTime(60000);
    });
  });

  describe('multipart form data', () => {
    it('should create multipart form data with regular fields', async () => {
      const fields = {
        name: 'Test File Upload',
        category: 'documents',
        size: 1024,
        public: true,
      };

      const protoFields = {};

      const formData = await service.testCreateMultipartFormData(fields, protoFields);

      expect(formData).toBeInstanceOf(FormData);
      expect(formData.get('name')).toBe('Test File Upload');
      expect(formData.get('category')).toBe('documents');
      expect(formData.get('size')).toBe('1024');
      expect(formData.get('public')).toBe('true');
    });

    it('should create multipart form data with JSON proto fields', async () => {
      const fields = {
        upload_type: 'bulk',
      };

      const protoFields = {
        metadata: {
          data: {
            user_id: '123',
            permissions: ['read', 'write'],
            tags: ['important', 'processed'],
          },
          package: 'upload',
          message: 'UploadMetadata',
        },
        config: {
          data: {
            max_size: 5242880,
            allowed_types: ['pdf', 'docx', 'txt'],
          },
          package: 'upload',
          message: 'UploadConfig',
        },
      };

      const formData = await service.testCreateMultipartFormData(fields, protoFields);

      expect(formData).toBeInstanceOf(FormData);
      expect(formData.get('upload_type')).toBe('bulk');

      // Check that proto fields were converted to JSON blobs
      const metadataBlob = formData.get('metadata') as File;
      expect(metadataBlob).toBeInstanceOf(File);
      expect(metadataBlob.name).toBe('metadata.json');
      expect(metadataBlob.type).toBe('application/json');

      const configBlob = formData.get('config') as File;
      expect(configBlob).toBeInstanceOf(File);
      expect(configBlob.name).toBe('config.json');
    });

    it('should handle undefined and null values in fields', async () => {
      const fields = {
        defined_field: 'value',
        undefined_field: undefined,
        null_field: null,
        empty_string: '',
        zero_value: 0,
        false_value: false,
      };

      const protoFields = {};

      const formData = await service.testCreateMultipartFormData(fields, protoFields);

      expect(formData.get('defined_field')).toBe('value');
      expect(formData.get('undefined_field')).toBeNull();
      expect(formData.get('null_field')).toBeNull();
      expect(formData.get('empty_string')).toBe('');
      expect(formData.get('zero_value')).toBe('0');
      expect(formData.get('false_value')).toBe('false');
    });

    it('should handle complex nested objects in proto fields', async () => {
      const fields = {};

      const protoFields = {
        complex_data: {
          data: {
            level1: {
              level2: {
                level3: {
                  deep_value: 'nested',
                  array: [1, 2, 3],
                  object: { key: 'value' },
                },
              },
            },
            parallel_data: ['a', 'b', 'c'],
          },
          package: 'test',
          message: 'ComplexData',
        },
      };

      const formData = await service.testCreateMultipartFormData(fields, protoFields);

      const complexBlob = formData.get('complex_data') as File;
      expect(complexBlob).toBeInstanceOf(File);

      // Read the blob content to verify JSON structure
      const text = await complexBlob.text();
      const parsed = JSON.parse(text);
      expect(parsed.level1.level2.level3.deep_value).toBe('nested');
      expect(parsed.parallel_data).toEqual(['a', 'b', 'c']);
    });
  });

  describe('message validation', () => {
    it('should always return null for JSON mode validation', async () => {
      const result = await service.testValidateMessage('test.package', 'TestMessage', {
        data: 'test',
      });
      expect(result).toBeNull();
    });

    it('should handle validation for different data types', async () => {
      const testCases = [
        'string',
        123,
        true,
        null,
        undefined,
        { object: 'value' },
        ['array', 'values'],
      ];

      for (const testData of testCases) {
        const result = await service.testValidateMessage('package', 'Message', testData);
        expect(result).toBeNull();
      }
    });
  });

  describe('base URL handling', () => {
    it('should construct correct URLs with base URL', () => {
      const service = new TestProtoService({
        serviceName: 'URL Test',
        baseUrl: 'https://custom-api.example.com/v3',
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ test: true }),
      });

      service.testGet('/endpoint', { package: 'test', message: 'Test' });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://custom-api.example.com/v3/endpoint',
        expect.any(Object)
      );
    });

    it('should handle base URL with trailing slash', () => {
      const service = new TestProtoService({
        serviceName: 'Trailing Slash Test',
        baseUrl: 'https://api.example.com/',
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ test: true }),
      });

      service.testGet('/endpoint', { package: 'test', message: 'Test' });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com//endpoint',
        expect.any(Object)
      );
    });

    it('should handle endpoint with query parameters', () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ test: true }),
      });

      service.testGet('/search?q=test&limit=10', { package: 'test', message: 'Search' });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-api-v2.com/search?q=test&limit=10',
        expect.any(Object)
      );
    });
  });

  describe('header handling', () => {
    it('should merge custom headers with default headers', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await service.testGet(
        '/merge-headers',
        { package: 'test', message: 'MergeHeaders' },
        {
          token: 'test-token',
          headers: {
            'X-Custom-Header': 'custom-value',
            'Content-Type': 'application/custom+json', // Should override default for POST/PUT
          },
        }
      );

      expect(mockFetch).toHaveBeenCalledWith('https://test-api-v2.com/merge-headers', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer test-token',
          'X-Custom-Header': 'custom-value',
          'Content-Type': 'application/custom+json',
        },
        signal: expect.any(AbortSignal),
      });
    });

    it('should handle empty custom headers object', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await service.testGet(
        '/empty-headers',
        { package: 'test', message: 'EmptyHeaders' },
        {
          token: 'test-token',
          headers: {},
        }
      );

      expect(mockFetch).toHaveBeenCalledWith('https://test-api-v2.com/empty-headers', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer test-token',
        },
        signal: expect.any(AbortSignal),
      });
    });
  });
});
