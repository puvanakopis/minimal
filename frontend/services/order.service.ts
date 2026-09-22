import { apiClient } from './client';
import { ApiResponse, Order, CreateOrderPayload } from '@/interfaces';

export const orderService = {
  createOrder: (payload: CreateOrderPayload): Promise<ApiResponse<Order>> => {
    return apiClient.post<Order>('/api/orders', payload);
  },

  getUserOrders: (): Promise<ApiResponse<Order[]>> => {
    return apiClient.get<Order[]>('/api/orders');
  },

  getOrderById: (id: number | string): Promise<ApiResponse<Order>> => {
    return apiClient.get<Order>(`/api/orders/${id}`);
  },

  trackOrder: (orderNumber: string): Promise<ApiResponse<Order>> => {
    return apiClient.get<Order>(`/api/orders/track/${encodeURIComponent(orderNumber)}`);
  },

  adminGetOrders: (): Promise<ApiResponse<Order[]>> => {
    return apiClient.get<Order[]>('/api/orders/admin');
  },

  adminUpdateOrderStatus: (
    id: number | string,
    payload: { orderStatus?: string; paymentStatus?: string }
  ): Promise<ApiResponse<Order>> => {
    return apiClient.put<Order>(`/api/orders/${id}/status`, payload);
  },

  adminDeleteOrder: (id: number | string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/api/orders/${id}`);
  },
};
