import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Sidebar from './Sidebar';

// Mock the SideNavBar component
vi.mock('../../../components/SideNavBar', () => ({
  default: ({ phone, className, style }: any) => (
    <div
      data-testid={phone ? 'mobile-sidenav' : 'desktop-sidenav'}
      className={className}
      style={style}
    >
      SideNavBar
    </div>
  ),
}));

describe('Sidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render desktop sidebar by default', () => {
      // Arrange & Act
      render(<Sidebar />);

      // Assert
      const desktopSidebar = screen.getByTestId('desktop-sidenav');
      expect(desktopSidebar).toBeInTheDocument();
    });

    it('should render mobile navigation elements', () => {
      // Arrange & Act
      render(<Sidebar />);

      // Assert
      const logo = screen.getByAltText('logo');
      const burgerMenu = screen.getByAltText('burger-menu');
      const mobileSidenav = screen.getByTestId('mobile-sidenav');

      expect(logo).toBeInTheDocument();
      expect(burgerMenu).toBeInTheDocument();
      expect(mobileSidenav).toBeInTheDocument();
    });

    it('should apply correct styles to desktop sidebar', () => {
      // Arrange & Act
      const { container } = render(<Sidebar />);

      // Assert
      const desktopContainer = container.querySelector('.fixed.top-0.left-0.h-screen.w-20');
      expect(desktopContainer).toHaveClass('bg-white', 'z-50', 'shadow-md', 'hidden', 'md:block');
    });

    it('should apply correct styles to mobile header', () => {
      // Arrange & Act
      const { container } = render(<Sidebar />);

      // Assert
      const mobileHeader = container.querySelector('.fixed.top-0.left-0.w-screen.h-20');
      expect(mobileHeader).toHaveClass('md:hidden', 'flex', 'items-center', 'bg-white');
    });
  });

  describe('Current Step Prop', () => {
    it('should not apply blur when currentStep is not 6', () => {
      // Arrange & Act
      const { container } = render(<Sidebar currentStep={1} />);

      // Assert
      const desktopContainer = container.querySelector('.fixed.top-0.left-0.h-screen');
      expect(desktopContainer).not.toHaveClass('blur-md');
    });

    it('should apply blur when currentStep is 6', () => {
      // Arrange & Act
      const { container } = render(<Sidebar currentStep={6} />);

      // Assert
      const desktopContainer = container.querySelector('.fixed.top-0.left-0.h-screen');
      expect(desktopContainer).toHaveClass('blur-md');
    });

    it('should handle different step values', () => {
      // Arrange & Act & Assert
      [1, 2, 3, 4, 5, 7, 8].forEach((step) => {
        const { container } = render(<Sidebar currentStep={step} />);
        const desktopContainer = container.querySelector('.fixed.top-0.left-0.h-screen');
        expect(desktopContainer).not.toHaveClass('blur-md');
      });
    });

    it('should use default currentStep of 1 when not provided', () => {
      // Arrange & Act
      const { container } = render(<Sidebar />);

      // Assert
      const desktopContainer = container.querySelector('.fixed.top-0.left-0.h-screen');
      expect(desktopContainer).not.toHaveClass('blur-md');
    });
  });

  describe('Mobile Sidebar Toggle', () => {
    it('should have mobile sidebar hidden by default', () => {
      // Arrange & Act
      render(<Sidebar />);

      // Assert
      const mobileSidenav = screen.getByTestId('mobile-sidenav');
      expect(mobileSidenav).toHaveStyle({ right: '-80px' });
    });

    it('should toggle mobile sidebar visibility on burger menu click', () => {
      // Arrange
      render(<Sidebar />);
      const burgerButton = screen.getByAltText('burger-menu').parentElement as HTMLElement;
      const mobileSidenav = screen.getByTestId('mobile-sidenav');

      // Act - First click opens
      fireEvent.click(burgerButton);

      // Assert - Sidebar visible
      expect(mobileSidenav).toHaveStyle({ right: '0px' });

      // Act - Second click closes
      fireEvent.click(burgerButton);

      // Assert - Sidebar hidden
      expect(mobileSidenav).toHaveStyle({ right: '-80px' });
    });

    it('should handle multiple toggle clicks correctly', () => {
      // Arrange
      render(<Sidebar />);
      const burgerButton = screen.getByAltText('burger-menu').parentElement as HTMLElement;
      const mobileSidenav = screen.getByTestId('mobile-sidenav');

      // Act & Assert - Multiple toggles
      for (let i = 0; i < 5; i++) {
        fireEvent.click(burgerButton);
        expect(mobileSidenav).toHaveStyle({ right: i % 2 === 0 ? '0px' : '-80px' });
      }
    });
  });

  describe('SideNavBar Integration', () => {
    it('should pass correct props to desktop SideNavBar', () => {
      // Arrange & Act
      render(<Sidebar />);

      // Assert
      const desktopSidenav = screen.getByTestId('desktop-sidenav');
      expect(desktopSidenav).toBeInTheDocument();
    });

    it('should pass correct props to mobile SideNavBar', () => {
      // Arrange & Act
      render(<Sidebar />);

      // Assert
      const mobileSidenav = screen.getByTestId('mobile-sidenav');
      expect(mobileSidenav).toHaveClass('bg-white', 'w-20', 'absolute', 'top-0', 'transition-all');
    });
  });

  describe('Image Sources', () => {
    it('should render logo with correct source', () => {
      // Arrange & Act
      render(<Sidebar />);

      // Assert
      const logo = screen.getByAltText('logo');
      expect(logo).toHaveAttribute('src', '/src/assets/icons/logo.svg');
    });

    it('should render burger menu icon with correct source', () => {
      // Arrange & Act
      render(<Sidebar />);

      // Assert
      const burgerMenu = screen.getByAltText('burger-menu');
      expect(burgerMenu).toHaveAttribute('src', '/src/assets/icons/burger.svg');
    });
  });

  describe('Responsive Design', () => {
    it('should have desktop sidebar hidden on mobile', () => {
      // Arrange & Act
      const { container } = render(<Sidebar />);

      // Assert
      const desktopContainer = container.querySelector('.fixed.top-0.left-0.h-screen');
      expect(desktopContainer).toHaveClass('hidden', 'md:block');
    });

    it('should have mobile header hidden on desktop', () => {
      // Arrange & Act
      const { container } = render(<Sidebar />);

      // Assert
      const mobileHeader = container.querySelector('.fixed.top-0.left-0.w-screen');
      expect(mobileHeader).toHaveClass('md:hidden');
    });
  });

  describe('Accessibility', () => {
    it('should have accessible button for burger menu', () => {
      // Arrange & Act
      render(<Sidebar />);

      // Assert
      const burgerButton = screen.getByAltText('burger-menu').parentElement;
      expect(burgerButton?.tagName).toBe('BUTTON');
    });

    it('should have proper alt text for images', () => {
      // Arrange & Act
      render(<Sidebar />);

      // Assert
      expect(screen.getByAltText('logo')).toBeInTheDocument();
      expect(screen.getByAltText('burger-menu')).toBeInTheDocument();
    });
  });

  describe('State Management', () => {
    it('should maintain sidebar state between re-renders', () => {
      // Arrange
      const { rerender } = render(<Sidebar currentStep={1} />);
      const burgerButton = screen.getByAltText('burger-menu').parentElement as HTMLElement;
      const mobileSidenav = screen.getByTestId('mobile-sidenav');

      // Act - Open sidebar
      fireEvent.click(burgerButton);
      expect(mobileSidenav).toHaveStyle({ right: '0px' });

      // Re-render with different prop
      rerender(<Sidebar currentStep={2} />);

      // Assert - State should be maintained
      expect(mobileSidenav).toHaveStyle({ right: '0px' });
    });

    it('should reset state when component unmounts and remounts', () => {
      // Arrange
      const { unmount } = render(<Sidebar />);
      const burgerButton = screen.getByAltText('burger-menu').parentElement as HTMLElement;

      // Act - Open sidebar
      fireEvent.click(burgerButton);
      expect(screen.getByTestId('mobile-sidenav')).toHaveStyle({ right: '0px' });

      // Unmount and remount
      unmount();
      render(<Sidebar />);

      // Assert - State should be reset
      expect(screen.getByTestId('mobile-sidenav')).toHaveStyle({ right: '-80px' });
    });
  });

  describe('Z-Index Layering', () => {
    it('should have proper z-index for desktop sidebar', () => {
      // Arrange & Act
      const { container } = render(<Sidebar />);

      // Assert
      const desktopContainer = container.querySelector('.fixed.top-0.left-0.h-screen');
      expect(desktopContainer).toHaveClass('z-50');
    });

    it('should have proper z-index for mobile header', () => {
      // Arrange & Act
      const { container } = render(<Sidebar />);

      // Assert
      const mobileHeader = container.querySelector('.fixed.top-0.left-0.w-screen');
      expect(mobileHeader).toHaveClass('z-50');
    });
  });
});
