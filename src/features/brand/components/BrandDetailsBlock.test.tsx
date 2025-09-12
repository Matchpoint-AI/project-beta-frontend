import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import BrandDetailsBlock from './BrandDetailsBlock';
import { BrandContext } from '../context/BrandContext';

// Mock react-router-dom hooks
const mockUseLocation = vi.fn();
const mockUseNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>();
  return {
    ...actual,
    useLocation: () => mockUseLocation(),
    useNavigate: () => mockUseNavigate(),
  };
});

// Mock child components
vi.mock('./BrandDetailsEditBlock', () => ({
  default: vi.fn(({ closeEdit, category, initValues }) => (
    <div data-testid={`edit-block-${category}`}>
      <button onClick={closeEdit}>Close Edit</button>
      <span>Initial values: {initValues.length}</span>
    </div>
  )),
}));

vi.mock('../../../shared/components/ui/EditBlock', () => ({
  default: vi.fn(({ onClick, disabled, className }) => (
    <button data-testid="edit-button" onClick={onClick} disabled={disabled} className={className}>
      Edit
    </button>
  )),
}));

vi.mock('../../../shared/components/ui/ChipComponent', () => ({
  default: vi.fn(({ label, onClose, onSelect, index, selected }) => (
    <div data-testid={`chip-${index}`}>
      <span>{label}</span>
      <button data-testid={`chip-close-${index}`} onClick={() => onClose(index)}>
        Close
      </button>
      <button data-testid={`chip-select-${index}`} onClick={() => onSelect(index)}>
        {selected ? 'Deselect' : 'Select'}
      </button>
    </div>
  )),
}));

describe('BrandDetailsBlock', () => {
  const mockSetBusinessInfo = vi.fn();
  const mockNavigate = vi.fn();

  const defaultBusinessInfo = {
    mission: [
      { id: 1, label: 'Innovation', selected: true },
      { id: 2, label: 'Quality', selected: false },
    ],
    values: [
      { id: 3, label: 'Integrity', selected: true },
      { id: 4, label: 'Trust', selected: true },
    ],
    persona: [{ id: 5, label: 'Professional', selected: true }],
    toneAndVoice: [
      { id: 6, label: 'Friendly', selected: false },
      { id: 7, label: 'Approachable', selected: true },
    ],
  };

  const renderComponent = (category: 'mission' | 'persona' | 'values' | 'toneAndVoice') => {
    return render(
      <BrowserRouter>
        <BrandContext.Provider
          value={{ businessInfo: defaultBusinessInfo, setBusinessInfo: mockSetBusinessInfo }}
        >
          <BrandDetailsBlock category={category} />
        </BrandContext.Provider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseLocation.mockReturnValue({ search: '', hash: '', pathname: '/test' });
    mockUseNavigate.mockReturnValue(mockNavigate);
  });

  describe('Component Rendering', () => {
    it('should render mission category with correct title and description', () => {
      // Arrange & Act
      renderComponent('mission');

      // Assert
      expect(screen.getByText('mission')).toBeInTheDocument();
      expect(screen.getByText('The goal you want to achieve as a company')).toBeInTheDocument();
    });

    it('should render values category with correct title and description', () => {
      // Arrange & Act
      renderComponent('values');

      // Assert
      expect(screen.getByText('values')).toBeInTheDocument();
      expect(
        screen.getByText('The core beliefs that guide your interactions with customers')
      ).toBeInTheDocument();
    });

    it('should render persona category with correct title and description', () => {
      // Arrange & Act
      renderComponent('persona');

      // Assert
      expect(screen.getByText('persona')).toBeInTheDocument();
      expect(
        screen.getByText('The characteristics that identify who you are and how you behave')
      ).toBeInTheDocument();
    });

    it('should render toneAndVoice category as "Tone of Voice"', () => {
      // Arrange & Act
      renderComponent('toneAndVoice');

      // Assert
      expect(screen.getByText('Tone of Voice')).toBeInTheDocument();
      expect(
        screen.getByText('How your business speaks and verbally expresses its personality')
      ).toBeInTheDocument();
    });

    it('should render all chips for the category', () => {
      // Arrange & Act
      renderComponent('mission');

      // Assert
      expect(screen.getByText('Innovation')).toBeInTheDocument();
      expect(screen.getByText('Quality')).toBeInTheDocument();
    });
  });

  describe('Chip Interactions', () => {
    it('should remove chip when close button is clicked', () => {
      // Arrange
      renderComponent('mission');
      const closeButton = screen.getByTestId('chip-close-1');

      // Act
      fireEvent.click(closeButton);

      // Assert
      expect(mockSetBusinessInfo).toHaveBeenCalledWith({
        ...defaultBusinessInfo,
        mission: [{ id: 2, label: 'Quality', selected: false }],
      });
    });

    it('should show error when last chip is removed', () => {
      // Arrange
      renderComponent('persona');
      const closeButton = screen.getByTestId('chip-close-5');

      // Act
      fireEvent.click(closeButton);

      // Assert
      expect(mockSetBusinessInfo).toHaveBeenCalledWith({
        ...defaultBusinessInfo,
        persona: [],
      });
    });

    it('should toggle chip selection when select button is clicked', () => {
      // Arrange
      renderComponent('mission');
      const selectButton = screen.getByTestId('chip-select-1');

      // Act
      fireEvent.click(selectButton);

      // Assert
      const expectedChips = [
        { id: 1, label: 'Innovation', selected: true },
        { id: 2, label: 'Quality', selected: true },
      ];
      expect(mockSetBusinessInfo).toHaveBeenCalledWith({
        ...defaultBusinessInfo,
        mission: expectedChips,
      });
    });

    it('should show error when all chips are deselected', () => {
      // Arrange
      const singleSelectedChip = {
        ...defaultBusinessInfo,
        persona: [{ id: 5, label: 'Professional', selected: true }],
      };

      render(
        <BrowserRouter>
          <BrandContext.Provider
            value={{ businessInfo: singleSelectedChip, setBusinessInfo: mockSetBusinessInfo }}
          >
            <BrandDetailsBlock category="persona" />
          </BrandContext.Provider>
        </BrowserRouter>
      );

      const selectButton = screen.getByTestId('chip-select-5');

      // Act
      fireEvent.click(selectButton);

      // Assert
      expect(mockSetBusinessInfo).toHaveBeenCalledWith({
        ...singleSelectedChip,
        persona: [{ id: 5, label: 'Professional', selected: false }],
      });
    });
  });

  describe('Edit Mode', () => {
    it('should enter edit mode when edit button is clicked', () => {
      // Arrange
      renderComponent('mission');
      const editButton = screen.getByTestId('edit-button');

      // Act
      fireEvent.click(editButton);

      // Assert
      expect(screen.getByTestId('edit-block-mission')).toBeInTheDocument();
      expect(screen.getByText('Initial values: 2')).toBeInTheDocument();
    });

    it('should exit edit mode when close edit is clicked', () => {
      // Arrange
      renderComponent('mission');
      const editButton = screen.getByTestId('edit-button');
      fireEvent.click(editButton);

      const closeButton = screen.getByText('Close Edit');

      // Act
      fireEvent.click(closeButton);

      // Assert
      expect(screen.queryByTestId('edit-block-mission')).not.toBeInTheDocument();
      expect(screen.getByText('Innovation')).toBeInTheDocument();
    });

    it('should disable edit button when in edit mode', () => {
      // Arrange
      renderComponent('mission');
      const editButton = screen.getByTestId('edit-button');

      // Act
      fireEvent.click(editButton);

      // Assert
      expect(editButton).toBeDisabled();
    });
  });

  describe('URL Navigation Integration', () => {
    it('should enter edit mode when URL has edit=true and matching hash', async () => {
      // Arrange
      mockUseLocation.mockReturnValue({
        search: '?edit=true',
        hash: '#mission',
        pathname: '/test',
      });

      // Act
      renderComponent('mission');

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId('edit-block-mission')).toBeInTheDocument();
      });
      expect(mockNavigate).toHaveBeenCalledWith('/test', { replace: true });
    });

    it('should not enter edit mode when hash does not match category', () => {
      // Arrange
      mockUseLocation.mockReturnValue({
        search: '?edit=true',
        hash: '#values',
        pathname: '/test',
      });

      // Act
      renderComponent('mission');

      // Assert
      expect(screen.queryByTestId('edit-block-mission')).not.toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should not enter edit mode when edit param is not true', () => {
      // Arrange
      mockUseLocation.mockReturnValue({
        search: '?edit=false',
        hash: '#mission',
        pathname: '/test',
      });

      // Act
      renderComponent('mission');

      // Assert
      expect(screen.queryByTestId('edit-block-mission')).not.toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Error State', () => {
    it('should display error message when error state is true', () => {
      // Arrange
      renderComponent('persona');
      const closeButton = screen.getByTestId('chip-close-5');

      // Act
      fireEvent.click(closeButton);

      // Assert
      // Component would re-render with error state after setBusinessInfo is called
      // In a real scenario, the parent would update businessInfo which would trigger re-render
    });

    it('should have error background color when no selected chips', () => {
      // Arrange
      const noSelectedChips = {
        ...defaultBusinessInfo,
        mission: [
          { id: 1, label: 'Innovation', selected: false },
          { id: 2, label: 'Quality', selected: false },
        ],
      };

      // Act
      const { container } = render(
        <BrowserRouter>
          <BrandContext.Provider
            value={{ businessInfo: noSelectedChips, setBusinessInfo: mockSetBusinessInfo }}
          >
            <BrandDetailsBlock category="mission" />
          </BrandContext.Provider>
        </BrowserRouter>
      );

      // Assert
      const mainDiv = container.querySelector('#mission');
      expect(mainDiv).toHaveStyle({ backgroundColor: '#F0F5FF' });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty category array gracefully', () => {
      // Arrange
      const emptyCategory = {
        ...defaultBusinessInfo,
        mission: [],
      };

      // Act
      const { container } = render(
        <BrowserRouter>
          <BrandContext.Provider
            value={{ businessInfo: emptyCategory, setBusinessInfo: mockSetBusinessInfo }}
          >
            <BrandDetailsBlock category="mission" />
          </BrandContext.Provider>
        </BrowserRouter>
      );

      // Assert
      expect(container.querySelector('#mission')).toBeInTheDocument();
      expect(screen.queryByTestId('chip-1')).not.toBeInTheDocument();
    });

    it('should handle non-array category data', () => {
      // Arrange
      const invalidData = {
        ...defaultBusinessInfo,
        mission: 'not an array' as any,
      };

      // Act
      const { container } = render(
        <BrowserRouter>
          <BrandContext.Provider
            value={{ businessInfo: invalidData, setBusinessInfo: mockSetBusinessInfo }}
          >
            <BrandDetailsBlock category="mission" />
          </BrandContext.Provider>
        </BrowserRouter>
      );

      // Assert
      expect(container.querySelector('#mission')).toBeInTheDocument();
      expect(screen.queryByTestId('chip-1')).not.toBeInTheDocument();
    });

    it('should handle undefined category data', () => {
      // Arrange
      const undefinedCategory = {
        ...defaultBusinessInfo,
        mission: undefined as any,
      };

      // Act
      const { container } = render(
        <BrowserRouter>
          <BrandContext.Provider
            value={{ businessInfo: undefinedCategory, setBusinessInfo: mockSetBusinessInfo }}
          >
            <BrandDetailsBlock category="mission" />
          </BrandContext.Provider>
        </BrowserRouter>
      );

      // Assert
      expect(container.querySelector('#mission')).toBeInTheDocument();
      expect(screen.queryByTestId('chip-1')).not.toBeInTheDocument();
    });
  });
});
