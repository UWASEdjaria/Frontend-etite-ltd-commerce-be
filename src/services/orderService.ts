import axios from 'axios';
import { CreateOrderRequest,OrderResponse, PaginatedOrdersResponse } from '@/types/order';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token || token === 'undefined' || token === 'null') {
    return {}; // Return empty object instead of crashing the app
    }
  return { headers: { Authorization: `Bearer ${token}` } };
};
export const orderService = {
  createOrder: async (data: CreateOrderRequest): Promise<OrderResponse> => {
    const response = await axios.post(`${API_URL}/order`, data ,getAuthHeaders());
    return response.data;
  },
  createGuestOrder: async (data: CreateOrderRequest): Promise<OrderResponse> => {
    const response = await axios.post(`${API_URL}/order/guest`, data);
    return response.data;
  },

  getMyOrders: async (page: number = 1): Promise<PaginatedOrdersResponse> => {
    const response = await axios.get(`${API_URL}/order/my-orders?page=${page}`,getAuthHeaders());
    return response.data;
  },
   getOrderById: async (orderId: string): Promise<OrderResponse> => {
    const response = await axios.get(`${API_URL}/order/${orderId}`);
    return response.data;
  },
  cancelOrder: async (orderId: string) => {
    const response = await axios.put(`${API_URL}/order/${orderId}/cancel`, {}, getAuthHeaders());
    return response.data;
  }
};