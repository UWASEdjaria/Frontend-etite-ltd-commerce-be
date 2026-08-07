/* eslint-disable react/no-unescaped-entities */
'use client';
import { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import { authService } from '@/services/authService';
import { AuthError } from '@/types/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { OtpFormData, otpSchema } from '@/lib/validations/authValidation';

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { email, otp: '' }
  });

  const onSubmit = async (data: OtpFormData) => {
    try {
      const res = await authService.verifyOtp({ email: data.email, otp: data.otp.trim() });
      const token = res?.token || res?.data?.token;

      if (token) {
        localStorage.setItem('token', token);

        const payload = JSON.parse(atob(token.split('.')[1]));
        const userRole = res?.role || res?.user?.role || payload?.role;

        if (userRole === 'ADMIN') {
          router.push('/admin/users');
        } else {
          router.push('/user-dashboard/products');
        }
      } else {
        setError('otp', { message: 'Verification succeeded but no access token was returned.' });
      }
    } catch (error) {
      console.error("Verification error:", error);
      setError('otp', { message: (error as AuthError).response?.data?.message || 'Invalid OTP.' });
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
          {/* LEFT SIDE - Visible on all screens, stacked on mobile */}
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
              <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Check your email
                </h2>
                <p className="text-sm text-slate-300">
                  We sent a 6-digit code to{' '}
                  <span className="font-semibold text-orange-400">{email}</span>
                </p>
              </div>

              <div className="space-y-3">
                <AuthInput label="Verification Code" type="text" placeholder="Enter 6-digit code"  glass {...register('otp')} />
                {errors.otp && <p className="text-red-400 text-xs">{errors.otp.message}</p>}
              </div>

              <div className="mt-7">
                <AuthButton text="VERIFY CODE" isLoading={isSubmitting} />
              </div>

              <p className="mt-6 text-center text-sm text-white/80">
                Didn't receive a code?{' '}
                <Link href={`/verify/resend?email=${email}`} className="text-orange-400 font-bold hover:underline">
                  Resend
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center min-h-[400px] w-full">
          <div className="text-slate-400 text-sm animate-pulse">Loading verification view...</div>
        </div>
      }
    >
      <VerifyForm />
    </Suspense>
  );
}