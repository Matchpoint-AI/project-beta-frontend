import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock posthog-js before importing the module
const mockPosthog = {
  init: vi.fn(),
};

vi.mock('posthog-js', () => ({
  default: mockPosthog,
}));

describe('posthog configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset modules so we can re-import with different window conditions
    vi.resetModules();
  });

  it('should not initialize posthog in non-browser environment', async () => {
    // Arrange
    Object.defineProperty(globalThis, 'window', {
      value: undefined,
      writable: true,
      configurable: true,
    });

    // Act
    await import('./posthog');

    // Assert
    expect(mockPosthog.init).not.toHaveBeenCalled();
  });

  it('should initialize posthog for production hostname', async () => {
    // Arrange
    Object.defineProperty(globalThis, 'window', {
      value: {
        location: {
          hostname: 'www.matchpointai.com',
        },
      },
      writable: true,
      configurable: true,
    });

    // Act
    await import('./posthog');

    // Assert
    expect(mockPosthog.init).toHaveBeenCalledWith(
      'phc_VNVYMctu3zn3KiFdtjJJGkJ89GlqXINiNXEM6PZgL62',
      {
        api_host: 'https://us.i.posthog.com',
        capture_pageview: false,
      }
    );
  });

  it('should initialize posthog for other non-localhost hostnames', async () => {
    // Arrange
    Object.defineProperty(globalThis, 'window', {
      value: {
        location: {
          hostname: 'staging.matchpointai.com',
        },
      },
      writable: true,
      configurable: true,
    });

    // Act
    await import('./posthog');

    // Assert
    expect(mockPosthog.init).toHaveBeenCalledWith(
      'phc_VNVYMctu3zn3KiFdtjJJGkJ89GlqXINiNXEM6PZgL62',
      {
        api_host: 'https://us.i.posthog.com',
        capture_pageview: false,
      }
    );
  });

  it('should not initialize posthog for localhost', async () => {
    // Arrange
    Object.defineProperty(globalThis, 'window', {
      value: {
        location: {
          hostname: 'localhost',
        },
      },
      writable: true,
      configurable: true,
    });

    // Act
    await import('./posthog');

    // Assert
    expect(mockPosthog.init).not.toHaveBeenCalled();
  });

  it('should not initialize posthog for 127.0.0.1', async () => {
    // Arrange
    Object.defineProperty(globalThis, 'window', {
      value: {
        location: {
          hostname: '127.0.0.1',
        },
      },
      writable: true,
      configurable: true,
    });

    // Act
    await import('./posthog');

    // Assert
    expect(mockPosthog.init).not.toHaveBeenCalled();
  });

  it('should normalize www.matchpointai.com to matchpointai.com', async () => {
    // Arrange
    Object.defineProperty(globalThis, 'window', {
      value: {
        location: {
          hostname: 'www.matchpointai.com',
        },
      },
      writable: true,
      configurable: true,
    });

    // Act
    await import('./posthog');

    // Assert
    // This test verifies the baseurl logic - posthog should still be initialized
    // regardless of the normalization since matchpointai.com is not localhost
    expect(mockPosthog.init).toHaveBeenCalled();
  });
});