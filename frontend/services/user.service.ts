import { apiClient } from './client';
import { ApiResponse, User, UpdateProfilePayload, AdminUpdateUserPayload } from '@/interfaces';

export const userService = {
  // USER PORTAL
  getProfile: (): Promise<ApiResponse<User>> => {
    return apiClient.get<User>('/api/user/profile');
  },

  updateProfile: (data: UpdateProfilePayload): Promise<ApiResponse<User>> => {
    return apiClient.put<User>('/api/user/profile', data);
  },

  uploadAvatar: (file: File): Promise<ApiResponse<{ avatarUrl: string }>> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.upload<{ avatarUrl: string }>('/api/user/upload-avatar', formData);
  },

  // ADMIN PORTAL
  adminGetUsers: (): Promise<ApiResponse<User[]>> => {
    return apiClient.get<User[]>('/api/admin/users');
  },

  adminGetUserById: (id: number | string): Promise<ApiResponse<User>> => {
    return apiClient.get<User>(`/api/admin/users/${id}`);
  },

  adminUpdateUser: (id: number | string, data: AdminUpdateUserPayload): Promise<ApiResponse<User>> => {
    return apiClient.put<User>(`/api/admin/users/${id}`, data);
  },

  adminToggleBlockUser: (id: number | string, blocked?: boolean): Promise<ApiResponse<User>> => {
    return apiClient.put<User>(`/api/admin/users/${id}/block`, { blocked });
  },

  adminDeleteUser: (id: number | string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/api/admin/users/${id}`);
  },
};

