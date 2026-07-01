'use client';

import { useRouter ,usePathname } from 'next/navigation';
import { FiLogOut } from 'react-icons/fi';
import { DashboardTopbarProps } from '@/types/dashboard';

export default function DashboardTopbar({ onMenuClick }: DashboardTopbarProps) {
  const router = useRouter();
  const pathname = usePathname();
 const getPageTitle = () => {
  if (pathname.includes('/orders')) return 'My Orders';
  if (pathname.includes('/wishlist')) return 'My Wishlist';
  if (pathname.includes('/cart')) return 'My Cart';
  if (pathname.includes('/profile')) return 'Profile Settings';
  if (pathname.includes('/settings')) return 'Account Settings';
  if (pathname.includes('/products')) return 'Products';
  return 'Dashboard'; // Default title
};

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.replace('/login');
  };

  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <button className="md:hidden text-slate-500 hover:text-slate-800" onClick={onMenuClick} aria-label="Open menu">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-base font-bold text-slate-800">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-3">
        <span className="px-3 py-1 bg-orange-50 text-orange-700 font-bold text-xs rounded-full border border-orange-200">
          My Account
        </span>
        <button
          onClick={handleLogout}
          title="Logout"
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-600 font-semibold transition"
        >
          <FiLogOut size={15} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
