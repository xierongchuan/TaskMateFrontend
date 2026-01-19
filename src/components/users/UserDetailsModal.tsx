import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PhoneIcon,
  BuildingOfficeIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import { Modal, Button, Badge } from '../ui';
import { RoleBadge } from '../common';
import { usePermissions } from '../../hooks/usePermissions';
import { formatPhoneNumber } from '../../utils/phoneFormatter';
import type { User } from '../../types/user';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onEdit?: (user: User) => void;
}

// Описания ролей
const roleDescriptions: Record<string, string> = {
  employee: 'Сотрудник - может выполнять задачи и управлять своими сменами',
  observer: 'Наблюдатель - может только просматривать информацию',
  manager: 'Менеджер - управляет задачами и сотрудниками своего автосалона',
  owner: 'Владелец - полный доступ ко всем функциям системы',
};

// Функция для получения цвета аватара по роли
const getAvatarColor = (role: string): string => {
  switch (role) {
    case 'employee':
      return 'bg-blue-500';
    case 'manager':
      return 'bg-green-500';
    case 'observer':
      return 'bg-purple-500';
    case 'owner':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  isOpen,
  onClose,
  user,
  onEdit,
}) => {
  const navigate = useNavigate();
  const permissions = usePermissions();

  if (!user) return null;

  const handleViewTasks = () => {
    onClose();
    navigate(`/tasks?assigned_to=${user.id}`);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(user);
      onClose();
    }
  };

  const canEdit = permissions.canCreateUsers;
  const phone = user.phone || user.phone_number;
  const userDealerships = user.dealerships || (user.dealership ? [user.dealership] : []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user.full_name}
      size="lg"
    >
      <Modal.Body>
        <div className="space-y-6">
          {/* Avatar and Role Section */}
          <div className="flex flex-col items-center text-center space-y-3">
            {/* Large Avatar */}
            <div className={`w-20 h-20 rounded-full ${getAvatarColor(user.role)} flex items-center justify-center text-white text-3xl font-bold`}>
              {user.full_name.charAt(0).toUpperCase()}
            </div>

            {/* Role Badge */}
            <div>
              <RoleBadge role={user.role} showDescription />
            </div>

            {/* Login */}
            <div className="text-sm text-gray-500 dark:text-gray-400">
              @{user.login}
            </div>
          </div>

          {/* Info Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Contact Information Card */}
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
              <div className="flex items-center space-x-2 mb-2">
                <PhoneIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Телефон
                </h4>
              </div>
              <p className="text-gray-900 dark:text-white font-medium">
                {formatPhoneNumber(phone)}
              </p>
            </div>

            {/* Account Information Card */}
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
              <div className="flex items-center space-x-2 mb-2">
                <UserIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ID Пользователя
                </h4>
              </div>
              <p className="text-gray-900 dark:text-white font-medium">
                #{user.id}
              </p>
            </div>
          </div>

          {/* Dealership Information Card (Full Width) */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
            <div className="flex items-center space-x-2 mb-2">
              <BuildingOfficeIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {user.role === 'manager' && userDealerships.length > 1 ? 'Автосалоны' : 'Автосалон'}
              </h4>
            </div>
            <div>
              {userDealerships.length > 0 ? (
                user.role === 'manager' ? (
                  // For managers: show all dealerships as badges
                  <div className="flex flex-wrap gap-2">
                    {userDealerships.map((dealership) => (
                      <Badge key={dealership.id} variant="info">
                        {dealership.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  // For other roles: show single dealership
                  <p className="text-gray-900 dark:text-white font-medium">
                    {userDealerships[0].name}
                  </p>
                )
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">
                  Не привязан к автосалону
                </p>
              )}
            </div>
          </div>

          {/* Role Description Card (Full Width) */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-200">
              {roleDescriptions[user.role] || 'Роль пользователя'}
            </p>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        {user.role !== 'owner' && (
          <Button
            variant="primary"
            onClick={handleViewTasks}
            className="flex items-center"
          >
            <ClipboardDocumentListIcon className="w-4 h-4 mr-2" />
            Посмотреть задачи
          </Button>
        )}
        {canEdit && onEdit && user.role !== 'owner' && (
          <Button
            variant="secondary"
            onClick={handleEdit}
            className="flex items-center"
          >
            <PencilSquareIcon className="w-4 h-4 mr-2" />
            Редактировать
          </Button>
        )}
        <Button variant="secondary" onClick={onClose}>
          Закрыть
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
