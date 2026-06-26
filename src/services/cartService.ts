import axios from "axios";
import { AddToCartRequest } from "@/types/cart";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  withCredentials: true,
});

// Helper to get the token from localStorage
const getToken = () => localStorage.getItem("token");

export const cartService = {
  getCart: () => api.get('/cart', {
    headers: { Authorization: `Bearer ${getToken()}` }
  }).then(res => res.data),
  
  addToCart: (payload: AddToCartRequest) => api.post('/cart', payload, {
    headers: { Authorization: `Bearer ${getToken()}` }
  }).then(res => res.data),
  
  updateItem: (id: string, quantity: number) => api.put(`/cart/${id}`, { quantity }, {
    headers: { Authorization: `Bearer ${getToken()}` }
  }).then(res => res.data),
  
  removeItem: (id: string) => api.delete(`/cart/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  }).then(res => res.data),
};