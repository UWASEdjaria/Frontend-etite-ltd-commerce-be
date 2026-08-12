export type StockStatus = 'NORMAL' | 'LOW' | 'OUT_OF_STOCK' | 'OVERSTOCK' | 'EXPIRED';

export interface IStockItem {
  id: string;
  productId: string;
  productName: string;
  productStock: number;
  quantity: number;
  price: number;
  expiryDate: string | null;
  batchCode: string | null;
  status: StockStatus;
  createdAt: string;
}

export interface IAddStockDto {
  productId: string;
  quantity: number;
  price: number;
  expiryDate?: string;
  batchCode?: string;
}

export interface IEditStockDto {
  quantity?: number;
  price?: number;
  stock?:number;
  expiryDate?: string;
  batchCode?: string;
}
