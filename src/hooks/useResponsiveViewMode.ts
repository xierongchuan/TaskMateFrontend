import { useState, useEffect } from 'react';

type ViewMode = 'list' | 'cards' | 'grid';

/**
 * Hook for responsive view mode switching.
 * Automatically switches to cards/grid mode on mobile/tablet devices.
 *
 * @param defaultMode - Default view mode for desktop
 * @param mobileMode - Mode to use on mobile (default: 'cards')
 * @param breakpoint - Breakpoint in pixels (default: 768 = md)
 */
export function useResponsiveViewMode(
  defaultMode: ViewMode = 'list',
  mobileMode: ViewMode = 'cards',
  breakpoint: number = 768
) {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultMode);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < breakpoint;
      setIsMobile(mobile);

      // Only auto-switch if user hasn't manually changed the mode
      if (mobile && viewMode === defaultMode) {
        setViewMode(mobileMode);
      }
    };

    // Check on mount
    checkMobile();

    // Listen for resize
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint, defaultMode, mobileMode, viewMode]);

  // Force mobile mode when on mobile device
  const effectiveViewMode = isMobile ? mobileMode : viewMode;

  return {
    viewMode: effectiveViewMode,
    setViewMode,
    isMobile,
  };
}
