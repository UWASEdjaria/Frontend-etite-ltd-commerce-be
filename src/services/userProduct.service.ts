import { UserProduct } from '@/types/userProduct';
import axios from 'axios';


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://commerce-be-3-5gsc.onrender.com/';

export class UserProductService {
    async getAll(filters?: { name?: string; categoryId?: string;page?: number }): Promise<{ data: UserProduct[]; totalPages: number }> {
    const { data } = await axios.get(`${API_URL}/products`, { params: filters });
    return data;
  }

  async getById(id: string): Promise<UserProduct> {
    const { data } = await axios.get(`${API_URL}/products/${id}`);
    return data;
  }
  
}
export const userProductService = new UserProductService();

