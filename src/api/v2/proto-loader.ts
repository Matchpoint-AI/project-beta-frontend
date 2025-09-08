/**
 * Proto Loader for V2 API
 * 
 * Dynamically loads protobuf definitions at runtime using protobuf.js.
 * This follows the requirements specified in frontend-protobuf-requirements.md.
 */
import * as protobuf from 'protobufjs';

// Conditionally import runfiles only in Bazel environment
let runfiles: any;
try {
  // This will only work in Bazel environment
  runfiles = require('@bazel/runfiles').runfiles;
} catch {
  // Not in Bazel environment, runfiles will be undefined
  runfiles = undefined;
}

/**
 * ProtoLoader handles dynamic loading of protobuf definitions.
 * All proto files are loaded dynamically at runtime to allow for proto updates
 * without requiring frontend rebuilds.
 */
export class ProtoLoader {
  private static instance: ProtoLoader;
  private root: protobuf.Root | null = null;
  private isLoading = false;
  private loadPromise: Promise<protobuf.Root> | null = null;

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
   * Load all proto definitions needed for V2 API
   * Uses Bazel runfiles to resolve proto file paths correctly
   */
  async loadProtos(): Promise<protobuf.Root> {
    // Return cached root if already loaded
    if (this.root) {
      return this.root;
    }

    // Return existing promise if loading is in progress
    if (this.isLoading && this.loadPromise) {
      return this.loadPromise;
    }

    // Start loading
    this.isLoading = true;
    this.loadPromise = this.doLoadProtos();

    try {
      this.root = await this.loadPromise;
      return this.root;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Internal method to load proto files
   */
  private async doLoadProtos(): Promise<protobuf.Root> {
    const root = new protobuf.Root();

    // List of proto files to load for V2 API
    const protoFiles = [
      'protos/entities.proto',
      'protos/campaigns.proto',
      'protos/brand.proto',
      'protos/generation.proto',
      'protos/policy.proto',
      'protos/quality.proto',
      'protos/progress.proto',
      'protos/publishing.proto',
      'protos/crawler.proto',
      'protos/extractor.proto',
      'protos/prompt.proto',
      'protos/admin.proto',
      'protos/moderation.proto',
      'protos/distribution.proto'
    ];

    // Check if we're in a Bazel environment with runfiles available
    const hasRunfiles = typeof runfiles !== 'undefined' && runfiles && runfiles.resolveWorkspaceRelative;
    
    // Only attempt to load proto files if we have a way to resolve them
    if (hasRunfiles) {
      for (const protoFile of protoFiles) {
        try {
          const protoPath = runfiles.resolveWorkspaceRelative(protoFile);
          await root.load(protoPath);
        } catch (error) {
          console.warn(`Failed to load proto file ${protoFile}:`, error);
          // Continue loading other files even if one fails
        }
      }
      
      // Resolve all references
      try {
        root.resolveAll();
      } catch (error) {
        console.warn('Failed to resolve proto references:', error);
      }
    } else {
      // In non-Bazel environments (tests, dev), we'll use JSON fallback
      console.info('Proto files not available - using JSON API fallback');
    }

    return root;
  }

  /**
   * Get a specific message type from loaded protos
   */
  async getMessageType(packageName: string, messageName: string): Promise<protobuf.Type> {
    const root = await this.loadProtos();
    const fullName = `${packageName}.${messageName}`;
    const messageType = root.lookupType(fullName);
    
    if (!messageType) {
      throw new Error(`Message type ${fullName} not found in loaded protos`);
    }
    
    return messageType;
  }

  /**
   * Create and validate a message
   */
  async createMessage(
    packageName: string,
    messageName: string,
    data: any
  ): Promise<protobuf.Message> {
    const messageType = await this.getMessageType(packageName, messageName);
    
    // Create the message
    const message = messageType.create(data);
    
    // Verify the message
    const error = messageType.verify(message);
    if (error) {
      throw new Error(`Invalid message: ${error}`);
    }
    
    return message;
  }

  /**
   * Encode a message to binary format
   */
  async encodeMessage(
    packageName: string,
    messageName: string,
    data: any
  ): Promise<Uint8Array> {
    const messageType = await this.getMessageType(packageName, messageName);
    
    // Create and verify the message
    const message = messageType.create(data);
    const error = messageType.verify(message);
    if (error) {
      throw new Error(`Invalid message: ${error}`);
    }
    
    // Encode to binary
    return messageType.encode(message).finish();
  }

  /**
   * Decode a binary message
   */
  async decodeMessage(
    packageName: string,
    messageName: string,
    buffer: Uint8Array
  ): Promise<any> {
    const messageType = await this.getMessageType(packageName, messageName);
    
    // Decode the message
    const message = messageType.decode(buffer);
    
    // Convert to plain object
    return messageType.toObject(message, {
      longs: String,
      enums: String,
      bytes: String,
      defaults: true,
      arrays: true,
      objects: true,
      oneofs: true
    });
  }

  /**
   * Convert a message to JSON
   */
  async messageToJson(
    packageName: string,
    messageName: string,
    data: any
  ): Promise<string> {
    const message = await this.createMessage(packageName, messageName, data);
    const messageType = await this.getMessageType(packageName, messageName);
    
    const jsonObj = messageType.toObject(message as any, {
      longs: String,
      enums: String,
      bytes: String,
      defaults: true,
      arrays: true,
      objects: true,
      oneofs: true
    });
    
    return JSON.stringify(jsonObj);
  }

  /**
   * Parse JSON to a message
   */
  async jsonToMessage(
    packageName: string,
    messageName: string,
    json: string
  ): Promise<protobuf.Message> {
    const data = JSON.parse(json);
    return this.createMessage(packageName, messageName, data);
  }

  /**
   * Clear the cached proto definitions
   * Useful for testing or when proto files are updated
   */
  clearCache(): void {
    this.root = null;
    this.loadPromise = null;
    this.isLoading = false;
  }
}

// Export singleton instance
export const protoLoader = ProtoLoader.getInstance();