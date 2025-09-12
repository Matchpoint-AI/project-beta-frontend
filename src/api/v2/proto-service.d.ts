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
export declare abstract class ProtoService {
    protected serviceName: string;
    protected baseUrl: string;
    protected defaultTimeout: number;
    constructor(config: ProtoServiceConfig);
    /**
     * Make a JSON-based API request
     */
    protected makeProtoRequest<TRequest, TResponse>(method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH', endpoint: string, requestData: TRequest | null, requestMessagePath: {
        package: string;
        message: string;
    } | null, responseMessagePath: {
        package: string;
        message: string;
    }, options?: RequestOptions): Promise<TResponse>;
    /**
     * Make a GET request with JSON support
     */
    protected get<TResponse>(endpoint: string, responseMessagePath: {
        package: string;
        message: string;
    }, options?: RequestOptions): Promise<TResponse>;
    /**
     * Make a POST request with JSON support
     */
    protected post<TRequest, TResponse>(endpoint: string, data: TRequest, requestMessagePath: {
        package: string;
        message: string;
    }, responseMessagePath: {
        package: string;
        message: string;
    }, options?: RequestOptions): Promise<TResponse>;
    /**
     * Make a PUT request with JSON support
     */
    protected put<TRequest, TResponse>(endpoint: string, data: TRequest, requestMessagePath: {
        package: string;
        message: string;
    }, responseMessagePath: {
        package: string;
        message: string;
    }, options?: RequestOptions): Promise<TResponse>;
    /**
     * Make a DELETE request with JSON support
     */
    protected delete<TResponse>(endpoint: string, responseMessagePath: {
        package: string;
        message: string;
    }, options?: RequestOptions): Promise<TResponse>;
    /**
     * Handle error responses
     */
    private handleErrorResponse;
    /**
     * Validate a message - always returns null for JSON
     */
    protected validateMessage(_packageName: string, _messageName: string, _data: unknown): Promise<string | null>;
    /**
     * Create headers for multipart form data
     */
    protected createMultipartFormData(fields: Record<string, unknown>, protoFields: Record<string, {
        data: unknown;
        package: string;
        message: string;
    }>): Promise<FormData>;
}
