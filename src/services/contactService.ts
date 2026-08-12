import { IContactRequest, IContactResponse } from '@/types/contact';
import axios from 'axios';


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://commerce-be-3-5gsc.onrender.com';

export class ContactService {
  async submitContactForm(data: IContactRequest): Promise<IContactResponse> {
    const { data: responseData } = await axios.post(`${API_URL}/contact`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return responseData;
  }
}

export const contactService = new ContactService();