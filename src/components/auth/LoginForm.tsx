import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

/**
 * Форма входа в систему.
 */
export const LoginForm: React.FC = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const { login: loginAction, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await loginAction(login, password);
      navigate('/dashboard');
    } catch {
      // Ошибка уже обработана в store
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Логин */}
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <UserIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        </div>
        <label htmlFor="login" className="sr-only">
          Логин
        </label>
        <input
          id="login"
          name="login"
          type="text"
          required
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          placeholder="Логин"
          maxLength={64}
          disabled={isLoading}
          className="login-input w-full pl-11 pr-4 py-3 bg-white/50 dark:bg-gray-800/50
                     border border-gray-200 dark:border-gray-700 rounded-xl
                     text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200"
        />
      </div>

      {/* Пароль */}
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <LockClosedIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        </div>
        <label htmlFor="password" className="sr-only">
          Пароль
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          disabled={isLoading}
          className="login-input w-full pl-11 pr-4 py-3 bg-white/50 dark:bg-gray-800/50
                     border border-gray-200 dark:border-gray-700 rounded-xl
                     text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200"
        />
      </div>

      {/* Ошибка */}
      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 p-3 animate-slide-in-up">
          <p className="text-sm text-red-600 dark:text-red-400 text-center">
            {error}
          </p>
        </div>
      )}

      {/* Кнопка входа */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        isLoading={isLoading}
        className="login-button rounded-xl py-3"
      >
        {isLoading ? 'Выполняется вход...' : 'Войти'}
      </Button>
    </form>
  );
};
