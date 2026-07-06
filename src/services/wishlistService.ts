
import { WishlistResponse } from "@/types/wishlist";
import apiClient from '@/lib/apiClient';

export const wishlistService = {
  // Get paginated wishlist
  getWishlist: (page: number = 1): Promise<WishlistResponse> => 
    apiClient.get(`/wishlist?page=${page}`).then(res => res.data),

  // Add to wishlist
  addToWishlist: (productId: string) => 
    apiClient.post('/wishlist', { productId }).then(res => res.data),

  // Remove from wishlist
  removeItem: (productId: string) => 
    apiClient.delete(`/wishlist/${productId}`).then(res => res.data),
};