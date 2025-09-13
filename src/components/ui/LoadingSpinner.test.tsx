import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LoadingSpinner } from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('should render with default medium size', () => {
    // Arrange & Act
    render(<LoadingSpinner />);
    const spinner = screen.getByRole('status', { name: 'Loading' });

    // Assert
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('w-6', 'h-6');
  });

  it('should render with small size when specified', () => {
    // Arrange & Act
    render(<LoadingSpinner size="sm" />);
    const spinner = screen.getByRole('status');

    // Assert
    expect(spinner).toHaveClass('w-4', 'h-4');
  });

  it('should render with large size when specified', () => {
    // Arrange & Act
    render(<LoadingSpinner size="lg" />);
    const spinner = screen.getByRole('status');

    // Assert
    expect(spinner).toHaveClass('w-8', 'h-8');
  });

  it('should apply custom className to wrapper', () => {
    // Arrange
    const customClass = 'custom-spinner-wrapper';

    // Act
    render(<LoadingSpinner className={customClass} />);
    const wrapper = screen.getByRole('status').parentElement;

    // Assert
    expect(wrapper).toHaveClass(customClass);
    expect(wrapper).toHaveClass('flex', 'justify-center', 'items-center');
  });

  it('should have proper animation classes', () => {
    // Arrange & Act
    render(<LoadingSpinner />);
    const spinner = screen.getByRole('status');

    // Assert
    expect(spinner).toHaveClass('animate-spin', 'rounded-full');
  });

  it('should have proper border styling', () => {
    // Arrange & Act
    render(<LoadingSpinner />);
    const spinner = screen.getByRole('status');

    // Assert
    expect(spinner).toHaveClass('border-2', 'border-gray-200', 'border-t-blue-600');
  });

  it('should have accessible aria-label', () => {
    // Arrange & Act
    render(<LoadingSpinner />);
    const spinner = screen.getByRole('status');

    // Assert
    expect(spinner).toHaveAttribute('aria-label', 'Loading');
  });

  it('should have screen reader only text', () => {
    // Arrange & Act
    render(<LoadingSpinner />);
    const srText = screen.getByText('Loading...');

    // Assert
    expect(srText).toBeInTheDocument();
    expect(srText).toHaveClass('sr-only');
  });

  it('should render wrapper as div element', () => {
    // Arrange & Act
    render(<LoadingSpinner />);
    const wrapper = screen.getByRole('status').parentElement;

    // Assert
    expect(wrapper?.tagName).toBe('DIV');
  });

  it('should combine size and custom className properly', () => {
    // Arrange
    const customClass = 'mt-4 mb-4';

    // Act
    render(<LoadingSpinner size="lg" className={customClass} />);
    const spinner = screen.getByRole('status');
    const wrapper = spinner.parentElement;

    // Assert
    expect(spinner).toHaveClass('w-8', 'h-8');
    expect(wrapper).toHaveClass(customClass);
  });
});
