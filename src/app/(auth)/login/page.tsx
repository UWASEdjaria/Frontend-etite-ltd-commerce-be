'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import { authService } from '@/services/authService';
import { AuthError, LoginCredentials } from '@/types/auth';
import { loginSchema } from '@/lib/validations/authValidation';
import { zodResolver } from '@hookform/resolvers/zod';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginCredentials) => {
    setFormMessage(null);
    try {
      const response = await authService.login(data);
      if (response.requiresOtp || response.message?.toLowerCase().includes('otp sent')) {
      router.push(`/verify?email=${encodeURIComponent(data.email)}`);
      return;
    }
      if (response.token) {
        localStorage.setItem('token', response.token);
       router.push(response.role === 'ADMIN' || response.message?.includes('Admin') ? '/admin/users' : '/dashboard');
        return;
      }
    
    } catch (error) {
      const err = error as AuthError;
      setFormMessage(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=870&auto=format&fit=crop')" }}>
        <div className="absolute inset-0 bg-black/65" />
      </div>
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-300">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="space-y-1">
            <AuthInput label="Email" type="email" placeholder="you@example.com" {...register('email')} />
            {errors.email && <p className="text-red-500 text-xs pb-2">{errors.email.message}</p>}
            <AuthInput label="Password" type="password" placeholder="••••••••" {...register('password')}
              showPassword={showPassword} onToggle={() => setShowPassword(!showPassword)} />
            {errors.password && <p className="text-red-500 text-xs pb-2">{errors.password.message}</p>}
          </div>

          {formMessage && (
            <p className="mt-4 text-sm text-center bg-red-50 text-red-600 rounded-lg px-3 py-2">{formMessage}</p>
          )}

          <div className="mt-6">
            <AuthButton text="SIGN IN" isLoading={isSubmitting} />
          </div>

          <p className="mt-5 text-center text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-orange-700 font-bold hover:underline">Register here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
