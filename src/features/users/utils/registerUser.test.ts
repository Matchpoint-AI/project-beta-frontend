import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import registerUser from './registerUser';
import { getServiceURL } from '../../../helpers/getServiceURL';
import posthog from '../../../helpers/posthog';

// Mock the dependencies
vi.mock('../../../helpers/getServiceURL', () => ({
  getServiceURL: vi.fn(),
}));

vi.mock('../../../helpers/posthog', () => ({
  default: {
    __loaded: true,
    capture: vi.fn(),
  },
}));

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('registerUser', () => {
  const mockEndpoint = 'https://api.example.com';
  const mockEmail = 'test@example.com';
  const mockName = 'John Doe';
  const mockPassword = 'password123';

  beforeEach(() => {
    vi.mocked(getServiceURL).mockReturnValue(mockEndpoint);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('successful user registration', () => {
    it('should successfully register user and capture analytics', async () => {
      // Arrange
      const mockResponse = {
        id: 'user-123',
        email: mockEmail,
        name: mockName,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act
      const result = await registerUser(mockEmail, mockName, mockPassword);

      // Assert
      expect(getServiceURL).toHaveBeenCalledWith('data');
      expect(mockFetch).toHaveBeenCalledWith(`${mockEndpoint}/api/v1/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: mockEmail,
          name: mockName,
          password: mockPassword,
        }),
      });
      expect(posthog.capture).toHaveBeenCalledWith('User Signed Up', {
        distinct_id: 'user-123',
        email: mockEmail,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle registration without analytics when posthog is not loaded', async () => {
      // Arrange
      const mockResponse = {
        id: 'user-456',
        email: mockEmail,
        name: mockName,
      };

      vi.mocked(posthog).__loaded = false;

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act
      const result = await registerUser(mockEmail, mockName, mockPassword);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        `${mockEndpoint}/api/v1/user/register`,
        expect.any(Object)
      );
      expect(posthog.capture).not.toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });

    it('should handle response without id field gracefully', async () => {
      // Arrange
      const mockResponse = {
        email: mockEmail,
        name: mockName,
        // No id field
      };

      vi.mocked(posthog).__loaded = true;

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act
      const result = await registerUser(mockEmail, mockName, mockPassword);

      // Assert
      expect(posthog.capture).toHaveBeenCalledWith('User Signed Up', {
        distinct_id: undefined, // Should handle missing id
        email: mockEmail,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle response without email field in analytics', async () => {
      // Arrange
      const mockResponse = {
        id: 'user-789',
        name: mockName,
        // No email field
      };

      vi.mocked(posthog).__loaded = true;

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act
      const result = await registerUser(mockEmail, mockName, mockPassword);

      // Assert
      expect(posthog.capture).toHaveBeenCalledWith('User Signed Up', {
        distinct_id: 'user-789',
        email: undefined, // Should handle missing email in response
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('error handling', () => {
    it('should throw error detail when response is not ok', async () => {
      // Arrange
      const errorDetail = 'Email already exists';
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: vi.fn().mockResolvedValue({ detail: errorDetail }),
      });

      // Act & Assert
      await expect(registerUser(mockEmail, mockName, mockPassword)).rejects.toBe(errorDetail);
      expect(posthog.capture).not.toHaveBeenCalled();
    });

    it('should handle network errors', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      // Act & Assert
      await expect(registerUser(mockEmail, mockName, mockPassword)).rejects.toThrow(
        'Network error'
      );
      expect(posthog.capture).not.toHaveBeenCalled();
    });

    it('should handle JSON parsing errors in error response', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
      });

      // Act & Assert
      await expect(registerUser(mockEmail, mockName, mockPassword)).rejects.toThrow('Invalid JSON');
      expect(posthog.capture).not.toHaveBeenCalled();
    });

    it('should handle missing detail in error response', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: vi.fn().mockResolvedValue({}), // No detail field
      });

      // Act & Assert
      await expect(registerUser(mockEmail, mockName, mockPassword)).rejects.toBe(undefined);
      expect(posthog.capture).not.toHaveBeenCalled();
    });

    it('should handle error response with null detail', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: vi.fn().mockResolvedValue({ detail: null }),
      });

      // Act & Assert
      await expect(registerUser(mockEmail, mockName, mockPassword)).rejects.toBe(null);
      expect(posthog.capture).not.toHaveBeenCalled();
    });
  });

  describe('input validation and edge cases', () => {
    it('should handle empty email', async () => {
      // Arrange
      const mockResponse = { id: 'user-123', email: '', name: mockName };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act
      const result = await registerUser('', mockName, mockPassword);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({
            email: '',
            name: mockName,
            password: mockPassword,
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle empty name', async () => {
      // Arrange
      const mockResponse = { id: 'user-123', email: mockEmail, name: '' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act
      const result = await registerUser(mockEmail, '', mockPassword);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({
            email: mockEmail,
            name: '',
            password: mockPassword,
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle empty password', async () => {
      // Arrange
      const mockResponse = { id: 'user-123', email: mockEmail, name: mockName };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act
      const result = await registerUser(mockEmail, mockName, '');

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({
            email: mockEmail,
            name: mockName,
            password: '',
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle special characters in input', async () => {
      // Arrange
      const specialEmail = 'joão+test@example.com';
      const specialName = "João José O'Connor";
      const specialPassword = 'P@ssw0rd!@#$%^&*()';
      const mockResponse = { id: 'user-123', email: specialEmail, name: specialName };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act
      const result = await registerUser(specialEmail, specialName, specialPassword);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({
            email: specialEmail,
            name: specialName,
            password: specialPassword,
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle very long input strings', async () => {
      // Arrange
      const longEmail = 'a'.repeat(100) + '@example.com';
      const longName = 'A'.repeat(1000);
      const longPassword = 'P'.repeat(100);
      const mockResponse = { id: 'user-123', email: longEmail, name: longName };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act
      const result = await registerUser(longEmail, longName, longPassword);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({
            email: longEmail,
            name: longName,
            password: longPassword,
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle unicode characters', async () => {
      // Arrange
      const unicodeEmail = 'test@例え.テスト';
      const unicodeName = '山田太郎';
      const unicodePassword = 'パスワード123';
      const mockResponse = { id: 'user-123', email: unicodeEmail, name: unicodeName };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act
      const result = await registerUser(unicodeEmail, unicodeName, unicodePassword);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({
            email: unicodeEmail,
            name: unicodeName,
            password: unicodePassword,
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
        json: vi.fn().mockResolvedValue({ id: 'user-123', email: mockEmail, name: mockName }),
      });

      // Act
      await registerUser(mockEmail, mockName, mockPassword);

      // Assert
      expect(getServiceURL).toHaveBeenCalledWith('data');
    });

    it('should construct correct endpoint URL', async () => {
      // Arrange
      const customEndpoint = 'https://custom-api.example.com';
      vi.mocked(getServiceURL).mockReturnValue(customEndpoint);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ id: 'user-123', email: mockEmail, name: mockName }),
      });

      // Act
      await registerUser(mockEmail, mockName, mockPassword);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        `${customEndpoint}/api/v1/user/register`,
        expect.any(Object)
      );
    });
  });

  describe('posthog analytics integration', () => {
    beforeEach(() => {
      vi.mocked(posthog).__loaded = true;
    });

    it('should capture user signup event with correct data', async () => {
      // Arrange
      const mockResponse = {
        id: 'user-xyz',
        email: 'analytics@test.com',
        name: 'Analytics User',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act
      await registerUser('analytics@test.com', 'Analytics User', 'password');

      // Assert
      expect(posthog.capture).toHaveBeenCalledWith('User Signed Up', {
        distinct_id: 'user-xyz',
        email: 'analytics@test.com',
      });
    });

    it('should handle posthog errors gracefully', async () => {
      // Arrange
      const mockResponse = { id: 'user-123', email: mockEmail, name: mockName };
      vi.mocked(posthog.capture).mockImplementation(() => {
        throw new Error('PostHog error');
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act & Assert - The function doesn't have try-catch around posthog, so it will throw
      await expect(registerUser(mockEmail, mockName, mockPassword)).rejects.toThrow(
        'PostHog error'
      );
    });
  });

  describe('response data handling', () => {
    it('should return complete response data', async () => {
      // Arrange
      const mockResponse = {
        id: 'user-123',
        email: mockEmail,
        name: mockName,
        createdAt: '2024-01-01T00:00:00Z',
        role: 'user',
        isVerified: false,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Act
      const result = await registerUser(mockEmail, mockName, mockPassword);

      // Assert
      expect(result).toEqual(mockResponse);
    });

    it('should handle empty response data', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({}),
      });

      // Act
      const result = await registerUser(mockEmail, mockName, mockPassword);

      // Assert
      expect(result).toEqual({});
    });

    it('should handle null response data', async () => {
      // Arrange
      vi.mocked(posthog).__loaded = true;
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(null),
      });

      // Act & Assert - Will fail when trying to access data.id on null
      await expect(registerUser(mockEmail, mockName, mockPassword)).rejects.toThrow();
    });
  });
});
