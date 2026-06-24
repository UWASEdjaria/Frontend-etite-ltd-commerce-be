export interface UserProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  images?: string[] | { url: string }[];
  condition: 'NEW' | 'REFURBISHED' | 'HEAVY_DUTY';
  categoryId: string;
}