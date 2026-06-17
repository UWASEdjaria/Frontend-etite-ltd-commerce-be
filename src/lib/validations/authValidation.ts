import { z } from 'zod';

// Login Validation
export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters"),
});

// Register Validation
export const registerSchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
export type RegisterFormData = z.infer<typeof registerSchema>;

// OTP / Verify Validation
export const otpSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  otp: z.string().min(1, "OTP is required").trim().length(6, "OTP must be exactly 6 digits").regex(/^\d{6}$/, "OTP must be 6 digits only"),
});
export type OtpFormData = z.infer<typeof otpSchema>;

// Resend OTP Validation
export const resendOtpSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});
export type ResendOtpFormData = z.infer<typeof resendOtpSchema>;

export const inviteSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  role: z.enum(["USER", "ADMIN"]),
});
export const setPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type SetPasswordData = z.infer<typeof setPasswordSchema>;