'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  Product,
  Review,
  CreateReviewPayload,
  CreateProductPayload,
  UpdateProductPayload,
  ProductQueryParams,
  ApiResponse,
} from '@/interfaces';
import { productService } from '@/services';

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  getProducts: (params?: ProductQueryParams) => Promise<ApiResponse<Product[]>>;
  getProductById: (id: number | string) => Promise<ApiResponse<Product>>;
  getProductBySlug: (slug: string) => Promise<ApiResponse<Product>>;
  getProductReviews: (productId: number | string) => Promise<ApiResponse<Review[]>>;
  postReview: (productId: number | string, data: CreateReviewPayload) => Promise<ApiResponse<Review>>;
  uploadImage: (file: File) => Promise<ApiResponse<{ imageUrl: string }>>;
  adminGetProducts: () => Promise<ApiResponse<Product[]>>;
  adminGetProductById: (id: number | string) => Promise<ApiResponse<Product>>;
  adminCreateProduct: (data: CreateProductPayload) => Promise<ApiResponse<Product>>;
  adminUpdateProduct: (id: number | string, data: UpdateProductPayload) => Promise<ApiResponse<Product>>;
  adminDeleteProduct: (id: number | string) => Promise<ApiResponse<void>>;
  refreshProducts: (params?: ProductQueryParams) => Promise<void>;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getProducts = useCallback(async (params?: ProductQueryParams): Promise<ApiResponse<Product[]>> => {
    setIsLoading(true);
    try {
      const res = await productService.getProducts(params);
      if (res.success && res.data) {
        setProducts(res.data);
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshProducts = useCallback(async (params?: ProductQueryParams) => {
    await getProducts(params);
  }, [getProducts]);

  const getProductById = useCallback(async (id: number | string): Promise<ApiResponse<Product>> => {
    return productService.getProductById(id);
  }, []);

  const getProductBySlug = useCallback(async (slug: string): Promise<ApiResponse<Product>> => {
    return productService.getProductBySlug(slug);
  }, []);

  const getProductReviews = useCallback(async (productId: number | string): Promise<ApiResponse<Review[]>> => {
    return productService.getProductReviews(productId);
  }, []);

  const postReview = useCallback(async (productId: number | string, data: CreateReviewPayload): Promise<ApiResponse<Review>> => {
    return productService.postReview(productId, data);
  }, []);

  const uploadImage = useCallback(async (file: File): Promise<ApiResponse<{ imageUrl: string }>> => {
    return productService.uploadImage(file);
  }, []);

  const adminGetProducts = useCallback(async (): Promise<ApiResponse<Product[]>> => {
    setIsLoading(true);
    try {
      const res = await productService.adminGetProducts();
      if (res.success && res.data) {
        setProducts(res.data);
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const adminGetProductById = useCallback(async (id: number | string): Promise<ApiResponse<Product>> => {
    return productService.adminGetProductById(id);
  }, []);

  const adminCreateProduct = useCallback(async (data: CreateProductPayload): Promise<ApiResponse<Product>> => {
    const res = await productService.adminCreateProduct(data);
    if (res.success && res.data) {
      setProducts((prev) => [res.data as Product, ...prev]);
    }
    return res;
  }, []);

  const adminUpdateProduct = useCallback(async (id: number | string, data: UpdateProductPayload): Promise<ApiResponse<Product>> => {
    const res = await productService.adminUpdateProduct(id, data);
    if (res.success && res.data) {
      setProducts((prev) => prev.map((p) => (p.id === Number(id) ? (res.data as Product) : p)));
    }
    return res;
  }, []);

  const adminDeleteProduct = useCallback(async (id: number | string): Promise<ApiResponse<void>> => {
    const res = await productService.adminDeleteProduct(id);
    if (res.success) {
      setProducts((prev) => prev.filter((p) => p.id !== Number(id)));
    }
    return res;
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        isLoading,
        getProducts,
        getProductById,
        getProductBySlug,
        getProductReviews,
        postReview,
        uploadImage,
        adminGetProducts,
        adminGetProductById,
        adminCreateProduct,
        adminUpdateProduct,
        adminDeleteProduct,
        refreshProducts,
        setProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}

export const useProduct = useProducts;
