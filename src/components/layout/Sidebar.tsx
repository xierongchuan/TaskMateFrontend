import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import { APP_NAME } from '../../constants/app';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  ClipboardDocumentCheckIcon,
  CogIcon,
  ArchiveBoxIcon,
  ClockIcon,
  UsersIcon,
  LinkIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  DocumentMagnifyingGlassIcon,
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
    { path: '/my-history', label: 'Моя история', icon: ClockIcon },
    { path: '/task-generators', label: 'Генераторы', icon: CogIcon, permission: permissions.canManageTasks },
    { path: '/archived-tasks', label: 'Архив', icon: ArchiveBoxIcon, permission: permissions.canManageTasks },
    { path: '/pending-review', label: 'На проверке', icon: ClipboardDocumentCheckIcon, permission: permissions.canManageTasks },
    { path: '/shifts', label: 'Смены', icon: ClockIcon },
    { path: '/employees', label: 'Сотрудники', icon: UsersIcon, permission: permissions.canCreateUsers || permissions.isObserver },
    { path: '/links', label: 'Ссылки', icon: LinkIcon },
    { path: '/dealerships', label: 'Автосалоны', icon: BuildingOfficeIcon, permission: permissions.canManageTasks },
    { path: '/reports', label: 'Отчёты', icon: ChartBarIcon, permission: permissions.canManageTasks },
    { path: '/settings', label: 'Настройки', icon: Cog6ToothIcon, permission: permissions.canManageTasks },
    { path: '/audit-logs', label: 'Аудит', icon: DocumentMagnifyingGlassIcon, permission: permissions.isOwner },
  ];

  const filteredItems = navItems.filter(item => item.permission === undefined || item.permission);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Overlay for mobile - closes sidebar on tap */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className="
          fixed lg:static top-0 left-0 z-50 h-screen
          w-64 flex-shrink-0 flex flex-col
          bg-white dark:bg-gray-900
          lg:bg-gray-50/80 lg:dark:bg-gray-900/95 lg:backdrop-blur-sm
          border-r border-gray-200 dark:border-gray-800
          transition-colors duration-200
        "
      >
        {/* Mobile Header / Logo area */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-gray-800 lg:hidden shrink-0">
          <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{APP_NAME}</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
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
                      w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all
                      ${isActive
                        ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
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
