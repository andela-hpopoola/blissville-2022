export const trackEvent = ({ action, category, label }) => {
  if (typeof window === 'undefined') return;

  window.gtag?.('event', action, {
    event_category: category,
    event_label: label,
  });
};
