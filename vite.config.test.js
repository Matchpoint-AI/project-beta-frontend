import { defineConfig, searchForWorkspaceRoot } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { resolve } from 'path';

export default defineConfig({
  plugins: [svgr(), react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  define: {
    global: 'globalThis',
  },
  test: {
    globals: true,
    css: false,
    reporters: ['verbose'],
    environment: 'jsdom',
    setupFiles: [resolve(__dirname, 'src/setupTests.ts')],
    include: ['src/**/*.test.tsx', 'src/**/*.test.ts'],
    deps: {
      inline: ['@testing-library/jest-dom'],
    },
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
  esbuild: {
    define: {
      global: 'globalThis',
    },
  },
  optimizeDeps: {
    include: ['@testing-library/jest-dom'],
  },
  server: {
    fs: {
      allow: [searchForWorkspaceRoot(process.cwd()), './client'],
    },
  },
});
