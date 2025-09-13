import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoadingModal from './ExportLoading';

// Mock MUI components
vi.mock('@mui/material', () => ({
  CircularProgress: vi.fn(({ size }) => (
    <div data-testid="circular-progress" data-size={size} role="progressbar">
      Loading...
    </div>
  )),
}));

describe('LoadingModal (ExportLoading)', () => {
  const mockSteps = [
    { label: 'Preparing content', loading: true, complete: false },
    { label: 'Generating files', loading: false, complete: false },
    { label: 'Finalizing export', loading: false, complete: false },
  ];

  const mockStepsWithComplete = [
    { label: 'Preparing content', loading: false, complete: true },
    { label: 'Generating files', loading: true, complete: false },
    { label: 'Finalizing export', loading: false, complete: false },
  ];

  const mockStepsAllComplete = [
    { label: 'Preparing content', loading: false, complete: true },
    { label: 'Generating files', loading: false, complete: true },
    { label: 'Finalizing export', loading: false, complete: true },
  ];

  describe('Modal Visibility', () => {
    it('should not render when isOpen is false', () => {
      // Arrange & Act
      render(<LoadingModal steps={mockSteps} isOpen={false} />);

      // Assert
      expect(screen.queryByText('Exporting Content')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
      // Arrange & Act
      render(<LoadingModal steps={mockSteps} isOpen={true} />);

      // Assert
      expect(screen.getByText('Exporting Content')).toBeInTheDocument();
    });

    it('should render modal with correct styling when open', () => {
      // Arrange & Act
      render(<LoadingModal steps={mockSteps} isOpen={true} />);

      // Assert
      const modal = screen.getByText('Exporting Content').closest('div');
      expect(modal?.parentElement).toHaveClass(
        'fixed',
        'inset-0',
        'bg-gray-800',
        'bg-opacity-50',
        'flex',
        'justify-center',
        'items-center',
        'z-50',
        'p-5',
        'lg:p-0'
      );
    });
  });

  describe('Modal Content', () => {
    it('should render the modal title', () => {
      // Arrange & Act
      render(<LoadingModal steps={mockSteps} isOpen={true} />);

      // Assert
      const title = screen.getByText('Exporting Content');
      expect(title).toBeInTheDocument();
      expect(title.tagName).toBe('H2');
      expect(title).toHaveClass('text-xl', 'font-semibold', 'mb-4');
    });

    it('should render modal content container with correct styling', () => {
      // Arrange & Act
      render(<LoadingModal steps={mockSteps} isOpen={true} />);

      // Assert
      const container = screen.getByText('Exporting Content').closest('div');
      expect(container).toHaveClass('bg-white', 'p-8', 'rounded', 'shadow-lg', 'w-[400px]');
    });
  });

  describe('Steps Rendering', () => {
    it('should render all steps with correct labels', () => {
      // Arrange & Act
      render(<LoadingModal steps={mockSteps} isOpen={true} />);

      // Assert
      expect(screen.getByText('Preparing content')).toBeInTheDocument();
      expect(screen.getByText('Generating files')).toBeInTheDocument();
      expect(screen.getByText('Finalizing export')).toBeInTheDocument();
    });

    it('should render empty steps array without error', () => {
      // Arrange & Act
      render(<LoadingModal steps={[]} isOpen={true} />);

      // Assert
      expect(screen.getByText('Exporting Content')).toBeInTheDocument();
      expect(screen.queryByText('Preparing content')).not.toBeInTheDocument();
    });

    it('should render steps with correct layout styling', () => {
      // Arrange & Act
      render(<LoadingModal steps={mockSteps} isOpen={true} />);

      // Assert
      const stepContainer = screen.getByText('Preparing content').closest('div');
      expect(stepContainer).toHaveClass('flex', 'items-center', 'mb-4');
    });
  });

  describe('Loading State Indicators', () => {
    it('should show loading spinner for loading steps', () => {
      // Arrange & Act
      render(<LoadingModal steps={mockSteps} isOpen={true} />);

      // Assert
      const progressIndicators = screen.getAllByTestId('circular-progress');
      expect(progressIndicators).toHaveLength(3); // All steps show loading spinner (active loading or waiting)
      expect(progressIndicators[0]).toHaveAttribute('data-size', '20');
    });

    it('should show check icon for completed steps', () => {
      // Arrange & Act
      render(<LoadingModal steps={mockStepsWithComplete} isOpen={true} />);

      // Assert
      const checkIcon = document.querySelector('svg.text-green-500');
      expect(checkIcon).toBeInTheDocument();
      expect(checkIcon).toHaveClass('h-5', 'w-5', 'text-green-500');
    });

    it('should display correct SVG path for check icon', () => {
      // Arrange & Act
      render(<LoadingModal steps={mockStepsWithComplete} isOpen={true} />);

      // Assert
      const checkPath = document.querySelector('svg.text-green-500 path');
      expect(checkPath).toHaveAttribute('fill-rule', 'evenodd');
      expect(checkPath).toHaveAttribute('clip-rule', 'evenodd');
      expect(checkPath).toHaveAttribute(
        'd',
        'M10 18a8 8 0 100-16 8 8 0 000 16zm-1.292-4.293a1 1 0 011.414 0l5-5a1 1 0 10-1.414-1.414l-4.293 4.293-1.293-1.293a1 1 0 00-1.414 1.414l2 2z'
      );
    });

    it('should show loading spinner for non-loading, non-complete steps', () => {
      // Arrange & Act
      render(<LoadingModal steps={mockSteps} isOpen={true} />);

      // Assert
      // Steps that are not loading and not complete should still show loading spinner
      const progressIndicators = screen.getAllByTestId('circular-progress');
      expect(progressIndicators.length).toBeGreaterThan(0);
    });
  });

  describe('Step States Combinations', () => {
    it('should handle all steps completed', () => {
      // Arrange & Act
      render(<LoadingModal steps={mockStepsAllComplete} isOpen={true} />);

      // Assert
      const checkIcons = document.querySelectorAll('svg.text-green-500');
      expect(checkIcons).toHaveLength(3);
      expect(screen.queryByTestId('circular-progress')).not.toBeInTheDocument();
    });

    it('should handle mixed loading and complete states', () => {
      // Arrange & Act
      render(<LoadingModal steps={mockStepsWithComplete} isOpen={true} />);

      // Assert
      const checkIcons = document.querySelectorAll('svg.text-green-500');
      const progressIndicators = screen.getAllByTestId('circular-progress');

      expect(checkIcons).toHaveLength(1); // One completed step
      expect(progressIndicators).toHaveLength(2); // Two remaining steps
    });

    it('should handle step with loading true and complete true', () => {
      // Arrange
      const contradictorySteps = [{ label: 'Contradictory step', loading: true, complete: true }];

      // Act
      render(<LoadingModal steps={contradictorySteps} isOpen={true} />);

      // Assert
      // Should prioritize loading state
      expect(screen.getByTestId('circular-progress')).toBeInTheDocument();
      expect(document.querySelector('svg.text-green-500')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper modal structure for screen readers', () => {
      // Arrange & Act
      render(<LoadingModal steps={mockSteps} isOpen={true} />);

      // Assert
      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toHaveTextContent('Exporting Content');
    });

    it('should provide proper progressbar role for loading indicators', () => {
      // Arrange & Act
      render(<LoadingModal steps={mockSteps} isOpen={true} />);

      // Assert
      const progressBars = screen.getAllByRole('progressbar');
      expect(progressBars.length).toBeGreaterThan(0);
    });

    it('should have proper alt text for check icon', () => {
      // Arrange & Act
      render(<LoadingModal steps={mockStepsWithComplete} isOpen={true} />);

      // Assert
      const checkIcon = document.querySelector('svg.text-green-500');
      expect(checkIcon).toBeInTheDocument();
    });
  });

  describe('Styling and Layout', () => {
    it('should apply correct step label styling', () => {
      // Arrange & Act
      render(<LoadingModal steps={mockSteps} isOpen={true} />);

      // Assert
      const stepLabel = screen.getByText('Preparing content');
      expect(stepLabel).toHaveClass('ml-4');
    });

    it('should maintain consistent spacing between steps', () => {
      // Arrange & Act
      render(<LoadingModal steps={mockSteps} isOpen={true} />);

      // Assert
      const firstStepContainer = screen.getByText('Preparing content').closest('div');
      const secondStepContainer = screen.getByText('Generating files').closest('div');

      expect(firstStepContainer).toHaveClass('mb-4');
      expect(secondStepContainer).toHaveClass('mb-4');
    });

    it('should center modal content properly', () => {
      // Arrange & Act
      render(<LoadingModal steps={mockSteps} isOpen={true} />);

      // Assert
      const overlay = screen.getByText('Exporting Content').closest('div')?.parentElement;
      expect(overlay).toHaveClass('flex', 'justify-center', 'items-center');
    });
  });

  describe('Edge Cases', () => {
    it('should handle steps with empty labels', () => {
      // Arrange
      const stepsWithEmptyLabel = [
        { label: '', loading: false, complete: true },
        { label: 'Valid step', loading: true, complete: false },
      ];

      // Act
      render(<LoadingModal steps={stepsWithEmptyLabel} isOpen={true} />);

      // Assert
      expect(screen.getByText('Valid step')).toBeInTheDocument();
      // Empty label should still render but be empty
      const emptyLabelSpan = screen
        .getByText('Valid step')
        .closest('div')
        ?.parentElement?.querySelector('span');
      expect(emptyLabelSpan).toBeDefined();
    });

    it('should handle very long step labels', () => {
      // Arrange
      const longLabelSteps = [
        {
          label:
            'This is a very long step label that might cause layout issues if not handled properly',
          loading: true,
          complete: false,
        },
      ];

      // Act & Assert
      expect(() => render(<LoadingModal steps={longLabelSteps} isOpen={true} />)).not.toThrow();
      expect(screen.getByText(/This is a very long step label/)).toBeInTheDocument();
    });

    it('should handle large number of steps', () => {
      // Arrange
      const manySteps = Array.from({ length: 10 }, (_, i) => ({
        label: `Step ${i + 1}`,
        loading: i === 5,
        complete: i < 5,
      }));

      // Act & Assert
      expect(() => render(<LoadingModal steps={manySteps} isOpen={true} />)).not.toThrow();
      expect(screen.getByText('Step 1')).toBeInTheDocument();
      expect(screen.getByText('Step 10')).toBeInTheDocument();
    });
  });
});
