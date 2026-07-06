import { CartItem } from '@/types/cart';

export const getGuestCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const cart = localStorage.getItem('guest_cart');
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
};

export const saveGuestCart = (cart: CartItem[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('guest_cart', JSON.stringify(cart));
};