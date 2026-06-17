/* eslint-disable react/no-unescaped-entities */
'use client';
import { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
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
        router.push('/user-dashboard');
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
    <div className="relative z-10 w-full max-w-md">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10">
        <div className="mb-8 text-center">
          <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📧</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Check your email</h1>
          <p className="mt-2 text-sm text-gray-500">
            We sent a 6-digit code to<br />
            <span className="font-semibold text-orange-600">{email}</span>
          </p>
        </div>

        <AuthInput label="Verification Code" type="text" placeholder="Enter 6-digit code" {...register('otp')} />
        {errors.otp && <p className="text-red-500 text-xs mt-1 mb-2">{errors.otp.message}</p>}

        <div className="mt-4">
          <AuthButton text="VERIFY CODE" isLoading={isSubmitting} />
        </div>

        <p className="mt-5 text-center text-sm text-gray-500">
          Didn't receive a code?{' '}
          <a href={`/verify/resend?email=${email}`} className="text-orange-600 font-bold hover:underline">Resend</a>
        </p>
      </form>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="relative w-full h-full flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=870&auto=format&fit=crop')" }}>
        <div className="absolute inset-0 bg-black/65" />
      </div>
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <VerifyForm />
      </Suspense>
    </div>
  );
}
