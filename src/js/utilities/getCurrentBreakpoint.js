export const getCurrentBreakpoint = () => {

  // SSR guard
  if (typeof window === 'undefined') {
    return {
      value: 'md',
      isDesktop: false,
      isMobile: true,
    };
  }

  const breakpoint = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue('--current-bp')
    .trim()
    .replace(/^["']|["']$/g, '');

  const isDesktop = ['lg', 'xl', 'xxl'].includes(breakpoint);
  const isMobile = ['sm', 'md'].includes(breakpoint);

  return {
    value: breakpoint,
    isDesktop,
    isMobile,
  };
};