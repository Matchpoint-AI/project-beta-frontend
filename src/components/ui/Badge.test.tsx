import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('should render children content', () => {
    // Arrange
    const testContent = 'Test Badge';

    // Act
    render(<Badge>{testContent}</Badge>);

    // Assert
    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  it('should apply default variant classes when no variant specified', () => {
    // Arrange
    const testContent = 'Default Badge';

    // Act
    render(<Badge>{testContent}</Badge>);
    const badge = screen.getByText(testContent);

    // Assert
    expect(badge).toHaveClass('bg-gray-100', 'text-gray-800');
  });

  it('should apply secondary variant classes', () => {
    // Arrange
    const testContent = 'Secondary Badge';

    // Act
    render(<Badge variant="secondary">{testContent}</Badge>);
    const badge = screen.getByText(testContent);

    // Assert
    expect(badge).toHaveClass('bg-gray-100', 'text-gray-600');
  });

  it('should apply success variant classes', () => {
    // Arrange
    const testContent = 'Success Badge';

    // Act
    render(<Badge variant="success">{testContent}</Badge>);
    const badge = screen.getByText(testContent);

    // Assert
    expect(badge).toHaveClass('bg-green-100', 'text-green-800');
  });

  it('should apply warning variant classes', () => {
    // Arrange
    const testContent = 'Warning Badge';

    // Act
    render(<Badge variant="warning">{testContent}</Badge>);
    const badge = screen.getByText(testContent);

    // Assert
    expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800');
  });

  it('should apply danger variant classes', () => {
    // Arrange
    const testContent = 'Danger Badge';

    // Act
    render(<Badge variant="danger">{testContent}</Badge>);
    const badge = screen.getByText(testContent);

    // Assert
    expect(badge).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('should apply custom className along with default classes', () => {
    // Arrange
    const testContent = 'Custom Badge';
    const customClass = 'custom-test-class';

    // Act
    render(<Badge className={customClass}>{testContent}</Badge>);
    const badge = screen.getByText(testContent);

    // Assert
    expect(badge).toHaveClass(customClass);
    expect(badge).toHaveClass('inline-flex', 'items-center', 'px-2.5');
  });

  it('should render as a span element', () => {
    // Arrange
    const testContent = 'Span Badge';

    // Act
    render(<Badge>{testContent}</Badge>);
    const badge = screen.getByText(testContent);

    // Assert
    expect(badge.tagName).toBe('SPAN');
  });

  it('should have proper base styling classes', () => {
    // Arrange
    const testContent = 'Base Styled Badge';

    // Act
    render(<Badge>{testContent}</Badge>);
    const badge = screen.getByText(testContent);

    // Assert
    expect(badge).toHaveClass(
      'inline-flex',
      'items-center',
      'px-2.5',
      'py-0.5',
      'rounded-full',
      'text-xs',
      'font-medium'
    );
  });
});
