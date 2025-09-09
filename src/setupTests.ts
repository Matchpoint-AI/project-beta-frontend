import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock firebase-config for V2 API hook
vi.mock('./firebase-config', () => ({
  auth: {
    currentUser: {
      getIdToken: vi.fn().mockResolvedValue('test-token')
    }
  }
}));

// Global mock for scrapeProduct
try {
  // @ts-ignore
  if (typeof vi !== 'undefined') {
    vi.mock('./helpers/scrapeProduct', () => ({
      default: vi.fn().mockResolvedValue({
        name: 'Test Product',
        description: 'Test Description',
        product_features: ['Feature 1', 'Feature 2'],
      }),
    }));
  }
} catch (e) {
  // Ignore if vi is not available
}

// Polyfill for crypto.getRandomValues
Object.defineProperty(globalThis, 'crypto', {
  value: {
    getRandomValues: (arr: any) => {
      if (typeof require !== 'undefined') {
        const crypto = require('crypto');
        if (crypto.randomFillSync) {
          crypto.randomFillSync(arr);
          return arr;
        }
      }
      // Fallback for environments without Node.js crypto
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    },
    randomUUID: () => {
      if (typeof require !== 'undefined') {
        const crypto = require('crypto');
        if (crypto.randomUUID) {
          return crypto.randomUUID();
        }
      }
      // Fallback UUID generation
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
  },
  configurable: true,
});

// Additional browser API mocks
if (typeof window !== 'undefined') {
  // Mock ResizeObserver
  window.ResizeObserver = window.ResizeObserver || class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  // Mock IntersectionObserver
  window.IntersectionObserver = window.IntersectionObserver || class IntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  // Mock matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => {},
    }),
  });
}
