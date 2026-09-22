export interface CartItem {
  id: string | number;
  productId: number;
  name: string;
  slug?: string;
  price: number;
  image: string;
  size?: string;
  colorSize?: string;
  quantity: number;
  subtotal?: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
}

export interface AddToCartPayload {
  productId: number;
  quantity: number;
  size?: string;
}

export interface UpdateCartItemPayload {
  quantity: number;
}
