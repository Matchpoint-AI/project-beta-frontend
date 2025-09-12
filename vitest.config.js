import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Set up crypto polyfill for Node.js environment before anything else
Object.defineProperty(globalThis, 'crypto', {
  value: {
    getRandomValues: (arr) => {
      try {
        const crypto = require('crypto');
        return crypto.randomFillSync(arr);
      } catch {
        // Fallback for environments without Node.js crypto
        for (let i = 0; i < arr.length; i++) {
          arr[i] = Math.floor(Math.random() * 256);
        }
        return arr;
      }
    },
    randomUUID: () => {
      try {
        const crypto = require('crypto');
        return crypto.randomUUID();
      } catch {
        // Fallback UUID generation
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          const r = (Math.random() * 16) | 0;
          const v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
      }
    },
  },
  configurable: true,
});

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  // Use proper cache directory for better performance
  cacheDir: process.env.TEST_TMPDIR || 'node_modules/.vite',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['node_modules', 'dist'],
    deps: {
      inline: ['@testing-library/jest-dom'],
    },
    coverage: {
      enabled: false, // Set to true when running with --coverage flag
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'text-summary', 'json-summary'],
      exclude: [
        'node_modules/',
        'src/setupTests.ts',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        '**/__mocks__',
      ],
      thresholds: {
        // Enforcing 50% test coverage across all metrics
        statements: 50,
        branches: 50,
        functions: 50,
        lines: 50,
      },
    },
    // Use threads pool for parallel test execution
    pool: 'threads',
    poolOptions: {
      threads: {
        // Run tests in parallel for better performance
        singleThread: false,
        // Use available CPU cores for maximum parallelization
        maxThreads: undefined,
        minThreads: 1,
      },
    },
  },
});
