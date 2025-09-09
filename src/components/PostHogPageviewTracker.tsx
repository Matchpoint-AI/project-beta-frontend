import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import posthog from '../helpers/posthog';

export default function PostHogPageviewTracker() {
  const location = useLocation();

  useEffect(() => {
    if (posthog.__loaded) {
      posthog.capture('$pageview');
    }
  }, [location, posthog]);

  return null;
}
