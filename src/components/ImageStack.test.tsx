import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ImageStack from './ImageStack';

describe('ImageStack', () => {
  describe('Rendering', () => {
    it('should render all three images with correct src attributes', () => {
      // Arrange & Act
      render(<ImageStack />);

      // Assert
      const firstImage = screen.getByAltText('First');
      const secondImage = screen.getByAltText('Second');
      const thirdImage = screen.getByAltText('Third');

      expect(firstImage).toBeInTheDocument();
      expect(secondImage).toBeInTheDocument();
      expect(thirdImage).toBeInTheDocument();

      expect(firstImage).toHaveAttribute('src', '/src/assets/icons/first_rectangle.svg');
      expect(secondImage).toHaveAttribute('src', '/src/assets/icons/second_rectangle.svg');
      expect(thirdImage).toHaveAttribute('src', '/src/assets/icons/third_rectangle.svg');
    });

    it('should have correct container structure with relative positioning', () => {
      // Arrange & Act
      const { container } = render(<ImageStack />);

      // Assert
      const stackContainer = container.firstChild;
      expect(stackContainer).toHaveClass('relative');
    });
  });

  describe('Styling', () => {
    it('should apply correct positioning classes to first image', () => {
      // Arrange & Act
      render(<ImageStack />);

      // Assert
      const firstImage = screen.getByAltText('First');
      expect(firstImage).toHaveClass('absolute', 'top-0', 'left-0', 'w-[178px]', 'h-[173px]');
    });

    it('should apply correct positioning classes to second image', () => {
      // Arrange & Act
      render(<ImageStack />);

      // Assert
      const secondImage = screen.getByAltText('Second');
      expect(secondImage).toHaveClass('absolute', '-top-5', 'left-32', 'w-[178px]', 'h-[173px]');
    });

    it('should apply correct positioning classes to third image', () => {
      // Arrange & Act
      render(<ImageStack />);

      // Assert
      const thirdImage = screen.getByAltText('Third');
      expect(thirdImage).toHaveClass('absolute', '-top-7', 'left-64', 'w-[181px]', 'h-[175px]');
    });
  });

  describe('Accessibility', () => {
    it('should have descriptive alt text for all images', () => {
      // Arrange & Act
      render(<ImageStack />);

      // Assert
      expect(screen.getByAltText('First')).toBeInTheDocument();
      expect(screen.getByAltText('Second')).toBeInTheDocument();
      expect(screen.getByAltText('Third')).toBeInTheDocument();
    });

    it('should render images with proper img tag', () => {
      // Arrange & Act
      render(<ImageStack />);

      // Assert
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(3);

      images.forEach((img) => {
        expect(img.tagName).toBe('IMG');
      });
    });
  });

  describe('Layout Structure', () => {
    it('should render exactly three images in stacked layout', () => {
      // Arrange & Act
      render(<ImageStack />);

      // Assert
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(3);
    });

    it('should maintain proper image order in DOM', () => {
      // Arrange & Act
      render(<ImageStack />);

      // Assert
      const images = screen.getAllByRole('img');

      expect(images[0]).toHaveAttribute('alt', 'First');
      expect(images[1]).toHaveAttribute('alt', 'Second');
      expect(images[2]).toHaveAttribute('alt', 'Third');
    });
  });
});
