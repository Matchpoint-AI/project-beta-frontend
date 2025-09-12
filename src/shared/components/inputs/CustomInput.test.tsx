import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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

// Mock mui-chips-input
vi.mock('mui-chips-input', () => ({
  MuiChipsInput: ({ value, onChange, renderChip, ...props }: any) => {
    return (
      <div data-testid="mui-chips-input" {...props}>
        <input
          data-testid="chips-input-field"
          onChange={(e) => {
            const newValue = (e.target as HTMLInputElement).value;
            if (newValue && !value.includes(newValue)) {
              onChange([...value, newValue]);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.target as HTMLInputElement).value) {
              const newValue = (e.target as HTMLInputElement).value;
              if (!value.includes(newValue)) {
                onChange([...value, newValue]);
              }
              (e.target as HTMLInputElement).value = '';
            }
          }}
        />
        <div data-testid="chips-container">
          {value.map((chip: string, index: number) =>
            renderChip('div', `chip-${index}`, { index, label: chip })
          )}
        </div>
      </div>
    );
  },
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
      expect(screen.getByTestId('chips-input-field')).toBeInTheDocument();
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

  describe('Adding Chips', () => {
    it('should add new chip when value is entered', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<CustomInput {...defaultProps} options={[]} />);
      const input = screen.getByTestId('chips-input-field');

      // Act
      await user.type(input, 'New Option');
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      // Assert
      expect(mockSetOptions).toHaveBeenCalledWith(['New Option']);
    });

    it('should add multiple chips', async () => {
      // Arrange
      const user = userEvent.setup();
      const { rerender } = render(<CustomInput {...defaultProps} options={[]} />);
      const input = screen.getByTestId('chips-input-field');

      // Act - Add first chip
      await user.type(input, 'Option 1');
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      expect(mockSetOptions).toHaveBeenCalledWith(['Option 1']);

      // Simulate state update
      rerender(<CustomInput {...defaultProps} options={['Option 1']} />);

      // Add second chip
      await user.type(input, 'Option 2');
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      // Assert
      expect(mockSetOptions).toHaveBeenLastCalledWith(['Option 1', 'Option 2']);
    });

    it('should not add duplicate chips', async () => {
      // Arrange
      const user = userEvent.setup();
      const options = ['Existing Option'];
      render(<CustomInput {...defaultProps} options={options} />);
      const input = screen.getByTestId('chips-input-field');

      // Act
      await user.type(input, 'Existing Option');
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      // Assert
      expect(mockSetOptions).not.toHaveBeenCalled();
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

    it('should delete chip from middle of array', async () => {
      // Arrange
      const user = userEvent.setup();
      const options = ['First', 'Middle', 'Last'];
      render(<CustomInput {...defaultProps} options={options} />);

      const deleteButtons = screen.getAllByTestId('chip-delete');

      // Act - Delete middle chip (index 1)
      await user.click(deleteButtons[1]);

      // Assert
      expect(mockSetOptions).toHaveBeenCalledWith(['First', 'Last']);
    });

    it('should delete last chip', async () => {
      // Arrange
      const user = userEvent.setup();
      const options = ['First', 'Second', 'Last'];
      render(<CustomInput {...defaultProps} options={options} />);

      const deleteButtons = screen.getAllByTestId('chip-delete');

      // Act - Delete last chip (index 2)
      await user.click(deleteButtons[2]);

      // Assert
      expect(mockSetOptions).toHaveBeenCalledWith(['First', 'Second']);
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

  describe('Limit Handling', () => {
    it('should not add chips when at limit', () => {
      // Arrange
      const options = ['1', '2', '3', '4', '5']; // At limit of 5
      render(<CustomInput {...defaultProps} options={options} limit={5} />);
      const input = screen.getByTestId('chips-input-field');

      // Act
      fireEvent.change(input, { target: { value: 'New Option' } });

      // Assert
      expect(mockSetOptions).not.toHaveBeenCalled();
    });

    it('should add chips when under limit', () => {
      // Arrange
      const options = ['1', '2', '3']; // Under limit of 5
      render(<CustomInput {...defaultProps} options={options} limit={5} />);
      const input = screen.getByTestId('chips-input-field');

      // Act
      fireEvent.change(input, { target: { value: 'New Option' } });

      // Assert
      expect(mockSetOptions).toHaveBeenCalledWith(['1', '2', '3', 'New Option']);
    });

    it('should handle unlimited chips when limit is -1', () => {
      // Arrange
      const options = ['1', '2', '3', '4', '5', '6', '7']; // More than 5
      render(<CustomInput {...defaultProps} options={options} limit={-1} />);
      const input = screen.getByTestId('chips-input-field');

      // Act
      fireEvent.change(input, { target: { value: 'Another Option' } });

      // Assert
      expect(mockSetOptions).toHaveBeenCalledWith([...options, 'Another Option']);
    });

    it('should prevent adding when exactly at limit', () => {
      // Arrange
      const options = ['1', '2', '3']; // At limit of 3
      render(<CustomInput {...defaultProps} options={options} limit={3} />);
      const input = screen.getByTestId('chips-input-field');

      // Act
      fireEvent.change(input, { target: { value: 'Should Not Add' } });

      // Assert
      expect(mockSetOptions).not.toHaveBeenCalled();
    });

    it('should allow adding when limit is 0', () => {
      // Arrange - limit 0 should not restrict
      const options = [];
      render(<CustomInput {...defaultProps} options={options} limit={0} />);
      const input = screen.getByTestId('chips-input-field');

      // Act
      fireEvent.change(input, { target: { value: 'Should Add' } });

      // Assert
      expect(mockSetOptions).toHaveBeenCalledWith(['Should Add']);
    });
  });

  describe('Chip Styling and Appearance', () => {
    it('should render chips with correct styling properties', () => {
      // Arrange
      const options = ['Styled Option'];

      // Act
      render(<CustomInput {...defaultProps} options={options} />);

      // Assert
      const chip = screen.getByTestId('mui-chip');
      expect(chip).toHaveAttribute(
        'style',
        expect.stringContaining('backgroundColor: rgb(188, 240, 218)')
      );
      expect(chip).toHaveAttribute('style', expect.stringContaining('color: black'));
      expect(chip).toHaveAttribute('style', expect.stringContaining('borderRadius: 6px'));
    });

    it('should render delete buttons with correct styling', () => {
      // Arrange
      const options = ['Option with Delete'];

      // Act
      render(<CustomInput {...defaultProps} options={options} />);

      // Assert
      const deleteButton = screen.getByTestId('chip-delete');
      expect(deleteButton).toHaveAttribute(
        'style',
        expect.stringContaining('backgroundColor: rgb(188, 240, 218)')
      );
      expect(deleteButton).toHaveAttribute('style', expect.stringContaining('color: gray'));
    });

    it('should apply correct variant to chips', () => {
      // Arrange
      const options = ['Variant Test'];

      // Act
      render(<CustomInput {...defaultProps} options={options} />);

      // Assert
      const chip = screen.getByTestId('mui-chip');
      expect(chip).toHaveAttribute('variant', 'solid');
    });

    it('should apply correct variant to delete buttons', () => {
      // Arrange
      const options = ['Delete Variant Test'];

      // Act
      render(<CustomInput {...defaultProps} options={options} />);

      // Assert
      const deleteButton = screen.getByTestId('chip-delete');
      expect(deleteButton).toHaveAttribute('variant', 'plain');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string input', () => {
      // Arrange
      render(<CustomInput {...defaultProps} options={[]} />);
      const input = screen.getByTestId('chips-input-field');

      // Act
      fireEvent.change(input, { target: { value: '' } });

      // Assert
      expect(mockSetOptions).not.toHaveBeenCalled();
    });

    it('should handle whitespace-only input', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<CustomInput {...defaultProps} options={[]} />);
      const input = screen.getByTestId('chips-input-field');

      // Act
      await user.type(input, '   ');
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      // Assert
      expect(mockSetOptions).toHaveBeenCalledWith(['   ']);
    });

    it('should handle very long chip text', () => {
      // Arrange
      const longText = 'This is a very long option text that might cause layout issues';
      const options = [longText];

      // Act
      render(<CustomInput {...defaultProps} options={options} />);

      // Assert
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('should handle special characters in chip text', () => {
      // Arrange
      const specialChars = ['@#$%^&*()', '!@#$%^&*()_+', '[]{}|;\':",./<>?'];

      // Act
      render(<CustomInput {...defaultProps} options={specialChars} />);

      // Assert
      specialChars.forEach((text) => {
        expect(screen.getByText(text)).toBeInTheDocument();
      });
    });

    it('should handle rapid deletion of multiple chips', async () => {
      // Arrange
      const user = userEvent.setup();
      const options: string[] = ['A', 'B', 'C', 'D', 'E'];
      render(<CustomInput {...defaultProps} options={options} />);

      const deleteButtons = screen.getAllByTestId('chip-delete');

      // Act - Delete multiple chips rapidly
      await user.click(deleteButtons[0]);
      await user.click(deleteButtons[2]); // This would be index 2 in original array

      // Assert
      expect(mockSetOptions).toHaveBeenCalledTimes(2);
      expect(mockSetOptions).toHaveBeenNthCalledWith(1, ['B', 'C', 'D', 'E']);
      expect(mockSetOptions).toHaveBeenNthCalledWith(2, ['A', 'B', 'D', 'E']);
    });
  });

  describe('Props Validation', () => {
    it('should handle negative limit values', () => {
      // Arrange
      const options = ['Test'];

      // Act & Assert - Should not crash with negative limit
      expect(() =>
        render(<CustomInput {...defaultProps} options={options} limit={-5} />)
      ).not.toThrow();
    });

    it('should handle very large limit values', () => {
      // Arrange
      const options = ['Test'];

      // Act & Assert - Should not crash with very large limit
      expect(() =>
        render(<CustomInput {...defaultProps} options={options} limit={999999} />)
      ).not.toThrow();
    });
  });
});
