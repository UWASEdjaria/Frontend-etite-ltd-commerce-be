import { PaypackPaymentRequest, PaypackApiResponse } from '@/types/payment';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://commerce-be-3-5gsc.onrender.com';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

export const paymentService = {
  async processCheckout(data: PaypackPaymentRequest): Promise<PaypackApiResponse> {
    const response = await axios.post(`${API_URL}/payments/checkout`, data, { headers: getHeaders() });
    return response.data;
  },

  async retryPayment(orderId: string, phone: string): Promise<PaypackApiResponse> {
    const response = await axios.post(`${API_URL}/payments/retry/${orderId}`, { phone }, { headers: getHeaders() });
    return response.data;
  },
};
