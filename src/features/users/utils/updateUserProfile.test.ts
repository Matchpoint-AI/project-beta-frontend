import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import updateUserProfile from './updateUserProfile';
import { getServiceURL } from '../../../helpers/getServiceURL';

// Mock the getServiceURL helper
vi.mock('../../../helpers/getServiceURL', () => ({
  getServiceURL: vi.fn(),
}));

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('updateUserProfile', () => {
  const mockEndpoint = 'https://api.example.com';
  const mockToken = 'test-token-123';
  const mockName = 'John Doe';
  const mockEmail = 'john@example.com';
  const mockPassword = 'newPassword123';

  beforeEach(() => {
    vi.mocked(getServiceURL).mockReturnValue(mockEndpoint);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('successful profile update', () => {
    it('should successfully update user profile with all fields', async () => {
      // Arrange
      const mockResponse = {
        email: mockEmail,
        name: mockName,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act
      const result = await updateUserProfile(mockToken, mockName, mockEmail, mockPassword);

      // Assert
      expect(getServiceURL).toHaveBeenCalledWith('data');
      expect(mockFetch).toHaveBeenCalledWith(`${mockEndpoint}/api/v1/user/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`,
        },
        body: JSON.stringify({
          name: mockName,
          email: mockEmail,
          password: mockPassword,
        }),
      });
      expect(result).toEqual(mockResponse);
    });

    it('should update profile without password when password is empty', async () => {
      // Arrange
      const mockResponse = {
        email: mockEmail,
        name: mockName,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act
      const result = await updateUserProfile(mockToken, mockName, mockEmail, '');

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        `${mockEndpoint}/api/v1/user/update`,
        expect.objectContaining({
          body: JSON.stringify({
            name: mockName,
            email: mockEmail,
            password: undefined,
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle undefined password', async () => {
      // Arrange
      const mockResponse = {
        email: mockEmail,
        name: mockName,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act
      const result = await updateUserProfile(mockToken, mockName, mockEmail, undefined as any);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        `${mockEndpoint}/api/v1/user/update`,
        expect.objectContaining({
          body: JSON.stringify({
            name: mockName,
            email: mockEmail,
            password: undefined,
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle null password', async () => {
      // Arrange
      const mockResponse = {
        email: mockEmail,
        name: mockName,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act
      const result = await updateUserProfile(mockToken, mockName, mockEmail, null as any);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        `${mockEndpoint}/api/v1/user/update`,
        expect.objectContaining({
          body: JSON.stringify({
            name: mockName,
            email: mockEmail,
            password: undefined,
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('error handling', () => {
    it('should throw error when response is not ok', async () => {
      // Arrange
      const errorDetail = 'Email already exists';
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: vi.fn().mockResolvedValue({ detail: errorDetail }),
      });

      // Act & Assert
      await expect(updateUserProfile(mockToken, mockName, mockEmail, mockPassword)).rejects.toThrow(
        errorDetail
      );
    });

    it('should handle network errors', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      // Act & Assert
      await expect(updateUserProfile(mockToken, mockName, mockEmail, mockPassword)).rejects.toThrow(
        'Network error'
      );
    });

    it('should handle JSON parsing errors in error response', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
      });

      // Act & Assert
      await expect(updateUserProfile(mockToken, mockName, mockEmail, mockPassword)).rejects.toThrow(
        'Invalid JSON'
      );
    });

    it('should handle missing error detail in response', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: vi.fn().mockResolvedValue({}), // No detail field
      });

      // Act & Assert
      await expect(
        updateUserProfile(mockToken, mockName, mockEmail, mockPassword)
      ).rejects.toThrow(); // Will throw with undefined detail
    });
  });

  describe('input validation and edge cases', () => {
    it('should handle empty token', async () => {
      // Arrange
      const mockResponse = { email: mockEmail, name: mockName };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act
      const result = await updateUserProfile('', mockName, mockEmail, mockPassword);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer ',
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle empty name', async () => {
      // Arrange
      const mockResponse = { email: mockEmail, name: '' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act
      const result = await updateUserProfile(mockToken, '', mockEmail, mockPassword);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({
            name: '',
            email: mockEmail,
            password: mockPassword,
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle empty email', async () => {
      // Arrange
      const mockResponse = { email: '', name: mockName };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act
      const result = await updateUserProfile(mockToken, mockName, '', mockPassword);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({
            name: mockName,
            email: '',
            password: mockPassword,
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle special characters in input', async () => {
      // Arrange
      const specialName = "João José O'Connor";
      const specialEmail = 'joão+test@example.com';
      const specialPassword = 'P@ssw0rd!@#$%^&*()';
      const mockResponse = { email: specialEmail, name: specialName };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act
      const result = await updateUserProfile(mockToken, specialName, specialEmail, specialPassword);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({
            name: specialName,
            email: specialEmail,
            password: specialPassword,
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle very long input strings', async () => {
      // Arrange
      const longName = 'A'.repeat(1000);
      const longEmail = 'a'.repeat(100) + '@example.com';
      const longPassword = 'P'.repeat(100);
      const mockResponse = { email: longEmail, name: longName };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act
      const result = await updateUserProfile(mockToken, longName, longEmail, longPassword);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({
            name: longName,
            email: longEmail,
            password: longPassword,
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('service URL integration', () => {
    it('should call getServiceURL with correct service name', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ email: mockEmail, name: mockName }),
      });

      // Act
      await updateUserProfile(mockToken, mockName, mockEmail, mockPassword);

      // Assert
      expect(getServiceURL).toHaveBeenCalledWith('data');
    });

    it('should construct correct endpoint URL', async () => {
      // Arrange
      const customEndpoint = 'https://custom-api.example.com';
      vi.mocked(getServiceURL).mockReturnValue(customEndpoint);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ email: mockEmail, name: mockName }),
      });

      // Act
      await updateUserProfile(mockToken, mockName, mockEmail, mockPassword);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        `${customEndpoint}/api/v1/user/update`,
        expect.any(Object)
      );
    });
  });

  describe('response data types', () => {
    it('should return typed response data', async () => {
      // Arrange
      const mockResponse = {
        email: mockEmail,
        name: mockName,
        additionalField: 'extra data', // Additional fields should be preserved
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act
      const result = await updateUserProfile(mockToken, mockName, mockEmail, mockPassword);

      // Assert
      expect(result).toEqual(mockResponse);
      expect(result.email).toBe(mockEmail);
      expect(result.name).toBe(mockName);
    });

    it('should handle empty response data', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({}),
      });

      // Act
      const result = await updateUserProfile(mockToken, mockName, mockEmail, mockPassword);

      // Assert
      expect(result).toEqual({});
    });

    it('should handle null response data', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(null),
      });

      // Act
      const result = await updateUserProfile(mockToken, mockName, mockEmail, mockPassword);

      // Assert
      expect(result).toBe(null);
    });
  });
});
