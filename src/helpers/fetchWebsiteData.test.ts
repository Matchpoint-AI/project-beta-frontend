import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchWebsiteData } from './fetchWebsiteData';
import { getServiceURL } from './getServiceURL';

// Mock the getServiceURL helper
vi.mock('./getServiceURL', () => ({
  getServiceURL: vi.fn(),
}));

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('fetchWebsiteData', () => {
  const mockSetProgressDescription = vi.fn();
  const mockLLMUrl = 'https://llm-dev-test.com';

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();

    // Setup default mocks
    (getServiceURL as any).mockReturnValue(mockLLMUrl);
  });

  it('should call getServiceURL with correct parameter', async () => {
    // Arrange
    const url = 'https://example.com';
    mockFetch.mockRejectedValue(new Error('Test error'));

    // Act
    try {
      await fetchWebsiteData(url, mockSetProgressDescription);
    } catch {
      // Expected to fail due to mock
    }

    // Assert
    expect(getServiceURL).toHaveBeenCalledWith('llm');
  });

  it('should call progress description callback', async () => {
    // Arrange
    const url = 'https://example.com';
    const mockWebsiteData = { content: 'Mock content' };
    
    mockFetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockWebsiteData),
      })
      .mockRejectedValueOnce(new Error('Second call fails'));

    // Act
    try {
      await fetchWebsiteData(url, mockSetProgressDescription);
    } catch {
      // Expected to fail on second call
    }

    // Assert
    expect(mockSetProgressDescription).toHaveBeenCalledWith('Extracting Physical Locations...');
  });

  it('should make API call with correct URL and parameters', async () => {
    // Arrange
    const url = 'https://example.com';
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    // Act
    try {
      await fetchWebsiteData(url, mockSetProgressDescription);
    } catch {
      // Expected to fail
    }

    // Assert
    expect(mockFetch).toHaveBeenCalledWith(`${mockLLMUrl}/api/v1/llm/fetch-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
  });

  it('should propagate fetch errors', async () => {
    // Arrange
    const url = 'https://example.com';
    const fetchError = new Error('Network error');

    mockFetch.mockRejectedValueOnce(fetchError);

    // Act & Assert
    await expect(fetchWebsiteData(url, mockSetProgressDescription)).rejects.toThrow('Network error');
    expect(getServiceURL).toHaveBeenCalledWith('llm');
    expect(mockSetProgressDescription).not.toHaveBeenCalled();
  });

  it('should handle successful data extraction', async () => {
    // Arrange
    const url = 'https://example.com';
    const mockWebsiteData = { content: 'Mock HTML content', title: 'Example Site' };
    const mockLocationResponse = [
      JSON.stringify({ Physical_locations: ['New York', 'Los Angeles'] }),
    ];

    mockFetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockWebsiteData),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockLocationResponse),
      });

    // Act
    const result = await fetchWebsiteData(url, mockSetProgressDescription);

    // Assert
    expect(result.data).toEqual(mockWebsiteData);
    expect(result.locations).toEqual(['New York', 'Los Angeles']);
    expect(mockSetProgressDescription).toHaveBeenCalledWith('Extracting Physical Locations...');
  });

  it('should handle empty location response', async () => {
    // Arrange
    const url = 'https://example.com';
    const mockWebsiteData = { content: 'Mock content without locations' };
    const mockLocationResponse = [JSON.stringify({ Physical_locations: [] })];

    mockFetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockWebsiteData),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockLocationResponse),
      });

    // Act
    const result = await fetchWebsiteData(url, mockSetProgressDescription);

    // Assert
    expect(result).toEqual({
      data: mockWebsiteData,
      locations: [],
    });
  });

  it('should use custom service URL', async () => {
    // Arrange
    const url = 'https://test-site.com';
    const customLLMUrl = 'https://custom-llm.com';
    
    (getServiceURL as any).mockReturnValue(customLLMUrl);
    mockFetch.mockRejectedValueOnce(new Error('Test error'));

    // Act
    try {
      await fetchWebsiteData(url, mockSetProgressDescription);
    } catch {
      // Expected to fail
    }

    // Assert
    expect(mockFetch).toHaveBeenCalledWith(`${customLLMUrl}/api/v1/llm/fetch-content`, expect.any(Object));
  });
});