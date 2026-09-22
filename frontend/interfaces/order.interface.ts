export interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  district?: string;
  postalCode?: string;
  country?: string;
}

export interface OrderItem {
  id?: number | string;
  productId?: number;
  name: string;
  image?: string;
  size?: string;
  color?: string;
  price: number;
  quantity: number;
  subtotal?: number;
}

export interface Order {
  id: number | string;
  orderNumber?: string;
  customerEmail?: string;
  email?: string;
  guestEmail?: string;
  fullName?: string;
  customerName?: string;
  phoneNumber?: string;
  streetAddress?: string;
  city?: string;
  district?: string;
  postalCode?: string;
  country?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  orderStatus?: "Processing" | "Shipped" | "Delivered" | "Cancelled" | string;
  status?: string;
  subtotal?: number;
  shippingCost?: number;
  tax?: number;
  total?: number;
  totalAmount: number;
  items?: OrderItem[];
  products?: OrderItem[];
  shippingAddress?: any;
  createdAt?: string;
  date?: string;
}

export interface CreateOrderPayload {
  shippingDetails: ShippingDetails;
  paymentMethod?: string;
  paymentStatus?: string;
  items?: {
    productId: number;
    quantity: number;
    size?: string;
  }[];
}
