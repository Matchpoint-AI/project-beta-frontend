import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import scrapeProduct from './scrapeProduct';
import { getServiceURL } from '../../../helpers/getServiceURL';

// Mock the getServiceURL helper
vi.mock('../../../helpers/getServiceURL', () => ({
  getServiceURL: vi.fn(),
}));

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('scrapeProduct', () => {
  const mockEndpoint = 'https://llm-service.example.com';
  const mockUrl = 'https://example.com/product';
  const mockName = 'Test Product';
  const mockDescription = 'A great test product';

  beforeEach(() => {
    vi.mocked(getServiceURL).mockReturnValue(mockEndpoint);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('successful scraping with URL', () => {
    it('should successfully scrape product from URL', async () => {
      // Arrange
      const mockResponse = {
        name: 'Scraped Product',
        description: 'Scraped description',
        product_features: ['feature1', 'feature2', 'feature3'],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act
      const result = await scrapeProduct(mockUrl);

      // Assert
      expect(getServiceURL).toHaveBeenCalledWith('llm');
      expect(mockFetch).toHaveBeenCalledWith(
        `${mockEndpoint}/api/v1/llm/fetch-content`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: mockUrl,
            subject: 'product',
          }),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle URL with fallback to provided name', async () => {
      // Arrange
      const mockResponse = {
        description: 'Scraped description',
        product_features: ['feature1', 'feature2'],
        // No name in response
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act
      const result = await scrapeProduct(mockUrl, mockName);

      // Assert
      expect(result).toEqual({
        name: mockName, // Should use provided name as fallback
        description: 'Scraped description',
        product_features: ['feature1', 'feature2'],
      });
    });

    it('should handle URL with fallback to provided description', async () => {
      // Arrange
      const mockResponse = {
        name: 'Scraped Product',
        product_features: ['feature1'],
        // No description in response
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act
      const result = await scrapeProduct(mockUrl, undefined, mockDescription);

      // Assert
      expect(result).toEqual({
        name: 'Scraped Product',
        description: mockDescription, // Should use provided description as fallback
        product_features: ['feature1'],
      });
    });
  });

  describe('successful scraping with name/description', () => {
    it('should successfully scrape product from name and description', async () => {
      // Arrange
      const mockResponse = {
        name: 'Enhanced Product Name',
        description: 'Enhanced description',
        product_features: ['feature1', 'feature2'],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act
      const result = await scrapeProduct(undefined, mockName, mockDescription);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        `${mockEndpoint}/api/v1/llm/fetch-content`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: mockName,
            description: mockDescription,
            subject: 'product',
          }),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should scrape with only name provided', async () => {
      // Arrange
      const mockResponse = {
        name: mockName,
        description: 'Generated description',
        product_features: ['feature1'],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act
      const result = await scrapeProduct(undefined, mockName);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        `${mockEndpoint}/api/v1/llm/fetch-content`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: mockName,
            description: undefined,
            subject: 'product',
          }),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should scrape with only description provided', async () => {
      // Arrange
      const mockResponse = {
        name: 'Generated Product Name',
        description: mockDescription,
        product_features: ['feature1'],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act
      const result = await scrapeProduct(undefined, undefined, mockDescription);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        `${mockEndpoint}/api/v1/llm/fetch-content`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: undefined,
            description: mockDescription,
            subject: 'product',
          }),
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('product features handling', () => {
    it('should handle product_features array correctly', async () => {
      // Arrange
      const mockResponse = {
        name: mockName,
        description: mockDescription,
        product_features: ['feature1', 'feature2', 'feature3'],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act
      const result = await scrapeProduct(mockUrl);

      // Assert
      expect(result.product_features).toEqual(['feature1', 'feature2', 'feature3']);
    });

    it('should handle key_features as fallback to product_features', async () => {
      // Arrange
      const mockResponse = {
        name: mockName,
        description: mockDescription,
        key_features: ['key1', 'key2'], // Using key_features instead
        // No product_features
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act
      const result = await scrapeProduct(mockUrl);

      // Assert
      expect(result.product_features).toEqual(['key1', 'key2']);
    });

    it('should handle empty features arrays', async () => {
      // Arrange
      const mockResponse = {
        name: mockName,
        description: mockDescription,
        product_features: [],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act
      const result = await scrapeProduct(mockUrl);

      // Assert
      expect(result.product_features).toEqual([]);
    });

    it('should handle missing features fields', async () => {
      // Arrange
      const mockResponse = {
        name: mockName,
        description: mockDescription,
        // No product_features or key_features
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act
      const result = await scrapeProduct(mockUrl);

      // Assert
      expect(result.product_features).toEqual([]);
    });

    it('should handle non-array features', async () => {
      // Arrange
      const mockResponse = {
        name: mockName,
        description: mockDescription,
        product_features: 'not an array',
        key_features: 'also not an array',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act
      const result = await scrapeProduct(mockUrl);

      // Assert
      expect(result.product_features).toEqual([]);
    });
  });

  describe('error handling', () => {
    it('should throw error when no input provided', async () => {
      // Act & Assert
      await expect(scrapeProduct()).rejects.toThrow('No product URL or name/description provided');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should throw error when all inputs are empty', async () => {
      // Act & Assert
      await expect(scrapeProduct('', '', '')).rejects.toThrow('No product URL or name/description provided');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should throw error when response is not ok', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: vi.fn().mockResolvedValue('Bad Request Error'),
      });

      // Act & Assert
      await expect(scrapeProduct(mockUrl)).rejects.toThrow('HTTP error! status: 400, message: Bad Request Error');
    });

    it('should throw error when response is not ok with JSON error', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: vi.fn().mockResolvedValue('{"error": "Internal Server Error"}'),
      });

      // Act & Assert
      await expect(scrapeProduct(mockUrl)).rejects.toThrow('HTTP error! status: 500, message: {"error": "Internal Server Error"}');
    });

    it('should throw error when no data in response', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(null),
      });

      // Act & Assert
      await expect(scrapeProduct(mockUrl)).rejects.toThrow('No data found in response');
    });

    it('should throw error when no product name found', async () => {
      // Arrange
      const mockResponse = {
        description: mockDescription,
        product_features: ['feature1'],
        // No name field and no fallback provided
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act & Assert
      await expect(scrapeProduct(mockUrl)).rejects.toThrow('No product name found in response');
    });

    it('should throw error when product name is empty string', async () => {
      // Arrange
      const mockResponse = {
        name: '   ', // Whitespace only
        description: mockDescription,
        product_features: ['feature1'],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act & Assert
      await expect(scrapeProduct(mockUrl)).rejects.toThrow('No product name found in response');
    });

    it('should handle network errors', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      // Act & Assert
      await expect(scrapeProduct(mockUrl)).rejects.toThrow('Network error');
    });

    it('should handle JSON parsing errors', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
      });

      // Act & Assert
      await expect(scrapeProduct(mockUrl)).rejects.toThrow('Invalid JSON');
    });
  });

  describe('input validation and edge cases', () => {
    it('should handle empty URL but with name/description', async () => {
      // Arrange
      const mockResponse = {
        name: mockName,
        description: mockDescription,
        product_features: ['feature1'],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act
      const result = await scrapeProduct('', mockName, mockDescription);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        `${mockEndpoint}/api/v1/llm/fetch-content`,
        expect.objectContaining({
          body: JSON.stringify({
            name: mockName,
            description: mockDescription,
            subject: 'product',
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle undefined URL but with name/description', async () => {
      // Arrange
      const mockResponse = {
        name: mockName,
        description: mockDescription,
        product_features: ['feature1'],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act
      const result = await scrapeProduct(undefined, mockName, mockDescription);

      // Assert
      expect(result).toEqual(mockResponse);
    });

    it('should handle special characters in inputs', async () => {
      // Arrange
      const specialUrl = 'https://example.com/产品?id=123&special=!@#$%^&*()';
      const specialName = 'Spéciál Prodüct Ñamé';
      const specialDescription = 'Descripción with émojis 🎉 and symbols @#$%';
      const mockResponse = {
        name: specialName,
        description: specialDescription,
        product_features: ['feature1'],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act
      const result = await scrapeProduct(specialUrl, specialName, specialDescription);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({
            url: specialUrl,
            subject: 'product',
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle very long inputs', async () => {
      // Arrange
      const longUrl = 'https://example.com/' + 'a'.repeat(1000);
      const longName = 'A'.repeat(500);
      const longDescription = 'D'.repeat(2000);
      const mockResponse = {
        name: longName,
        description: longDescription,
        product_features: ['feature1'],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act
      const result = await scrapeProduct(longUrl, longName, longDescription);

      // Assert
      expect(result).toEqual(mockResponse);
    });
  });

  describe('service URL integration', () => {
    it('should call getServiceURL with correct service name', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          name: mockName,
          description: mockDescription,
          product_features: [],
        }),
      });

      // Act
      await scrapeProduct(mockUrl);

      // Assert
      expect(getServiceURL).toHaveBeenCalledWith('llm');
    });

    it('should construct correct endpoint URL', async () => {
      // Arrange
      const customEndpoint = 'https://custom-llm-service.example.com';
      vi.mocked(getServiceURL).mockReturnValue(customEndpoint);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          name: mockName,
          description: mockDescription,
          product_features: [],
        }),
      });

      // Act
      await scrapeProduct(mockUrl);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        `${customEndpoint}/api/v1/llm/fetch-content`,
        expect.any(Object)
      );
    });
  });

  describe('response data consistency', () => {
    it('should ensure consistent field naming and structure', async () => {
      // Arrange
      const mockResponse = {
        name: 'Product Name',
        description: 'Product Description',
        product_features: ['f1', 'f2'],
        extra_field: 'should be ignored in validation',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act
      const result = await scrapeProduct(mockUrl, 'fallback-name', 'fallback-desc');

      // Assert
      expect(result).toHaveProperty('name', 'Product Name');
      expect(result).toHaveProperty('description', 'Product Description');
      expect(result).toHaveProperty('product_features', ['f1', 'f2']);
      expect(Array.isArray(result.product_features)).toBe(true);
    });

    it('should handle mixed response data types', async () => {
      // Arrange
      const mockResponse = {
        name: 123, // Number instead of string - but function checks if name.trim() === ''
        description: null, // Null instead of string
        product_features: 'string instead of array',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act & Assert - Since name is not a string, name.trim() will fail
      await expect(scrapeProduct(mockUrl, 'fallback-name', 'fallback-desc')).rejects.toThrow();
    });
  });
});