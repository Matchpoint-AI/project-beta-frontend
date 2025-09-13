import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Card } from './Card';

describe('Card', () => {
  it('should render children content', () => {
    // Arrange
    const testContent = <div>Test Card Content</div>;

    // Act
    render(<Card>{testContent}</Card>);

    // Assert
    expect(screen.getByText('Test Card Content')).toBeInTheDocument();
  });

  it('should apply base classes', () => {
    // Arrange
    const testContent = 'Card Content';

    // Act
    const { container } = render(<Card>{testContent}</Card>);
    const card = container.firstChild;

    // Assert
    expect(card).toHaveClass('bg-white', 'rounded-lg', 'shadow', 'border');
  });

  it('should apply custom className', () => {
    // Arrange
    const testContent = 'Custom Card';
    const customClass = 'custom-card-class';

    // Act
    const { container } = render(<Card className={customClass}>{testContent}</Card>);
    const card = container.firstChild;

    // Assert
    expect(card).toHaveClass(customClass);
    expect(card).toHaveClass('bg-white', 'rounded-lg', 'shadow', 'border');
  });

  it('should handle onClick event when provided', () => {
    // Arrange
    const testContent = 'Clickable Card';
    const handleClick = vi.fn();

    // Act
    const { container } = render(<Card onClick={handleClick}>{testContent}</Card>);
    const card = container.firstChild as HTMLElement;
    fireEvent.click(card);

    // Assert
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not have onClick handler when not provided', () => {
    // Arrange
    const testContent = 'Non-clickable Card';

    // Act
    const { container } = render(<Card>{testContent}</Card>);
    const card = container.firstChild as HTMLElement;

    // Assert
    // When no onClick is provided, the element still has the onClick prop set but to undefined
    expect(card.onclick).toBeFalsy();
  });

  it('should render as a div element', () => {
    // Arrange
    const testContent = 'Div Card';

    // Act
    const { container } = render(<Card>{testContent}</Card>);
    const card = container.firstChild;

    // Assert
    expect(card?.nodeName).toBe('DIV');
  });

  it('should render multiple children', () => {
    // Arrange
    const multipleChildren = (
      <>
        <h2>Card Title</h2>
        <p>Card Description</p>
        <button>Card Action</button>
      </>
    );

    // Act
    render(<Card>{multipleChildren}</Card>);

    // Assert
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Description')).toBeInTheDocument();
    expect(screen.getByText('Card Action')).toBeInTheDocument();
  });

  it('should combine custom className with base classes without overriding', () => {
    // Arrange
    const testContent = 'Styled Card';
    const customClass = 'p-4 hover:shadow-lg';

    // Act
    const { container } = render(<Card className={customClass}>{testContent}</Card>);
    const card = container.firstChild as HTMLElement;

    // Assert
    expect(card.className).toContain('bg-white');
    expect(card.className).toContain('rounded-lg');
    expect(card.className).toContain('shadow');
    expect(card.className).toContain('border');
    expect(card.className).toContain('p-4');
    expect(card.className).toContain('hover:shadow-lg');
  });
});
