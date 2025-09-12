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

  it('should successfully fetch website data and extract locations', async () => {
    // Arrange
    const url = 'https://example.com';
    const mockWebsiteData = { content: 'Mock HTML content', title: 'Example Site' };
    const mockLocationResponse = [
      JSON.stringify({ Physical_locations: ['New York', 'Los Angeles'] }),
      JSON.stringify({ Physical_locations: ['Chicago'] })
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
    expect(getServiceURL).toHaveBeenCalledWith('llm');
    
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch).toHaveBeenNthCalledWith(1, `${mockLLMUrl}/api/v1/llm/fetch-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    expect(mockSetProgressDescription).toHaveBeenCalledWith('Extracting Physical Locations...');

    expect(mockFetch).toHaveBeenNthCalledWith(2, `${mockLLMUrl}/api/v1/llm/physical-locations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: expect.stringContaining('Please extract the physical locations'),
        htmlcontent: mockWebsiteData,
      }),
    });

    expect(result).toEqual({
      data: mockWebsiteData,
      locations: ['New York', 'Los Angeles', 'Chicago'],
    });
  });

  it('should handle empty location extraction response', async () => {
    // Arrange
    const url = 'https://example.com';
    const mockWebsiteData = { content: 'Mock content without locations' };
    const mockLocationResponse = [
      JSON.stringify({ Physical_locations: [] })
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
    expect(result).toEqual({
      data: mockWebsiteData,
      locations: [],
    });
  });

  it('should handle missing Physical_locations property', async () => {
    // Arrange
    const url = 'https://example.com';
    const mockWebsiteData = { content: 'Mock content' };
    const mockLocationResponse = [
      JSON.stringify({ other_data: 'no locations' })
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
    expect(result).toEqual({
      data: mockWebsiteData,
      locations: [],
    });
  });

  it('should combine multiple location arrays correctly', async () => {
    // Arrange
    const url = 'https://example.com';
    const mockWebsiteData = { content: 'Mock content' };
    const mockLocationResponse = [
      JSON.stringify({ Physical_locations: ['Tokyo', 'Osaka'] }),
      JSON.stringify({ Physical_locations: ['London', 'Manchester'] }),
      JSON.stringify({ Physical_locations: [] }),
      JSON.stringify({ Physical_locations: ['Sydney'] })
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
    expect(result.locations).toEqual(['Tokyo', 'Osaka', 'London', 'Manchester', 'Sydney']);
  });

  it('should propagate fetch errors for website data', async () => {
    // Arrange
    const url = 'https://example.com';
    const fetchError = new Error('Network error');

    mockFetch.mockRejectedValueOnce(fetchError);

    // Act & Assert
    await expect(fetchWebsiteData(url, mockSetProgressDescription)).rejects.toThrow('Network error');
    expect(getServiceURL).toHaveBeenCalledWith('llm');
    expect(mockSetProgressDescription).not.toHaveBeenCalled();
  });

  it('should propagate fetch errors for location extraction', async () => {
    // Arrange
    const url = 'https://example.com';
    const mockWebsiteData = { content: 'Mock content' };
    const locationError = new Error('Location API error');

    mockFetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockWebsiteData),
      })
      .mockRejectedValueOnce(locationError);

    // Act & Assert
    await expect(fetchWebsiteData(url, mockSetProgressDescription)).rejects.toThrow('Location API error');
    expect(mockSetProgressDescription).toHaveBeenCalledWith('Extracting Physical Locations...');
  });

  it('should handle JSON parsing errors in location extraction', async () => {
    // Arrange
    const url = 'https://example.com';
    const mockWebsiteData = { content: 'Mock content' };
    const invalidJsonResponse = ['invalid json string'];

    mockFetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockWebsiteData),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(invalidJsonResponse),
      });

    // Act & Assert
    await expect(fetchWebsiteData(url, mockSetProgressDescription)).rejects.toThrow();
  });

  it('should call setProgressDescription at the correct time', async () => {
    // Arrange
    const url = 'https://example.com';
    const mockWebsiteData = { content: 'Mock content' };
    const mockLocationResponse = [JSON.stringify({ Physical_locations: [] })];

    mockFetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockWebsiteData),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockLocationResponse),
      });

    // Act
    await fetchWebsiteData(url, mockSetProgressDescription);

    // Assert - Progress should be called after first fetch but before second
    const fetchCallOrder = mockFetch.mock.invocationCallOrder;
    const progressCallOrder = mockSetProgressDescription.mock.invocationCallOrder;
    
    expect(progressCallOrder[0]).toBeGreaterThan(fetchCallOrder[0]);
    expect(progressCallOrder[0]).toBeLessThan(fetchCallOrder[1]);
  });

  it('should use correct API endpoints', async () => {
    // Arrange
    const url = 'https://test-site.com';
    const customLLMUrl = 'https://custom-llm.com';
    const mockWebsiteData = { content: 'test' };
    const mockLocationResponse = [JSON.stringify({ Physical_locations: [] })];

    (getServiceURL as any).mockReturnValue(customLLMUrl);

    mockFetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockWebsiteData),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockLocationResponse),
      });

    // Act
    await fetchWebsiteData(url, mockSetProgressDescription);

    // Assert
    expect(mockFetch).toHaveBeenNthCalledWith(1, `${customLLMUrl}/api/v1/llm/fetch-content`, expect.any(Object));
    expect(mockFetch).toHaveBeenNthCalledWith(2, `${customLLMUrl}/api/v1/llm/physical-locations`, expect.any(Object));
  });

  it('should pass the correct prompt structure for location extraction', async () => {
    // Arrange
    const url = 'https://example.com';
    const mockWebsiteData = { content: 'Mock content' };
    const mockLocationResponse = [JSON.stringify({ Physical_locations: [] })];

    mockFetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockWebsiteData),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockLocationResponse),
      });

    // Act
    await fetchWebsiteData(url, mockSetProgressDescription);

    // Assert
    const secondCallBody = JSON.parse(mockFetch.mock.calls[1][1].body);
    expect(secondCallBody.prompt).toContain('Please extract the physical locations');
    expect(secondCallBody.prompt).toContain('Physical_locations');
    expect(secondCallBody.prompt).toContain('JSON output');
    expect(secondCallBody.htmlcontent).toEqual(mockWebsiteData);
  });
});