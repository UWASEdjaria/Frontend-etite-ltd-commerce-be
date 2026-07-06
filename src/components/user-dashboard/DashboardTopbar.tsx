'use client';

import { useAuth } from '@/hooks/useAuth';
import { DashboardTopbarProps } from '@/types/dashboard';
import Link from 'next/link';
import { FiLogOut } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import Logo from '../ui/Logo';
import CartIcon from '../CartIcon';


export default function DashboardTopbar({
  onMenuClick,
}: DashboardTopbarProps) {
  const { isLoggedIn, initials, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        {isLoggedIn && (
          <button
            className="md:hidden text-slate-500 hover:text-slate-800"
            onClick={onMenuClick}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <Logo />
      
      </div>

      <div className="flex items-center gap-5">
          <Link href="/" className="hidden sm:block text-sm font-semibold text-slate-600 hover:text-orange-600">
          Home
        </Link>
        <CartIcon /> 

        {mounted && isLoggedIn ? (
          <>
            <Link href="/user-dashboard/profile" className="w-9 h-9 rounded-full border-2 border-orange-500 text-orange-500 flex items-center justify-center font-bold">
              {initials}
            </Link>
            <button onClick={logout} className="flex items-center gap-2 text-sm text-slate-600 hover:text-red-600">
              <FiLogOut />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-orange-600">
              Sign In
            </Link>
            <Link href="/signup" className="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:bg-orange-800">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}