import { useAuthStore } from '../stores/authStore';

export const usePermissions = () => {
  const { user } = useAuthStore();

  const canCreateUsers = user?.role === 'manager' || user?.role === 'owner';
  const canEditUsers = user?.role === 'manager' || user?.role === 'owner';
  const canDeleteUsers = user?.role === 'manager' || user?.role === 'owner';
  const canManageTasks = user?.role === 'manager' || user?.role === 'owner';
  const canManageSettings = user?.role === 'manager' || user?.role === 'owner';

  // Dealership-specific permissions
  const canManageDealershipSettings = user?.role === 'owner' ||
    (user?.role === 'manager' && user?.dealership_id);

  const canManageGlobalSettings = user?.role === 'owner';

  // Check if user can manage settings for specific dealership
  const canManageDealershipSettingsFor = (dealershipId: number) => {
    if (user?.role === 'owner') return true;
    if (user?.role === 'manager' && user?.dealership_id === dealershipId) return true;
    return false;
  };

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
    canManageDealershipSettings,
    canManageGlobalSettings,
    canManageDealershipSettingsFor,
    isOwner,
    isManager,
    isObserver,
    isEmployee,
    role: user?.role,
    dealershipId: user?.dealership_id,
  };
};
