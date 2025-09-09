/**
 * Base Proto Service for V2 API (JSON-only implementation)
 * 
 * Provides base functionality for all V2 API services using JSON.
 * Protobuf support has been removed.
 */
import { V2_PUBLIC_API_URL } from '../config';

/**
 * Configuration for proto service
 */
export interface ProtoServiceConfig {
  serviceName: string;
  baseUrl?: string;
  timeout?: number;
}

/**
 * Request options for API calls
 */
export interface RequestOptions {
  token?: string;
  headers?: Record<string, string>;
  timeout?: number;
}

/**
 * Base class for all V2 API services using JSON
 */
export abstract class ProtoService {
  protected serviceName: string;
  protected baseUrl: string;
  protected defaultTimeout: number;

  constructor(config: ProtoServiceConfig) {
    this.serviceName = config.serviceName;
    this.baseUrl = config.baseUrl || V2_PUBLIC_API_URL;
    this.defaultTimeout = config.timeout || 30000;
  }

  /**
   * Make a JSON-based API request
   */
  protected async makeProtoRequest<TRequest, TResponse>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    endpoint: string,
    requestData: TRequest | null,
    requestMessagePath: { package: string; message: string } | null,
    responseMessagePath: { package: string; message: string },
    options?: RequestOptions
  ): Promise<TResponse> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Prepare headers - always use JSON
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      ...options?.headers
    };

    if (options?.token) {
      headers['Authorization'] = `Bearer ${options.token}`;
    }

    // Prepare request body if needed
    let body: BodyInit | undefined;
    
    if (requestData && requestMessagePath) {
      body = JSON.stringify(requestData);
      headers['Content-Type'] = 'application/json';
    }

    // Make the request
    const controller = new AbortController();
    const timeout = options?.timeout || this.defaultTimeout;
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method,
        headers,
        body,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      // Always parse as JSON
      const json = await response.json();
      return json as TResponse;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`Request timeout after ${timeout}ms`);
        }
      }
      
      throw error;
    }
  }

  /**
   * Make a GET request with JSON support
   */
  protected async get<TResponse>(
    endpoint: string,
    responseMessagePath: { package: string; message: string },
    options?: RequestOptions
  ): Promise<TResponse> {
    return this.makeProtoRequest<null, TResponse>(
      'GET',
      endpoint,
      null,
      null,
      responseMessagePath,
      options
    );
  }

  /**
   * Make a POST request with JSON support
   */
  protected async post<TRequest, TResponse>(
    endpoint: string,
    data: TRequest,
    requestMessagePath: { package: string; message: string },
    responseMessagePath: { package: string; message: string },
    options?: RequestOptions
  ): Promise<TResponse> {
    return this.makeProtoRequest<TRequest, TResponse>(
      'POST',
      endpoint,
      data,
      requestMessagePath,
      responseMessagePath,
      options
    );
  }

  /**
   * Make a PUT request with JSON support
   */
  protected async put<TRequest, TResponse>(
    endpoint: string,
    data: TRequest,
    requestMessagePath: { package: string; message: string },
    responseMessagePath: { package: string; message: string },
    options?: RequestOptions
  ): Promise<TResponse> {
    return this.makeProtoRequest<TRequest, TResponse>(
      'PUT',
      endpoint,
      data,
      requestMessagePath,
      responseMessagePath,
      options
    );
  }

  /**
   * Make a DELETE request with JSON support
   */
  protected async delete<TResponse>(
    endpoint: string,
    responseMessagePath: { package: string; message: string },
    options?: RequestOptions
  ): Promise<TResponse> {
    return this.makeProtoRequest<null, TResponse>(
      'DELETE',
      endpoint,
      null,
      null,
      responseMessagePath,
      options
    );
  }

  /**
   * Handle error responses
   */
  private async handleErrorResponse(response: Response): Promise<never> {
    let errorMessage = `${this.serviceName} API error: ${response.status} ${response.statusText}`;
    
    try {
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } else if (contentType?.includes('text/')) {
        const errorText = await response.text();
        if (errorText) {
          errorMessage = errorText;
        }
      }
    } catch {
      // Ignore parsing errors, use default message
    }
    
    throw new Error(errorMessage);
  }

  /**
   * Validate a message - always returns null for JSON
   */
  protected async validateMessage(
    _packageName: string,
    _messageName: string,
    _data: unknown
  ): Promise<string | null> {
    // No validation in JSON mode
    return null;
  }

  /**
   * Create headers for multipart form data
   */
  protected async createMultipartFormData(
    fields: Record<string, unknown>,
    protoFields: Record<string, { data: unknown; package: string; message: string }>
  ): Promise<FormData> {
    const formData = new FormData();
    
    // Add regular fields
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    }
    
    // Add JSON fields (previously protobuf fields)
    for (const [key, protoField] of Object.entries(protoFields)) {
      const jsonString = JSON.stringify(protoField.data);
      const blob = new Blob([jsonString], { type: 'application/json' });
      formData.append(key, blob, `${key}.json`);
    }
    
    return formData;
  }
}