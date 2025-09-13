import { describe, it, expect, vi, beforeEach } from 'vitest';
import fetchPrompts from './fetchPrompts';
import { getServiceURL } from './getServiceURL';

// Mock getServiceURL
vi.mock('./getServiceURL', () => ({
  getServiceURL: vi.fn(),
}));

// Mock global fetch
global.fetch = vi.fn();

describe('fetchPrompts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getServiceURL as any).mockReturnValue('https://api.example.com');
  });

  it('should fetch prompts successfully and sort them by version', async () => {
    // Arrange
    const mockToken = 'test-token-123';
    const mockResponse = {
      content_generation: [
        { version: 3, content: 'prompt3' },
        { version: 1, content: 'prompt1' },
        { version: 2, content: 'prompt2' },
      ],
      scrape_website: [
        { version: 2, content: 'scrape2' },
        { version: 1, content: 'scrape1' },
      ],
    };

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    // Act
    const result = await fetchPrompts(mockToken);

    // Assert
    expect(getServiceURL).toHaveBeenCalledWith('content-gen');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.com/api/v1/app_prompts',
      {
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      }
    );
    expect(result.content_generation).toEqual([
      { version: 1, content: 'prompt1' },
      { version: 2, content: 'prompt2' },
      { version: 3, content: 'prompt3' },
    ]);
    expect(result.scrape_website).toEqual([
      { version: 1, content: 'scrape1' },
      { version: 2, content: 'scrape2' },
    ]);
  });

  it('should return null when response is not ok', async () => {
    // Arrange
    const mockToken = 'test-token-123';
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 401,
    });

    // Act
    const result = await fetchPrompts(mockToken);

    // Assert
    expect(result).toBeNull();
  });

  it('should handle network errors gracefully', async () => {
    // Arrange
    const mockToken = 'test-token-123';
    const networkError = new Error('Network error');
    (global.fetch as any).mockRejectedValue(networkError);

    // Act & Assert
    await expect(fetchPrompts(mockToken)).rejects.toThrow('Network error');
  });

  it('should correctly construct the URL with the service URL', async () => {
    // Arrange
    const mockToken = 'test-token-123';
    const customServiceUrl = 'https://custom-api.example.com';
    (getServiceURL as any).mockReturnValue(customServiceUrl);
    
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        content_generation: [],
        scrape_website: [],
      }),
    });

    // Act
    await fetchPrompts(mockToken);

    // Assert
    expect(global.fetch).toHaveBeenCalledWith(
      `${customServiceUrl}/api/v1/app_prompts`,
      expect.any(Object)
    );
  });

  it('should handle empty prompt arrays', async () => {
    // Arrange
    const mockToken = 'test-token-123';
    const mockResponse = {
      content_generation: [],
      scrape_website: [],
    };

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    // Act
    const result = await fetchPrompts(mockToken);

    // Assert
    expect(result).toEqual({
      content_generation: [],
      scrape_website: [],
    });
  });

  it('should maintain original data properties while sorting', async () => {
    // Arrange
    const mockToken = 'test-token-123';
    const mockResponse = {
      content_generation: [
        { version: 2, content: 'prompt2', extra: 'data' },
        { version: 1, content: 'prompt1', meta: 'info' },
      ],
      scrape_website: [
        { version: 1, content: 'scrape1', type: 'basic' },
      ],
      other_field: 'should be preserved',
    };

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    // Act
    const result = await fetchPrompts(mockToken);

    // Assert
    expect(result.content_generation[0]).toEqual({
      version: 1,
      content: 'prompt1',
      meta: 'info',
    });
    expect(result.content_generation[1]).toEqual({
      version: 2,
      content: 'prompt2',
      extra: 'data',
    });
    expect(result.other_field).toBe('should be preserved');
  });
});