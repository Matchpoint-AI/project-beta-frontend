import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

import ErrorToast from './ErrorToast';

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  FaCheckCircle: vi.fn(({ className }) => (
    <div data-testid="success-icon" className={className}>✓</div>
  )),
}));

vi.mock('react-icons/io5', () => ({
  IoAlertCircle: vi.fn(({ className }) => (
    <div data-testid="error-icon" className={className}>!</div>
  )),
}));

vi.mock('react-icons/md', () => ({
  MdClose: vi.fn(({ size }) => (
    <div data-testid="close-icon" data-size={size}>×</div>
  )),
}));

describe('ErrorToast', () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    message: 'Test message',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Visibility', () => {
    it('should not render when open is false', () => {
      // Arrange
      const props = { ...defaultProps, open: false };

      // Act
      render(<ErrorToast {...props} />);

      // Assert
      expect(screen.queryByText('Test message')).not.toBeInTheDocument();
    });

    it('should render when open is true', () => {
      // Arrange
      const props = { ...defaultProps, open: true };

      // Act
      render(<ErrorToast {...props} />);

      // Assert
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });
  });

  describe('Error State (Default)', () => {
    it('should display error title by default', () => {
      // Arrange
      const props = { ...defaultProps };

      // Act
      render(<ErrorToast {...props} />);

      // Assert
      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    it('should display error icon by default', () => {
      // Arrange
      const props = { ...defaultProps };

      // Act
      render(<ErrorToast {...props} />);

      // Assert
      expect(screen.getByTestId('error-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('success-icon')).not.toBeInTheDocument();
    });

    it('should not display button by default for error state', () => {
      // Arrange
      const props = { ...defaultProps };

      // Act
      render(<ErrorToast {...props} />);

      // Assert
      expect(screen.queryByRole('button', { name: /continue/i })).not.toBeInTheDocument();
    });

    it('should apply purple styling for error state', () => {
      // Arrange
      const props = { ...defaultProps, buttonText: 'Retry' };

      // Act
      render(<ErrorToast {...props} />);

      // Assert
      const errorIcon = screen.getByTestId('error-icon');
      expect(errorIcon).toHaveClass('text-purple-600');
    });
  });

  describe('Success State', () => {
    it('should display success title when success is true', () => {
      // Arrange
      const props = { ...defaultProps, success: true };

      // Act
      render(<ErrorToast {...props} />);

      // Assert
      expect(screen.getByText('Success')).toBeInTheDocument();
    });

    it('should display success icon when success is true', () => {
      // Arrange
      const props = { ...defaultProps, success: true };

      // Act
      render(<ErrorToast {...props} />);

      // Assert
      expect(screen.getByTestId('success-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('error-icon')).not.toBeInTheDocument();
    });

    it('should display continue button by default for success state', () => {
      // Arrange
      const props = { ...defaultProps, success: true };

      // Act
      render(<ErrorToast {...props} />);

      // Assert
      expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
    });

    it('should apply green styling for success state', () => {
      // Arrange
      const props = { ...defaultProps, success: true };

      // Act
      render(<ErrorToast {...props} />);

      // Assert
      const successIcon = screen.getByTestId('success-icon');
      expect(successIcon).toHaveClass('text-green-600');
    });
  });

  describe('Custom Props', () => {
    it('should display custom title when provided', () => {
      // Arrange
      const props = { ...defaultProps, title: 'Custom Title' };

      // Act
      render(<ErrorToast {...props} />);

      // Assert
      expect(screen.getByText('Custom Title')).toBeInTheDocument();
      expect(screen.queryByText('Error')).not.toBeInTheDocument();
    });

    it('should display custom button text when provided', () => {
      // Arrange
      const props = { ...defaultProps, buttonText: 'Retry' };

      // Act
      render(<ErrorToast {...props} />);

      // Assert
      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    });

    it('should handle JSX element as message', () => {
      // Arrange
      const jsxMessage = <span data-testid="jsx-message">JSX Message</span>;
      const props = { ...defaultProps, message: jsxMessage };

      // Act
      render(<ErrorToast {...props} />);

      // Assert
      expect(screen.getByTestId('jsx-message')).toBeInTheDocument();
      expect(screen.getByText('JSX Message')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call onClose when close button is clicked', () => {
      // Arrange
      const mockOnClose = vi.fn();
      const props = { ...defaultProps, onClose: mockOnClose };

      // Act
      render(<ErrorToast {...props} />);
      const closeButton = screen.getByLabelText('Close');
      fireEvent.click(closeButton);

      // Assert
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when clicking outside modal', () => {
      // Arrange
      const mockOnClose = vi.fn();
      const props = { ...defaultProps, onClose: mockOnClose };

      // Act
      render(<ErrorToast {...props} />);
      // Find the backdrop element by its className since it doesn't have a role
      const backdrop = document.querySelector('.absolute.inset-0.-z-10');
      if (backdrop) {
        fireEvent.click(backdrop);
      }

      // Assert
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call custom onButtonClick when provided', () => {
      // Arrange
      const mockOnButtonClick = vi.fn();
      const mockOnClose = vi.fn();
      const props = {
        ...defaultProps,
        buttonText: 'Custom Action',
        onButtonClick: mockOnButtonClick,
        onClose: mockOnClose,
      };

      // Act
      render(<ErrorToast {...props} />);
      const actionButton = screen.getByRole('button', { name: 'Custom Action' });
      fireEvent.click(actionButton);

      // Assert
      expect(mockOnButtonClick).toHaveBeenCalledTimes(1);
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should call onClose when action button is clicked and no custom onButtonClick is provided', () => {
      // Arrange
      const mockOnClose = vi.fn();
      const props = {
        ...defaultProps,
        buttonText: 'Okay',
        onClose: mockOnClose,
      };

      // Act
      render(<ErrorToast {...props} />);
      const actionButton = screen.getByRole('button', { name: 'Okay' });
      fireEvent.click(actionButton);

      // Assert
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-label for close button', () => {
      // Arrange
      const props = { ...defaultProps };

      // Act
      render(<ErrorToast {...props} />);

      // Assert
      const closeButton = screen.getByLabelText('Close');
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveAttribute('aria-label', 'Close');
    });

    it('should render close icon with correct size', () => {
      // Arrange
      const props = { ...defaultProps };

      // Act
      render(<ErrorToast {...props} />);

      // Assert
      const closeIcon = screen.getByTestId('close-icon');
      expect(closeIcon).toHaveAttribute('data-size', '20');
    });

    it('should use semantic HTML structure', () => {
      // Arrange
      const props = { ...defaultProps, title: 'Test Title', buttonText: 'Test Button' };

      // Act
      render(<ErrorToast {...props} />);

      // Assert
      expect(screen.getByRole('heading', { level: 3, name: 'Test Title' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Test Button' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply correct CSS classes for modal overlay', () => {
      // Arrange
      const props = { ...defaultProps };

      // Act
      render(<ErrorToast {...props} />);

      // Assert
      const overlay = screen.getByText('Test message').closest('.fixed');
      expect(overlay).toHaveClass(
        'fixed',
        'inset-0',
        'z-50',
        'flex',
        'items-center',
        'justify-center',
        'bg-black/50',
        'p-4'
      );
    });

    it('should apply correct button styling for success state', () => {
      // Arrange
      const props = { ...defaultProps, success: true };

      // Act
      render(<ErrorToast {...props} />);

      // Assert
      const button = screen.getByRole('button', { name: 'Continue' });
      expect(button).toHaveClass('bg-green-600', 'hover:bg-green-700');
    });

    it('should apply correct button styling for error state', () => {
      // Arrange
      const props = { ...defaultProps, buttonText: 'Retry' };

      // Act
      render(<ErrorToast {...props} />);

      // Assert
      const button = screen.getByRole('button', { name: 'Retry' });
      expect(button).toHaveClass('bg-purple-600', 'hover:bg-purple-700');
    });
  });

  describe('Edge Cases', () => {
    it('should handle null buttonText', () => {
      // Arrange
      const props = { ...defaultProps, buttonText: null };

      // Act
      render(<ErrorToast {...props} />);

      // Assert
      expect(screen.queryByRole('button', { name: /continue|retry/i })).not.toBeInTheDocument();
      expect(screen.getByLabelText('Close')).toBeInTheDocument(); // Only close button should be present
    });

    it('should handle empty message string', () => {
      // Arrange
      const props = { ...defaultProps, message: '' };

      // Act
      render(<ErrorToast {...props} />);

      // Assert
      const messageElement = screen.getByText('Error').parentElement?.querySelector('p');
      expect(messageElement).toBeInTheDocument();
      expect(messageElement).toHaveTextContent('');
    });

    it('should handle undefined onButtonClick gracefully', () => {
      // Arrange
      const mockOnClose = vi.fn();
      const props = {
        ...defaultProps,
        buttonText: 'Test',
        onButtonClick: undefined,
        onClose: mockOnClose,
      };

      // Act
      render(<ErrorToast {...props} />);
      const button = screen.getByRole('button', { name: 'Test' });
      fireEvent.click(button);

      // Assert
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });
});