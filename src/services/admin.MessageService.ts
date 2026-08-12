import { PaginatedMessagesResponse } from '@/types/message';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://commerce-be-3-5gsc.onrender.com';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};
export const messageService = {
  async getAllMessages(page: number = 1, limit: number = 10): Promise<PaginatedMessagesResponse> {
    const response = await axios.get(`${API_URL}/admin/messages?page=${page}&limit=${limit}`, getAuthHeaders());
    return response.data;
  },

  async deleteMessage(id: string): Promise<void> {
    await axios.delete(`${API_URL}/admin/messages/${id}`, getAuthHeaders());
  },
};