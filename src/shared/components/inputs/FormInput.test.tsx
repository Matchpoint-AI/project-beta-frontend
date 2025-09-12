import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormInput from './FormInput';

describe('FormInput', () => {
  const mockSaveInput = vi.fn();
  const mockValidateInput = vi.fn();

  const defaultProps = {
    saveInput: mockSaveInput,
    subject: 'name' as const,
    validateInput: mockValidateInput,
    parentError: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render name input correctly', () => {
      // Arrange & Act
      render(<FormInput {...defaultProps} subject="name" />);

      // Assert
      expect(screen.getByLabelText('name')).toBeInTheDocument();
      expect(screen.getByText('What are you called?')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Company name')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render website input correctly', () => {
      // Arrange & Act
      render(<FormInput {...defaultProps} subject="website" />);

      // Assert
      expect(screen.getByText('Add you business website')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Import information on your brand, products and audience from your website'
        )
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Company website')).toBeInTheDocument();

      // Should render website icon (SVG)
      const svgElement = document.querySelector('svg:not([data-testid="ClearIcon"])');
      expect(svgElement).toBeInTheDocument();
    });

    it('should render clear button', () => {
      // Arrange & Act
      render(<FormInput {...defaultProps} />);

      // Assert
      const clearButton = screen.getByRole('button');
      expect(clearButton).toBeInTheDocument();
      expect(clearButton).toHaveAttribute('type', 'button');
    });

    it('should render with initial value', () => {
      // Arrange
      const initValue = 'Test Company';

      // Act
      render(<FormInput {...defaultProps} initValue={initValue} />);

      // Assert
      const input = screen.getByDisplayValue(initValue);
      expect(input).toBeInTheDocument();
    });
  });

  describe('Input Behavior', () => {
    it('should update input value when typing', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<FormInput {...defaultProps} />);
      const input = screen.getByRole('textbox');

      // Act
      await user.type(input, 'Test Company');

      // Assert
      expect(input).toHaveValue('Test Company');
    });

    it('should handle empty input value correctly', () => {
      // Arrange & Act
      render(<FormInput {...defaultProps} />);
      const input = screen.getByRole('textbox');

      // Assert
      expect(input).toHaveValue('');
    });

    it('should clear input when clear button is clicked', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<FormInput {...defaultProps} />);
      const input = screen.getByRole('textbox');
      const clearButton = screen.getByRole('button');

      // Act - Type something first
      await user.type(input, 'Test Company');
      expect(input).toHaveValue('Test Company');

      // Clear the input
      await user.click(clearButton);

      // Assert
      expect(input).toHaveValue('');
      expect(screen.getByText('please provide a valid name')).toBeInTheDocument();
    });
  });

  describe('Validation', () => {
    it('should validate input on blur with valid input', async () => {
      // Arrange
      const user = userEvent.setup();
      mockValidateInput.mockReturnValue(true);
      render(<FormInput {...defaultProps} />);
      const input = screen.getByRole('textbox');

      // Act
      await user.type(input, 'Valid Company');
      await user.tab(); // Trigger blur

      // Assert
      expect(mockValidateInput).toHaveBeenCalledWith('Valid Company');
      expect(mockSaveInput).toHaveBeenCalledWith('name', 'Valid Company');
      expect(screen.queryByText('please provide a valid name')).not.toBeInTheDocument();
    });

    it('should show error for invalid input on blur', async () => {
      // Arrange
      const user = userEvent.setup();
      mockValidateInput.mockReturnValue(false);
      render(<FormInput {...defaultProps} />);
      const input = screen.getByRole('textbox');

      // Act
      await user.type(input, 'Invalid');
      await user.tab(); // Trigger blur

      // Assert
      expect(mockValidateInput).toHaveBeenCalledWith('Invalid');
      expect(mockSaveInput).not.toHaveBeenCalled();
      expect(screen.getByText('please provide a valid name')).toBeInTheDocument();
    });

    it('should show error for website validation', async () => {
      // Arrange
      const user = userEvent.setup();
      mockValidateInput.mockReturnValue(false);
      render(<FormInput {...defaultProps} subject="website" />);
      const input = screen.getByRole('textbox');

      // Act
      await user.type(input, 'invalid-website');
      await user.tab();

      // Assert
      expect(screen.getByText('please provide a valid website')).toBeInTheDocument();
    });

    it('should validate initial value on mount', () => {
      // Arrange
      mockValidateInput.mockReturnValue(true);
      const initValue = 'Initial Company';

      // Act
      render(<FormInput {...defaultProps} initValue={initValue} />);

      // Assert
      expect(mockValidateInput).toHaveBeenCalledWith(initValue);
      expect(mockSaveInput).toHaveBeenCalledWith('name', initValue);
    });

    it('should handle invalid initial value', () => {
      // Arrange
      mockValidateInput.mockReturnValue(false);
      const initValue = 'Invalid';

      // Act
      render(<FormInput {...defaultProps} initValue={initValue} />);

      // Assert
      expect(mockValidateInput).toHaveBeenCalledWith(initValue);
      expect(mockSaveInput).not.toHaveBeenCalled();
      expect(screen.getByText('please provide a valid name')).toBeInTheDocument();
    });
  });

  describe('Parent Error Handling', () => {
    it('should show error when parentError is true', () => {
      // Arrange & Act
      render(<FormInput {...defaultProps} parentError={true} />);

      // Assert
      expect(screen.getByText('please provide a valid name')).toBeInTheDocument();
    });

    it('should show website error when parentError is true for website', () => {
      // Arrange & Act
      render(<FormInput {...defaultProps} subject="website" parentError={true} />);

      // Assert
      expect(screen.getByText('please provide a valid website')).toBeInTheDocument();
    });

    it('should update error state when parentError changes', () => {
      // Arrange
      const { rerender } = render(<FormInput {...defaultProps} parentError={false} />);
      expect(screen.queryByText('please provide a valid name')).not.toBeInTheDocument();

      // Act - Update parentError to true
      rerender(<FormInput {...defaultProps} parentError={true} />);

      // Assert
      expect(screen.getByText('please provide a valid name')).toBeInTheDocument();
    });
  });

  describe('Error State Styling', () => {
    it('should apply error styling to input border when there is an error', async () => {
      // Arrange
      const user = userEvent.setup();
      mockValidateInput.mockReturnValue(false);
      render(<FormInput {...defaultProps} />);
      const input = screen.getByRole('textbox');

      // Act
      await user.type(input, 'Invalid');
      await user.tab();

      // Assert
      const inputContainer = input.closest('div');
      expect(inputContainer).toHaveStyle({ borderColor: '#F05252' });
    });

    it('should apply normal styling when no error', () => {
      // Arrange & Act
      render(<FormInput {...defaultProps} />);
      const input = screen.getByRole('textbox');

      // Assert
      const inputContainer = input.closest('div');
      expect(inputContainer).toHaveStyle({ borderColor: '#d1d5db' });
    });

    it('should apply error styling to input text color', async () => {
      // Arrange
      const user = userEvent.setup();
      mockValidateInput.mockReturnValue(false);
      render(<FormInput {...defaultProps} />);
      const input = screen.getByRole('textbox');

      // Act
      await user.type(input, 'Invalid');
      await user.tab();

      // Assert
      expect(input).toHaveStyle({ color: '#6c0404' });
    });

    it('should apply normal text color when no error', () => {
      // Arrange & Act
      render(<FormInput {...defaultProps} />);
      const input = screen.getByRole('textbox');

      // Assert
      expect(input).toHaveStyle({ color: '#111827' });
    });
  });

  describe('Clear Button Behavior', () => {
    it('should set error state when clear button is clicked', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<FormInput {...defaultProps} />);
      const clearButton = screen.getByRole('button');

      // Act
      await user.click(clearButton);

      // Assert
      expect(screen.getByText('please provide a valid name')).toBeInTheDocument();
    });

    it('should clear input value immediately when clear button is clicked', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<FormInput {...defaultProps} />);
      const input = screen.getByRole('textbox');
      const clearButton = screen.getByRole('button');

      await user.type(input, 'Some text');
      expect(input).toHaveValue('Some text');

      // Act
      await user.click(clearButton);

      // Assert
      expect(input).toHaveValue('');
    });

    it('should show appropriate error message for website when cleared', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<FormInput {...defaultProps} subject="website" />);
      const clearButton = screen.getByRole('button');

      // Act
      await user.click(clearButton);

      // Assert
      expect(screen.getByText('please provide a valid website')).toBeInTheDocument();
    });
  });

  describe('Icon Rendering', () => {
    it('should render website icon for website subject', () => {
      // Arrange & Act
      render(<FormInput {...defaultProps} subject="website" />);

      // Assert
      const svgElement = document.querySelector('svg');
      expect(svgElement).toBeInTheDocument();
      expect(svgElement?.tagName).toBe('svg');
    });

    it('should not render website icon for name subject', () => {
      // Arrange & Act
      render(<FormInput {...defaultProps} subject="name" />);

      // Assert
      const svgElement = document.querySelector('svg');
      // For name subject, only ClearIcon SVG should be present
      expect(svgElement?.getAttribute('data-testid')).toBe('ClearIcon');
    });

    it('should apply correct icon color based on error state', async () => {
      // Arrange
      const user = userEvent.setup();
      mockValidateInput.mockReturnValue(false);
      render(<FormInput {...defaultProps} subject="website" />);
      const input = screen.getByRole('textbox');

      // Act
      await user.type(input, 'Invalid');
      await user.tab();

      // Assert
      // The SVG is rendered as part of the component structure
      const svgElement = document.querySelector('svg');
      expect(svgElement).toBeInTheDocument();
      const path = svgElement?.querySelector('path');
      expect(path).toHaveAttribute('stroke', '#6c0404');
    });
  });

  describe('Accessibility', () => {
    it('should have proper label association', () => {
      // Arrange & Act
      render(<FormInput {...defaultProps} />);

      // Assert
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id', 'name');
      // Label exists with title attribute
      expect(screen.getByText('What are you called?')).toBeInTheDocument();
    });

    it('should have proper placeholder text', () => {
      // Arrange & Act
      render(<FormInput {...defaultProps} subject="name" />);

      // Assert
      expect(screen.getByPlaceholderText('Company name')).toBeInTheDocument();
    });

    it('should have proper placeholder text for website', () => {
      // Arrange & Act
      render(<FormInput {...defaultProps} subject="website" />);

      // Assert
      expect(screen.getByPlaceholderText('Company website')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined input value', () => {
      // Arrange & Act
      render(<FormInput {...defaultProps} />);
      const input = screen.getByRole('textbox');

      // Assert
      expect(input).toHaveValue('');
    });

    it('should handle multiple validation calls', async () => {
      // Arrange
      const user = userEvent.setup();
      mockValidateInput.mockReturnValue(true);
      render(<FormInput {...defaultProps} />);
      const input = screen.getByRole('textbox');

      // Act
      await user.type(input, 'Test');
      await user.tab();
      await user.click(input);
      await user.type(input, ' Company');
      await user.tab();

      // Assert
      expect(mockValidateInput).toHaveBeenCalledTimes(2);
      expect(mockValidateInput).toHaveBeenLastCalledWith('Test Company');
    });

    it('should handle rapid input changes', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<FormInput {...defaultProps} />);
      const input = screen.getByRole('textbox');

      // Act
      await user.type(input, 'Rapid typing test');

      // Assert
      expect(input).toHaveValue('Rapid typing test');
    });
  });
});
