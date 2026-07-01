export interface CreateOrderRequest {
  shippingAddress: string;
}

export interface OrderResponse {
  id: string;
  userId: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  orderItems: Array<{
    quantity: number;
    price: number;
    product: {
      name: string 
      imageUrl?: string;
     };
  }>;
}

export interface PaginatedOrdersResponse {
  orders: OrderResponse[];
  totalPages: number;
  currentPage: number;
}
