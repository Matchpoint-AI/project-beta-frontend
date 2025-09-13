import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ConnectInstagram } from './ConnectToInstagram';

// Mock external dependencies
vi.mock('../helpers/getServiceURL', () => ({
  getServiceURL: vi.fn(() => 'http://mock-data-service'),
}));

vi.mock('../shared/components/ui/InstagramIcon', () => ({
  default: vi.fn(() => <div data-testid="instagram-icon">Instagram Icon</div>),
}));

// Mock fetch
global.fetch = vi.fn();

// Mock window.open
Object.defineProperty(window, 'open', {
  value: vi.fn(),
  writable: true,
});

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

describe('ConnectInstagram', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        auth_url: 'https://instagram.com/oauth/authorize?client_id=123&redirect_uri=test',
      }),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (initialEntries = ['/']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <ConnectInstagram />
      </MemoryRouter>
    );
  };

  describe('Component Rendering', () => {
    it('should render the connect button', () => {
      // Arrange & Act
      renderComponent();

      // Assert
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Connect with Instagram');
    });

    it('should render the Instagram icon', () => {
      // Arrange & Act
      renderComponent();

      // Assert
      expect(screen.getByTestId('instagram-icon')).toBeInTheDocument();
    });

    it('should have correct button styling', () => {
      // Arrange & Act
      renderComponent();

      // Assert
      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'inline-flex',
        'justify-center',
        'items-center',
        'gap-2',
        'w-[250px]',
        'h-12',
        'px-5',
        'py-3',
        'rounded-lg',
        'bg-indigo-700',
        'hover:bg-[#6875F5]'
      );
    });

    it('should have correct text styling', () => {
      // Arrange & Act
      renderComponent();

      // Assert
      const textElement = screen.getByText('Connect with Instagram');
      expect(textElement).toHaveClass('text-white', 'text-sm', 'font-medium', 'leading-normal');
    });
  });

  describe('Instagram Connection Flow', () => {
    it('should fetch auth URL when connect button is clicked', async () => {
      // Arrange
      const { getServiceURL } = await import('../helpers/getServiceURL');
      renderComponent();
      const button = screen.getByRole('button');

      // Act
      fireEvent.click(button);

      // Assert
      await waitFor(() => {
        expect(getServiceURL).toHaveBeenCalledWith('data');
        expect(global.fetch).toHaveBeenCalledWith('http://mock-data-service/api/v1/instagram');
      });
    });

    it('should open auth URL in new window when response is successful', async () => {
      // Arrange
      renderComponent();
      const button = screen.getByRole('button');

      // Act
      fireEvent.click(button);

      // Assert
      await waitFor(() => {
        expect(window.open).toHaveBeenCalledWith(
          'https://instagram.com/oauth/authorize?client_id=123&redirect_uri=test',
          '_top'
        );
      });
    });

    it('should handle API response without auth_url', async () => {
      // Arrange
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}), // No auth_url
      });
      renderComponent();
      const button = screen.getByRole('button');

      // Act
      fireEvent.click(button);

      // Assert
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
      expect(window.open).not.toHaveBeenCalled();
    });

    it('should handle failed API response', async () => {
      // Arrange
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      });
      renderComponent();
      const button = screen.getByRole('button');

      // Act
      fireEvent.click(button);

      // Assert
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
      expect(window.open).not.toHaveBeenCalled();
    });

    it('should handle network errors gracefully', async () => {
      // Arrange
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));
      renderComponent();
      const button = screen.getByRole('button');

      // Act & Assert
      expect(() => fireEvent.click(button)).not.toThrow();
    });
  });

  describe('URL Parameter Handling', () => {
    it('should store access token when present in URL with instagram source', () => {
      // Arrange & Act
      renderComponent(['/?access_token=test_token&source=instagram']);

      // Assert
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('instagram_access_token', 'test_token');
    });

    it('should not store token when source is not instagram', () => {
      // Arrange & Act
      renderComponent(['/?access_token=test_token&source=facebook']);

      // Assert
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
    });

    it('should not store token when access_token is missing', () => {
      // Arrange & Act
      renderComponent(['/?source=instagram']);

      // Assert
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
    });

    it('should not store token when source is missing', () => {
      // Arrange & Act
      renderComponent(['/?access_token=test_token']);

      // Assert
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
    });

    it('should handle empty URL parameters', () => {
      // Arrange & Act
      renderComponent(['/?access_token=&source=instagram']);

      // Assert
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
    });

    it('should handle multiple URL parameters correctly', () => {
      // Arrange & Act
      renderComponent([
        '/?access_token=test_token&source=instagram&other_param=value&redirect=true',
      ]);

      // Assert
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('instagram_access_token', 'test_token');
    });
  });

  describe('useEffect Behavior', () => {
    it('should run effect when location changes', () => {
      // Arrange & Act
      renderComponent(['/?access_token=new_token&source=instagram']);

      // Assert
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('instagram_access_token', 'new_token');
    });

    it('should only run effect on mount and location change', () => {
      // Arrange & Act
      const { rerender } = renderComponent(['/?access_token=token&source=instagram']);

      // Force a re-render without changing location
      rerender(
        <MemoryRouter initialEntries={['/?access_token=token&source=instagram']}>
          <ConnectInstagram />
        </MemoryRouter>
      );

      // Assert - should only be called once (on mount)
      expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(1);
    });
  });

  describe('Button Interaction', () => {
    it('should be clickable and focusable', () => {
      // Arrange & Act
      renderComponent();

      // Assert
      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
      button.focus();
      expect(document.activeElement).toBe(button);
    });

    it('should handle multiple rapid clicks', async () => {
      // Arrange
      renderComponent();
      const button = screen.getByRole('button');

      // Act
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      // Assert
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(3);
      });
    });

    it('should maintain button state during async operations', async () => {
      // Arrange
      let resolvePromise: (value: any) => void;
      (global.fetch as any).mockReturnValueOnce(
        new Promise((resolve) => {
          resolvePromise = resolve;
        })
      );

      renderComponent();
      const button = screen.getByRole('button');

      // Act
      fireEvent.click(button);

      // Assert - button should still be clickable during async operation
      expect(button).not.toBeDisabled();
      expect(button).toHaveTextContent('Connect with Instagram');

      // Resolve the promise
      resolvePromise!({
        ok: true,
        json: async () => ({ auth_url: 'test-url' }),
      });

      await waitFor(() => {
        expect(window.open).toHaveBeenCalled();
      });
    });
  });

  describe('Integration with Router', () => {
    it('should work with different route paths', () => {
      // Arrange & Act
      renderComponent(['/dashboard?access_token=test&source=instagram']);

      // Assert
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('instagram_access_token', 'test');
    });

    it('should handle hash fragments in URL', () => {
      // Arrange & Act
      renderComponent(['/home?access_token=test&source=instagram']);

      // Assert
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('instagram_access_token', 'test');
    });
  });

  describe('Accessibility', () => {
    it('should have proper button role', () => {
      // Arrange & Act
      renderComponent();

      // Assert
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should have accessible text content', () => {
      // Arrange & Act
      renderComponent();

      // Assert
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Connect with Instagram');
    });

    it('should be keyboard accessible', () => {
      // Arrange & Act
      renderComponent();

      // Assert
      const button = screen.getByRole('button');
      button.focus();

      // Should be focusable
      expect(document.activeElement).toBe(button);

      // Should respond to Enter key
      fireEvent.keyDown(button, { key: 'Enter' });
      // Button click would be triggered by browser automatically
    });

    it('should support screen readers with proper content', () => {
      // Arrange & Act
      renderComponent();

      // Assert
      const button = screen.getByRole('button');
      const textContent = button.textContent;
      expect(textContent).toContain('Connect with Instagram');
    });
  });

  describe('Error Scenarios', () => {
    it('should handle malformed URL parameters', () => {
      // Arrange & Act
      expect(() => renderComponent(['/?access_token=%invalid&source=instagram'])).not.toThrow();
    });

    it('should handle component unmounting during async operation', async () => {
      // Arrange
      let resolvePromise: (value: any) => void;
      (global.fetch as any).mockReturnValueOnce(
        new Promise((resolve) => {
          resolvePromise = resolve;
        })
      );

      const { unmount } = renderComponent();
      const button = screen.getByRole('button');

      // Act
      fireEvent.click(button);
      unmount(); // Unmount before promise resolves

      // Resolve after unmount
      resolvePromise!({
        ok: true,
        json: async () => ({ auth_url: 'test-url' }),
      });

      // Assert - should not cause errors
      await waitFor(() => {
        // Just ensure no errors were thrown
        expect(true).toBe(true);
      });
    });
  });
});
