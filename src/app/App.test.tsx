import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from './App';

// Mock the Firebase authentication
vi.mock('../lib/firebase', () => ({
  useAuthentication: vi.fn(() => ({
    user: {
      getIdToken: vi.fn().mockResolvedValue('test-token'),
      uid: 'test-uid',
      email: 'test@example.com'
    }
  }))
}));

// Mock PostHog
vi.mock('../helpers/posthog', () => ({
  default: {
    __loaded: false,
    capture: vi.fn()
  }
}));

// Mock the BrandDataLoader component
vi.mock('../features/brand/components/BrandDataLoader', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="brand-data-loader">{children}</div>
}));

// Mock VersionDisplay component
vi.mock('../shared/components/feedback/VersionDisplay', () => ({
  default: () => <div data-testid="version-display">Version Display</div>
}));

// Test helper function to render App with required providers
const renderApp = () => {
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <App />
    </MemoryRouter>
  );
};

describe('App Component', () => {
  test('renders app with all required providers and components', () => {
    // Arrange - Set up the component and dependencies
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Act - Render the component
    renderApp();
    
    // Assert - Verify the component renders without errors
    expect(screen.getByTestId('version-display')).toBeInTheDocument();
    expect(screen.getByTestId('brand-data-loader')).toBeInTheDocument();
    
    // Clean up console spy
    consoleSpy.mockRestore();
  });
});
