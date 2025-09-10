import { jsx as _jsx } from 'react/jsx-runtime';
/**
 * VersionDisplay component shows the application version only in development and staging environments.
 * It is hidden in production to avoid exposing internal version information to end users.
 *
 * Environment detection works for:
 * - Local development (NODE_ENV=development, MODE=development, localhost)
 * - Development deployments (dev.matchpointai.com)
 * - Staging environments (staging.matchpointai.com)
 *
 * Hidden in:
 * - Production environments (matchpointai.com without dev/staging subdomain)
 * - Default production builds (NODE_ENV=production without VITE_APP_ENV override)
 */
var VersionDisplay = function (_a) {
  var _b = _a.className,
    className = _b === void 0 ? '' : _b;
  // Get the version from the global variable set by Vite
  var version = typeof __VITE_APP_VERSION__ !== 'undefined' ? __VITE_APP_VERSION__ : 'unknown';
  // Determine environment - check both MODE and hostname
  var mode = import.meta.env.MODE;
  var nodeEnv = import.meta.env.NODE_ENV;
  var appEnv = import.meta.env.VITE_APP_ENV;
  var hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  var isDev = hostname.includes('dev.matchpointai.com') || hostname.includes('localhost');
  var isStaging = hostname.includes('staging.matchpointai.com');
  var _isProd = hostname.includes('matchpointai.com') && !isDev && !isStaging;
  // Show version only in development and staging environments
  // Hide in production for security/UX reasons
  var shouldShowVersion =
    mode === 'development' ||
    mode === 'staging' ||
    nodeEnv === 'development' ||
    appEnv === 'dev' ||
    appEnv === 'staging' ||
    appEnv === 'local' ||
    isDev ||
    isStaging;
  // Don't render anything in production
  if (!shouldShowVersion) {
    return null;
  }
  // Add 'v' prefix only if the version doesn't already have it
  var displayVersion = version.startsWith('v') ? version : 'v'.concat(version);
  return _jsx('div', {
    className:
      'fixed bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded z-50 font-mono '.concat(
        className
      ),
    'data-testid': 'version-display',
    children: displayVersion,
  });
};
export default VersionDisplay;
//# sourceMappingURL=VersionDisplay.js.map
