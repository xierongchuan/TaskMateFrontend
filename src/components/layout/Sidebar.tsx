import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  CogIcon,
  ArchiveBoxIcon,
  ClockIcon,
  UsersIcon,
  LinkIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const permissions = usePermissions();
  const location = useLocation();

  const navItems: NavItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: HomeIcon },
    { path: '/tasks', label: 'Задачи', icon: ClipboardDocumentListIcon },
    { path: '/task-generators', label: 'Генераторы', icon: CogIcon, permission: permissions.canManageTasks },
    { path: '/archived-tasks', label: 'Архив', icon: ArchiveBoxIcon, permission: permissions.canManageTasks },
    { path: '/shifts', label: 'Смены', icon: ClockIcon },
    { path: '/employees', label: 'Сотрудники', icon: UsersIcon, permission: permissions.canCreateUsers || permissions.isObserver },
    { path: '/links', label: 'Ссылки', icon: LinkIcon },
    { path: '/dealerships', label: 'Автосалоны', icon: BuildingOfficeIcon, permission: permissions.canManageTasks },
    { path: '/reports', label: 'Отчёты', icon: ChartBarIcon, permission: permissions.canManageTasks },
    { path: '/settings', label: 'Настройки', icon: Cog6ToothIcon, permission: permissions.canManageTasks },
  ];

  const filteredItems = navItems.filter(item => item.permission === undefined || item.permission);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-on-surface/32 backdrop-blur-sm z-40 lg:hidden md3-animate-fade-in"
        onClick={onClose}
      />

      <aside
        className="
          fixed lg:static top-0 left-0 z-50 h-screen
          w-[280px] flex-shrink-0 flex flex-col
          bg-surface-container-low
          transition-transform duration-medium2 ease-emphasized
          lg:translate-x-0
        "
      >
        <div className="h-16 flex items-center px-7 shrink-0 lg:hidden">
          <span className="text-primary md3-title-large font-medium">TaskMate</span>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-0.5">
            {filteredItems.map((item) => {
              const isActive = location.pathname === item.path ||
                (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              const Icon = item.icon;

              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        onClose();
                      }
                    }}
                    className={`
                      w-full flex items-center h-14 px-4 rounded-full
                      font-medium
                      transition-all duration-short3 ease-standard
                      ${isActive
                        ? 'bg-secondary-container text-on-secondary-container'
                        : 'text-on-surface-variant hover:bg-on-surface/[0.08] active:bg-on-surface/[0.12]'
                      }
                    `}
                  >
                    <Icon className={`w-6 h-6 mr-3 ${isActive ? 'text-on-secondary-container' : 'text-on-surface-variant'}`} />
                    <span className="md3-label-large">{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};
