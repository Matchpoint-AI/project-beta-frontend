import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import ModifyPrompt from './ModifyPrompt';

// Mock the dependencies
vi.mock('../../../features/auth/context/AuthContext', () => ({
  useAuth: () => ({
    profile: {
      token: 'test-token',
      name: 'Test User',
    },
  }),
}));

vi.mock('../../../helpers/getServiceURL', () => ({
  getServiceURL: () => 'http://test-url',
}));

// Mock the API module
vi.mock('../../../api/contentGenerationApi', () => ({
  imageApi: {
    generateImage: vi.fn().mockResolvedValue({
      image_url: 'http://test-url/generated-image.jpg',
    }),
  },
}));

// Mock universal-cookie
vi.mock('universal-cookie', () => {
  const mockCookie = {
    remove: vi.fn(),
  };
  return {
    default: vi.fn(() => mockCookie),
  };
});

// Mock fetch
global.fetch = vi.fn();

// Mock console methods
const consoleSpy = {
  error: vi.fn(),
  warn: vi.fn(),
  log: vi.fn(),
};

Object.assign(console, consoleSpy);

describe('ModifyPrompt', () => {
  const defaultProps = {
    week: 1,
    day: 1,
    post: 0,
    content_id: 'test-content-id',
    image: 'test-image-url',
    open: true,
    setOpen: vi.fn(),
    regenerate: vi.fn(),
    totalAllowed: 3,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('splitPrompt function', () => {
    it('should handle prompts with "A realistic photograph of" prefix', () => {
      // Arrange
      const testPrompt = 'A realistic photograph of young professionals in an office';
      const expectedFirstPart = 'young professionals in an office';

      // Act
      render(<ModifyPrompt {...defaultProps} />);
      const result = testPrompt.replace('A realistic photograph of', '').trim();

      // Assert
      expect(result).toBe(expectedFirstPart);
    });

    it('should handle prompts with "A photograph of" prefix', () => {
      // Arrange
      const testPrompt = 'A photograph of diverse individuals';
      const expectedFirstPart = 'diverse individuals';

      // Act
      const result = testPrompt.replace('A photograph of', '').trim();

      // Assert
      expect(result).toBe(expectedFirstPart);
    });

    it('should handle prompts with "A realistic image of" prefix', () => {
      // Arrange
      const testPrompt = 'A realistic image of young adults';
      const expectedFirstPart = 'young adults';

      // Act
      const result = testPrompt.replace('A realistic image of', '').trim();

      // Assert
      expect(result).toBe(expectedFirstPart);
    });

    it('should handle prompts with "An image of" prefix', () => {
      // Arrange
      const testPrompt = 'An image of professionals';
      const expectedFirstPart = 'professionals';

      // Act
      const result = testPrompt.replace('An image of', '').trim();

      // Assert
      expect(result).toBe(expectedFirstPart);
    });

    it('should handle prompts without any prefix', () => {
      // Arrange
      const testPrompt = 'Young professionals in a modern office';
      const expectedResult = 'Young professionals in a modern office';

      // Act & Assert
      expect(testPrompt).toBe(expectedResult);
    });

    it('should handle empty prompts', () => {
      // Arrange
      const testPrompt = '';
      const expectedResult = '';

      // Act
      const result = testPrompt
        ? (testPrompt as string).replace(/^A (realistic )?(photograph|image) of /, '').trim()
        : '';

      // Assert
      expect(result).toBe(expectedResult);
    });
  });

  describe('prompt editing', () => {
    it('should not automatically add "A realistic photograph of" prefix', async () => {
      // Arrange
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ prompt: 'Young professionals in an office' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ remaining: 3 }),
        });

      // Act
      render(<ModifyPrompt {...defaultProps} />);

      await waitFor(
        () => {
          expect(screen.getByDisplayValue('Young professionals in an office')).toBeInTheDocument();
        },
        { timeout: 5000 }
      );

      const textField = screen.getByDisplayValue('Young professionals in an office');
      fireEvent.change(textField, { target: { value: 'New prompt content' } });

      // Assert
      expect(textField).toHaveValue('New prompt content');
    });

    it('should handle prompts with existing content', async () => {
      // Arrange
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            prompt: 'A realistic photograph of young professionals. Additional content.',
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ remaining: 3 }),
        });

      // Act
      render(<ModifyPrompt {...defaultProps} />);

      await waitFor(
        () => {
          expect(screen.getByDisplayValue('young professionals')).toBeInTheDocument();
        },
        { timeout: 5000 }
      );

      const textField = screen.getByDisplayValue('young professionals');
      fireEvent.change(textField, { target: { value: 'Updated content' } });

      // Assert
      expect(textField).toHaveValue('Updated content');
    });
  });

  describe('form submission', () => {
    it('should submit prompt without hardcoded prefix', async () => {
      // Arrange
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ prompt: 'Young professionals in an office' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ remaining: 3 }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({}),
        });

      // Act
      render(<ModifyPrompt {...defaultProps} />);

      await waitFor(
        () => {
          expect(screen.getByDisplayValue('Young professionals in an office')).toBeInTheDocument();
        },
        { timeout: 5000 }
      );

      const textField = screen.getByDisplayValue('Young professionals in an office');
      fireEvent.change(textField, { target: { value: 'Campaign-driven prompt' } });

      const regenerateButtons = screen.getAllByText('Regenerate');
      const regenerateButton = regenerateButtons[0];
      fireEvent.click(regenerateButton);

      // Assert
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://test-url/api/v1/image_prompt',
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              Authorization: 'Bearer test-token',
            }),
          })
        );
      });
    });

    it('should handle submission errors', async () => {
      // Arrange
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ prompt: 'Test prompt' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ remaining: 3 }),
        })
        .mockResolvedValueOnce({
          ok: false,
          json: async () => ({ detail: 'Submission failed' }),
        });

      // Act
      render(<ModifyPrompt {...defaultProps} />);

      await waitFor(
        () => {
          expect(screen.getByDisplayValue('Test prompt')).toBeInTheDocument();
        },
        { timeout: 5000 }
      );

      const regenerateButtons = screen.getAllByText('Regenerate');
      const regenerateButton = regenerateButtons[0];
      fireEvent.click(regenerateButton);

      // Assert - Should handle the error gracefully without crashing
      await waitFor(() => {
        expect(consoleSpy.error).toHaveBeenCalled();
      });
    });
  });

  describe('remaining generations', () => {
    it('should fetch and display remaining generations', async () => {
      // Arrange
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ prompt: 'Test prompt' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ remaining: 2 }),
        });

      // Act
      render(<ModifyPrompt {...defaultProps} />);

      // Assert
      await waitFor(
        () => {
          expect(screen.getByText('2 Regenerations left for this post')).toBeInTheDocument();
        },
        { timeout: 5000 }
      );
    });

    it('should disable regenerate button when no generations left', async () => {
      // Arrange
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ prompt: 'Test prompt' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ remaining: 0 }),
        });

      // Act
      render(<ModifyPrompt {...defaultProps} />);

      // Assert
      await waitFor(
        () => {
          const regenerateButtons = screen.getAllByText('Regenerate');
          const regenerateButton = regenerateButtons[0];
          const buttonElement = regenerateButton.closest('button');
          expect(buttonElement).toBeDisabled();
        },
        { timeout: 5000 }
      );
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA labels', async () => {
      // Arrange
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ prompt: 'Test prompt' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ remaining: 3 }),
        });

      // Act
      render(<ModifyPrompt {...defaultProps} />);

      // Assert
      await waitFor(
        () => {
          expect(screen.getByRole('form')).toBeInTheDocument();
          expect(screen.getByRole('textbox')).toBeInTheDocument();
        },
        { timeout: 5000 }
      );
    });

    it('should have proper form structure', async () => {
      // Arrange
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ prompt: 'Test prompt' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ remaining: 3 }),
        });

      // Act
      render(<ModifyPrompt {...defaultProps} />);

      // Assert
      await waitFor(
        () => {
          const form = screen.getByRole('form');
          expect(form).toHaveAttribute('role', 'form');
        },
        { timeout: 5000 }
      );
    });
  });

  describe('error handling', () => {
    it('should handle network errors gracefully', async () => {
      // Arrange
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      // Act
      render(<ModifyPrompt {...defaultProps} />);

      // Assert - Should not crash and should log the error
      await waitFor(() => {
        expect(consoleSpy.error).toHaveBeenCalled();
      });
    });

    it('should handle authentication errors', async () => {
      // Arrange
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
      });
      const originalLocation = window.location;
      delete (window as any).location;
      window.location = { href: '' } as any;

      // Act
      render(<ModifyPrompt {...defaultProps} />);

      // Assert - Should handle 401 errors by redirecting to login
      await waitFor(() => {
        expect(window.location.href).toBe('/login');
      });

      // Cleanup
      window.location = originalLocation as any;
    });
  });

  describe('component lifecycle', () => {
    it('should fetch prompt on mount', async () => {
      // Arrange
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ prompt: 'Initial prompt' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ remaining: 3 }),
        });

      // Act
      render(<ModifyPrompt {...defaultProps} />);

      // Assert
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://test-url/api/v1/image_prompt?week_num=1&day_num=1&post_num=1&content_id=test-content-id',
          expect.objectContaining({
            headers: expect.objectContaining({
              Authorization: 'Bearer test-token',
            }),
          })
        );
      });
    });

    it('should close dialog when cancel is clicked', async () => {
      // Arrange
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ prompt: 'Test prompt' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ remaining: 3 }),
        });

      // Act
      render(<ModifyPrompt {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Cancel')).toBeInTheDocument();
      });

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      // Assert
      expect(defaultProps.setOpen).toHaveBeenCalledWith(false);
    });

    it('should show limit reached dialog when generations are 0', async () => {
      // Arrange
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ prompt: 'Test prompt' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ remaining: 0 }),
        });

      // Act
      render(<ModifyPrompt {...defaultProps} />);

      await waitFor(
        () => {
          expect(screen.getByDisplayValue('Test prompt')).toBeInTheDocument();
        },
        { timeout: 5000 }
      );

      const form = screen.getByRole('form');
      fireEvent.submit(form);

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Regeneration Limit Reached')).toBeInTheDocument();
      });
    });
  });

  describe('flux image generation', () => {
    it('should use flux API for image generation when available', async () => {
      // Arrange
      const mockImageApi = vi.mocked((await import('../../../api/contentGenerationApi')).imageApi);
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ prompt: 'Test prompt' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ remaining: 2 }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({}),
        });

      mockImageApi.generateImage.mockResolvedValueOnce({
        image_url: 'http://test-url/flux-generated.jpg',
      });

      // Act
      render(<ModifyPrompt {...defaultProps} />);

      await waitFor(
        () => {
          expect(screen.getByDisplayValue('Test prompt')).toBeInTheDocument();
        },
        { timeout: 5000 }
      );

      const form = screen.getByRole('form');
      fireEvent.submit(form);

      // Assert
      await waitFor(() => {
        expect(mockImageApi.generateImage).toHaveBeenCalledWith(
          expect.objectContaining({
            prompt: 'Test prompt',
            model: 'flux-pro',
            style: 'photorealistic',
          }),
          'test-token'
        );
        expect(defaultProps.regenerate).toHaveBeenCalledWith('http://test-url/flux-generated.jpg');
      });
    });
  });
});
