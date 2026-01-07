import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usePermissions } from '../../hooks/usePermissions';
import { useMyCurrentShift } from '../../hooks/useShifts';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ClockIcon } from '@heroicons/react/24/outline';

export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const permissions = usePermissions();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: currentShiftData } = useMyCurrentShift();
  const currentShift = currentShiftData?.data;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-8">
          <div className="flex justify-between h-16 min-w-0">
            <div className="flex items-center min-w-0 flex-1">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/">
                  <h1 className="text-lg md:text-xl font-bold text-indigo-600">TaskMate</h1>
                </Link>
              </div>
              {/* Desktop Navigation */}
              <div className="hidden md:ml-2 md:flex md:items-center md:min-w-0 md:flex-1 md:space-x-1 lg:ml-6 lg:space-x-4 xl:space-x-6">
                <Link
                  to="/dashboard"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 md:px-2 pt-1 border-b-2 text-xs md:text-sm font-medium truncate max-w-[80px] md:max-w-[100px] lg:max-w-none"
                >
                  Dashboard
                </Link>
                <Link
                  to="/tasks"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 md:px-2 pt-1 border-b-2 text-xs md:text-sm font-medium truncate max-w-[80px] md:max-w-[100px] lg:max-w-none"
                >
                  Задачи
                </Link>
                {permissions.canManageTasks && (
                  <Link
                    to="/task-generators"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 md:px-2 pt-1 border-b-2 text-xs md:text-sm font-medium truncate max-w-[80px] md:max-w-[100px] lg:max-w-none"
                  >
                    Генераторы
                  </Link>
                )}
                {permissions.canManageTasks && (
                  <Link
                    to="/archived-tasks"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 md:px-2 pt-1 border-b-2 text-xs md:text-sm font-medium truncate max-w-[80px] md:max-w-[100px] lg:max-w-none"
                  >
                    Архив
                  </Link>
                )}
                <Link
                  to="/shifts"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 md:px-2 pt-1 border-b-2 text-xs md:text-sm font-medium truncate max-w-[80px] md:max-w-[100px] lg:max-w-none"
                >
                  Смены
                </Link>
                {(permissions.canCreateUsers || permissions.isObserver) && (
                  <Link
                    to="/employees"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 md:px-2 pt-1 border-b-2 text-xs md:text-sm font-medium truncate max-w-[80px] md:max-w-[100px] lg:max-w-none"
                  >
                    Сотрудники
                  </Link>
                )}
                <Link
                  to="/links"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 md:px-2 pt-1 border-b-2 text-xs md:text-sm font-medium truncate max-w-[80px] md:max-w-[100px] lg:max-w-none"
                >
                  Ссылки
                </Link>
                {permissions.canManageTasks && (
                  <Link
                    to="/dealerships"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 md:px-2 pt-1 border-b-2 text-xs md:text-sm font-medium truncate max-w-[80px] md:max-w-[100px] lg:max-w-none"
                  >
                    Автосалоны
                  </Link>
                )}
                {permissions.canManageTasks && (
                  <Link
                    to="/reports"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 md:px-2 pt-1 border-b-2 text-xs md:text-sm font-medium truncate max-w-[80px] md:max-w-[100px] lg:max-w-none"
                  >
                    Отчеты
                  </Link>
                )}
                {permissions.canManageTasks && (
                  <Link
                    to="/settings"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 md:px-2 pt-1 border-b-2 text-xs md:text-sm font-medium truncate max-w-[80px] md:max-w-[100px] lg:max-w-none"
                  >
                    Настройки
                  </Link>
                )}
              </div>
            </div>

            {/* Desktop User Info */}
            <div className="hidden md:flex md:items-center md:space-x-3">
              {currentShift && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                  <ClockIcon className="w-4 h-4 text-green-600" />
                  <div className="text-xs text-green-800">
                    <div className="font-medium">Смена открыта</div>
                    <div className="text-green-600">
                      с {format(new Date(currentShift.shift_start), 'HH:mm', { locale: ru })}
                    </div>
                  </div>
                </div>
              )}
              <span className="text-xs md:text-sm text-gray-700 truncate max-w-[100px] md:max-w-[140px] lg:max-w-[180px] xl:max-w-xs">
                {user?.full_name} ({user?.role})
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-2 md:px-3 lg:px-4 py-2 border border-transparent text-xs md:text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 whitespace-nowrap"
              >
                Выйти
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <span className="sr-only">Открыть меню</span>
                {/* Hamburger icon */}
                <svg
                  className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                {/* Close icon */}
                <svg
                  className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu panel */}
        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300"
            >
              Dashboard
            </Link>
            <Link
              to="/tasks"
              onClick={() => setMobileMenuOpen(false)}
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300"
            >
              Задачи
            </Link>
            {permissions.canManageTasks && (
              <Link
                to="/task-generators"
                onClick={() => setMobileMenuOpen(false)}
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300"
              >
                Генераторы
              </Link>
            )}
            {permissions.canManageTasks && (
              <Link
                to="/archived-tasks"
                onClick={() => setMobileMenuOpen(false)}
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300"
              >
                Архив
              </Link>
            )}
            <Link
              to="/shifts"
              onClick={() => setMobileMenuOpen(false)}
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300"
            >
              Смены
            </Link>
            {(permissions.canCreateUsers || permissions.isObserver) && (
              <Link
                to="/employees"
                onClick={() => setMobileMenuOpen(false)}
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300"
              >
                Сотрудники
              </Link>
            )}
            <Link
              to="/links"
              onClick={() => setMobileMenuOpen(false)}
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300"
            >
              Ссылки
            </Link>
            {permissions.canManageTasks && (
              <Link
                to="/dealerships"
                onClick={() => setMobileMenuOpen(false)}
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300"
              >
                Автосалоны
              </Link>
            )}
            {permissions.canManageTasks && (
              <Link
                to="/reports"
                onClick={() => setMobileMenuOpen(false)}
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300"
              >
                Отчеты
              </Link>
            )}
            {permissions.canManageTasks && (
              <Link
                to="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300"
              >
                Настройки
              </Link>
            )}

            {/* Mobile user info and logout */}
            <div className="border-t border-gray-200 pt-4 pb-3">
              {currentShift && (
                <div className="px-4 py-2">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                    <ClockIcon className="w-4 h-4 text-green-600" />
                    <div className="text-sm text-green-800">
                      <div className="font-medium">Смена открыта</div>
                      <div className="text-green-600">
                        с {format(new Date(currentShift.shift_start), 'HH:mm', { locale: ru })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="px-4 py-2">
                <div className="text-base font-medium text-gray-800 truncate">
                  {user?.full_name}
                </div>
                <div className="text-sm font-medium text-gray-500">
                  {user?.role}
                </div>
              </div>
              <div className="mt-3 px-4">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  Выйти
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};
