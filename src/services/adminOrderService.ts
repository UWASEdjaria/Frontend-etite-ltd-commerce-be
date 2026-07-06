import axios from 'axios';
import { OrderResponse, PaginatedOrdersResponse } from '../types/order';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const adminOrderService = {
  // Fetch all orders with pagination
  getAll: async (page: number = 1): Promise<PaginatedOrdersResponse> => {
    const response = await axios.get(`${API_URL}/order/admin/all`, {
      params: { page },
      headers: getAuthHeaders(),
    });
    return response.data;
  },


  // Update order status (e.g., "SHIPPED", "DELIVERED")
  updateStatus: async (id: string, status: string) => {
    const response = await axios.put(
      `${API_URL}/order/admin/${id}/status`,
      { status },
      { headers: getAuthHeaders() }
    );
    return response.data;
  }
};