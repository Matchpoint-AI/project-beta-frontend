import posthog from './posthog';
export default function handleNavigate(id, dest, navigate) {
    var pageName = '';
    if (dest === '/dashboard')
        pageName = 'Dashboard';
    else if (dest === '/onboard')
        pageName = 'Onboard';
    else if (dest === '/landing')
        pageName = 'Landing Page';
    else if (dest === '/campaign')
        pageName = 'Campaign';
    else if (dest.includes('/campaign/content'))
        pageName = 'Campaign Content Page';
    else
        navigate(dest);
    if (posthog.__loaded) {
        posthog.capture("Navigated to ".concat(pageName), {
            distinct_id: id,
        });
    }
    navigate(dest);
}
//# sourceMappingURL=handleNavigate.js.map