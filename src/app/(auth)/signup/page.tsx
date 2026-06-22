'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import { authService } from '@/services/authService';
import { AuthError } from '@/types/auth';
import { registerSchema, RegisterFormData } from '@/lib/validations/authValidation';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formMessage, setFormMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setFormMessage(null);
    try {
      const { confirmPassword, ...registerData } = data;
      void confirmPassword;
      await authService.register(registerData);
      setFormMessage({ type: 'success', text: 'Account created! Redirecting...' });
      setTimeout(() => router.push('/login?email=' + data.email), 1500);
    } catch (error) {
      const err = error as AuthError;
      setFormMessage({ type: 'error', text: err.response?.data?.message || 'Registration failed.' });
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center px-4 py-6">
      <div className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=870&auto=format&fit=crop')" }}>
        <div className="absolute inset-0 bg-black/65" />
      </div>
      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-3">
          <h1 className="text-2xl font-extrabold text-white">Create account</h1>
          <p className="mt-0.5 text-sm text-slate-300">Join ConstructPro today</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <div className="space-y-0">
            <AuthInput label="Full Name" type="text" placeholder="John Doe" {...register('name')} />
            {errors.name && <p className="text-red-500 text-xs -mt-3 mb-1">{errors.name.message}</p>}

            <AuthInput label="Email" type="email" placeholder="you@example.com" {...register('email')} />
            {errors.email && <p className="text-red-500 text-xs -mt-3 mb-1">{errors.email.message}</p>}

            <AuthInput label="Password" type="password" placeholder="••••••••" {...register('password')}
              showPassword={showPassword} onToggle={() => setShowPassword(!showPassword)} />
            {errors.password && <p className="text-red-500 text-xs -mt-3 mb-1">{errors.password.message}</p>}

            <AuthInput label="Confirm Password" type="password" placeholder="••••••••" {...register('confirmPassword')}
              showPassword={showConfirmPassword} onToggle={() => setShowConfirmPassword(!showConfirmPassword)} />
            {errors.confirmPassword && <p className="text-red-500 text-xs -mt-3 mb-1">{errors.confirmPassword.message}</p>}
          </div>

          {formMessage && (
            <p className={`mt-3 text-sm text-center rounded-lg px-3 py-2 ${
              formMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
            }`}>{formMessage.text}</p>
          )}

          <div className="mt-4">
            <AuthButton text="CREATE ACCOUNT" isLoading={isSubmitting} />
          </div>

          <p className="mt-3 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="text-orange-700 font-bold hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
