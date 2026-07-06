export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  stock: number;
  minThreshold: number;
  maxThreshold: number;
  imageUrl?: string;
  condition: 'NEW' | 'REFURBISHED' | 'HEAVY_DUTY';
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface CreateProductDTO {
  name: string;
  description: string;
  stock: number;
  minThreshold: number;
  maxThreshold: number;
  categoryId: string;
  condition?: 'NEW' | 'REFURBISHED' | 'HEAVY_DUTY';
}
export interface Category {
  id: string;
  name: string;
}

export interface FormInputs {
  name: string;
  description: string;
  minThreshold?: number;
  maxThreshold?: number;
  categoryId: string;
  condition?: 'NEW' | 'REFURBISHED' | 'HEAVY_DUTY';
}

export interface ValidationError {
  message: string;
  errors?: Record<string, { message: string }>;
}