import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AudienceDetails from './AudienceDetails';

// Mock the child components
vi.mock('../shared/components/ui/SparklesMessage', () => ({
  SparklesMessage: vi.fn(({ children }) => <div data-testid="sparkles-message">{children}</div>),
}));

vi.mock('../shared/components/ui/EditBlock', () => ({
  default: vi.fn(({ disabled, onClick, className }) => (
    <button data-testid="edit-block" disabled={disabled} onClick={onClick} className={className}>
      Edit
    </button>
  )),
}));

vi.mock('../shared/components/ui/ChipComponent', () => ({
  default: vi.fn(({ label, index, onClose, onSelect, className }) => (
    <span data-testid={`chip-${index}`} className={className} onClick={() => onSelect()}>
      {label}
      <button data-testid={`chip-close-${index}`} onClick={() => onClose(index)}>
        ×
      </button>
    </span>
  )),
}));

vi.mock('../features/onboarding/components/ChipsEditBlock', () => ({
  default: vi.fn(({ max, initValues, saveValues, closeEdit, className, genre }) => (
    <div data-testid="chips-edit-block" className={className}>
      <input
        data-testid="edit-input"
        placeholder={`Add ${genre}`}
        onChange={(e) => {
          if (e.target.value) {
            saveValues([...initValues, e.target.value]);
          }
        }}
      />
      <button data-testid="close-edit" onClick={closeEdit}>
        Save
      </button>
      <span data-testid="max-items">Max: {max}</span>
    </div>
  )),
}));

describe('AudienceDetails', () => {
  const mockSetValues = vi.fn();
  const defaultProps = {
    values: ['happiness', 'excitement'],
    setValues: mockSetValues,
    title: 'Audience Emotions',
    description: 'Select emotions that resonate with your audience',
    genre: 'emotion' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the title', () => {
      // Arrange & Act
      render(<AudienceDetails {...defaultProps} />);

      // Assert
      expect(screen.getByText('Audience Emotions')).toBeInTheDocument();
    });

    it('should render the description when provided', () => {
      // Arrange & Act
      render(<AudienceDetails {...defaultProps} />);

      // Assert
      expect(
        screen.getByText('Select emotions that resonate with your audience')
      ).toBeInTheDocument();
    });

    it('should not render description when not provided', () => {
      // Arrange
      const propsWithoutDescription = { ...defaultProps, description: undefined };

      // Act
      render(<AudienceDetails {...propsWithoutDescription} />);

      // Assert
      expect(
        screen.queryByText('Select emotions that resonate with your audience')
      ).not.toBeInTheDocument();
    });

    it('should render SparklesMessage with correct content', () => {
      // Arrange & Act
      render(<AudienceDetails {...defaultProps} />);

      // Assert
      const sparklesMessage = screen.getByTestId('sparkles-message');
      expect(sparklesMessage).toBeInTheDocument();
      expect(sparklesMessage).toHaveTextContent(
        'Matchpoint tailored these suggestions to your brand. They inform the scenes and activities shown in your content—feel free to edit/add more up to 3 total'
      );
    });

    it('should render edit block with correct properties', () => {
      // Arrange & Act
      render(<AudienceDetails {...defaultProps} />);

      // Assert
      const editBlock = screen.getByTestId('edit-block');
      expect(editBlock).toBeInTheDocument();
      expect(editBlock).not.toBeDisabled();
      expect(editBlock).toHaveClass('ml-auto');
    });
  });

  describe('Values Display', () => {
    it('should render all values as chips when not in edit mode', () => {
      // Arrange & Act
      render(<AudienceDetails {...defaultProps} />);

      // Assert
      expect(screen.getByTestId('chip-0')).toHaveTextContent('happiness');
      expect(screen.getByTestId('chip-1')).toHaveTextContent('excitement');
    });

    it('should handle empty values array', () => {
      // Arrange
      const propsWithEmptyValues = { ...defaultProps, values: [] };

      // Act
      render(<AudienceDetails {...propsWithEmptyValues} />);

      // Assert
      expect(screen.queryByTestId('chip-0')).not.toBeInTheDocument();
    });

    it('should apply correct container styling based on values length', () => {
      // Arrange
      const propsWithEmptyValues = { ...defaultProps, values: [] };

      // Act
      render(<AudienceDetails {...propsWithEmptyValues} />);

      // Assert
      const container = document.querySelector('.bg-\\[\\#F9FAFB\\]');
      expect(container).toHaveStyle({
        height: '56px',
        padding: '0px 16px',
      });
    });

    it('should apply fit-content styling when values exist', () => {
      // Arrange & Act
      render(<AudienceDetails {...defaultProps} />);

      // Assert
      const container = document.querySelector('.bg-\\[\\#F9FAFB\\]');
      expect(container).toHaveStyle({
        height: 'fit-content',
        padding: '14px 16px',
      });
    });
  });

  describe('Edit Mode', () => {
    it('should enter edit mode when edit button is clicked', () => {
      // Arrange
      render(<AudienceDetails {...defaultProps} />);
      const editButton = screen.getByTestId('edit-block');

      // Act
      fireEvent.click(editButton);

      // Assert
      expect(screen.getByTestId('chips-edit-block')).toBeInTheDocument();
      expect(screen.queryByTestId('chip-0')).not.toBeInTheDocument();
    });

    it('should disable edit button when in edit mode', () => {
      // Arrange
      render(<AudienceDetails {...defaultProps} />);
      const editButton = screen.getByTestId('edit-block');

      // Act
      fireEvent.click(editButton);

      // Assert
      expect(editButton).toBeDisabled();
    });

    it('should show ChipsEditBlock with correct props in edit mode', () => {
      // Arrange
      render(<AudienceDetails {...defaultProps} />);
      const editButton = screen.getByTestId('edit-block');

      // Act
      fireEvent.click(editButton);

      // Assert
      const editBlock = screen.getByTestId('chips-edit-block');
      expect(editBlock).toBeInTheDocument();
      expect(editBlock).toHaveClass('mt-3');
      expect(screen.getByTestId('max-items')).toHaveTextContent('Max: 3');
    });

    it('should exit edit mode when close edit is clicked', () => {
      // Arrange
      render(<AudienceDetails {...defaultProps} />);
      fireEvent.click(screen.getByTestId('edit-block'));

      // Act
      fireEvent.click(screen.getByTestId('close-edit'));

      // Assert
      expect(screen.queryByTestId('chips-edit-block')).not.toBeInTheDocument();
      expect(screen.getByTestId('chip-0')).toBeInTheDocument();
    });
  });

  describe('Chip Management', () => {
    it('should handle chip removal correctly', () => {
      // Arrange
      render(<AudienceDetails {...defaultProps} />);
      const closeButton = screen.getByTestId('chip-close-0');

      // Act
      fireEvent.click(closeButton);

      // Assert
      expect(mockSetValues).toHaveBeenCalledWith(['excitement']);
    });

    it('should handle removal of last chip', () => {
      // Arrange
      const propsWithOneValue = { ...defaultProps, values: ['happiness'] };
      render(<AudienceDetails {...propsWithOneValue} />);
      const closeButton = screen.getByTestId('chip-close-0');

      // Act
      fireEvent.click(closeButton);

      // Assert
      expect(mockSetValues).toHaveBeenCalledWith([]);
    });

    it('should handle removal of middle chip', () => {
      // Arrange
      const propsWithThreeValues = {
        ...defaultProps,
        values: ['happiness', 'excitement', 'joy'],
      };
      render(<AudienceDetails {...propsWithThreeValues} />);
      const closeButton = screen.getByTestId('chip-close-1');

      // Act
      fireEvent.click(closeButton);

      // Assert
      expect(mockSetValues).toHaveBeenCalledWith(['happiness', 'joy']);
    });

    it('should not mutate original values array when removing chip', () => {
      // Arrange
      const originalValues = ['happiness', 'excitement'];
      const propsWithTrackedValues = { ...defaultProps, values: originalValues };
      render(<AudienceDetails {...propsWithTrackedValues} />);
      const closeButton = screen.getByTestId('chip-close-0');

      // Act
      fireEvent.click(closeButton);

      // Assert
      expect(originalValues).toEqual(['happiness', 'excitement']); // Original array unchanged
      expect(mockSetValues).toHaveBeenCalledWith(['excitement']);
    });
  });

  describe('Different Genres', () => {
    it('should handle interests genre correctly', () => {
      // Arrange
      const interestsProps = {
        ...defaultProps,
        genre: 'interests' as const,
        title: 'Audience Interests',
        values: ['technology', 'sports'],
      };

      // Act
      render(<AudienceDetails {...interestsProps} />);
      fireEvent.click(screen.getByTestId('edit-block'));

      // Assert
      expect(screen.getByTestId('chips-edit-block')).toBeInTheDocument();
      expect(screen.getByTestId('edit-input')).toHaveAttribute('placeholder', 'Add interests');
    });

    it('should handle emotion genre correctly', () => {
      // Arrange & Act
      render(<AudienceDetails {...defaultProps} />);
      fireEvent.click(screen.getByTestId('edit-block'));

      // Assert
      expect(screen.getByTestId('edit-input')).toHaveAttribute('placeholder', 'Add emotion');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      // Arrange & Act
      render(<AudienceDetails {...defaultProps} />);

      // Assert
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Audience Emotions');
      expect(heading).toHaveAttribute('title', 'email');
    });

    it('should have proper button roles', () => {
      // Arrange & Act
      render(<AudienceDetails {...defaultProps} />);

      // Assert
      expect(screen.getByTestId('edit-block')).toBeInTheDocument();
      expect(screen.getByTestId('chip-close-0')).toBeInTheDocument();

      // Verify they are buttons
      expect(screen.getByTestId('edit-block').tagName).toBe('BUTTON');
      expect(screen.getByTestId('chip-close-0').tagName).toBe('BUTTON');
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined values gracefully', () => {
      // Arrange
      const propsWithUndefinedValues = { ...defaultProps, values: [] };

      // Act & Assert
      expect(() => render(<AudienceDetails {...propsWithUndefinedValues} />)).not.toThrow();
    });

    it('should handle empty string values', () => {
      // Arrange
      const propsWithEmptyStrings = { ...defaultProps, values: ['', 'valid'] };

      // Act
      render(<AudienceDetails {...propsWithEmptyStrings} />);

      // Assert
      expect(screen.getByTestId('chip-0')).toBeInTheDocument();
      expect(screen.getByTestId('chip-1')).toHaveTextContent('valid');
    });

    it('should maintain chip order when removing items', () => {
      // Arrange
      const propsWithOrderedValues = {
        ...defaultProps,
        values: ['first', 'second', 'third', 'fourth'],
      };
      render(<AudienceDetails {...propsWithOrderedValues} />);

      // Act
      fireEvent.click(screen.getByTestId('chip-close-1')); // Remove 'second'

      // Assert
      expect(mockSetValues).toHaveBeenCalledWith(['first', 'third', 'fourth']);
    });
  });
});
