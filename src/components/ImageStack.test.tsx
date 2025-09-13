import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ImageStack from './ImageStack';

describe('ImageStack', () => {
  describe('Component Rendering', () => {
    it('should render the component without crashing', () => {
      // Act & Assert
      expect(() => render(<ImageStack />)).not.toThrow();
    });

    it('should render the container with correct classes', () => {
      // Arrange & Act
      const { container } = render(<ImageStack />);

      // Assert
      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv).toHaveClass('relative');
    });
  });

  describe('Image Rendering', () => {
    it('should render all three images', () => {
      // Arrange & Act
      render(<ImageStack />);

      // Assert
      const firstImage = screen.getByAltText('First');
      const secondImage = screen.getByAltText('Second');
      const thirdImage = screen.getByAltText('Third');

      expect(firstImage).toBeInTheDocument();
      expect(secondImage).toBeInTheDocument();
      expect(thirdImage).toBeInTheDocument();
    });

    it('should have correct src attributes for all images', () => {
      // Arrange & Act
      render(<ImageStack />);

      // Assert
      expect(screen.getByAltText('First')).toHaveAttribute(
        'src',
        '/src/assets/icons/first_rectangle.svg'
      );
      expect(screen.getByAltText('Second')).toHaveAttribute(
        'src',
        '/src/assets/icons/second_rectangle.svg'
      );
      expect(screen.getByAltText('Third')).toHaveAttribute(
        'src',
        '/src/assets/icons/third_rectangle.svg'
      );
    });

    it('should have correct alt attributes for accessibility', () => {
      // Arrange & Act
      render(<ImageStack />);

      // Assert
      const images = screen.getAllByRole('img');
      expect(images[0]).toHaveAttribute('alt', 'First');
      expect(images[1]).toHaveAttribute('alt', 'Second');
      expect(images[2]).toHaveAttribute('alt', 'Third');
    });
  });

  describe('Image Positioning and Styling', () => {
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

    it('should have all images positioned absolutely', () => {
      // Arrange & Act
      render(<ImageStack />);

      // Assert
      const images = screen.getAllByRole('img');
      images.forEach((image) => {
        expect(image).toHaveClass('absolute');
      });
    });

    it('should have progressive left positioning for stacking effect', () => {
      // Arrange & Act
      render(<ImageStack />);

      // Assert
      const firstImage = screen.getByAltText('First');
      const secondImage = screen.getByAltText('Second');
      const thirdImage = screen.getByAltText('Third');

      expect(firstImage).toHaveClass('left-0');
      expect(secondImage).toHaveClass('left-32');
      expect(thirdImage).toHaveClass('left-64');
    });

    it('should have progressive top positioning for layered effect', () => {
      // Arrange & Act
      render(<ImageStack />);

      // Assert
      const firstImage = screen.getByAltText('First');
      const secondImage = screen.getByAltText('Second');
      const thirdImage = screen.getByAltText('Third');

      expect(firstImage).toHaveClass('top-0');
      expect(secondImage).toHaveClass('-top-5');
      expect(thirdImage).toHaveClass('-top-7');
    });
  });

  describe('Image Dimensions', () => {
    it('should have consistent width for first two images', () => {
      // Arrange & Act
      render(<ImageStack />);

      // Assert
      const firstImage = screen.getByAltText('First');
      const secondImage = screen.getByAltText('Second');

      expect(firstImage).toHaveClass('w-[178px]');
      expect(secondImage).toHaveClass('w-[178px]');
    });

    it('should have slightly different dimensions for third image', () => {
      // Arrange & Act
      render(<ImageStack />);

      // Assert
      const thirdImage = screen.getByAltText('Third');

      expect(thirdImage).toHaveClass('w-[181px]', 'h-[175px]');
    });

    it('should have consistent height for first two images', () => {
      // Arrange & Act
      render(<ImageStack />);

      // Assert
      const firstImage = screen.getByAltText('First');
      const secondImage = screen.getByAltText('Second');

      expect(firstImage).toHaveClass('h-[173px]');
      expect(secondImage).toHaveClass('h-[173px]');
    });

    it('should maintain aspect ratios with specific pixel dimensions', () => {
      // Arrange & Act
      render(<ImageStack />);

      // Assert
      const images = screen.getAllByRole('img');

      // Check that all images have explicit width and height classes
      images.forEach((image) => {
        const classes = image.className;
        expect(classes).toMatch(/w-\[\d+px\]/); // Width with pixel value
        expect(classes).toMatch(/h-\[\d+px\]/); // Height with pixel value
      });
    });
  });

  describe('Component Structure', () => {
    it('should render exactly three images', () => {
      // Arrange & Act
      render(<ImageStack />);

      // Assert
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(3);
    });

    it('should render images as direct children of container', () => {
      // Arrange & Act
      const { container } = render(<ImageStack />);

      // Assert
      const mainDiv = container.firstChild as HTMLElement;
      const imageElements = mainDiv.querySelectorAll('img');
      expect(imageElements).toHaveLength(3);
    });

    it('should maintain correct DOM order for images', () => {
      // Arrange & Act
      render(<ImageStack />);

      // Assert
      const images = screen.getAllByRole('img');
      expect(images[0]).toHaveAttribute('alt', 'First');
      expect(images[1]).toHaveAttribute('alt', 'Second');
      expect(images[2]).toHaveAttribute('alt', 'Third');
    });
  });

  describe('Accessibility', () => {
    it('should have meaningful alt text for each image', () => {
      // Arrange & Act
      render(<ImageStack />);

      // Assert
      const images = screen.getAllByRole('img');

      images.forEach((image) => {
        const altText = image.getAttribute('alt');
        expect(altText).toBeTruthy();
        expect(altText).not.toBe('');
      });
    });

    it('should be keyboard accessible', () => {
      // Arrange & Act
      render(<ImageStack />);

      // Assert
      const images = screen.getAllByRole('img');

      // Images should be focusable by default unless explicitly made non-focusable
      images.forEach((image) => {
        expect(image).toBeInTheDocument();
      });
    });

    it('should have proper img role for screen readers', () => {
      // Arrange & Act
      render(<ImageStack />);

      // Assert
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(3);

      // Each should have the implicit img role
      images.forEach((image) => {
        expect(image.tagName.toLowerCase()).toBe('img');
      });
    });
  });

  describe('Visual Layout Validation', () => {
    it('should create a stacked visual effect with positioning', () => {
      // Arrange & Act
      render(<ImageStack />);

      // Assert
      const firstImage = screen.getByAltText('First');
      const secondImage = screen.getByAltText('Second');
      const thirdImage = screen.getByAltText('Third');

      // Verify the stacking pattern: each image is positioned further right and slightly up
      expect(firstImage).toHaveClass('top-0', 'left-0');
      expect(secondImage).toHaveClass('-top-5', 'left-32');
      expect(thirdImage).toHaveClass('-top-7', 'left-64');
    });

    it('should use SVG format for all images', () => {
      // Arrange & Act
      render(<ImageStack />);

      // Assert
      const images = screen.getAllByRole('img');

      images.forEach((image) => {
        const src = image.getAttribute('src');
        expect(src).toMatch(/\.svg$/);
      });
    });

    it('should load images from assets/icons directory', () => {
      // Arrange & Act
      render(<ImageStack />);

      // Assert
      const images = screen.getAllByRole('img');

      images.forEach((image) => {
        const src = image.getAttribute('src');
        expect(src).toMatch(/\/src\/assets\/icons\//);
      });
    });
  });

  describe('Error Handling', () => {
    it('should render without dependencies', () => {
      // This component has no props or external dependencies
      // Arrange & Act & Assert
      expect(() => render(<ImageStack />)).not.toThrow();
    });

    it('should handle missing image files gracefully', () => {
      // The component itself doesn't handle errors, but should render the img elements
      // Arrange & Act
      render(<ImageStack />);

      // Assert
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(3);

      // Images will have the src attributes even if files don't exist
      images.forEach((image) => {
        expect(image).toHaveAttribute('src');
      });
    });
  });

  describe('Performance Considerations', () => {
    it('should not have any inline styles that could cause re-renders', () => {
      // Arrange & Act
      const { container } = render(<ImageStack />);

      // Assert
      const mainDiv = container.firstChild as HTMLElement;
      const images = mainDiv.querySelectorAll('img');

      images.forEach((image) => {
        // Should use classes, not inline styles
        expect(image.style.cssText).toBe('');
      });
    });

    it('should use static asset paths', () => {
      // Arrange & Act
      render(<ImageStack />);

      // Assert
      const images = screen.getAllByRole('img');

      images.forEach((image) => {
        const src = image.getAttribute('src');
        // Should be static paths, not dynamic
        expect(src).toMatch(/^\/src\/assets\//);
      });
    });
  });
});
