import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { linksApi } from '../api/links';
import { usePermissions } from '../hooks/usePermissions';
import type { Link, CreateLinkRequest } from '../types/link';

export const LinksPage: React.FC = () => {
  const permissions = usePermissions();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<Link | null>(null);
  const [formData, setFormData] = useState<CreateLinkRequest>({
    title: '',
    url: '',
    description: '',
  });

  const { data: links, isLoading, error } = useQuery({
    queryKey: ['links'],
    queryFn: () => linksApi.getLinks(),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateLinkRequest) => linksApi.createLink(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      setIsModalOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateLinkRequest }) =>
      linksApi.updateLink(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      setIsModalOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => linksApi.deleteLink(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
    },
  });

  const resetForm = () => {
    setFormData({ title: '', url: '', description: '' });
    setSelectedLink(null);
  };

  const handleCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (link: Link) => {
    setSelectedLink(link);
    setFormData({
      title: link.title,
      url: link.url,
      description: link.description || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (link: Link) => {
    if (window.confirm(`Удалить ссылку "${link.title}"?`)) {
      deleteMutation.mutate(link.id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLink) {
      updateMutation.mutate({ id: selectedLink.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Ссылки</h1>
          <p className="mt-2 text-sm text-gray-700">
            Важные ссылки для быстрого доступа (CRM, таблицы и т.д.)
          </p>
        </div>
        {permissions.canManageTasks && (
          <div className="mt-4 sm:mt-0">
            <button
              type="button"
              onClick={handleCreate}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Добавить ссылку
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="bg-white shadow rounded-lg p-8">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Ошибка загрузки ссылок</p>
        </div>
      ) : links && links.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <p className="text-gray-500">Ссылки не найдены</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {links?.map((link) => (
            <div
              key={link.id}
              className="bg-white shadow rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-gray-900">{link.title}</h3>
                {permissions.canManageTasks && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(link)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Редактировать"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(link)}
                      className="text-gray-400 hover:text-red-600"
                      title="Удалить"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              {link.description && (
                <p className="text-sm text-gray-600 mb-3">{link.description}</p>
              )}
              <button
                onClick={() => openLink(link.url)}
                className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
              >
                Открыть ссылку
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setIsModalOpen(false)}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                    {selectedLink ? 'Редактировать ссылку' : 'Добавить ссылку'}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Название *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">URL *</label>
                      <input
                        type="url"
                        required
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        placeholder="https://example.com"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Описание
                      </label>
                      <textarea
                        rows={2}
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {selectedLink ? 'Сохранить' : 'Создать'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
