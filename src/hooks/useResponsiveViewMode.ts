import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

type ViewMode = 'list' | 'cards' | 'grid';

/**
 * Hook for responsive view mode switching with cookie persistence.
 * Automatically switches to cards/grid mode on mobile/tablet devices.
 *
 * @param defaultMode - Default view mode for desktop
 * @param mobileMode - Mode to use on mobile (default: 'cards')
 * @param breakpoint - Breakpoint in pixels (default: 768 = md)
 * @param storageKey - Optional key to persist the view mode in cookies
 */
export function useResponsiveViewMode(
  defaultMode: ViewMode = 'list',
  mobileMode: ViewMode = 'cards',
  breakpoint: number = 768,
  storageKey?: string
) {
  // Initialize state from cookie if available, otherwise use default
  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    if (storageKey) {
      const savedMode = Cookies.get(storageKey) as ViewMode;
      if (savedMode && ['list', 'cards', 'grid'].includes(savedMode)) {
        return savedMode;
      }
    }
    return defaultMode;
  });

  const [isMobile, setIsMobile] = useState(false);

  // Wrapper for setViewMode to handle cookie persistence
  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    if (storageKey) {
      Cookies.set(storageKey, mode, { expires: 365 }); // Save for 1 year
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < breakpoint;
      setIsMobile(mobile);

      // Note: We don't auto-switch the state itself anymore to preserve
      // the user's desktop preference in the state/cookie.
      // Instead we rely on effectiveViewMode below.
    };

    // Check on mount
    checkMobile();

    // Listen for resize
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  // Force mobile mode when on mobile device, otherwise use the selected mode (from state/cookie)
  const effectiveViewMode = isMobile ? mobileMode : viewMode;

  return {
    viewMode: effectiveViewMode,
    setViewMode,
    isMobile,
  };
}
