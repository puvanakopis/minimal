import { apiClient } from './client';
import { ApiResponse, User, UpdateProfilePayload } from '@/interfaces';

export const userService = {
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
};
