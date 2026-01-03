import { useAuthStore } from '../stores/authStore';

export const usePermissions = () => {
  const { user } = useAuthStore();

  // Permissions based on updated security requirements
  const canCreateUsers = user?.role === 'manager' || user?.role === 'owner';
  const canEditUsers = user?.role === 'manager' || user?.role === 'owner';
  const canDeleteUsers = user?.role === 'manager' || user?.role === 'owner';
  const canManageTasks = user?.role === 'manager' || user?.role === 'owner';

  // Settings are now restricted to Owner only
  const canManageSettings = user?.role === 'owner';
  const canManageDealerships = user?.role === 'owner';

  // Dealership-specific settings - Owner only
  const canManageDealershipSettings = user?.role === 'owner';
  const canManageGlobalSettings = user?.role === 'owner';

  // Check if user can manage settings for specific dealership
  const canManageDealershipSettingsFor = (_dealershipId: number) => {
    return user?.role === 'owner';
  };

  // Shift work via admin panel restricted to Owner only
  // Employees must use Telegram bot to open/close shifts
  const canWorkShifts = user?.role === 'owner';

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
    canManageDealerships,
    canManageDealershipSettings,
    canManageGlobalSettings,
    canManageDealershipSettingsFor,
    canWorkShifts,
    isOwner,
    isManager,
    isObserver,
    isEmployee,
    role: user?.role,
    dealershipId: user?.dealership_id,
  };
};
