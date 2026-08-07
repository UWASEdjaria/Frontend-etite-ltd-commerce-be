'use client';

import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { authService } from '@/services/authService';
import { AuthError } from '@/types/auth';
import { resendOtpSchema, ResendOtpFormData } from '@/lib/validations/authValidation';
import AuthButton from '@/components/auth/AuthButton';

function ResendForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email') || '';
  const [formMessage, setFormMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { handleSubmit, formState: { isSubmitting } } = useForm<ResendOtpFormData>({
    resolver: zodResolver(resendOtpSchema),
    defaultValues: { email }
  });

  const onSubmit = async (data: ResendOtpFormData) => {
    setFormMessage(null);
    try {
      const res = await authService.resendOtp(data);
      setFormMessage({ type: 'success', text: res?.message || 'New verification code sent!' });
      setTimeout(() => router.push(`/verify?email=${data.email}`), 1500);
    } catch (error) {
      const err = error as AuthError;
      const message = err.response?.data?.message || 'Failed to resend.';
      setFormMessage({ type: 'error', text: message });
      if (message.toLowerCase().includes('already verified')) {
        setTimeout(() => router.push('/login'), 1500);
      }
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
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold leading-tight">
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
          <div className="flex items-center justify-center p-10 bg-white/[0.03] backdrop-blur-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Resend code
                </h2>
                <p className="text-sm text-slate-300">
                  We&apos;ll send a new code to{' '}
                  <span className="font-semibold text-orange-400">{email}</span>
                </p>
              </div>

              {formMessage && (
                <p className={`mb-6 text-sm text-center rounded-lg px-3 py-2 ${
                  formMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                }`}>
                  {formMessage.text}
                </p>
              )}

              <div className="mt-2">
                <AuthButton text="SEND NEW CODE" isLoading={isSubmitting} />
              </div>

              <p className="mt-6 text-center text-sm text-white/80">
                <Link href={`/verify?email=${email}`} className="text-orange-400 font-bold hover:underline">
                  ← Back to verification
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResendPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center min-h-[400px] w-full">
          <div className="text-slate-400 text-sm animate-pulse">Loading resend view...</div>
        </div>
      }
    >
      <ResendForm />
    </Suspense>
  );
}