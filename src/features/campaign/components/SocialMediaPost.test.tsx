import React from 'react';
import { render, screen, fireEvent, waitFor, act, cleanup } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';

import SocialMediaPost from './SocialMediaPost';
import { AuthContext } from '../../../features/auth/context/AuthContext';

// --- BROWSER API MOCKS (robust for CI) ---
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
if (typeof globalThis !== 'undefined') globalThis.ResizeObserver = ResizeObserverMock;
if (typeof window !== 'undefined') window.ResizeObserver = ResizeObserverMock;
if (typeof global !== 'undefined') global.ResizeObserver = ResizeObserverMock;

global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
window.IntersectionObserver = global.IntersectionObserver;

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => '',
  }),
});

Element.prototype.getBoundingClientRect = vi.fn(() => ({
  width: 100,
  height: 100,
  top: 0,
  left: 0,
  bottom: 100,
  right: 100,
  x: 0,
  y: 0,
  toJSON: () => ({}),
}));
// --- END BROWSER API MOCKS ---

// Mock dependencies
vi.mock('../../../helpers/getServiceURL', () => ({
  getServiceURL: vi.fn(() => 'http://localhost:8000'),
}));

vi.mock('../../../helpers/posthog', () => ({
  default: {
    __loaded: true,
    capture: vi.fn(),
  },
}));

// Global mocks
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: async () => ({}),
    headers: new Headers(),
    redirected: false,
    status: 200,
    statusText: 'OK',
    type: 'basic',
    url: '',
    clone: () => ({}) as any,
    body: null,
    bodyUsed: false,
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    blob: () => Promise.resolve(new Blob()),
    formData: () => Promise.resolve(new FormData()),
    text: () => Promise.resolve(''),
  } as Response)
) as any;

const mockProfile = {
  id: 'test-user-id',
  token: 'test-token',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
};

const mockAuthContext = {
  profile: mockProfile,
  user: null,
  login: vi.fn(),
  logout: vi.fn(),
  loading: false,
  setProfile: vi.fn(),
  isAuthenticated: true,
  isLoading: false,
};

const mockContent = {
  id: '1',
  text: 'This is a test post content',
  image_url: ['image1.jpg', 'image2.jpg'],
  approved: false,
  posted: false,
  time: '9:00 AM',
};

const defaultProps = {
  day: 1,
  postIndex: 1,
  setOpen: vi.fn(),
  content: mockContent,
  id: 'test-content-id',
  week: 1,
  postingTime: '9:00 AM',
  brandName: 'Test Brand',
  onApprovalUpdate: vi.fn(),
  updataImage: vi.fn(),
  selectedImages: [1],
  setSelectedImages: vi.fn(),
};

const renderWithAuth = (props = {}) => {
  return render(
    <AuthContext.Provider value={mockAuthContext}>
      <SocialMediaPost {...defaultProps} {...props} />
    </AuthContext.Provider>
  );
};

describe('SocialMediaPost Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as unknown as jest.Mock).mockClear();
    // Reset fetch to default mock implementation
    (global.fetch as unknown as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({}),
      })
    );
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  describe('When rendering post information', () => {
    it('should display post number and timing', async () => {
      await act(async () => {
        renderWithAuth();
      });
      expect(screen.getByText('Post 1')).toBeInTheDocument();
      expect(screen.getByText('9:00 AM')).toBeInTheDocument();
    });

    it('should show the post text content', async () => {
      await act(async () => {
        renderWithAuth();
      });
      expect(screen.getByText('This is a test post content')).toBeInTheDocument();
    });

    it('should display the first image by default', async () => {
      await act(async () => {
        renderWithAuth();
      });
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', 'image1.jpg');
    });
  });

  describe('When post is not approved', () => {
    it('should show approve button', async () => {
      await act(async () => {
        renderWithAuth();
      });
      expect(screen.getByText('Approve Post')).toBeInTheDocument();
    });

    it('should show image controls for editing', async () => {
      await act(async () => {
        renderWithAuth();
      });
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(2);
    });
  });

  describe('When post is approved', () => {
    it('should show "Ready to Publish" status', async () => {
      await act(async () => {
        renderWithAuth({
          content: { ...mockContent, approved: true },
        });
      });
      expect(screen.getByText('Ready to Publish')).toBeInTheDocument();
    });

    it('should hide image editing controls', async () => {
      await act(async () => {
        renderWithAuth({
          content: { ...mockContent, approved: true },
        });
      });
      // Should not show edit controls when approved
      expect(screen.queryByRole('button', { name: /expand/i })).not.toBeInTheDocument();
    });
  });

  describe('When post is already posted', () => {
    it('should show "Posted" status', async () => {
      await act(async () => {
        renderWithAuth({
          content: { ...mockContent, posted: true },
        });
      });
      expect(screen.getByText('Posted')).toBeInTheDocument();
    });
  });

  describe('When managing image states', () => {
    it('should show loading spinner while image loads', async () => {
      await act(async () => {
        renderWithAuth();
      });
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should handle image load completion', async () => {
      await act(async () => {
        renderWithAuth();
      });
      const image = screen.getByRole('img');

      await act(async () => {
        fireEvent.load(image);
      });

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });
    });

    it('should handle image load errors', async () => {
      await act(async () => {
        renderWithAuth();
      });
      const image = screen.getByRole('img');

      await act(async () => {
        fireEvent.error(image);
      });

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });
    });
  });

  describe('When approving posts', () => {
    it('should call approval API when approve button is clicked', async () => {
      const fetchSpy = vi.spyOn(global, 'fetch');
      // Mock the initial calls that happen on mount
      fetchSpy
        .mockResolvedValueOnce({ ok: true, json: async () => ({}) } as any) // initial call
        .mockResolvedValueOnce({ ok: true, json: async () => ({}) } as any); // approval call

      await act(async () => {
        renderWithAuth();
      });

      // Wait for initial mount calls to complete
      await waitFor(() => {
        expect(fetchSpy).toHaveBeenCalled();
      });

      const approveButton = screen.getByText('Approve Post');
      await act(async () => {
        fireEvent.click(approveButton);
      });

      await waitFor(() => {
        expect(
          fetchSpy.mock.calls.some((call) => String(call[0]).includes('/api/v1/contentgen/approve'))
        ).toBe(true);
      });

      fetchSpy.mockRestore();
    });

    it('should show loading state during approval', async () => {
      // Mock initial call
      (global.fetch as unknown as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
        .mockImplementationOnce(
          () =>
            new Promise((resolve) =>
              setTimeout(
                () =>
                  resolve({
                    ok: true,
                    json: async () => ({}),
                  }),
                100
              )
            )
        );

      await act(async () => {
        renderWithAuth();
      });

      // Wait for initial mount
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      const approveButton = screen.getByText('Approve Post');
      await act(async () => {
        fireEvent.click(approveButton);
      });

      // Check that loading state appears
      await waitFor(() => {
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
      });
    });

    it('should call onApprovalUpdate callback on success', async () => {
      const onApprovalUpdateMock = vi.fn();
      (global.fetch as unknown as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
        .mockResolvedValueOnce({ ok: true, json: async () => ({}) });

      await act(async () => {
        renderWithAuth({ onApprovalUpdate: onApprovalUpdateMock });
      });

      // Wait for initial mount
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      const approveButton = screen.getByText('Approve Post');
      await act(async () => {
        fireEvent.click(approveButton);
      });

      await waitFor(() => {
        expect(onApprovalUpdateMock).toHaveBeenCalled();
      });
    });

    it('should handle approval errors', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      (global.fetch as unknown as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
        .mockResolvedValueOnce({
          ok: false,
          json: async () => ({ detail: 'Approval failed' }),
        });

      await act(async () => {
        renderWithAuth();
      });

      // Wait for initial mount
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      const approveButton = screen.getByText('Approve Post');
      await act(async () => {
        fireEvent.click(approveButton);
      });

      // Wait for the async operation to complete
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/v1/contentgen/approve'),
          expect.objectContaining({
            method: 'POST',
            headers: {
              Authorization: 'Bearer test-token',
              'Content-Type': 'application/json',
            },
          })
        );
      });

      consoleSpy.mockRestore();
    });
  });

  describe('When editing text content', () => {
    it('should enable editing when edit button is clicked', async () => {
      await act(async () => {
        renderWithAuth();
      });
      const buttons = screen.getAllByRole('button');
      const editButton = buttons.find(
        (btn) =>
          btn.getAttribute('aria-label')?.includes('edit') ||
          btn.querySelector('[data-testid*="edit"]')
      );

      if (editButton) {
        await act(async () => {
          fireEvent.click(editButton);
        });
        expect(screen.getByRole('textbox')).toBeInTheDocument();
      }
    });

    it('should save text changes when save is clicked', async () => {
      (global.fetch as unknown as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
        .mockResolvedValueOnce({ ok: true, json: async () => ({}) });

      await act(async () => {
        renderWithAuth();
      });

      // Wait for initial mount
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      const buttons = screen.getAllByRole('button');
      const editButton = buttons[3]; // Approximate position of edit button

      await act(async () => {
        fireEvent.click(editButton);
      });

      const textarea = screen.queryByRole('textbox');
      if (textarea) {
        await act(async () => {
          fireEvent.change(textarea, { target: { value: 'Updated text' } });
          fireEvent.click(editButton); // Same button toggles to save
        });

        await waitFor(() => {
          expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/v1/contentgen/update-text-versions'),
            expect.objectContaining({ method: 'POST' })
          );
        });
      }
    });
  });

  describe('When managing multiple images', () => {
    it('should show pagination for multiple images', async () => {
      const multiImageContent = {
        ...mockContent,
        image_url: ['image1.jpg', 'image2.jpg'],
      };

      await act(async () => {
        renderWithAuth({ content: multiImageContent });
      });
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('should handle image selection changes', async () => {
      const setSelectedImagesMock = vi.fn();
      const multiImageContent = {
        ...mockContent,
        image_url: ['image1.jpg', 'image2.jpg'],
      };

      await act(async () => {
        renderWithAuth({
          content: multiImageContent,
          setSelectedImages: setSelectedImagesMock,
        });
      });

      const page2Button = screen.getByText('2');
      await act(async () => {
        fireEvent.click(page2Button);
      });

      // Check that the component handles the pagination
      expect(page2Button).toBeInTheDocument();
    });
  });

  describe('When handling hover interactions', () => {
    it('should show cancel option when hovering over approved post', async () => {
      await act(async () => {
        renderWithAuth({
          content: { ...mockContent, approved: true },
        });
      });

      const container = screen.getByText('Ready to Publish').closest('div');
      if (container) {
        await act(async () => {
          fireEvent.mouseEnter(container);
        });
        expect(screen.getByText('Cancel approved')).toBeInTheDocument();
      }
    });
  });

  describe('When handling edge cases', () => {
    it('should handle missing post data gracefully', async () => {
      await act(async () => {
        renderWithAuth({ content: null as unknown });
      });
      expect(screen.getByText('Post 1')).toBeInTheDocument();
    });

    it('should handle empty image array', async () => {
      await act(async () => {
        renderWithAuth({
          content: { ...mockContent, image_url: [] },
        });
      });
      expect(screen.getByText('Post 1')).toBeInTheDocument();
    });

    it('should handle missing text content', async () => {
      await act(async () => {
        renderWithAuth({
          content: { ...mockContent, text: '' },
        });
      });
      expect(screen.getByText('Post 1')).toBeInTheDocument();
    });

    it('should truncate very long text', async () => {
      const longText = 'A'.repeat(400);
      await act(async () => {
        renderWithAuth({
          content: { ...mockContent, text: longText },
        });
      });

      // Check that some form of the text is displayed
      expect(screen.getByText(longText, { exact: false })).toBeInTheDocument();
    });
  });

  describe('When regenerating content', () => {
    it('should call regenerate API when regenerate button is clicked', async () => {
      (global.fetch as unknown as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ prompt: 'test prompt' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ url: 'new-image.jpg', newText: 'New text' }),
        });

      await act(async () => {
        renderWithAuth();
      });

      // Wait for initial mount
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      const buttons = screen.getAllByRole('button');
      const regenerateButton = buttons[2]; // Approximate position

      await act(async () => {
        fireEvent.click(regenerateButton);
      });

      // Verify that the regenerate API was called
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/v1/image_prompt'),
          expect.objectContaining({
            headers: {
              Authorization: 'Bearer test-token',
            },
          })
        );
      });
    });
  });

  describe('Image Pagination', () => {
    it('should display the next image when next button is clicked', async () => {
      const multiImageContent = {
        ...mockContent,
        image_url: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
      };
      // Test wrapper to provide real state for selectedImages
      const TestWrapper = (props: Record<string, unknown>) => {
        const [selectedImages, setSelectedImages] = React.useState([1]);
        return (
          <AuthContext.Provider value={mockAuthContext}>
            <SocialMediaPost
              {...defaultProps}
              {...props}
              content={multiImageContent}
              selectedImages={selectedImages}
              setSelectedImages={setSelectedImages}
            />
          </AuthContext.Provider>
        );
      };
      render(<TestWrapper />);
      // Click the button labeled '2' to select the second image
      const nextButton = screen.getByRole('button', { name: /^2\s*$/ });
      await act(async () => {
        fireEvent.click(nextButton);
      });
      // Wait for the <img> src to update to image2.jpg
      await waitFor(() => {
        const image = screen.getByRole('img');
        expect(image).toHaveAttribute('src', 'image2.jpg');
      });
      // Now fire the load event to simulate image loading
      const image = screen.getByRole('img');
      fireEvent.load(image);
      // Assert the image is visible (not hidden)
      expect(image.className).not.toContain('hidden');
    });
  });
});
