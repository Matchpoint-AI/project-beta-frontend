/**
 * Proto Loader for V2 API (JSON-only implementation)
 * 
 * This is a simplified version that works with JSON payloads only.
 * Protobuf support has been removed.
 */

/**
 * ProtoLoader handles loading and validation of message definitions.
 * This implementation uses JSON exclusively instead of protobuf.
 */
export class ProtoLoader {
  private static instance: ProtoLoader;

  private constructor() {}

  /**
   * Get singleton instance of ProtoLoader
   */
  static getInstance(): ProtoLoader {
    if (!ProtoLoader.instance) {
      ProtoLoader.instance = new ProtoLoader();
    }
    return ProtoLoader.instance;
  }

  /**
   * Mock load protos - returns immediately since we're using JSON
   */
  async loadProtos(): Promise<any> {
    // No-op for JSON implementation
    return {};
  }

  /**
   * Mock get message type - not needed for JSON
   */
  async getMessageType(packageName: string, messageName: string): Promise<any> {
    // Return a mock type object that satisfies the interface
    return {
      create: (data: any) => data,
      verify: (data: any) => null, // No errors in JSON mode
      encode: (message: any) => ({
        finish: () => new Uint8Array(0)
      }),
      decode: (buffer: Uint8Array) => ({}),
      toObject: (message: any, options?: any) => message
    };
  }

  /**
   * Create and validate a message - just returns the data for JSON
   */
  async createMessage(
    packageName: string,
    messageName: string,
    data: any
  ): Promise<any> {
    // In JSON mode, just return the data as-is
    return data;
  }

  /**
   * Encode a message - converts to JSON string then to Uint8Array
   */
  async encodeMessage(
    packageName: string,
    messageName: string,
    data: any
  ): Promise<Uint8Array> {
    const jsonString = JSON.stringify(data);
    const encoder = new TextEncoder();
    return encoder.encode(jsonString);
  }

  /**
   * Decode a message - converts from Uint8Array to JSON
   */
  async decodeMessage(
    packageName: string,
    messageName: string,
    buffer: Uint8Array
  ): Promise<any> {
    const decoder = new TextDecoder();
    const jsonString = decoder.decode(buffer);
    return JSON.parse(jsonString);
  }

  /**
   * Convert a message to JSON
   */
  async messageToJson(
    packageName: string,
    messageName: string,
    data: any
  ): Promise<string> {
    return JSON.stringify(data);
  }

  /**
   * Parse JSON to a message
   */
  async jsonToMessage(
    packageName: string,
    messageName: string,
    json: string
  ): Promise<any> {
    return JSON.parse(json);
  }

  /**
   * Clear the cached proto definitions
   * No-op for JSON implementation
   */
  clearCache(): void {
    // No cache to clear in JSON mode
  }
}

// Export singleton instance
export const protoLoader = ProtoLoader.getInstance();