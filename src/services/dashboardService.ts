import apiClient from "@/lib/apiClient";

export const dashboardService = {
  getSummary: async () => {
    const response = await apiClient.get('/dashboard/summary');
    return response.data;
  },

  getRecentOrders: async (page: number = 1) => {
    const response = await apiClient.get(`/dashboard/recent-orders?page=${page}`);
    return response.data;
  }
};