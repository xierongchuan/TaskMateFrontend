
import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useMyCurrentShift } from '../../hooks/useShifts';
import { useWorkspace } from '../../hooks/useWorkspace';
import { Sidebar } from './Sidebar';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import { formatTime } from '../../utils/dateTime';
import { ClockIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { APP_NAME } from '../../constants/app';

export const Layout: React.FC = () => {
  const { user } = useAuth();
  const { dealershipId } = useWorkspace();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });
  const { data: currentShiftData } = useMyCurrentShift(dealershipId ?? undefined);
  const currentShift = currentShiftData?.data;

  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-900 flex overflow-hidden transition-colors duration-200 print:h-auto print:overflow-visible">
      {/* Sidebar */}
      <div className="print:hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 print:h-auto print:overflow-visible">
        {/* Top header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm h-16 flex items-center justify-between px-4 lg:px-6 z-10 transition-colors duration-200 print:hidden">
          {/* Menu toggle button - visible on all screen sizes */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
              title={sidebarOpen ? 'Скрыть меню' : 'Показать меню'}
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link to="/" className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
              {APP_NAME}
            </Link>

            {/* Разделитель */}
            <div className="hidden sm:block w-px h-6 bg-gray-300 dark:bg-gray-600" />

            {/* Переключатель автосалона */}
            <div className="hidden sm:block">
              <WorkspaceSwitcher />
            </div>
          </div>

          {/* Right side: shift info + user */}
          <div className="flex items-center space-x-4">
            {currentShift && (
              <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <ClockIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                <div className="text-xs text-green-800 dark:text-green-300">
                  <div className="font-medium">Смена открыта</div>
                  <div className="text-green-600 dark:text-green-400">
                    с {formatTime(currentShift.shift_start)}
                  </div>
                </div>
              </div>
            )}

            <Link to="/profile" className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded-lg transition-colors">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium shadow-sm">
                {user?.full_name?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:flex items-center gap-3">
                <span className="text-sm text-gray-700 dark:text-gray-200 truncate max-w-[150px]">
                  {user?.full_name}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {user?.role}
                </span>
              </div>
            </Link>

            {/* Logout button moved to Profile page */}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 transition-colors duration-200 print:h-auto print:overflow-visible">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
