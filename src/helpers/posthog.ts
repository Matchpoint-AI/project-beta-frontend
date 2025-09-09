import posthog from 'posthog-js';

// Only run init logic in browser environment
if (typeof window !== 'undefined') {
  const baseurl =
    window.location.hostname === 'www.matchpointai.com'
      ? 'matchpointai.com'
      : window.location.hostname;

  if (baseurl !== 'localhost' && baseurl !== '127.0.0.1') {
    posthog.init('phc_VNVYMctu3zn3KiFdtjJJGkJ89GlqXINiNXEM6PZgL62', {
      api_host: 'https://us.i.posthog.com',
      capture_pageview: false,
    });
  }
}

export default posthog;
