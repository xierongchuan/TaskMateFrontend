import { useState, useCallback, useRef, useEffect } from 'react';

interface RippleStyle {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface Ripple {
  id: number;
  style: RippleStyle;
}

export const useRipple = () => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const containerRef = useRef<HTMLElement | null>(null);
  const rippleIdRef = useRef(0);

  const addRipple = useCallback((event: React.MouseEvent<HTMLElement>) => {
    const container = event.currentTarget;
    containerRef.current = container;
    const rect = container.getBoundingClientRect();

    // Calculate ripple size (should be large enough to cover the entire element)
    const size = Math.max(rect.width, rect.height) * 2;

    // Calculate click position relative to element
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple: Ripple = {
      id: rippleIdRef.current++,
      style: {
        left: x,
        top: y,
        width: size,
        height: size,
      },
    };

    setRipples((prev) => [...prev, newRipple]);
  }, []);

  const removeRipple = useCallback((id: number) => {
    setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
  }, []);

  // Cleanup ripples after animation
  useEffect(() => {
    if (ripples.length === 0) return;

    const latestRipple = ripples[ripples.length - 1];
    const timer = setTimeout(() => {
      removeRipple(latestRipple.id);
    }, 550); // Slightly longer than animation duration

    return () => clearTimeout(timer);
  }, [ripples, removeRipple]);

  return { ripples, addRipple };
};

export type { Ripple, RippleStyle };
