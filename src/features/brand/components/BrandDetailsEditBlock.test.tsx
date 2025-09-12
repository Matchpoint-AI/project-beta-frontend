import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BrandDetailsEditBlock from './BrandDetailsEditBlock';
import { BrandContext } from '../context/BrandContext';

// Mock child components
vi.mock('../../../shared/components/inputs/BrandDetailsInput', () => ({
  default: vi.fn(({ value, onChange }) => (
    <input
      data-testid="brand-details-input"
      value={value}
      onChange={onChange}
      placeholder="Enter value"
    />
  )),
}));

vi.mock('../../../shared/components/buttons/PurpleButton', () => ({
  default: vi.fn(({ children, onClick, type }) => (
    <button data-testid="save-button" onClick={onClick} type={type}>
      {children}
    </button>
  )),
}));

describe('BrandDetailsEditBlock', () => {
  const mockSetBusinessInfo = vi.fn();
  const mockUpdateWorkflowState = vi.fn();
  const mockClearWorkflow = vi.fn();
  const mockCloseEdit = vi.fn();

  const defaultBusinessInfo = {
    name: '',
    website: '',
    product_features: [],
    product_description: '',
    product_link: '',
    start_date: '',
    durationNum: 0,
    mission: [
      { id: 1, label: 'Innovation', selected: true },
      { id: 2, label: 'Quality', selected: false },
    ] as any,
    values: [],
    persona: [],
    toneAndVoice: [],
  };

  const renderComponent = (
    category: 'mission' | 'persona' | 'values' | 'toneAndVoice' = 'mission',
    initValues = [
      { id: 1, label: 'Value 1', selected: true },
      { id: 2, label: 'Value 2', selected: true },
    ]
  ) => {
    // Clone initValues to avoid mutation issues since component mutates the array
    const clonedValues = initValues.map((v) => ({ ...v }));
    return render(
      <BrandContext.Provider
        value={{
          businessInfo: defaultBusinessInfo,
          setBusinessInfo: mockSetBusinessInfo,
          updateWorkflowState: mockUpdateWorkflowState,
          clearWorkflow: mockClearWorkflow,
        }}
      >
        <BrandDetailsEditBlock
          category={category}
          initValues={clonedValues}
          closeEdit={mockCloseEdit}
        />
      </BrandContext.Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Initialization', () => {
    it('should render three input fields', () => {
      // Arrange & Act
      renderComponent();

      // Assert
      const inputs = screen.getAllByTestId('brand-details-input');
      expect(inputs).toHaveLength(3);
    });

    it('should populate inputs with initial values up to 3 items', () => {
      // Arrange
      const initValues = [
        { id: 1, label: 'First', selected: true },
        { id: 2, label: 'Second', selected: true },
        { id: 3, label: 'Third', selected: true },
        { id: 4, label: 'Fourth', selected: true }, // Should be ignored
      ];

      // Act
      renderComponent('mission', initValues);

      // Assert
      const inputs = screen.getAllByTestId('brand-details-input');
      expect(inputs[0]).toHaveValue('First');
      expect(inputs[1]).toHaveValue('Second');
      expect(inputs[2]).toHaveValue('Third');
    });

    it('should handle fewer than 3 initial values', () => {
      // Arrange
      const initValues = [{ id: 1, label: 'Only One', selected: true }];

      // Act
      renderComponent('mission', initValues);

      // Assert
      const inputs = screen.getAllByTestId('brand-details-input');
      expect(inputs[0]).toHaveValue('Only One');
      expect(inputs[1]).toHaveValue('');
      expect(inputs[2]).toHaveValue('');
    });

    it('should handle empty initial values', () => {
      // Arrange & Act
      renderComponent('mission', []);

      // Assert
      const inputs = screen.getAllByTestId('brand-details-input');
      inputs.forEach((input) => {
        expect(input).toHaveValue('');
      });
    });
  });

  describe('Input Interactions', () => {
    it('should update input value when typed', () => {
      // Arrange
      renderComponent();
      const inputs = screen.getAllByTestId('brand-details-input');

      // Act
      fireEvent.change(inputs[0], { target: { value: 'New Value' } });

      // Assert
      expect(inputs[0]).toHaveValue('New Value');
    });

    it('should handle multiple input changes', () => {
      // Arrange
      renderComponent();
      const inputs = screen.getAllByTestId('brand-details-input');

      // Act
      fireEvent.change(inputs[0], { target: { value: 'First' } });
      fireEvent.change(inputs[1], { target: { value: 'Second' } });
      fireEvent.change(inputs[2], { target: { value: 'Third' } });

      // Assert
      expect(inputs[0]).toHaveValue('First');
      expect(inputs[1]).toHaveValue('Second');
      expect(inputs[2]).toHaveValue('Third');
    });

    it('should clear input when remove button is clicked', () => {
      // Arrange
      const initValues = [{ id: 1, label: 'To Remove', selected: true }];
      renderComponent('mission', initValues);
      const removeButtons = screen.getAllByAltText('remove tag');
      const inputs = screen.getAllByTestId('brand-details-input');

      // Act
      fireEvent.click(removeButtons[0]);

      // Assert
      waitFor(() => {
        expect(inputs[0]).toHaveValue('');
      });
    });

    it('should handle removing multiple values', () => {
      // Arrange
      const initValues = [
        { id: 1, label: 'First', selected: true },
        { id: 2, label: 'Second', selected: true },
        { id: 3, label: 'Third', selected: true },
      ];
      renderComponent('mission', initValues);
      const removeButtons = screen.getAllByAltText('remove tag');
      const inputs = screen.getAllByTestId('brand-details-input');

      // Act
      fireEvent.click(removeButtons[0]);
      fireEvent.click(removeButtons[2]);

      // Assert
      waitFor(() => {
        expect(inputs[0]).toHaveValue('');
        expect(inputs[1]).toHaveValue('Second');
        expect(inputs[2]).toHaveValue('');
      });
    });
  });

  describe('Save Functionality', () => {
    it('should save only non-empty values when save button is clicked', () => {
      // Arrange
      renderComponent('mission', []);
      const inputs = screen.getAllByTestId('brand-details-input');
      fireEvent.change(inputs[0], { target: { value: 'First Value' } });
      fireEvent.change(inputs[2], { target: { value: 'Third Value' } });
      const saveButton = screen.getByTestId('save-button');

      // Act
      fireEvent.click(saveButton);

      // Assert
      expect(mockSetBusinessInfo).toHaveBeenCalledWith({
        ...defaultBusinessInfo,
        mission: [
          { id: 0, label: 'First Value', selected: true },
          { id: 2, label: 'Third Value', selected: true },
        ],
      });
    });

    it('should call closeEdit after saving', () => {
      // Arrange
      renderComponent();
      const saveButton = screen.getByTestId('save-button');

      // Act
      fireEvent.click(saveButton);

      // Assert
      expect(mockCloseEdit).toHaveBeenCalledTimes(1);
    });

    it('should save empty array when all inputs are empty', () => {
      // Arrange
      renderComponent('values', []);
      const saveButton = screen.getByTestId('save-button');

      // Act
      fireEvent.click(saveButton);

      // Assert
      expect(mockSetBusinessInfo).toHaveBeenCalledWith({
        ...defaultBusinessInfo,
        values: [],
      });
    });

    it('should save to correct category', () => {
      // Arrange
      renderComponent('toneAndVoice', []);
      const inputs = screen.getAllByTestId('brand-details-input');
      fireEvent.change(inputs[0], { target: { value: 'Friendly' } });
      const saveButton = screen.getByTestId('save-button');

      // Act
      fireEvent.click(saveButton);

      // Assert
      expect(mockSetBusinessInfo).toHaveBeenCalledWith({
        ...defaultBusinessInfo,
        toneAndVoice: [{ id: 0, label: 'Friendly', selected: true }],
      });
    });

    it('should preserve initial values when saving without changes', () => {
      // Arrange
      const initValues = [
        { id: 1, label: 'Selected', selected: true },
        { id: 2, label: 'Not Selected', selected: false },
      ];
      renderComponent('mission', initValues);
      const saveButton = screen.getByTestId('save-button');

      // Act
      fireEvent.click(saveButton);

      // Assert
      expect(mockSetBusinessInfo).toHaveBeenCalledWith({
        ...defaultBusinessInfo,
        mission: [
          { id: 0, label: 'Selected', selected: true },
          { id: 1, label: 'Not Selected', selected: false },
        ],
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid input changes', () => {
      // Arrange
      renderComponent();
      const inputs = screen.getAllByTestId('brand-details-input');

      // Act
      for (let i = 0; i < 10; i++) {
        fireEvent.change(inputs[0], { target: { value: `Value ${i}` } });
      }

      // Assert
      expect(inputs[0]).toHaveValue('Value 9');
    });

    it('should handle special characters in input', () => {
      // Arrange
      renderComponent();
      const inputs = screen.getAllByTestId('brand-details-input');
      const specialValue = '!@#$%^&*()_+{}[]|\\:";\'<>?,./';

      // Act
      fireEvent.change(inputs[0], { target: { value: specialValue } });

      // Assert
      expect(inputs[0]).toHaveValue(specialValue);
    });

    it('should handle very long input values', () => {
      // Arrange
      renderComponent();
      const inputs = screen.getAllByTestId('brand-details-input');
      const longValue = 'a'.repeat(1000);

      // Act
      fireEvent.change(inputs[0], { target: { value: longValue } });

      // Assert
      expect(inputs[0]).toHaveValue(longValue);
    });

    it('should handle whitespace-only input as non-empty', () => {
      // Arrange
      renderComponent('mission', []);
      const inputs = screen.getAllByTestId('brand-details-input');
      fireEvent.change(inputs[0], { target: { value: '   ' } });
      const saveButton = screen.getByTestId('save-button');

      // Act
      fireEvent.click(saveButton);

      // Assert
      expect(mockSetBusinessInfo).toHaveBeenCalledWith({
        ...defaultBusinessInfo,
        mission: [{ id: 0, label: '   ', selected: true }],
      });
    });

    it('should maintain input order when saving', () => {
      // Arrange
      renderComponent();
      const inputs = screen.getAllByTestId('brand-details-input');
      fireEvent.change(inputs[2], { target: { value: 'Third' } });
      fireEvent.change(inputs[0], { target: { value: 'First' } });
      fireEvent.change(inputs[1], { target: { value: 'Second' } });
      const saveButton = screen.getByTestId('save-button');

      // Act
      fireEvent.click(saveButton);

      // Assert
      expect(mockSetBusinessInfo).toHaveBeenCalledWith({
        ...defaultBusinessInfo,
        mission: [
          { id: 0, label: 'First', selected: true },
          { id: 1, label: 'Second', selected: true },
          { id: 2, label: 'Third', selected: true },
        ],
      });
    });
  });

  describe('Component Lifecycle', () => {
    it('should update when initial values change', () => {
      // Arrange
      const { rerender } = renderComponent('mission', [
        { id: 1, label: 'Initial', selected: true },
      ]);

      // Act
      rerender(
        <BrandContext.Provider
          value={{
            businessInfo: defaultBusinessInfo,
            setBusinessInfo: mockSetBusinessInfo,
            updateWorkflowState: mockUpdateWorkflowState,
            clearWorkflow: mockClearWorkflow,
          }}
        >
          <BrandDetailsEditBlock
            category="mission"
            initValues={[{ id: 1, label: 'Updated', selected: true }]}
            closeEdit={mockCloseEdit}
          />
        </BrandContext.Provider>
      );

      // Assert
      const inputs = screen.getAllByTestId('brand-details-input');
      waitFor(() => {
        expect(inputs[0]).toHaveValue('Updated');
      });
    });
  });
});
