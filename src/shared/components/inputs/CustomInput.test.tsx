import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CustomInput from './CustomInput';

// Mock MUI Joy components
vi.mock('@mui/joy/Chip', () => ({
  default: ({ children, endDecorator, ...props }: any) => (
    <div data-testid="mui-chip" {...props}>
      {children}
      {endDecorator}
    </div>
  ),
}));

vi.mock('@mui/joy/ChipDelete', () => ({
  default: ({ onDelete, children, ...props }: any) => (
    <button data-testid="chip-delete" onClick={() => onDelete()} {...props}>
      {children || 'Delete'}
    </button>
  ),
}));

// Mock mui-chips-input with minimal functionality
vi.mock('mui-chips-input', () => ({
  MuiChipsInput: ({ value, renderChip, ...props }: any) => (
    <div data-testid="mui-chips-input" {...props}>
      <div data-testid="chips-container">
        {value.map((chip: string, index: number) =>
          renderChip('div', `chip-${index}`, { index, label: chip })
        )}
      </div>
    </div>
  ),
}));

describe('CustomInput', () => {
  const mockSetOptions = vi.fn();

  const defaultProps = {
    options: [],
    setOptions: mockSetOptions,
    limit: 5,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the chips input component', () => {
      // Arrange & Act
      render(<CustomInput {...defaultProps} />);

      // Assert
      expect(screen.getByTestId('mui-chips-input')).toBeInTheDocument();
    });

    it('should render existing chips', () => {
      // Arrange
      const options = ['Option 1', 'Option 2', 'Option 3'];

      // Act
      render(<CustomInput {...defaultProps} options={options} />);

      // Assert
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();

      const chips = screen.getAllByTestId('mui-chip');
      expect(chips).toHaveLength(3);
    });

    it('should render chips with delete buttons', () => {
      // Arrange
      const options = ['Deletable Option'];

      // Act
      render(<CustomInput {...defaultProps} options={options} />);

      // Assert
      expect(screen.getByText('Deletable Option')).toBeInTheDocument();
      expect(screen.getByTestId('chip-delete')).toBeInTheDocument();
    });

    it('should render with empty options array', () => {
      // Arrange & Act
      render(<CustomInput {...defaultProps} options={[]} />);

      // Assert
      expect(screen.getByTestId('mui-chips-input')).toBeInTheDocument();
      expect(screen.queryByTestId('mui-chip')).not.toBeInTheDocument();
    });
  });

  describe('Deleting Chips', () => {
    it('should delete chip when delete button is clicked', async () => {
      // Arrange
      const user = userEvent.setup();
      const options = ['Option 1', 'Option 2', 'Option 3'];
      render(<CustomInput {...defaultProps} options={options} />);

      // Get the first delete button
      const deleteButtons = screen.getAllByTestId('chip-delete');

      // Act - Delete first chip (index 0)
      await user.click(deleteButtons[0]);

      // Assert
      expect(mockSetOptions).toHaveBeenCalledWith(['Option 2', 'Option 3']);
    });

    it('should handle deleting all chips', async () => {
      // Arrange
      const user = userEvent.setup();
      const options = ['Only Option'];
      render(<CustomInput {...defaultProps} options={options} />);

      const deleteButton = screen.getByTestId('chip-delete');

      // Act
      await user.click(deleteButton);

      // Assert
      expect(mockSetOptions).toHaveBeenCalledWith([]);
    });
  });

  describe('Props Handling', () => {
    it('should handle negative limit values without crashing', () => {
      // Arrange
      const options = ['Test'];

      // Act & Assert - Should not crash with negative limit
      expect(() =>
        render(<CustomInput {...defaultProps} options={options} limit={-5} />)
      ).not.toThrow();
    });

    it('should handle very large limit values without crashing', () => {
      // Arrange
      const options = ['Test'];

      // Act & Assert - Should not crash with very large limit
      expect(() =>
        render(<CustomInput {...defaultProps} options={options} limit={999999} />)
      ).not.toThrow();
    });

    it('should handle special characters in chip text', () => {
      // Arrange
      const specialChars = ['@#$%^&*()', 'Test with spaces', 'unicode-∅-test'];

      // Act
      render(<CustomInput {...defaultProps} options={specialChars} />);

      // Assert
      specialChars.forEach((text) => {
        expect(screen.getByText(text)).toBeInTheDocument();
      });
    });
  });
});