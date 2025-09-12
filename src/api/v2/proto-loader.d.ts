/**
 * Proto Loader for V2 API (JSON-only implementation)
 *
 * This is a simplified version that works with JSON payloads only.
 * Protobuf support has been removed.
 */
interface MockMessageType {
    create: (data: unknown) => unknown;
    verify: (data: unknown) => null;
    encode: (message: unknown) => {
        finish: () => Uint8Array;
    };
    decode: (buffer: Uint8Array) => Record<string, unknown>;
    toObject: (message: unknown, options?: unknown) => unknown;
}
/**
 * ProtoLoader handles loading and validation of message definitions.
 * This implementation uses JSON exclusively instead of protobuf.
 */
export declare class ProtoLoader {
    private static instance;
    private constructor();
    /**
     * Get singleton instance of ProtoLoader
     */
    static getInstance(): ProtoLoader;
    /**
     * Mock load protos - returns immediately since we're using JSON
     */
    loadProtos(): Promise<Record<string, unknown>>;
    /**
     * Mock get message type - not needed for JSON
     */
    getMessageType(_packageName: string, _messageName: string): Promise<MockMessageType>;
    /**
     * Create and validate a message - just returns the data for JSON
     */
    createMessage(packageName: string, messageName: string, data: unknown): Promise<unknown>;
    /**
     * Encode a message - converts to JSON string then to Uint8Array
     */
    encodeMessage(_packageName: string, _messageName: string, data: unknown): Promise<Uint8Array>;
    /**
     * Decode a message - converts from Uint8Array to JSON
     */
    decodeMessage(_packageName: string, _messageName: string, buffer: Uint8Array): Promise<unknown>;
    /**
     * Convert a message to JSON
     */
    messageToJson(_packageName: string, _messageName: string, _data: unknown): Promise<string>;
    /**
     * Parse JSON to a message
     */
    jsonToMessage(_packageName: string, _messageName: string, json: string): Promise<unknown>;
    /**
     * Clear the cached proto definitions
     * No-op for JSON implementation
     */
    clearCache(): void;
}
export declare const protoLoader: ProtoLoader;
export {};
