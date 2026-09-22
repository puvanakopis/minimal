import { apiClient } from './client';
import { ApiResponse, Cart, AddToCartPayload, UpdateCartItemPayload } from '@/interfaces';

export const cartService = {
  getCart: (): Promise<ApiResponse<Cart>> => {
    return apiClient.get<Cart>('/api/cart');
  },

  addToCart: (payload: AddToCartPayload): Promise<ApiResponse<Cart>> => {
    return apiClient.post<Cart>('/api/cart/add', payload);
  },

  updateCartItem: (itemId: number | string, payload: UpdateCartItemPayload): Promise<ApiResponse<Cart>> => {
    return apiClient.put<Cart>(`/api/cart/item/${itemId}`, payload);
  },

  removeCartItem: (itemId: number | string): Promise<ApiResponse<Cart>> => {
    return apiClient.delete<Cart>(`/api/cart/item/${itemId}`);
  },

  clearCart: (): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>('/api/cart/clear');
  },

  syncCart: (items: AddToCartPayload[]): Promise<ApiResponse<Cart>> => {
    return apiClient.post<Cart>('/api/cart/sync', items);
  },
};
