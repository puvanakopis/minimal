import { apiClient } from './client';
import { ApiResponse, Product } from '@/interfaces';

export interface FavoriteToggleResponse {
  productId: number;
  favorited: boolean;
}

export const favoriteService = {
  getFavorites: (): Promise<ApiResponse<Product[]>> => {
    return apiClient.get<Product[]>('/api/favorites');
  },

  getFavoriteIds: (): Promise<ApiResponse<number[]>> => {
    return apiClient.get<number[]>('/api/favorites/ids');
  },

  addFavorite: (productId: number | string): Promise<ApiResponse<Product>> => {
    return apiClient.post<Product>(`/api/favorites/${productId}`);
  },

  removeFavorite: (productId: number | string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/api/favorites/${productId}`);
  },

  toggleFavorite: (productId: number | string): Promise<ApiResponse<FavoriteToggleResponse>> => {
    return apiClient.post<FavoriteToggleResponse>(`/api/favorites/${productId}/toggle`);
  },

  checkFavorite: (productId: number | string): Promise<ApiResponse<FavoriteToggleResponse>> => {
    return apiClient.get<FavoriteToggleResponse>(`/api/favorites/check/${productId}`);
  },
};
