import { InputHTMLAttributes } from 'react';

export interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  showPassword?: boolean;
  onToggle?: () => void;
}
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name?: string;
  email: string;
  password: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface ResendOtpPayload {
  email: string;
}
export interface SetPasswordPayload {
  token: string;
  password?: string;
  confirmPassword?: string;
}

export interface AuthError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}
export interface UserProfileResponse {
  id: string;
  email: string;
  name: string;
  role?: string;
  isVerified?: boolean;
}
export interface BackendWrappedResponse {
  user?: UserProfileResponse;
  data?: UserProfileResponse;
}