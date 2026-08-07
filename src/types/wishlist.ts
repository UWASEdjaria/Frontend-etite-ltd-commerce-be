export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string | null;
  condition: 'NEW' | 'REFURBISHED' | 'HEAVY_DUTY';
}
export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  createdAt: string;
}

export interface WishlistResponse {
  userWishlist: WishlistItem[];
  totalPages: number;
  currentPage: number;
}