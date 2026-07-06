export type PaymentMethod = 'MOMO' | 'DELIVERY';

export interface CreateOrderRequest {
  shippingAddress: string;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  items?: {
    productId: string;
    quantity: number;
    price: number;
  }[];
}
export interface OrderItem {
  id: string;
  quantity: number;
  productId: string;
  price: number;
  product: {
    name: string;
    imageUrl?: string | null;
  };
}

export interface OrderResponse {
  id: string;
  userId: string;
  totalAmount: number;
  status: string;
  shippingAddress: string;
  paymentMethod: string;
  transactionId?: string | null;
  user: {
    name: string;
    email: string;
  };
  createdAt: string;
  orderItems: OrderItem[];
}

export interface PaginatedOrdersResponse {
  orders: OrderResponse[];
  totalPages: number;
  currentPage: number;
}
