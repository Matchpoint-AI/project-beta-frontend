import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
// Note: imports are dynamically required in tests to avoid ESM cache issues

describe('API Configuration', () => {
  const originalEnv = process.env;
  const originalMetaEnv = import.meta.env;

  beforeEach(() => {
    // Arrange - Reset environment variables
    vi.resetModules();
    process.env = { ...originalEnv };
    // @ts-expect-error - Testing with modified import.meta.env
    import.meta.env = { ...originalMetaEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    // @ts-expect-error - Testing with modified import.meta.env
    import.meta.env = originalMetaEnv;
  });

  describe('API_BASE_URL', () => {
    it('should use REACT_APP_API_BASE_URL when provided', () => {
      // Arrange
      process.env.REACT_APP_API_BASE_URL = 'https://custom-api.example.com';

      // Act
      vi.resetModules();
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const config = require('./config');

      // Assert
      expect(config.API_BASE_URL).toBe('https://custom-api.example.com');
    });

    it('should use production URL when NODE_ENV is production', () => {
      // Arrange
      delete process.env.REACT_APP_API_BASE_URL;
      process.env.NODE_ENV = 'production';

      // Act
      vi.resetModules();
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const config = require('./config');

      // Assert
      expect(config.API_BASE_URL).toBe('https://api.matchpointai.com');
    });

    it('should use localhost URL when NODE_ENV is development', () => {
      // Arrange
      delete process.env.REACT_APP_API_BASE_URL;
      process.env.NODE_ENV = 'development';

      // Act
      vi.resetModules();
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const config = require('./config');

      // Assert
      expect(config.API_BASE_URL).toBe('http://localhost:8080');
    });

    it('should use localhost URL when NODE_ENV is test', () => {
      // Arrange
      delete process.env.REACT_APP_API_BASE_URL;
      process.env.NODE_ENV = 'test';

      // Act
      vi.resetModules();
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const config = require('./config');

      // Assert
      expect(config.API_BASE_URL).toBe('http://localhost:8080');
    });

    it('should prioritize REACT_APP_API_BASE_URL over NODE_ENV', () => {
      // Arrange
      process.env.REACT_APP_API_BASE_URL = 'https://override.example.com';
      process.env.NODE_ENV = 'production';

      // Act
      vi.resetModules();
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const config = require('./config');

      // Assert
      expect(config.API_BASE_URL).toBe('https://override.example.com');
    });
  });

  describe('V2_PUBLIC_API_URL', () => {
    it('should use VITE_V2_PUBLIC_API_URL when provided', () => {
      // Arrange
      // @ts-expect-error - Testing with modified import.meta.env
      import.meta.env.VITE_V2_PUBLIC_API_URL = 'https://v2-api.example.com';

      // Act
      vi.resetModules();
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const config = require('./config');

      // Assert
      expect(config.V2_PUBLIC_API_URL).toBe('https://v2-api.example.com');
    });

    it('should fallback to REACT_APP_V2_PUBLIC_API_URL when VITE env not set', () => {
      // Arrange
      // @ts-expect-error - Testing with modified import.meta.env
      import.meta.env.VITE_V2_PUBLIC_API_URL = undefined;
      process.env.REACT_APP_V2_PUBLIC_API_URL = 'https://v2-react.example.com';

      // Act
      vi.resetModules();
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const config = require('./config');

      // Assert
      expect(config.V2_PUBLIC_API_URL).toBe('https://v2-react.example.com');
    });

    it('should fallback to API_BASE_URL when no V2 URL is configured', () => {
      // Arrange
      // @ts-expect-error - Testing with modified import.meta.env
      import.meta.env.VITE_V2_PUBLIC_API_URL = undefined;
      delete process.env.REACT_APP_V2_PUBLIC_API_URL;
      process.env.REACT_APP_API_BASE_URL = 'https://base-api.example.com';

      // Act
      vi.resetModules();
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const config = require('./config');

      // Assert
      expect(config.V2_PUBLIC_API_URL).toBe('https://base-api.example.com');
    });

    it('should use production defaults when no environment variables are set', () => {
      // Arrange
      // @ts-expect-error - Testing with modified import.meta.env
      import.meta.env = {};
      process.env = { NODE_ENV: 'production' };

      // Act
      vi.resetModules();
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const config = require('./config');

      // Assert
      expect(config.API_BASE_URL).toBe('https://api.matchpointai.com');
      expect(config.V2_PUBLIC_API_URL).toBe('https://api.matchpointai.com');
    });

    it('should use development defaults when no environment variables are set', () => {
      // Arrange
      // @ts-expect-error - Testing with modified import.meta.env
      import.meta.env = {};
      process.env = { NODE_ENV: 'development' };

      // Act
      vi.resetModules();
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const config = require('./config');

      // Assert
      expect(config.API_BASE_URL).toBe('http://localhost:8080');
      expect(config.V2_PUBLIC_API_URL).toBe('http://localhost:8080');
    });

    it('should handle priority correctly: VITE > REACT_APP_V2 > API_BASE', () => {
      // Arrange
      // @ts-expect-error - Testing with modified import.meta.env
      import.meta.env.VITE_V2_PUBLIC_API_URL = 'https://vite-v2.example.com';
      process.env.REACT_APP_V2_PUBLIC_API_URL = 'https://react-v2.example.com';
      process.env.REACT_APP_API_BASE_URL = 'https://base.example.com';

      // Act
      vi.resetModules();
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const config = require('./config');

      // Assert
      expect(config.V2_PUBLIC_API_URL).toBe('https://vite-v2.example.com');
    });
  });

  describe('Environment Edge Cases', () => {
    it('should handle undefined NODE_ENV gracefully', () => {
      // Arrange
      delete process.env.NODE_ENV;
      delete process.env.REACT_APP_API_BASE_URL;

      // Act
      vi.resetModules();
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const config = require('./config');

      // Assert
      expect(config.API_BASE_URL).toBe('http://localhost:8080');
    });

    it('should handle empty string environment variables', () => {
      // Arrange
      process.env.REACT_APP_API_BASE_URL = '';
      process.env.REACT_APP_V2_PUBLIC_API_URL = '';
      // @ts-expect-error - Testing with modified import.meta.env
      import.meta.env.VITE_V2_PUBLIC_API_URL = '';

      // Act
      vi.resetModules();
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const config = require('./config');

      // Assert
      expect(config.API_BASE_URL).toBe('http://localhost:8080');
      expect(config.V2_PUBLIC_API_URL).toBe('http://localhost:8080');
    });

    it('should handle whitespace in environment variables', () => {
      // Arrange
      process.env.REACT_APP_API_BASE_URL = '  https://api.example.com  ';

      // Act
      vi.resetModules();
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const config = require('./config');

      // Assert
      expect(config.API_BASE_URL).toBe('  https://api.example.com  ');
    });

    it('should maintain URL format exactly as provided', () => {
      // Arrange
      process.env.REACT_APP_API_BASE_URL = 'https://api.example.com/v1/';
      // @ts-expect-error - Testing with modified import.meta.env
      import.meta.env.VITE_V2_PUBLIC_API_URL = 'https://v2.example.com/api';

      // Act
      vi.resetModules();
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const config = require('./config');

      // Assert
      expect(config.API_BASE_URL).toBe('https://api.example.com/v1/');
      expect(config.V2_PUBLIC_API_URL).toBe('https://v2.example.com/api');
    });
  });

  describe('Configuration Consistency', () => {
    it('should export consistent types', () => {
      // Arrange & Act
      vi.resetModules();
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const config = require('./config');

      // Assert
      expect(typeof config.API_BASE_URL).toBe('string');
      expect(typeof config.V2_PUBLIC_API_URL).toBe('string');
    });

    it('should always provide non-empty URLs', () => {
      // Arrange
      process.env = {};
      // @ts-expect-error - Testing with modified import.meta.env
      import.meta.env = {};

      // Act
      vi.resetModules();
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const config = require('./config');

      // Assert
      expect(config.API_BASE_URL).toBeTruthy();
      expect(config.V2_PUBLIC_API_URL).toBeTruthy();
      expect(config.API_BASE_URL.length).toBeGreaterThan(0);
      expect(config.V2_PUBLIC_API_URL.length).toBeGreaterThan(0);
    });

    it('should handle protocol-relative URLs', () => {
      // Arrange
      process.env.REACT_APP_API_BASE_URL = '//api.example.com';
      // @ts-expect-error - Testing with modified import.meta.env
      import.meta.env.VITE_V2_PUBLIC_API_URL = '//v2.example.com';

      // Act
      vi.resetModules();
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const config = require('./config');

      // Assert
      expect(config.API_BASE_URL).toBe('//api.example.com');
      expect(config.V2_PUBLIC_API_URL).toBe('//v2.example.com');
    });

    it('should handle localhost with custom ports', () => {
      // Arrange
      process.env.REACT_APP_API_BASE_URL = 'http://localhost:3000';
      // @ts-expect-error - Testing with modified import.meta.env
      import.meta.env.VITE_V2_PUBLIC_API_URL = 'http://localhost:4000';

      // Act
      vi.resetModules();
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const config = require('./config');

      // Assert
      expect(config.API_BASE_URL).toBe('http://localhost:3000');
      expect(config.V2_PUBLIC_API_URL).toBe('http://localhost:4000');
    });
  });
});
