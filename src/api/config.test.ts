import { describe, it, expect } from 'vitest';
import { API_BASE_URL, V2_PUBLIC_API_URL } from './config';

describe('API Configuration', () => {
  describe('API_BASE_URL', () => {
    it('should be defined as a string', () => {
      // Act & Assert
      expect(typeof API_BASE_URL).toBe('string');
      expect(API_BASE_URL.length).toBeGreaterThan(0);
    });

    it('should be a valid URL format', () => {
      // Act & Assert
      expect(API_BASE_URL).toMatch(/^https?:\/\/.+/);
    });
  });

  describe('V2_PUBLIC_API_URL', () => {
    it('should be defined as a string', () => {
      // Act & Assert
      expect(typeof V2_PUBLIC_API_URL).toBe('string');
      expect(V2_PUBLIC_API_URL.length).toBeGreaterThan(0);
    });

    it('should be a valid URL format', () => {
      // Act & Assert
      expect(V2_PUBLIC_API_URL).toMatch(/^https?:\/\/.+/);
    });

    it('should use API_BASE_URL as fallback when V2 URL not configured', () => {
      // Assert - In test environment without specific V2 config, should fallback
      expect(V2_PUBLIC_API_URL).toBe(API_BASE_URL);
    });
  });

  describe('Configuration Consistency', () => {
    it('should export consistent types', () => {
      // Act & Assert
      expect(typeof API_BASE_URL).toBe('string');
      expect(typeof V2_PUBLIC_API_URL).toBe('string');
    });

    it('should always provide non-empty URLs', () => {
      // Act & Assert
      expect(API_BASE_URL).toBeTruthy();
      expect(V2_PUBLIC_API_URL).toBeTruthy();
      expect(API_BASE_URL.length).toBeGreaterThan(0);
      expect(V2_PUBLIC_API_URL.length).toBeGreaterThan(0);
    });
  });
});
