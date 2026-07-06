
export interface LowStockItem {
  name: string;
  stock: number;
}

export interface AdminSummaryResponse {
  totalOrders: number;
  lowStockCount: number;
  activeCartCount: number;
  totalRevenue: number;
  lowStockItems: LowStockItem[];
}

export interface UserCartDTO {
  id: string;
  userEmail: string;
  itemsCount: number;
  totalValue: number;
}

export interface CartItemProduct {
  name: string;
  price: number;
  imageUrl: string;
}

export interface CartItemWithDetails {
  id: string;
  user: { email: string };
  product: CartItemProduct;
  createdAt:string;
}

export interface PaginatedCartsResponse {
  carts: CartItemWithDetails[];
  totalPages: number;
  currentPage: number;
}
