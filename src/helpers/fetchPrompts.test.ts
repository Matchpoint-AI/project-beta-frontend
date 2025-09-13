import { describe, it, expect, vi, beforeEach } from 'vitest';
import fetchPrompts from './fetchPrompts';
import * as getServiceURLModule from './getServiceURL';

// Mock the getServiceURL module
vi.mock('./getServiceURL', () => ({
  getServiceURL: vi.fn(),
}));

describe('fetchPrompts', () => {
  const mockToken = 'test-token-123';
  const mockServiceURL = 'https://api.example.com';
  const mockResponse = {
    content_generation: [
      { version: 3, id: 'cg-3' },
      { version: 1, id: 'cg-1' },
      { version: 2, id: 'cg-2' },
    ],
    scrape_website: [
      { version: 2, id: 'sw-2' },
      { version: 1, id: 'sw-1' },
      { version: 3, id: 'sw-3' },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    vi.mocked(getServiceURLModule.getServiceURL).mockReturnValue(mockServiceURL);
  });

  it('should fetch prompts successfully and sort by version', async () => {
    // Arrange
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    // Act
    const result = await fetchPrompts(mockToken);

    // Assert
    expect(getServiceURLModule.getServiceURL).toHaveBeenCalledWith('content-gen');
    expect(global.fetch).toHaveBeenCalledWith(`${mockServiceURL}/api/v1/app_prompts`, {
      headers: {
        Authorization: `Bearer ${mockToken}`,
      },
    });
    expect(result).toEqual({
      content_generation: [
        { version: 1, id: 'cg-1' },
        { version: 2, id: 'cg-2' },
        { version: 3, id: 'cg-3' },
      ],
      scrape_website: [
        { version: 1, id: 'sw-1' },
        { version: 2, id: 'sw-2' },
        { version: 3, id: 'sw-3' },
      ],
    });
  });

  it('should return null when response is not ok', async () => {
    // Arrange
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      status: 404,
    } as Response);

    // Act
    const result = await fetchPrompts(mockToken);

    // Assert
    expect(result).toBeNull();
    expect(getServiceURLModule.getServiceURL).toHaveBeenCalledWith('content-gen');
    expect(global.fetch).toHaveBeenCalledWith(`${mockServiceURL}/api/v1/app_prompts`, {
      headers: {
        Authorization: `Bearer ${mockToken}`,
      },
    });
  });

  it('should handle network errors', async () => {
    // Arrange
    vi.mocked(global.fetch).mockRejectedValue(new Error('Network error'));

    // Act & Assert
    await expect(fetchPrompts(mockToken)).rejects.toThrow('Network error');
    expect(getServiceURLModule.getServiceURL).toHaveBeenCalledWith('content-gen');
  });

  it('should handle empty arrays in response', async () => {
    // Arrange
    const emptyResponse = {
      content_generation: [],
      scrape_website: [],
    };
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(emptyResponse),
    } as Response);

    // Act
    const result = await fetchPrompts(mockToken);

    // Assert
    expect(result).toEqual({
      content_generation: [],
      scrape_website: [],
    });
  });

  it('should construct correct API URL', async () => {
    // Arrange
    const customServiceURL = 'https://custom.api.com';
    vi.mocked(getServiceURLModule.getServiceURL).mockReturnValue(customServiceURL);
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    // Act
    await fetchPrompts(mockToken);

    // Assert
    expect(global.fetch).toHaveBeenCalledWith(
      `${customServiceURL}/api/v1/app_prompts`,
      expect.any(Object)
    );
  });
});
