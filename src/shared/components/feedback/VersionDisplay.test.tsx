import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import VersionDisplay from './VersionDisplay';

// Mock the global __VITE_APP_VERSION__ variable
declare global {
  const __VITE_APP_VERSION__: string;
}

// Mock import.meta.env
const mockImportMeta = {
  env: {
    MODE: 'development',
    NODE_ENV: 'development',
    VITE_APP_ENV: 'dev',
  },
};

Object.defineProperty(globalThis, 'import', {
  value: {
    meta: mockImportMeta,
  },
  writable: true,
});

// Mock the version variable
Object.defineProperty(globalThis, '__VITE_APP_VERSION__', {
  value: '1.2.3',
  writable: true,
});

describe('VersionDisplay', () => {
  // Mock window.location
  const mockLocation = {
    hostname: 'localhost',
  };

  beforeEach(() => {
    // Reset environment variables before each test
    mockImportMeta.env.MODE = 'development';
    mockImportMeta.env.NODE_ENV = 'development';
    mockImportMeta.env.VITE_APP_ENV = 'dev';

    // Reset window.location mock
    mockLocation.hostname = 'localhost';
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true,
    });
  });

  afterEach(() => {
    cleanup();
  });

  describe('Environment Detection', () => {
    it('should render in development mode', () => {
      mockImportMeta.env.MODE = 'development';
      render(<VersionDisplay />);
      expect(screen.getByTestId('version-display')).toBeInTheDocument();
      expect(screen.getByText('v1.2.3')).toBeInTheDocument();
    });

    it('should render in staging mode', () => {
      mockImportMeta.env.MODE = 'staging';
      mockImportMeta.env.NODE_ENV = 'production';
      mockImportMeta.env.VITE_APP_ENV = 'staging';
      render(<VersionDisplay />);
      expect(screen.getByTestId('version-display')).toBeInTheDocument();
      expect(screen.getByText('v1.2.3')).toBeInTheDocument();
    });

    it('should render in local environment', () => {
      mockImportMeta.env.MODE = 'development';
      mockImportMeta.env.NODE_ENV = 'development';
      mockImportMeta.env.VITE_APP_ENV = 'local';
      render(<VersionDisplay />);
      expect(screen.getByTestId('version-display')).toBeInTheDocument();
      expect(screen.getByText('v1.2.3')).toBeInTheDocument();
    });

    it('should render in cloud dev environment', () => {
      mockImportMeta.env.MODE = 'production';
      mockImportMeta.env.NODE_ENV = 'production';
      mockImportMeta.env.VITE_APP_ENV = 'dev';
      render(<VersionDisplay />);
      expect(screen.getByTestId('version-display')).toBeInTheDocument();
      expect(screen.getByText('v1.2.3')).toBeInTheDocument();
    });

    it('should render in cloud staging environment', () => {
      mockImportMeta.env.MODE = 'production';
      mockImportMeta.env.NODE_ENV = 'production';
      mockImportMeta.env.VITE_APP_ENV = 'staging';
      render(<VersionDisplay />);
      expect(screen.getByTestId('version-display')).toBeInTheDocument();
      expect(screen.getByText('v1.2.3')).toBeInTheDocument();
    });

    it('should NOT render in production mode', () => {
      mockImportMeta.env.MODE = 'production';
      mockImportMeta.env.NODE_ENV = 'production';
      mockImportMeta.env.VITE_APP_ENV = 'production';
      mockLocation.hostname = 'matchpointai.com';
      render(<VersionDisplay />);
      expect(screen.queryByTestId('version-display')).not.toBeInTheDocument();
    });

    it('should NOT render in cloud prod environment', () => {
      mockImportMeta.env.MODE = 'production';
      mockImportMeta.env.NODE_ENV = 'production';
      mockImportMeta.env.VITE_APP_ENV = 'prod';
      mockLocation.hostname = 'matchpointai.com';
      render(<VersionDisplay />);
      expect(screen.queryByTestId('version-display')).not.toBeInTheDocument();
    });

    it('should NOT render when no environment variables indicate dev/staging', () => {
      mockImportMeta.env.MODE = 'production';
      mockImportMeta.env.NODE_ENV = 'production';
      mockImportMeta.env.VITE_APP_ENV = 'prod';
      mockLocation.hostname = 'matchpointai.com';
      render(<VersionDisplay />);
      expect(screen.queryByTestId('version-display')).not.toBeInTheDocument();
    });
  });

  describe('Hostname-based Environment Detection', () => {
    beforeEach(() => {
      // Set production-like environment variables to test hostname detection
      mockImportMeta.env.MODE = 'production';
      mockImportMeta.env.NODE_ENV = 'production';
      mockImportMeta.env.VITE_APP_ENV = '';
    });

    it('should render on dev.matchpointai.com', () => {
      mockLocation.hostname = 'dev.matchpointai.com';
      render(<VersionDisplay />);
      expect(screen.getByTestId('version-display')).toBeInTheDocument();
      expect(screen.getByText('v1.2.3')).toBeInTheDocument();
    });

    it('should render on staging.matchpointai.com', () => {
      mockLocation.hostname = 'staging.matchpointai.com';
      render(<VersionDisplay />);
      expect(screen.getByTestId('version-display')).toBeInTheDocument();
      expect(screen.getByText('v1.2.3')).toBeInTheDocument();
    });

    it('should render on localhost', () => {
      mockLocation.hostname = 'localhost';
      render(<VersionDisplay />);
      expect(screen.getByTestId('version-display')).toBeInTheDocument();
      expect(screen.getByText('v1.2.3')).toBeInTheDocument();
    });

    it('should render on localhost:3000', () => {
      mockLocation.hostname = 'localhost';
      render(<VersionDisplay />);
      expect(screen.getByTestId('version-display')).toBeInTheDocument();
      expect(screen.getByText('v1.2.3')).toBeInTheDocument();
    });

    it('should NOT render on production matchpointai.com', () => {
      mockLocation.hostname = 'matchpointai.com';
      render(<VersionDisplay />);
      expect(screen.queryByTestId('version-display')).not.toBeInTheDocument();
    });

    it('should NOT render on app.matchpointai.com', () => {
      mockLocation.hostname = 'app.matchpointai.com';
      render(<VersionDisplay />);
      expect(screen.queryByTestId('version-display')).not.toBeInTheDocument();
    });

    it('should NOT render on www.matchpointai.com', () => {
      mockLocation.hostname = 'www.matchpointai.com';
      render(<VersionDisplay />);
      expect(screen.queryByTestId('version-display')).not.toBeInTheDocument();
    });

    it('should NOT render on other production domains', () => {
      mockLocation.hostname = 'example.com';
      render(<VersionDisplay />);
      expect(screen.queryByTestId('version-display')).not.toBeInTheDocument();
    });
  });

  describe('Version Display', () => {
    it('should display the correct version number', () => {
      render(<VersionDisplay />);
      expect(screen.getByText('v1.2.3')).toBeInTheDocument();
    });

    it('should display "unknown" when version is not available', () => {
      // Mock undefined version
      Object.defineProperty(globalThis, '__VITE_APP_VERSION__', {
        value: undefined,
        writable: true,
      });

      render(<VersionDisplay />);
      expect(screen.getByText('vunknown')).toBeInTheDocument();
    });

    it('should handle empty version string', () => {
      Object.defineProperty(globalThis, '__VITE_APP_VERSION__', {
        value: '',
        writable: true,
      });

      render(<VersionDisplay />);
      expect(screen.getByText('v')).toBeInTheDocument();
    });

    it('should not add double v prefix when version already starts with v', () => {
      Object.defineProperty(globalThis, '__VITE_APP_VERSION__', {
        value: 'v2.0.0',
        writable: true,
      });

      render(<VersionDisplay />);
      expect(screen.getByText('v2.0.0')).toBeInTheDocument();
      // Ensure no double 'v' prefix
      expect(screen.queryByText('vv2.0.0')).not.toBeInTheDocument();
    });

    it('should add v prefix when version does not start with v', () => {
      Object.defineProperty(globalThis, '__VITE_APP_VERSION__', {
        value: '3.0.0',
        writable: true,
      });

      render(<VersionDisplay />);
      expect(screen.getByText('v3.0.0')).toBeInTheDocument();
    });
  });

  describe('Styling and Layout', () => {
    it('should have the correct CSS classes', () => {
      render(<VersionDisplay />);
      const versionElement = screen.getByTestId('version-display');

      expect(versionElement).toHaveClass('fixed');
      expect(versionElement).toHaveClass('bottom-2');
      expect(versionElement).toHaveClass('right-2');
      expect(versionElement).toHaveClass('bg-black');
      expect(versionElement).toHaveClass('bg-opacity-70');
      expect(versionElement).toHaveClass('text-white');
      expect(versionElement).toHaveClass('text-xs');
      expect(versionElement).toHaveClass('px-2');
      expect(versionElement).toHaveClass('py-1');
      expect(versionElement).toHaveClass('rounded');
      expect(versionElement).toHaveClass('z-50');
      expect(versionElement).toHaveClass('font-mono');
    });

    it('should apply custom className when provided', () => {
      render(<VersionDisplay className="custom-class" />);
      const versionElement = screen.getByTestId('version-display');
      expect(versionElement).toHaveClass('custom-class');
    });
  });

  describe('Accessibility', () => {
    it('should have the correct test id for testing', () => {
      render(<VersionDisplay />);
      expect(screen.getByTestId('version-display')).toBeInTheDocument();
    });
  });
});
