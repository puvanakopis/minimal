import { apiClient } from './client';
import {
  ApiResponse,
  Product,
  Review,
  CreateReviewPayload,
  CreateProductPayload,
  UpdateProductPayload,
  ProductQueryParams,
} from '@/interfaces';

export const productService = {
  // ==========================================
  // USER PORTAL FUNCTIONS
  // ==========================================

  /**
   * Fetch all products with optional filters (category, gender, search, sortBy)
   */
  getProducts: (params?: ProductQueryParams): Promise<ApiResponse<Product[]>> => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.gender) query.append('gender', params.gender);
    if (params?.search) query.append('search', params.search);
    if (params?.sortBy) query.append('sortBy', params.sortBy);

    const queryString = query.toString();
    const endpoint = queryString ? `/api/products?${queryString}` : '/api/products';
    return apiClient.get<Product[]>(endpoint);
  },

  /**
   * Get product details by ID
   */
  getProductById: (id: number | string): Promise<ApiResponse<Product>> => {
    return apiClient.get<Product>(`/api/products/${id}`);
  },

  /**
   * Get product details by slug
   */
  getProductBySlug: (slug: string): Promise<ApiResponse<Product>> => {
    return apiClient.get<Product>(`/api/products/slug/${slug}`);
  },

  /**
   * Get all reviews for a specific product
   */
  getProductReviews: (productId: number | string): Promise<ApiResponse<Review[]>> => {
    return apiClient.get<Review[]>(`/api/products/${productId}/reviews`);
  },

  /**
   * Submit a new review for a product
   */
  postReview: (
    productId: number | string,
    data: CreateReviewPayload
  ): Promise<ApiResponse<Review>> => {
    return apiClient.post<Review>(`/api/products/${productId}/reviews`, data);
  },

  // ==========================================
  // ADMIN PORTAL FUNCTIONS
  // ==========================================

  /**
   * Admin: Upload an image file (multipart/form-data)
   */
  uploadImage: (file: File): Promise<ApiResponse<{ imageUrl: string }>> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.upload<{ imageUrl: string }>('/api/admin/products/upload-image', formData);
  },

  /**
   * Admin: Get all products for catalogue management
   */
  adminGetProducts: (): Promise<ApiResponse<Product[]>> => {
    return apiClient.get<Product[]>('/api/admin/products');
  },

  /**
   * Admin: Get product details by ID
   */
  adminGetProductById: (id: number | string): Promise<ApiResponse<Product>> => {
    return apiClient.get<Product>(`/api/admin/products/${id}`);
  },

  /**
   * Admin: Create a new product
   */
  adminCreateProduct: (data: CreateProductPayload): Promise<ApiResponse<Product>> => {
    return apiClient.post<Product>('/api/admin/products', data);
  },

  /**
   * Admin: Update an existing product
   */
  adminUpdateProduct: (
    id: number | string,
    data: UpdateProductPayload
  ): Promise<ApiResponse<Product>> => {
    return apiClient.put<Product>(`/api/admin/products/${id}`, data);
  },

  /**
   * Admin: Delete a product by ID
   */
  adminDeleteProduct: (id: number | string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/api/admin/products/${id}`);
  },
};
