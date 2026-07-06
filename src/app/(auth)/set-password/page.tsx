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
            <h1 className="text-2xl sm:text-3xl lg:text-5x font-extrabold leading-tight">
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
            <form onSubmit={handlePasswordSubmit} className="w-full max-w-sm">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">
                Setup Password
              </h2>

              {success ? (
                <div className="text-sm text-center bg-green-50 text-green-600 rounded-lg px-3 py-4 font-medium">
                  ✓ Password updated successfully! Redirecting to login page...
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {error && (
                      <p className="text-sm text-center bg-red-50 text-red-600 rounded-lg px-3 py-2 mb-4 break-words">
                        ⚠️ {error}
                      </p>
                    )}

                    <AuthInput label="New Password" type="password" placeholder="••••••••"  glass value={password} disabled={loading || !token} onChange={(e) => setPassword(e.target.value)} showPassword={showPassword} onToggle={() => setShowPassword(!showPassword)} required />

                    <AuthInput label="Confirm New Password" type="password" placeholder="••••••••"  glass value={confirmPassword} disabled={loading || !token} onChange={(e) => setConfirmPassword(e.target.value)} showPassword={showPassword} onToggle={() => setShowPassword(!showPassword)} required />
                  </div>

                  <div className="mt-7">
                    <AuthButton text="SET PASSWORD & LOGIN" isLoading={loading} />
                  </div>

                  <p className="mt-6 text-center text-sm text-white/80">
                    Remember your account details?{' '}
                    <Link href="/login" className="text-orange-400 font-bold hover:underline">
                      Sign in here
                    </Link>
                  </p>
                </>
              )}
            </form>
          </div>
        </div>
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