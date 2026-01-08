import React from 'react';
import type { Ripple as RippleType } from '../../hooks/useRipple';

interface RippleContainerProps {
  ripples: RippleType[];
  color?: string;
}

export const RippleContainer: React.FC<RippleContainerProps> = ({
  ripples,
  color = 'currentColor'
}) => {
  return (
    <span className="absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none">
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full animate-md3-ripple pointer-events-none"
          style={{
            left: ripple.style.left,
            top: ripple.style.top,
            width: ripple.style.width,
            height: ripple.style.height,
            backgroundColor: color,
            opacity: 0.12,
          }}
        />
      ))}
    </span>
  );
};
