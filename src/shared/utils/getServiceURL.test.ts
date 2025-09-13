import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('getServiceURL', () => {
  beforeEach(() => {
    // Clear module cache to ensure fresh module load with new window.location
    vi.resetModules();
  });

  describe('localhost environment', () => {
    it('should return correct URLs for all services on localhost', async () => {
      // Arrange
      Object.defineProperty(window, 'location', {
        value: { hostname: 'localhost' },
        writable: true,
      });

      // Dynamically import after setting window.location
      const { getServiceURL } = await import('./getServiceURL');

      // Act & Assert
      expect(getServiceURL('data')).toBe('https://localhost:7651');
      expect(getServiceURL('llm')).toBe('https://localhost:7652');
      expect(getServiceURL('content-gen')).toBe('https://localhost:7653');
      expect(getServiceURL('campaign-manager')).toBe('https://localhost:7654');
    });
  });

  describe('127.0.0.1 environment', () => {
    it('should return correct URLs for all services on 127.0.0.1', async () => {
      // Arrange
      Object.defineProperty(window, 'location', {
        value: { hostname: '127.0.0.1' },
        writable: true,
      });

      // Dynamically import after setting window.location
      const { getServiceURL } = await import('./getServiceURL');

      // Act & Assert
      expect(getServiceURL('data')).toBe('https://localhost:7651');
      expect(getServiceURL('llm')).toBe('https://localhost:7652');
      expect(getServiceURL('content-gen')).toBe('https://localhost:7653');
      expect(getServiceURL('campaign-manager')).toBe('https://localhost:7654');
    });
  });

  describe('production environment (www.matchpointai.com)', () => {
    it('should return correct URLs for all services in production', async () => {
      // Arrange
      Object.defineProperty(window, 'location', {
        value: { hostname: 'www.matchpointai.com' },
        writable: true,
      });

      // Dynamically import after setting window.location
      const { getServiceURL } = await import('./getServiceURL');

      // Act & Assert
      expect(getServiceURL('data')).toBe('https://data.matchpointai.com');
      expect(getServiceURL('llm')).toBe('https://llm.matchpointai.com');
      expect(getServiceURL('content-gen')).toBe('https://content-gen.matchpointai.com');
      expect(getServiceURL('campaign-manager')).toBe('https://campaign-manager.matchpointai.com');
    });
  });

  describe('staging environment', () => {
    it('should return correct URLs for all services in staging', async () => {
      // Arrange
      Object.defineProperty(window, 'location', {
        value: { hostname: 'staging.example.com' },
        writable: true,
      });

      // Dynamically import after setting window.location
      const { getServiceURL } = await import('./getServiceURL');

      // Act & Assert
      expect(getServiceURL('data')).toBe('https://data.staging.example.com');
      expect(getServiceURL('llm')).toBe('https://llm.staging.example.com');
      expect(getServiceURL('content-gen')).toBe('https://content-gen.staging.example.com');
      expect(getServiceURL('campaign-manager')).toBe(
        'https://campaign-manager.staging.example.com'
      );
    });
  });

  describe('custom domain', () => {
    it('should return correct URLs for all services on custom domain', async () => {
      // Arrange
      Object.defineProperty(window, 'location', {
        value: { hostname: 'custom.domain.com' },
        writable: true,
      });

      // Dynamically import after setting window.location
      const { getServiceURL } = await import('./getServiceURL');

      // Act & Assert
      expect(getServiceURL('data')).toBe('https://data.custom.domain.com');
      expect(getServiceURL('llm')).toBe('https://llm.custom.domain.com');
      expect(getServiceURL('content-gen')).toBe('https://content-gen.custom.domain.com');
      expect(getServiceURL('campaign-manager')).toBe('https://campaign-manager.custom.domain.com');
    });
  });

  describe('edge cases', () => {
    it('should handle subdomain in hostname', async () => {
      // Arrange
      Object.defineProperty(window, 'location', {
        value: { hostname: 'app.subdomain.example.com' },
        writable: true,
      });

      // Dynamically import after setting window.location
      const { getServiceURL } = await import('./getServiceURL');

      // Act & Assert
      expect(getServiceURL('data')).toBe('https://data.app.subdomain.example.com');
      expect(getServiceURL('llm')).toBe('https://llm.app.subdomain.example.com');
      expect(getServiceURL('content-gen')).toBe('https://content-gen.app.subdomain.example.com');
      expect(getServiceURL('campaign-manager')).toBe(
        'https://campaign-manager.app.subdomain.example.com'
      );
    });

    it('should handle IP address as hostname', async () => {
      // Arrange
      Object.defineProperty(window, 'location', {
        value: { hostname: '192.168.1.100' },
        writable: true,
      });

      // Dynamically import after setting window.location
      const { getServiceURL } = await import('./getServiceURL');

      // Act & Assert
      expect(getServiceURL('data')).toBe('https://data.192.168.1.100');
      expect(getServiceURL('llm')).toBe('https://llm.192.168.1.100');
      expect(getServiceURL('content-gen')).toBe('https://content-gen.192.168.1.100');
      expect(getServiceURL('campaign-manager')).toBe('https://campaign-manager.192.168.1.100');
    });
  });
});
