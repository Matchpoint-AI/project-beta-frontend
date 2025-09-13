import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoadingModal from './ExportLoading';

// Mock Material-UI CircularProgress
vi.mock('@mui/material', () => ({
  CircularProgress: ({ size }: { size: number }) => (
    <div data-testid="circular-progress" data-size={size}>
      Loading...
    </div>
  ),
}));

describe('LoadingModal', () => {
  const mockSteps = [
    { label: 'Preparing export', loading: true, complete: false },
    { label: 'Processing content', loading: false, complete: false },
    { label: 'Finalizing export', loading: false, complete: false },
  ];

  const completedSteps = [
    { label: 'Preparing export', loading: false, complete: true },
    { label: 'Processing content', loading: false, complete: true },
    { label: 'Finalizing export', loading: false, complete: true },
  ];

  describe('Rendering', () => {
    it('should render nothing when isOpen is false', () => {
      // Arrange & Act
      const { container } = render(<LoadingModal steps={mockSteps} isOpen={false} />);

      // Assert
      expect(container.firstChild).toBeNull();
    });

    it('should render modal when isOpen is true', () => {
      // Arrange & Act
      render(<LoadingModal steps={mockSteps} isOpen={true} />);

      // Assert
      expect(screen.getByText('Exporting Content')).toBeInTheDocument();
      expect(screen.getByText('Preparing export')).toBeInTheDocument();
      expect(screen.getByText('Processing content')).toBeInTheDocument();
      expect(screen.getByText('Finalizing export')).toBeInTheDocument();
    });

    it('should have correct modal structure and styling', () => {
      // Arrange & Act
      const { container } = render(<LoadingModal steps={mockSteps} isOpen={true} />);

      // Assert
      const overlay = container.querySelector('.fixed.inset-0.bg-gray-800.bg-opacity-50');
      const modal = container.querySelector('.bg-white.p-8.rounded.shadow-lg');

      expect(overlay).toBeInTheDocument();
      expect(modal).toBeInTheDocument();
      expect(overlay).toHaveClass('flex', 'justify-center', 'items-center', 'z-50');
    });
  });

  describe('Step States', () => {
    it('should show loading spinner for loading steps', () => {
      // Arrange & Act
      render(<LoadingModal steps={mockSteps} isOpen={true} />);

      // Assert
      const loadingSpinners = screen.getAllByTestId('circular-progress');
      expect(loadingSpinners).toHaveLength(3); // All non-complete steps show spinner
      expect(loadingSpinners[0]).toHaveAttribute('data-size', '20');
    });

    it('should show checkmark for completed steps', () => {
      // Arrange & Act
      const { container } = render(<LoadingModal steps={completedSteps} isOpen={true} />);

      // Assert
      const checkmarks = container.querySelectorAll('svg.text-green-500');
      expect(checkmarks).toHaveLength(3);

      checkmarks.forEach((checkmark) => {
        expect(checkmark).toHaveClass('h-5', 'w-5', 'text-green-500');
      });
    });

    it('should render mixed step states correctly', () => {
      // Arrange
      const mixedSteps = [
        { label: 'Completed step', loading: false, complete: true },
        { label: 'Loading step', loading: true, complete: false },
        { label: 'Pending step', loading: false, complete: false },
      ];

      // Act
      const { container } = render(<LoadingModal steps={mixedSteps} isOpen={true} />);

      // Assert
      expect(container.querySelector('svg.text-green-500')).toBeInTheDocument(); // checkmark
      expect(screen.getAllByTestId('circular-progress')).toHaveLength(2); // loading + pending
    });
  });

  describe('Step Labels', () => {
    it('should display all step labels correctly', () => {
      // Arrange
      const customSteps = [
        { label: 'Custom step 1', loading: true, complete: false },
        { label: 'Custom step 2', loading: false, complete: true },
        { label: 'Custom step 3', loading: false, complete: false },
      ];

      // Act
      render(<LoadingModal steps={customSteps} isOpen={true} />);

      // Assert
      expect(screen.getByText('Custom step 1')).toBeInTheDocument();
      expect(screen.getByText('Custom step 2')).toBeInTheDocument();
      expect(screen.getByText('Custom step 3')).toBeInTheDocument();
    });

    it('should render steps with correct layout structure', () => {
      // Arrange & Act
      render(<LoadingModal steps={mockSteps} isOpen={true} />);

      // Assert
      const stepContainers = screen
        .getAllByText(/export|content/)
        .map((text) => text.closest('.flex.items-center.mb-4'));

      expect(stepContainers).toHaveLength(3);
      stepContainers.forEach((container) => {
        expect(container).toHaveClass('flex', 'items-center', 'mb-4');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty steps array', () => {
      // Arrange & Act
      const { container } = render(<LoadingModal steps={[]} isOpen={true} />);

      // Assert
      expect(screen.getByText('Exporting Content')).toBeInTheDocument();
      expect(screen.queryByTestId('circular-progress')).not.toBeInTheDocument();
      expect(container.querySelector('svg.text-green-500')).not.toBeInTheDocument();
    });

    it('should handle steps with empty labels', () => {
      // Arrange
      const stepsWithEmptyLabels = [
        { label: '', loading: true, complete: false },
        { label: 'Valid label', loading: false, complete: true },
      ];

      // Act
      render(<LoadingModal steps={stepsWithEmptyLabels} isOpen={true} />);

      // Assert
      expect(screen.getByText('Valid label')).toBeInTheDocument();
      const stepContainers = screen.getByText('Valid label').closest('.flex');
      expect(stepContainers).toBeInTheDocument();
    });

    it('should handle single step', () => {
      // Arrange
      const singleStep = [{ label: 'Only step', loading: true, complete: false }];

      // Act
      render(<LoadingModal steps={singleStep} isOpen={true} />);

      // Assert
      expect(screen.getByText('Only step')).toBeInTheDocument();
      expect(screen.getByTestId('circular-progress')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      // Arrange & Act
      render(<LoadingModal steps={mockSteps} isOpen={true} />);

      // Assert
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Exporting Content');
      expect(heading).toHaveClass('text-xl', 'font-semibold', 'mb-4');
    });

    it('should be properly centered and styled for accessibility', () => {
      // Arrange & Act
      const { container } = render(<LoadingModal steps={mockSteps} isOpen={true} />);

      // Assert
      const overlay = container.firstChild;
      expect(overlay).toHaveClass(
        'fixed',
        'inset-0',
        'flex',
        'justify-center',
        'items-center',
        'z-50'
      );
    });
  });

  describe('Material-UI Integration', () => {
    it('should pass correct size prop to CircularProgress', () => {
      // Arrange & Act
      render(<LoadingModal steps={mockSteps} isOpen={true} />);

      // Assert
      const progressIndicators = screen.getAllByTestId('circular-progress');
      progressIndicators.forEach((indicator) => {
        expect(indicator).toHaveAttribute('data-size', '20');
      });
    });
  });
});
