export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface Color {
  id?: string | number;
  name: string;
  hex: string;
}

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
  colors?: Color[];
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
  colors?: Color[];
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
  colors?: Color[];
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

export interface OrderProduct {
  productId: number;
  name: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

export interface Order {
  id: string;
  userId?: string | number;
  customerName?: string;
  email?: string;
  guestEmail?: string;
  items?: OrderProduct[];
  products?: OrderProduct[];
  total?: number;
  totalAmount?: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | string;
  shippingAddress?: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
}
