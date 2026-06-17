'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { authService } from '@/services/authService';
import { AuthError } from '@/types/auth';
import { resendOtpSchema, ResendOtpFormData } from '@/lib/validations/authValidation';
import AuthButton from '@/components/auth/AuthButton';

export default function ResendForm() {
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
    <div className="relative w-full h-full flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=870&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-black/65" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10">
          <div className="mb-8 text-center">
            <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔄</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Resend code</h1>
            <p className="mt-2 text-sm text-gray-500">
              We&apos;ll send a new code to<br />
              <span className="font-semibold text-orange-600">{email}</span>
            </p>
          </div>

          {formMessage && (
            <p className={`mb-6 text-sm text-center rounded-lg px-3 py-2 ${
              formMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
            }`}>{formMessage.text}</p>
          )}

          <AuthButton text="SEND NEW CODE" isLoading={isSubmitting} />

          <p className="mt-5 text-center text-sm text-gray-500">
            <a href={`/verify?email=${email}`} className="text-orange-600 font-bold hover:underline">
              ← Back to verification
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
