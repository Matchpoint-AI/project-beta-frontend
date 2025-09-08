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
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }
    }
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
  // Fix Vite cache directory issue
  cacheDir: process.env.TEST_TMPDIR || '.vite_cache',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['node_modules', 'dist'],
    deps: {
      inline: ['@testing-library/jest-dom']
    },
    // Disable coverage for now to avoid additional issues
    coverage: {
      enabled: false
    },
    // Use threads pool which is more stable than forks
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
});
