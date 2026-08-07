import { AdminSummaryResponse, PaginatedCartsResponse } from '@/types/adminAnalytics';
import axios from 'axios';


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const adminAnalyticsService = {
  getSummary: async (): Promise<AdminSummaryResponse> => {
    const { data } = await axios.get(`${API_URL}/admin/analytics/summary`, {
      headers: getAuthHeaders()
    });
    return data;
  },

  getActiveCarts: async (page: number = 1, limit: number = 10): Promise<PaginatedCartsResponse> => {
    const { data } = await axios.get(`${API_URL}/admin/analytics/carts`, {
      params: { page, limit },
      headers: getAuthHeaders()
    });
    return data;
  }
};