import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const adminProductService = {
  getAll: async (params?: { name?: string; categoryId?: string; page?: number }) => {
    const response = await axios.get(`${API_URL}/products`, { params });
    return response.data;
  },

  getCategories: async () => {
    const response = await axios.get(`${API_URL}/admin/categories`);
    return response.data.data;
  },

  create: async (formData: FormData) => {
    const response = await axios.post(`${API_URL}/products`, formData, {
      headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data',},
    });
    return response.data;
  },

  update: async (id: string, formData: FormData) => {
    const response = await axios.put(`${API_URL}/products/${id}`, formData, {
      headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data',},
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axios.delete(`${API_URL}/products/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  }
};