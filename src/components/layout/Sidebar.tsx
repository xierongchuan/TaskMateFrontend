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
      {/* Overlay for mobile - closes sidebar on tap */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className="
          fixed lg:static top-0 left-0 z-50 h-screen bg-white shadow-lg
          w-64 flex-shrink-0 flex flex-col
        "
      >
        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {filteredItems.map((item) => {
              const isActive = location.pathname === item.path ||
                (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              const Icon = item.icon;

              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                      ${isActive
                        ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-indigo-600' : 'text-gray-500'}`} />
                    <span>{item.label}</span>
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
