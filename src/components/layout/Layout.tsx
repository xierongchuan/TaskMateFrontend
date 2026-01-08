import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useMyCurrentShift } from '../../hooks/useShifts';
import { Sidebar } from './Sidebar';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ClockIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { Button, IconButton } from '../ui';

export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { data: currentShiftData } = useMyCurrentShift();
  const currentShift = currentShiftData?.data;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden transition-colors duration-medium2">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-surface shadow-elevation-1 h-16 flex items-center justify-between px-4 lg:px-6 z-10 transition-colors duration-medium2">
          <div className="flex items-center gap-3">
            <IconButton
              icon={<Bars3Icon />}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              tooltip={sidebarOpen ? 'Скрыть меню' : 'Показать меню'}
            />

            <Link to="/" className="text-primary md3-title-large font-medium">
              TaskMate
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {currentShift && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-tertiary-container rounded-full">
                <ClockIcon className="w-4 h-4 text-on-tertiary-container" />
                <div className="text-xs text-on-tertiary-container">
                  <div className="font-medium">Смена открыта</div>
                  <div className="opacity-80">
                    с {format(new Date(currentShift.shift_start), 'HH:mm', { locale: ru })}
                  </div>
                </div>
              </div>
            )}

            <div className="hidden sm:flex items-center gap-3">
              <span className="text-on-surface md3-body-medium truncate max-w-[150px]">
                {user?.full_name}
              </span>
              <span className="text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full md3-label-medium">
                {user?.role}
              </span>
            </div>

            <Button
              variant="filled"
              size="sm"
              onClick={handleLogout}
            >
              Выйти
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-background transition-colors duration-medium2">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
