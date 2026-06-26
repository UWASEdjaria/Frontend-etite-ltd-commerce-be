import axios from 'axios';
import { CreateOrderRequest, OrderResponse, PaginatedOrdersResponse } from '@/types/order';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); // Adjust key if you use a different one
  return { headers: { Authorization: `Bearer ${token}` } };
};
export const orderService = {
  createOrder: async (data: CreateOrderRequest) => {
    const response = await axios.post(`${API_URL}/order`, data ,getAuthHeaders());
    return response.data;
  },

  getMyOrders: async (page: number = 1): Promise<PaginatedOrdersResponse> => {
    const response = await axios.get(`${API_URL}/order/my-orders?page=${page}`,getAuthHeaders());
    return response.data;
  }
};