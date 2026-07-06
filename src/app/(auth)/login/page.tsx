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
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=870&auto=format&fit=crop')]">
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Main Wrapper */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        {/* Glass Container */}
        <div className="w-full max-w-6xl min-h-[650px] rounded-2xl overflow-hidden grid md:grid-cols-2 bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl">
          {/* LEFT SIDE */}
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-12 text-white bg-black/20 border-b md:border-b-0 md:border-r border-white/10">
            <h1 className="text-2xl md:text-3xl lg:text-5xl font-extrabold leading-tight">
              It&apos;s time to boost<br />your productivity
            </h1>

            <p className="mt-5 text-slate-200 max-w-sm">
              Manage your account and continue shopping with us.
            </p>

            <Link href="/" className="mt-4 text-sm text-white/80 hover:text-white transition w-fit">
              ← Back to Home
            </Link>

            <Link href="/signup" className="mt-8 w-fit px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition">
              Create account →
            </Link>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center justify-center p-6 sm:p-10 bg-white/[0.03] backdrop-blur-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">
                Sign in
              </h2>

              <div className="space-y-3">
                <AuthInput label="Email" type="email" placeholder="you@example.com"  glass {...register('email')} />
                {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}

                <AuthInput label="Password" type="password" placeholder="••••••••"   glass {...register('password')} showPassword={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
              </div>

              {formMessage && (
                <p className="mt-4 text-sm text-center bg-red-50 text-red-600 rounded-lg px-3 py-2">
                  {formMessage}
                </p>
              )}

              <div className="mt-7">
                <AuthButton text="SIGN IN" isLoading={isSubmitting} />
              </div>

              <p className="mt-6 text-center text-sm text-white/80">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="text-orange-400 font-bold hover:underline">
                  Register here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}