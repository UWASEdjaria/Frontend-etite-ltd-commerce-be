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
      setFormMessage({ type: 'success', text: 'Account created! Check your email for the verification code.' });
      setTimeout(() => router.push('/verify?email=' + data.email), 1500);
    } catch (error) {
      const err = error as AuthError;
      setFormMessage({ type: 'error', text: err.response?.data?.message || 'Registration failed.' });
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
        <div className="w-full max-w-6xl min-h-[650px] rounded-2xl overflow-hidden grid md:grid-cols-2 bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl">
             {/* LEFT SIDE */}
         {/* LEFT SIDE - Visible on all screens, stacked on mobile */}
         <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-12 text-white bg-black/20 border-b md:border-b-0 md:border-r border-white/10">
            <h1 className="text-2xl sm:text-3xl lg:text-5x font-extrabold leading-tight">
              It&apos;s time to boost<br />your productivity
            </h1>

            <p className="mt-5 text-slate-200 max-w-sm">
              Manage your account and continue shopping with us.
            </p>

            <Link href="/" className="mt-4 text-sm text-white/80 hover:text-white transition w-fit">
              ← Back to Home
            </Link>

            <Link href="/login" className="mt-8 w-fit px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition">
              Sign in →
            </Link>
          </div>
           {/* RIGHT SIDE */}
           <div className="flex items-center justify-center p-6 sm:p-10 bg-white/[0.03] backdrop-blur-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">
                Create account
              </h2>
          <div className="space-y-3">
            <AuthInput label="Full Name" type="text" placeholder="John Doe" glass {...register('name')} />
            {errors.name && <p className="text-red-500 text-xs -mt-3 mb-1">{errors.name.message}</p>}

            <AuthInput label="Email" type="email" placeholder="you@example.com" glass {...register('email')} />
            {errors.email && <p className="text-red-500 text-xs -mt-3 mb-1">{errors.email.message}</p>}

            <AuthInput label="Password" type="password" placeholder="••••••••" glass {...register('password')}
              showPassword={showPassword} onToggle={() => setShowPassword(!showPassword)} />
            {errors.password && <p className="text-red-500 text-xs -mt-3 mb-1">{errors.password.message}</p>}

            <AuthInput label="Confirm Password" type="password" placeholder="••••••••"  glass {...register('confirmPassword')}
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

          <p className="mt-6 text-center text-sm text-white/80">
                Already have an account?{' '}
                <Link href="/login" className="text-orange-400 font-bold hover:underline">
                  Sign in
                </Link>
          </p>
        </form>
      </div>
    </div>
  </div>
  </div>
);
}
