import { useAuthStore } from '../stores/authStore';

export const usePermissions = () => {
  const { user } = useAuthStore();

  const canCreateUsers = user?.role === 'manager' || user?.role === 'owner';
  const canEditUsers = user?.role === 'manager' || user?.role === 'owner';
  const canDeleteUsers = user?.role === 'manager' || user?.role === 'owner';
  const canManageTasks = user?.role === 'manager' || user?.role === 'owner';
  const canManageSettings = user?.role === 'manager' || user?.role === 'owner';
  const isOwner = user?.role === 'owner';
  const isManager = user?.role === 'manager';
  const isObserver = user?.role === 'observer';
  const isEmployee = user?.role === 'employee';

  return {
    canCreateUsers,
    canEditUsers,
    canDeleteUsers,
    canManageTasks,
    canManageSettings,
    isOwner,
    isManager,
    isObserver,
    isEmployee,
    role: user?.role,
  };
};
