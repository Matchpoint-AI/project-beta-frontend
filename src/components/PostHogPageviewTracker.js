import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import posthog from '../helpers/posthog';
export default function PostHogPageviewTracker() {
    var location = useLocation();
    useEffect(function () {
        if (posthog.__loaded) {
            posthog.capture('$pageview');
        }
    }, [location, posthog]);
    return null;
}
//# sourceMappingURL=PostHogPageviewTracker.js.map