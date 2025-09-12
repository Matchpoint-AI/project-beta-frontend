import React from 'react';

interface VersionDisplayProps {
  className?: string;
}

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
const VersionDisplay: React.FC<VersionDisplayProps> = ({ className = '' }) => {
  // Get the version from the global variable set by Vite
  const version = typeof __VITE_APP_VERSION__ !== 'undefined' ? __VITE_APP_VERSION__ : 'unknown';

  // Determine environment - check both MODE and hostname
  const mode = import.meta.env.MODE;
  const nodeEnv = import.meta.env.NODE_ENV;
  const appEnv = import.meta.env.VITE_APP_ENV;
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const isDev = hostname.includes('dev.matchpointai.com') || hostname.includes('localhost');
  const isStaging = hostname.includes('staging.matchpointai.com');
  const _isProd = hostname.includes('matchpointai.com') && !isDev && !isStaging;

  // Show version only in development and staging environments
  // Hide in production for security/UX reasons
  const shouldShowVersion =
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
  const displayVersion = version.startsWith('v') ? version : `v${version}`;

  return (
    <div
      className={`fixed bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded z-50 font-mono ${className}`}
      data-testid="version-display"
    >
      {displayVersion}
    </div>
  );
};

export default VersionDisplay;
