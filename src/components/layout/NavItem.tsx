import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useRipple } from '../../hooks/useRipple';
import { RippleContainer } from '../ui/Ripple';

interface NavItemProps {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onItemClick?: () => void;
}

export const NavItem: React.FC<NavItemProps> = ({
  path,
  label,
  icon: Icon,
  onItemClick,
}) => {
  const location = useLocation();
  const { ripples, addRipple } = useRipple();

  const isActive = location.pathname === path ||
    (path !== '/dashboard' && location.pathname.startsWith(path));

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    addRipple(event);
    onItemClick?.();
  };

  return (
    <NavLink
      to={path}
      onClick={handleClick}
      className={`
        w-full flex items-center h-14 px-4 rounded-full
        font-medium
        transition-all duration-short3 ease-standard
        relative overflow-hidden select-none
        ${isActive
          ? 'bg-secondary-container text-on-secondary-container'
          : 'text-on-surface-variant hover:bg-on-surface/[0.08] active:bg-on-surface/[0.12]'
        }
      `}
    >
      <RippleContainer ripples={ripples} />
      <Icon className={`w-6 h-6 mr-3 ${isActive ? 'text-on-secondary-container' : 'text-on-surface-variant'}`} />
      <span className="md3-label-large">{label}</span>
    </NavLink>
  );
};
