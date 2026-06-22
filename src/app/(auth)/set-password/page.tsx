'use client';

import { useState, useEffect, Suspense, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import { authService } from '@/services/authService';
import { AuthError } from '@/types/auth';

function SetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [token] = useState<string | null>(() => searchParams.get('token'));
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid setup link. The secure invitation token is missing or has expired.');
    }
  }, [token]);

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Missing token validation. Cannot update password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your inputs.');
      return;
    }

    setLoading(true);

    try {
      await authService.setPassword({ 
        token, 
        password,
        confirmPassword 
      });
      setSuccess(true);
      
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: unknown) {
      const errorWithData = err as AuthError;
      const backendMessage = errorWithData.response?.data?.message;
      const structuralMessage = errorWithData.message;
      
      setError(backendMessage || structuralMessage || 'Failed to initialize password.');
    } finally {
      setLoading(false);
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white">Setup Password</h1>
          <p className="mt-1 text-sm text-slate-300">Configure your credentials to activate your account</p>
        </div>

        <form onSubmit={handlePasswordSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          {success ? (
            <div className="text-sm text-center bg-green-50 text-green-600 rounded-lg px-3 py-4 font-medium">
              ✓ Password updated successfully! Redirecting to login page...
            </div>
          ) : (
            <>
              <div className="space-y-1">
                {error && (
                  <p className="text-sm text-center bg-red-50 text-red-600 rounded-lg px-3 py-2 mb-4 break-words">
                    ⚠️ {error}
                  </p>
                )}

                <AuthInput 
                  label="New Password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  disabled={loading || !token}
                  onChange={(e) => setPassword(e.target.value)}
                  showPassword={showPassword}
                  onToggle={() => setShowPassword(!showPassword)}
                  required
                />

                <AuthInput 
                  label="Confirm New Password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  disabled={loading || !token}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  showPassword={showPassword}
                  onToggle={() => setShowPassword(!showPassword)}
                  required
                />
              </div>

              <div className="mt-6">
                <AuthButton text="SET PASSWORD & LOGIN" isLoading={loading} />
              </div>

              <p className="mt-5 text-center text-sm text-slate-500">
                Remember your account details?{' '}
                <Link href="/login" className="text-orange-700 font-bold hover:underline">
                  Sign in here
                </Link>
              </p>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center min-h-[400px] w-full">
          <div className="text-slate-400 text-sm animate-pulse">Loading credential view...</div>
        </div>
      }
    >
      <SetPasswordForm />
    </Suspense>
  );
}