import { defineConfig, loadEnv, searchForWorkspaceRoot } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { vitePostHog } from 'vite-plugin-posthog';

export default defineConfig(({ mode }) => {
  // const env = loadEnv(mode, process.cwd(), "");
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  // Try to get version from multiple sources
  const version =
    process.env.VITE_APP_VERSION ||
    process.env.BAZEL_VITE_APP_VERSION ||
    process.env.BAZEL_VITE_APP_VERSION_DEFINE ||
    process.env.BAZEL_VITE_APP_VERSION_DEFINE_ARG ||
    process.env.BAZEL_VITE_APP_VERSION_DEFINE_ARG_2 ||
    process.env.BAZEL_VITE_APP_VERSION_DEFINE_ARG_3 ||
    process.env.BAZEL_VITE_APP_VERSION_DEFINE_ARG_4 ||
    process.env.BAZEL_VITE_APP_VERSION_DEFINE_ARG_5 ||
    process.env.BAZEL_VITE_APP_VERSION_DEFINE_ARG_6 ||
    process.env.BAZEL_VITE_APP_VERSION_DEFINE_ARG_7 ||
    process.env.BAZEL_VITE_APP_VERSION_DEFINE_ARG_8 ||
    process.env.BAZEL_VITE_APP_VERSION_DEFINE_ARG_9 ||
    process.env.BAZEL_VITE_APP_VERSION_DEFINE_ARG_10 ||
    process.env.BAZEL_VITE_APP_VERSION_DEFINE_ARG_11 ||
    process.env.BAZEL_VITE_APP_VERSION_DEFINE_ARG_12 ||
    process.env.BAZEL_VITE_APP_VERSION_DEFINE_ARG_13 ||
    process.env.BAZEL_VITE_APP_VERSION_DEFINE_ARG_14 ||
    process.env.TAG_NAME ||
    'dev';

  return {
    define: {
      __VITE_APP_VERSION__: JSON.stringify(version),
    },
    base: '/',
    plugins: [
      svgr(),
      react(),
      ...(process.env.VITE_POSTHOG_KEY && process.env.VITE_POSTHOG_API_HOST
        ? [
            vitePostHog({
              apiKey: process.env.VITE_POSTHOG_KEY,
              hostUrl: process.env.VITE_POSTHOG_API_HOST,
              isDevModeOn: true,
              config: {
                autocapture: true,
                capture_pageview: true,
              },
            }),
          ]
        : []),
    ],
    // optimizeDeps: {
    //    exclude: ["react", "react-dom"], // Ensures React is not pre-bundled
    // },
    // build: {
    //    rollupOptions: {
    //       external: ["react", "react-dom"], // Marks React as external
    //    },
    // },
    test: {
      globals: true,
      css: true,
      reporters: ['verbose'],
    },
    server: {
      fs: {
        allow: [
          // search up for workspace root
          searchForWorkspaceRoot(process.cwd()),
          // your custom rules
          './client',
        ],
      },
    },
  };
});
