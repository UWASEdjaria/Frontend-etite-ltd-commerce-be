export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartRequest {
  quantity: number;
}

export interface CartItem {
  id: string;
  userId?: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
    stock?: number;
  };
}
export interface GuestCartItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
}