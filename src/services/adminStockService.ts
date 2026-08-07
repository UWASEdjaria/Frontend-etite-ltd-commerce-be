import axios from 'axios';
import { IAddStockDto, IEditStockDto, IStockItem } from '@/types/adminStock';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const adminStockService = {
  async getAll(page: number = 1): Promise<{ data: IStockItem[]; totalPages: number }> {
    const res = await axios.get(`${API_URL}/admin/stock?page=${page}&_t=${Date.now()}`, { headers: getAuthHeaders() });
    return res.data;
  },

  async addStock(data: IAddStockDto): Promise<IStockItem> {
    const res = await axios.post(`${API_URL}/admin/stock`, data, { headers: getAuthHeaders() });
    return res.data;
  },

  async editStock(stockId: string, data: IEditStockDto): Promise<IStockItem> {
    const res = await axios.put(`${API_URL}/admin/stock/${stockId}`, data, { headers: getAuthHeaders() });
    return res.data;
  },
};
