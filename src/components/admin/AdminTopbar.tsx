'use client';

import { AdminTopbarProps } from '@/types/admin';
import { useEffect, useState } from 'react';
import  Link  from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { FiLogOut } from 'react-icons/fi';
import Logo from '../ui/Logo';

 
export default function AdminTopbar({ onMenuClick}: AdminTopbarProps& { title: string }) {
   const {initials, logout} = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shrink-0 z-50 relative">
      <div className="flex items-center gap-3">
        <button className="md:hidden text-slate-500 hover:text-slate-800" onClick={onMenuClick} aria-label="Toggle menu">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
       <Logo/>
      </div>
         <div className="flex items-center gap-4">
         {mounted && (
              <Link
               href="/user-dashboard/profile" className="w-10 h-10 md:w-8 md:h-8 rounded-full border-2 border-orange-500 text-orange-500 flex items-center justify-center font-bold">
               {initials}
              </Link>
      
              )}
            <button
               onClick={logout}
               className="flex items-center text-sm gap-2 text-gray-600 hover:text-red-600">
             <FiLogOut/>
             Logout
            </button>
           </div>
    </header>
  );
}
