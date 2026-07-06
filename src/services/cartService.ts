import { AddToCartRequest } from "@/types/cart";
import apiClient from '@/lib/apiClient';

export const cartService = {
  getCart: (page: number = 1) => apiClient.get(`/cart?page=${page}`).then(res => res.data),

  addToCart: (payload: AddToCartRequest) => apiClient.post('/cart', payload).then(res => res.data),

  updateItem: (id: string, quantity: number) => apiClient.put(`/cart/${id}`, { quantity }).then(res => res.data),

  removeItem: (id: string) => apiClient.delete(`/cart/${id}`).then(res => res.data),
  
  clearCart: () => apiClient.delete('/cart').then(res => res.data),
};