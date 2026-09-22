export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface Product {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  price: number;
  category?: string;
  gender: 'men' | 'women' | 'unisex';
  mainImage?: string;
  image: string;
  images?: string[];
  sizes?: (Size | string)[];
  details?: string[];
  features?: string[];
  material?: string;
  careInstructions?: string[];
  rating?: number;
  reviewCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  id: number;
  productId: number;
  userId?: number;
  authorName: string;
  authorEmail?: string;
  rating: number;
  title?: string;
  comment: string;
  createdAt: string;
}

export interface CreateReviewPayload {
  authorName?: string;
  authorEmail?: string;
  rating: number;
  title?: string;
  comment: string;
}

export interface CreateProductPayload {
  name: string;
  slug?: string;
  description?: string;
  price: number;
  category?: string;
  gender?: 'men' | 'women' | 'unisex' | string;
  mainImage?: string;
  image: string;
  images?: string[];
  sizes?: (Size | string)[];
  details?: string[];
  features?: string[];
  material?: string;
  careInstructions?: string[];
}

export interface UpdateProductPayload {
  id?: number;
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  category?: string;
  gender?: 'men' | 'women' | 'unisex' | string;
  mainImage?: string;
  image?: string;
  images?: string[];
  sizes?: (Size | string)[];
  details?: string[];
  features?: string[];
  material?: string;
  careInstructions?: string[];
}

export interface ProductQueryParams {
  category?: string;
  gender?: string;
  search?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'newest' | string;
}
