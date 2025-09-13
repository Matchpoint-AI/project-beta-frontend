import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('should render children content', () => {
    // Arrange
    const buttonText = 'Click Me';

    // Act
    render(<Button>{buttonText}</Button>);

    // Assert
    expect(screen.getByText(buttonText)).toBeInTheDocument();
  });

  it('should apply primary variant classes by default', () => {
    // Arrange & Act
    render(<Button>Primary Button</Button>);
    const button = screen.getByRole('button');

    // Assert
    expect(button).toHaveClass('bg-blue-600', 'text-white', 'hover:bg-blue-700');
  });

  it('should apply secondary variant classes when specified', () => {
    // Arrange & Act
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByRole('button');

    // Assert
    expect(button).toHaveClass('bg-gray-600', 'text-white', 'hover:bg-gray-700');
  });

  it('should apply outline variant classes when specified', () => {
    // Arrange & Act
    render(<Button variant="outline">Outline Button</Button>);
    const button = screen.getByRole('button');

    // Assert
    expect(button).toHaveClass(
      'border',
      'border-gray-300',
      'bg-white',
      'text-gray-700',
      'hover:bg-gray-50'
    );
  });

  it('should apply medium size classes by default', () => {
    // Arrange & Act
    render(<Button>Medium Button</Button>);
    const button = screen.getByRole('button');

    // Assert
    expect(button).toHaveClass('px-4', 'py-2', 'text-sm');
  });

  it('should apply small size classes when specified', () => {
    // Arrange & Act
    render(<Button size="sm">Small Button</Button>);
    const button = screen.getByRole('button');

    // Assert
    expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');
  });

  it('should apply large size classes when specified', () => {
    // Arrange & Act
    render(<Button size="lg">Large Button</Button>);
    const button = screen.getByRole('button');

    // Assert
    expect(button).toHaveClass('px-6', 'py-3', 'text-base');
  });

  it('should handle onClick event', () => {
    // Arrange
    const handleClick = vi.fn();

    // Act
    render(<Button onClick={handleClick}>Clickable Button</Button>);
    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Assert
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    // Arrange
    const handleClick = vi.fn();

    // Act
    render(
      <Button disabled onClick={handleClick}>
        Disabled Button
      </Button>
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Assert
    expect(button).toBeDisabled();
    expect(handleClick).not.toHaveBeenCalled();
    expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
  });

  it('should apply custom className', () => {
    // Arrange
    const customClass = 'custom-button-class';

    // Act
    render(<Button className={customClass}>Custom Button</Button>);
    const button = screen.getByRole('button');

    // Assert
    expect(button).toHaveClass(customClass);
  });

  it('should have button type by default', () => {
    // Arrange & Act
    render(<Button>Default Type Button</Button>);
    const button = screen.getByRole('button');

    // Assert
    expect(button).toHaveAttribute('type', 'button');
  });

  it('should set submit type when specified', () => {
    // Arrange & Act
    render(<Button type="submit">Submit Button</Button>);
    const button = screen.getByRole('button');

    // Assert
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('should set reset type when specified', () => {
    // Arrange & Act
    render(<Button type="reset">Reset Button</Button>);
    const button = screen.getByRole('button');

    // Assert
    expect(button).toHaveAttribute('type', 'reset');
  });

  it('should have focus styles', () => {
    // Arrange & Act
    render(<Button>Focusable Button</Button>);
    const button = screen.getByRole('button');

    // Assert
    expect(button).toHaveClass(
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
      'focus:ring-blue-500'
    );
  });

  it('should have base styling classes', () => {
    // Arrange & Act
    render(<Button>Styled Button</Button>);
    const button = screen.getByRole('button');

    // Assert
    expect(button).toHaveClass(
      'inline-flex',
      'items-center',
      'justify-center',
      'rounded-md',
      'font-medium'
    );
  });

  it('should combine all props correctly', () => {
    // Arrange
    const handleClick = vi.fn();
    const customClass = 'shadow-lg';

    // Act
    render(
      <Button
        variant="secondary"
        size="lg"
        type="submit"
        className={customClass}
        onClick={handleClick}
      >
        Complex Button
      </Button>
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Assert
    expect(button).toHaveClass('bg-gray-600', 'px-6', 'py-3', customClass);
    expect(button).toHaveAttribute('type', 'submit');
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
