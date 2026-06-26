import axios, { AxiosInstance } from 'axios';
import { LoginCredentials, RegisterData, VerifyOtpPayload,  ResendOtpPayload, SetPasswordPayload, UserProfileResponse} from '@/types/auth';
import { InviteFormData, PaginatedUsersResponse, UserRow } from '@/types/admin';

class AuthService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    });

    this.api.interceptors.request.use(
      (config) => {
        // 1. Grab the saved token from the browser storage
        const token = localStorage.getItem('token');
        // 2. If it exists, inject it as a "Bearer <token>" header automatically
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
      }
      // --- AUTH ENTITY ENDPOINTS ---
  
  async login(credentials: LoginCredentials) {
    const { data } = await this.api.post('/auth/login', credentials);
    return data;
  }

  async register(userData: RegisterData) {
    const { data } = await this.api.post('/auth/signup', userData);
    return data;
  }
  async setPassword(payload: SetPasswordPayload) {
  const { data } = await this.api.post('/auth/set-password', payload);
  return data;
}

  async verifyOtp(payload: VerifyOtpPayload) {
    const { data } = await this.api.post('/auth/verify-otp', payload);
    return data;
  }

 async resendOtp(payload: ResendOtpPayload) {
    const { data } = await this.api.post('/auth/resend-otp', payload);
    return data;
  }

  // --- ADMINISTRATIVE SERVICES ---
  async getAllUsers(page: number = 1, limit: number = 10): Promise<PaginatedUsersResponse> {
  const { data } = await this.api.get<PaginatedUsersResponse>('/admin/users', {
    params: { page, limit }
  });
  return data;
}
async inviteUser(userData: InviteFormData): Promise<UserRow> {
  const { data } = await this.api.post<UserRow>('/admin/users', userData, {
  });
  return data;
}
async updateUser(id: string, updateFields: Partial<UserRow>): Promise<UserRow> {
  const { data } = await this.api.put<UserRow>(`/admin/users/${id}`, updateFields);
  return data;
}

async deleteUser(id: string):Promise<{ message: string }> {
  const { data } = await this.api.delete<{ message: string }>(`/admin/users/${id}`, {
  });
  return data;
}

async getProfile(): Promise<UserProfileResponse> {
    const { data } = await this.api.post<UserProfileResponse>('/profile/me'); 
    return data;
  }
  async updateProfile(updatedFields: { name: string; email: string }): Promise<UserProfileResponse> {
  const { data } = await this.api.patch<UserProfileResponse>('/profile/update', updatedFields); 
  return data;
}
}

export const authService = new AuthService();