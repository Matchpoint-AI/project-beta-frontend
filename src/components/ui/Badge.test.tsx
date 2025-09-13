import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  describe('Rendering', () => {
    it('should render children text correctly', () => {
      // Arrange & Act
      render(<Badge>Test Badge</Badge>);

      // Assert
      expect(screen.getByText('Test Badge')).toBeInTheDocument();
    });

    it('should render with default variant when no variant is specified', () => {
      // Arrange & Act
      render(<Badge>Default Badge</Badge>);

      // Assert
      const badge = screen.getByText('Default Badge');
      expect(badge).toHaveClass('bg-gray-100', 'text-gray-800');
    });
  });

  describe('Variants', () => {
    it('should apply secondary variant classes', () => {
      // Arrange & Act
      render(<Badge variant="secondary">Secondary</Badge>);

      // Assert
      const badge = screen.getByText('Secondary');
      expect(badge).toHaveClass('bg-gray-100', 'text-gray-600');
    });

    it('should apply success variant classes', () => {
      // Arrange & Act
      render(<Badge variant="success">Success</Badge>);

      // Assert
      const badge = screen.getByText('Success');
      expect(badge).toHaveClass('bg-green-100', 'text-green-800');
    });

    it('should apply warning variant classes', () => {
      // Arrange & Act
      render(<Badge variant="warning">Warning</Badge>);

      // Assert
      const badge = screen.getByText('Warning');
      expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800');
    });

    it('should apply danger variant classes', () => {
      // Arrange & Act
      render(<Badge variant="danger">Danger</Badge>);

      // Assert
      const badge = screen.getByText('Danger');
      expect(badge).toHaveClass('bg-red-100', 'text-red-800');
    });
  });

  describe('Styling', () => {
    it('should apply custom className in addition to default classes', () => {
      // Arrange & Act
      render(<Badge className="custom-class">Custom</Badge>);

      // Assert
      const badge = screen.getByText('Custom');
      expect(badge).toHaveClass('custom-class');
      expect(badge).toHaveClass('inline-flex', 'items-center', 'px-2.5', 'py-0.5', 'rounded-full', 'text-xs', 'font-medium');
    });

    it('should maintain base styling classes for all variants', () => {
      // Arrange & Act
      render(<Badge variant="success">Test</Badge>);

      // Assert
      const badge = screen.getByText('Test');
      expect(badge).toHaveClass('inline-flex', 'items-center', 'px-2.5', 'py-0.5', 'rounded-full', 'text-xs', 'font-medium');
    });
  });

  describe('Children Types', () => {
    it('should render string children', () => {
      // Arrange & Act
      render(<Badge>String content</Badge>);

      // Assert
      expect(screen.getByText('String content')).toBeInTheDocument();
    });

    it('should render number children', () => {
      // Arrange & Act
      render(<Badge>{42}</Badge>);

      // Assert
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('should render complex children with nested elements', () => {
      // Arrange & Act
      render(
        <Badge>
          <span>Complex</span> <strong>content</strong>
        </Badge>
      );

      // Assert
      expect(screen.getByText('Complex')).toBeInTheDocument();
      expect(screen.getByText('content')).toBeInTheDocument();
    });
  });

  describe('HTML Structure', () => {
    it('should render as a span element', () => {
      // Arrange & Act
      const { container } = render(<Badge>Test</Badge>);

      // Assert
      const badge = container.querySelector('span');
      expect(badge).toBeInTheDocument();
      expect(badge?.tagName).toBe('SPAN');
    });
  });
});