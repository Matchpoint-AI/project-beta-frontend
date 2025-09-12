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
declare const VersionDisplay: React.FC<VersionDisplayProps>;
export default VersionDisplay;
