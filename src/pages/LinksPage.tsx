import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { linksApi } from '../api/links';
import { usePermissions } from '../hooks/usePermissions';
import type { Link, CreateLinkRequest } from '../types/link';
import {
  PlusIcon,
  LinkIcon,
  PencilIcon,
  TrashIcon,
  Squares2X2Icon,
  ListBulletIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  ArrowTopRightOnSquareIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  ChartBarIcon,
  UserGroupIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

export const LinksPage: React.FC = () => {
  const permissions = usePermissions();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<Link | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<CreateLinkRequest>({
    title: '',
    url: '',
    description: '',
    category: 'general',
  });

  const { data: linksData, isLoading, error } = useQuery({
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
    setFormData({ title: '', url: '', description: '', category: 'general' });
    setSelectedLink(null);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'crm': return <UserGroupIcon className="w-6 h-6" />;
      case 'documents': return <DocumentTextIcon className="w-6 h-6" />;
      case 'analytics': return <ChartBarIcon className="w-6 h-6" />;
      case 'tools': return <Squares2X2Icon className="w-6 h-6" />;
      default: return <GlobeAltIcon className="w-6 h-6" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'crm': return 'bg-blue-500';
      case 'documents': return 'bg-green-500';
      case 'analytics': return 'bg-purple-500';
      case 'tools': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'crm': return 'CRM';
      case 'documents': return 'Документы';
      case 'analytics': return 'Аналитика';
      case 'tools': return 'Инструменты';
      default: return 'Общее';
    }
  };

  const filteredLinks = linksData?.filter(link =>
    link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.url.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const groupedLinks = filteredLinks.reduce((acc, link) => {
    const category = link.category || 'general';
    if (!acc[category]) acc[category] = [];
    acc[category].push(link);
    return acc;
  }, {} as Record<string, Link[]>);

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
      category: (link as any).category || 'general',
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
    <div className="px-4 py-6 sm:px-0 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ссылки</h1>
            <p className="mt-2 text-sm text-gray-600">
              Важные ссылки для быстрого доступа к рабочим инструментам
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-white rounded-lg border border-gray-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-sm font-medium rounded-l-lg ${
                  viewMode === 'grid'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Squares2X2Icon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm font-medium rounded-r-lg ${
                  viewMode === 'list'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <ListBulletIcon className="w-4 h-4" />
              </button>
            </div>
            {permissions.canManageTasks && (
              <button
                onClick={handleCreate}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Добавить ссылку
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Поиск ссылок..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="animate-pulse space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <XCircleIcon className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-800">Ошибка загрузки ссылок</p>
          </div>
        </div>
      ) : filteredLinks.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <LinkIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'Ссылки не найдены' : 'Нет ссылок'}
          </h3>
          <p className="text-gray-500">
            {searchTerm ? 'Попробуйте изменить поисковый запрос' : 'Добавьте первые ссылки для быстрого доступа'}
          </p>
        </div>
      ) : (
        <>
          {/* Grid View with Categories */}
          {viewMode === 'grid' && (
            <div className="space-y-8">
              {Object.entries(groupedLinks).map(([category, categoryLinks]) => (
                <div key={category}>
                  <div className="flex items-center mb-4">
                    <div className={`${getCategoryColor(category)} rounded-lg p-2 mr-3 text-white`}>
                      {getCategoryIcon(category)}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {getCategoryLabel(category)}
                    </h2>
                    <span className="ml-3 text-sm text-gray-500">
                      {categoryLinks.length} ссылок
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {categoryLinks.map((link) => (
                      <div
                        key={link.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:border-blue-300 group"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center">
                            <div className={`${getCategoryColor((link as any).category || 'general')} rounded-lg p-2 mr-3 text-white`}>
                              {getCategoryIcon((link as any).category || 'general')}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {link.title}
                              </h3>
                              <p className="text-xs text-gray-500 truncate max-w-[150px]">
                                {new URL(link.url).hostname}
                              </p>
                            </div>
                          </div>
                          {permissions.canManageTasks && (
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEdit(link)}
                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                title="Редактировать"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(link)}
                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                title="Удалить"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                        {link.description && (
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {link.description}
                          </p>
                        )}
                        <button
                          onClick={() => openLink(link.url)}
                          className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                        >
                          <ArrowTopRightOnSquareIcon className="w-4 h-4 mr-2" />
                          Открыть
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-200">
                {filteredLinks.map((link) => (
                  <div key={link.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-1 min-w-0 pr-4">
                        <div className={`${getCategoryColor((link as any).category || 'general')} rounded-lg p-3 mr-4 text-white flex-shrink-0`}>
                          {getCategoryIcon((link as any).category || 'general')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {link.title}
                            </h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {getCategoryLabel((link as any).category || 'general')}
                            </span>
                          </div>
                          {link.description && (
                            <p className="text-sm text-gray-600 mb-2">{link.description}</p>
                          )}
                          <p className="text-sm text-gray-500">
                            {new URL(link.url).hostname}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => openLink(link.url)}
                          className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                        >
                          <EyeIcon className="w-4 h-4 mr-2" />
                          Открыть
                        </button>
                        {permissions.canManageTasks && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(link)}
                              className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                              title="Редактировать"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(link)}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                              title="Удалить"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
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
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
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
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Категория
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                      >
                        <option value="general">Общее</option>
                        <option value="crm">CRM</option>
                        <option value="documents">Документы</option>
                        <option value="analytics">Аналитика</option>
                        <option value="tools">Инструменты</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Описание
                      </label>
                      <textarea
                        rows={3}
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                        placeholder="Краткое описание ссылки..."
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
