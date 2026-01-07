import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useMyCurrentShift } from '../../hooks/useShifts';
import { Sidebar } from './Sidebar';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ClockIcon, Bars3Icon } from '@heroicons/react/24/outline';

export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default open on desktop
  const { data: currentShiftData } = useMyCurrentShift();
  const currentShift = currentShiftData?.data;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 lg:px-6">
          {/* Menu toggle button - visible on all screen sizes */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              title={sidebarOpen ? 'Скрыть меню' : 'Показать меню'}
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link to="/" className="text-lg font-bold text-indigo-600">
              TaskMate
            </Link>
          </div>

          {/* Right side: shift info + user */}
          <div className="flex items-center space-x-4">
            {currentShift && (
              <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                <ClockIcon className="w-4 h-4 text-green-600" />
                <div className="text-xs text-green-800">
                  <div className="font-medium">Смена открыта</div>
                  <div className="text-green-600">
                    с {format(new Date(currentShift.shift_start), 'HH:mm', { locale: ru })}
                  </div>
                </div>
              </div>
            )}

            <div className="hidden sm:flex items-center space-x-3">
              <span className="text-sm text-gray-700 truncate max-w-[150px]">
                {user?.full_name}
              </span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {user?.role}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Выйти
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
