import { jsx as _jsx } from 'react/jsx-runtime';
import { render, screen, cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import VersionDisplay from './VersionDisplay';
// Mock import.meta.env
var mockImportMeta = {
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
describe('VersionDisplay', function () {
  // Mock window.location
  var mockLocation = {
    hostname: 'localhost',
  };
  beforeEach(function () {
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
  afterEach(function () {
    cleanup();
  });
  describe('Environment Detection', function () {
    it('should render in development mode', function () {
      mockImportMeta.env.MODE = 'development';
      render(_jsx(VersionDisplay, {}));
      expect(screen.getByTestId('version-display')).toBeInTheDocument();
      expect(screen.getByText('v1.2.3')).toBeInTheDocument();
    });
    it('should render in staging mode', function () {
      mockImportMeta.env.MODE = 'staging';
      mockImportMeta.env.NODE_ENV = 'production';
      mockImportMeta.env.VITE_APP_ENV = 'staging';
      render(_jsx(VersionDisplay, {}));
      expect(screen.getByTestId('version-display')).toBeInTheDocument();
      expect(screen.getByText('v1.2.3')).toBeInTheDocument();
    });
    it('should render in local environment', function () {
      mockImportMeta.env.MODE = 'development';
      mockImportMeta.env.NODE_ENV = 'development';
      mockImportMeta.env.VITE_APP_ENV = 'local';
      render(_jsx(VersionDisplay, {}));
      expect(screen.getByTestId('version-display')).toBeInTheDocument();
      expect(screen.getByText('v1.2.3')).toBeInTheDocument();
    });
    it('should render in cloud dev environment', function () {
      mockImportMeta.env.MODE = 'production';
      mockImportMeta.env.NODE_ENV = 'production';
      mockImportMeta.env.VITE_APP_ENV = 'dev';
      render(_jsx(VersionDisplay, {}));
      expect(screen.getByTestId('version-display')).toBeInTheDocument();
      expect(screen.getByText('v1.2.3')).toBeInTheDocument();
    });
    it('should render in cloud staging environment', function () {
      mockImportMeta.env.MODE = 'production';
      mockImportMeta.env.NODE_ENV = 'production';
      mockImportMeta.env.VITE_APP_ENV = 'staging';
      render(_jsx(VersionDisplay, {}));
      expect(screen.getByTestId('version-display')).toBeInTheDocument();
      expect(screen.getByText('v1.2.3')).toBeInTheDocument();
    });
    it('should NOT render in production mode', function () {
      mockImportMeta.env.MODE = 'production';
      mockImportMeta.env.NODE_ENV = 'production';
      mockImportMeta.env.VITE_APP_ENV = 'production';
      mockLocation.hostname = 'matchpointai.com';
      render(_jsx(VersionDisplay, {}));
      expect(screen.queryByTestId('version-display')).not.toBeInTheDocument();
    });
    it('should NOT render in cloud prod environment', function () {
      mockImportMeta.env.MODE = 'production';
      mockImportMeta.env.NODE_ENV = 'production';
      mockImportMeta.env.VITE_APP_ENV = 'prod';
      mockLocation.hostname = 'matchpointai.com';
      render(_jsx(VersionDisplay, {}));
      expect(screen.queryByTestId('version-display')).not.toBeInTheDocument();
    });
    it('should NOT render when no environment variables indicate dev/staging', function () {
      mockImportMeta.env.MODE = 'production';
      mockImportMeta.env.NODE_ENV = 'production';
      mockImportMeta.env.VITE_APP_ENV = 'prod';
      mockLocation.hostname = 'matchpointai.com';
      render(_jsx(VersionDisplay, {}));
      expect(screen.queryByTestId('version-display')).not.toBeInTheDocument();
    });
  });
  describe('Hostname-based Environment Detection', function () {
    beforeEach(function () {
      // Set production-like environment variables to test hostname detection
      mockImportMeta.env.MODE = 'production';
      mockImportMeta.env.NODE_ENV = 'production';
      mockImportMeta.env.VITE_APP_ENV = '';
    });
    it('should render on dev.matchpointai.com', function () {
      mockLocation.hostname = 'dev.matchpointai.com';
      render(_jsx(VersionDisplay, {}));
      expect(screen.getByTestId('version-display')).toBeInTheDocument();
      expect(screen.getByText('v1.2.3')).toBeInTheDocument();
    });
    it('should render on staging.matchpointai.com', function () {
      mockLocation.hostname = 'staging.matchpointai.com';
      render(_jsx(VersionDisplay, {}));
      expect(screen.getByTestId('version-display')).toBeInTheDocument();
      expect(screen.getByText('v1.2.3')).toBeInTheDocument();
    });
    it('should render on localhost', function () {
      mockLocation.hostname = 'localhost';
      render(_jsx(VersionDisplay, {}));
      expect(screen.getByTestId('version-display')).toBeInTheDocument();
      expect(screen.getByText('v1.2.3')).toBeInTheDocument();
    });
    it('should render on localhost:3000', function () {
      mockLocation.hostname = 'localhost';
      render(_jsx(VersionDisplay, {}));
      expect(screen.getByTestId('version-display')).toBeInTheDocument();
      expect(screen.getByText('v1.2.3')).toBeInTheDocument();
    });
    it('should NOT render on production matchpointai.com', function () {
      mockLocation.hostname = 'matchpointai.com';
      render(_jsx(VersionDisplay, {}));
      expect(screen.queryByTestId('version-display')).not.toBeInTheDocument();
    });
    it('should NOT render on app.matchpointai.com', function () {
      mockLocation.hostname = 'app.matchpointai.com';
      render(_jsx(VersionDisplay, {}));
      expect(screen.queryByTestId('version-display')).not.toBeInTheDocument();
    });
    it('should NOT render on www.matchpointai.com', function () {
      mockLocation.hostname = 'www.matchpointai.com';
      render(_jsx(VersionDisplay, {}));
      expect(screen.queryByTestId('version-display')).not.toBeInTheDocument();
    });
    it('should NOT render on other production domains', function () {
      mockLocation.hostname = 'example.com';
      render(_jsx(VersionDisplay, {}));
      expect(screen.queryByTestId('version-display')).not.toBeInTheDocument();
    });
  });
  describe('Version Display', function () {
    it('should display the correct version number', function () {
      render(_jsx(VersionDisplay, {}));
      expect(screen.getByText('v1.2.3')).toBeInTheDocument();
    });
    it('should display "unknown" when version is not available', function () {
      // Mock undefined version
      Object.defineProperty(globalThis, '__VITE_APP_VERSION__', {
        value: undefined,
        writable: true,
      });
      render(_jsx(VersionDisplay, {}));
      expect(screen.getByText('vunknown')).toBeInTheDocument();
    });
    it('should handle empty version string', function () {
      Object.defineProperty(globalThis, '__VITE_APP_VERSION__', {
        value: '',
        writable: true,
      });
      render(_jsx(VersionDisplay, {}));
      expect(screen.getByText('v')).toBeInTheDocument();
    });
    it('should not add double v prefix when version already starts with v', function () {
      Object.defineProperty(globalThis, '__VITE_APP_VERSION__', {
        value: 'v2.0.0',
        writable: true,
      });
      render(_jsx(VersionDisplay, {}));
      expect(screen.getByText('v2.0.0')).toBeInTheDocument();
      // Ensure no double 'v' prefix
      expect(screen.queryByText('vv2.0.0')).not.toBeInTheDocument();
    });
    it('should add v prefix when version does not start with v', function () {
      Object.defineProperty(globalThis, '__VITE_APP_VERSION__', {
        value: '3.0.0',
        writable: true,
      });
      render(_jsx(VersionDisplay, {}));
      expect(screen.getByText('v3.0.0')).toBeInTheDocument();
    });
  });
  describe('Styling and Layout', function () {
    it('should have the correct CSS classes', function () {
      render(_jsx(VersionDisplay, {}));
      var versionElement = screen.getByTestId('version-display');
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
    it('should apply custom className when provided', function () {
      render(_jsx(VersionDisplay, { className: 'custom-class' }));
      var versionElement = screen.getByTestId('version-display');
      expect(versionElement).toHaveClass('custom-class');
    });
  });
  describe('Accessibility', function () {
    it('should have the correct test id for testing', function () {
      render(_jsx(VersionDisplay, {}));
      expect(screen.getByTestId('version-display')).toBeInTheDocument();
    });
  });
});
//# sourceMappingURL=VersionDisplay.test.js.map
