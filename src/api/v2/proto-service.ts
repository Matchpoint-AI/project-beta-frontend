/**
 * Base Proto Service for V2 API
 *
 * Provides base functionality for all V2 API services using protobuf.
 * This implements the requirements from frontend-protobuf-requirements.md.
 */
import { protoLoader } from './proto-loader';
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
 * Base class for all V2 API services using protobuf
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
   * Make a protobuf-based API request
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

    // Prepare headers
    const headers: Record<string, string> = {
      Accept: 'application/x-protobuf, application/json',
      ...options?.headers,
    };

    if (options?.token) {
      headers['Authorization'] = `Bearer ${options.token}`;
    }

    // Prepare request body if needed
    let body: BodyInit | undefined;

    if (requestData && requestMessagePath) {
      try {
        // Encode request data as protobuf
        const encodedData = await protoLoader.encodeMessage(
          requestMessagePath.package,
          requestMessagePath.message,
          requestData
        );

        body = encodedData;
        headers['Content-Type'] = 'application/x-protobuf';
      } catch (error) {
        // Fallback to JSON if protobuf encoding fails
        console.warn('Failed to encode as protobuf, falling back to JSON:', error);
        body = JSON.stringify(requestData);
        headers['Content-Type'] = 'application/json';
      }
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
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      // Parse response based on content type
      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/x-protobuf')) {
        // Decode protobuf response
        const buffer = await response.arrayBuffer();
        const decoded = await protoLoader.decodeMessage(
          responseMessagePath.package,
          responseMessagePath.message,
          new Uint8Array(buffer)
        );
        return decoded as TResponse;
      } else {
        // Parse as JSON (fallback)
        const json = await response.json();
        return json as TResponse;
      }
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
   * Make a GET request with protobuf support
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
   * Make a POST request with protobuf support
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
   * Make a PUT request with protobuf support
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
   * Make a DELETE request with protobuf support
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
   * Validate a message against its proto definition
   */
  protected async validateMessage(
    packageName: string,
    messageName: string,
    data: any
  ): Promise<string | null> {
    try {
      const messageType = await protoLoader.getMessageType(packageName, messageName);
      return messageType.verify(data);
    } catch (error) {
      return `Failed to validate message: ${error}`;
    }
  }

  /**
   * Create headers for multipart form data with protobuf
   */
  protected async createMultipartFormData(
    fields: Record<string, any>,
    protoFields: Record<string, { data: any; package: string; message: string }>
  ): Promise<FormData> {
    const formData = new FormData();

    // Add regular fields
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    }

    // Add protobuf fields
    for (const [key, protoField] of Object.entries(protoFields)) {
      try {
        const encoded = await protoLoader.encodeMessage(
          protoField.package,
          protoField.message,
          protoField.data
        );

        const blob = new Blob([encoded], { type: 'application/x-protobuf' });
        formData.append(key, blob, `${key}.pb`);
      } catch (error) {
        console.error(`Failed to encode proto field ${key}:`, error);
      }
    }

    return formData;
  }
}
