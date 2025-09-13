import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NavigateFunction } from 'react-router-dom';
import handleNavigate from './handleNavigate';
import posthog from './posthog';

// Mock the posthog module
vi.mock('./posthog', () => ({
  default: {
    __loaded: true,
    capture: vi.fn(),
  },
}));

describe('handleNavigate', () => {
  let mockNavigate: NavigateFunction;
  let mockPosthogCapture: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockNavigate = vi.fn();
    mockPosthogCapture = vi.mocked(posthog.capture);
    vi.clearAllMocks();
  });

  describe('navigation to specific routes', () => {
    it('should navigate to dashboard and capture analytics', () => {
      // Arrange
      const id = 'user123';
      const dest = '/dashboard';

      // Act
      handleNavigate(id, dest, mockNavigate);

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      expect(mockPosthogCapture).toHaveBeenCalledWith('Navigated to Dashboard', {
        distinct_id: 'user123',
      });
    });

    it('should navigate to onboard and capture analytics', () => {
      // Arrange
      const id = 'user456';
      const dest = '/onboard';

      // Act
      handleNavigate(id, dest, mockNavigate);

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('/onboard');
      expect(mockPosthogCapture).toHaveBeenCalledWith('Navigated to Onboard', {
        distinct_id: 'user456',
      });
    });

    it('should navigate to landing and capture analytics', () => {
      // Arrange
      const id = 'user789';
      const dest = '/landing';

      // Act
      handleNavigate(id, dest, mockNavigate);

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('/landing');
      expect(mockPosthogCapture).toHaveBeenCalledWith('Navigated to Landing Page', {
        distinct_id: 'user789',
      });
    });

    it('should navigate to campaign and capture analytics', () => {
      // Arrange
      const id = 'user101';
      const dest = '/campaign';

      // Act
      handleNavigate(id, dest, mockNavigate);

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('/campaign');
      expect(mockPosthogCapture).toHaveBeenCalledWith('Navigated to Campaign', {
        distinct_id: 'user101',
      });
    });
  });

  describe('campaign content route handling', () => {
    it('should detect campaign content route and capture appropriate analytics', () => {
      // Arrange
      const id = 'user202';
      const dest = '/campaign/content/123';

      // Act
      handleNavigate(id, dest, mockNavigate);

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('/campaign/content/123');
      expect(mockPosthogCapture).toHaveBeenCalledWith('Navigated to Campaign Content Page', {
        distinct_id: 'user202',
      });
    });

    it('should handle campaign content route with query parameters', () => {
      // Arrange
      const id = 'user303';
      const dest = '/campaign/content/456?tab=preview';

      // Act
      handleNavigate(id, dest, mockNavigate);

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('/campaign/content/456?tab=preview');
      expect(mockPosthogCapture).toHaveBeenCalledWith('Navigated to Campaign Content Page', {
        distinct_id: 'user303',
      });
    });

    it('should handle nested campaign content routes', () => {
      // Arrange
      const id = 'user404';
      const dest = '/campaign/content/789/edit';

      // Act
      handleNavigate(id, dest, mockNavigate);

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('/campaign/content/789/edit');
      expect(mockPosthogCapture).toHaveBeenCalledWith('Navigated to Campaign Content Page', {
        distinct_id: 'user404',
      });
    });
  });

  describe('unknown route handling', () => {
    it('should navigate to unknown route and capture analytics with empty page name', () => {
      // Arrange
      const id = 'user505';
      const dest = '/unknown-route';

      // Act
      handleNavigate(id, dest, mockNavigate);

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('/unknown-route');
      expect(mockNavigate).toHaveBeenCalledTimes(2); // Called twice - once in else branch, once at end
      expect(mockPosthogCapture).toHaveBeenCalledWith('Navigated to ', {
        distinct_id: 'user505',
      });
    });

    it('should handle complex unknown routes', () => {
      // Arrange
      const id = 'user606';
      const dest = '/settings/profile/advanced?section=privacy';

      // Act
      handleNavigate(id, dest, mockNavigate);

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('/settings/profile/advanced?section=privacy');
      expect(mockNavigate).toHaveBeenCalledTimes(2);
      expect(mockPosthogCapture).toHaveBeenCalledWith('Navigated to ', {
        distinct_id: 'user606',
      });
    });

    it('should handle root route', () => {
      // Arrange
      const id = 'user707';
      const dest = '/';

      // Act
      handleNavigate(id, dest, mockNavigate);

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('/');
      expect(mockNavigate).toHaveBeenCalledTimes(2);
      expect(mockPosthogCapture).toHaveBeenCalledWith('Navigated to ', {
        distinct_id: 'user707',
      });
    });
  });

  describe('posthog integration', () => {
    it('should not capture analytics when posthog is not loaded', () => {
      // Arrange
      const mockPosthog = vi.mocked(posthog);
      mockPosthog.__loaded = false;
      const id = 'user808';
      const dest = '/dashboard';

      // Act
      handleNavigate(id, dest, mockNavigate);

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      expect(mockPosthogCapture).not.toHaveBeenCalled();
    });

    it('should capture analytics when posthog is loaded', () => {
      // Arrange
      const mockPosthog = vi.mocked(posthog);
      mockPosthog.__loaded = true;
      const id = 'user909';
      const dest = '/onboard';

      // Act
      handleNavigate(id, dest, mockNavigate);

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('/onboard');
      expect(mockPosthogCapture).toHaveBeenCalledWith('Navigated to Onboard', {
        distinct_id: 'user909',
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty user id', () => {
      // Arrange
      const id = '';
      const dest = '/dashboard';

      // Act
      handleNavigate(id, dest, mockNavigate);

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      expect(mockPosthogCapture).toHaveBeenCalledWith('Navigated to Dashboard', {
        distinct_id: '',
      });
    });

    it('should handle null user id', () => {
      // Arrange
      const id = null as any;
      const dest = '/dashboard';

      // Act
      handleNavigate(id, dest, mockNavigate);

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      expect(mockPosthogCapture).toHaveBeenCalledWith('Navigated to Dashboard', {
        distinct_id: null,
      });
    });

    it('should handle special characters in route', () => {
      // Arrange
      const id = 'user123';
      const dest = '/campaign/content/test-123_special!@#';

      // Act
      handleNavigate(id, dest, mockNavigate);

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('/campaign/content/test-123_special!@#');
      expect(mockPosthogCapture).toHaveBeenCalledWith('Navigated to Campaign Content Page', {
        distinct_id: 'user123',
      });
    });

    it('should handle routes with fragments', () => {
      // Arrange
      const id = 'user123';
      const dest = '/dashboard#section-1';

      // Act
      handleNavigate(id, dest, mockNavigate);

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard#section-1');
      expect(mockNavigate).toHaveBeenCalledTimes(2); // Fragment doesn't match exact '/dashboard' so treated as unknown
      expect(mockPosthogCapture).toHaveBeenCalledWith('Navigated to ', {
        distinct_id: 'user123',
      });
    });

    it('should handle case sensitivity in routes', () => {
      // Arrange
      const id = 'user123';
      const dest = '/Dashboard'; // Uppercase D

      // Act
      handleNavigate(id, dest, mockNavigate);

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('/Dashboard');
      expect(mockNavigate).toHaveBeenCalledTimes(2);
      expect(mockPosthogCapture).toHaveBeenCalledWith('Navigated to ', {
        distinct_id: 'user123',
      });
    });
  });

  describe('navigate function call timing', () => {
    it('should call navigate function exactly once for known routes', () => {
      // Arrange
      const id = 'user123';
      const dest = '/dashboard';

      // Act
      handleNavigate(id, dest, mockNavigate);

      // Assert
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });

    it('should call navigate function twice for unknown routes', () => {
      // Arrange
      const id = 'user123';
      const dest = '/unknown';

      // Act
      handleNavigate(id, dest, mockNavigate);

      // Assert
      expect(mockNavigate).toHaveBeenCalledTimes(2); // Called in else branch and at end
      expect(mockNavigate).toHaveBeenCalledWith('/unknown');
    });
  });

  describe('page name mapping consistency', () => {
    const testCases = [
      { dest: '/dashboard', expectedPageName: 'Dashboard' },
      { dest: '/onboard', expectedPageName: 'Onboard' },
      { dest: '/landing', expectedPageName: 'Landing Page' },
      { dest: '/campaign', expectedPageName: 'Campaign' },
      { dest: '/campaign/content', expectedPageName: 'Campaign Content Page' },
      { dest: '/campaign/content/123', expectedPageName: 'Campaign Content Page' },
    ];

    testCases.forEach(({ dest, expectedPageName }) => {
      it(`should map ${dest} to "${expectedPageName}"`, () => {
        // Arrange
        const id = 'user123';

        // Act
        handleNavigate(id, dest, mockNavigate);

        // Assert
        expect(mockPosthogCapture).toHaveBeenCalledWith(`Navigated to ${expectedPageName}`, {
          distinct_id: 'user123',
        });
      });
    });
  });
});
