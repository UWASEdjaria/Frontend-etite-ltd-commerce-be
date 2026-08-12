'use client';

import { Toaster } from 'sonner';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const getPageTitle = () => {
 
  
  //if (pathname.includes('/orders')) return 'Order History';
  if (pathname.includes('/wishlist')) return 'Saved Items';
  if (pathname.includes('/cart')) return 'Shopping Cart';
  //if (pathname.includes('/profile')) return 'My Profile';
  if (pathname.includes('/settings')) return 'Account Settings';
  if (pathname.includes('/products')) return 'Product Catalog';
  return ''; // Default title
};
  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster position="top-right" />
        <main className="flex-1 overflow-y-auto px-4 sm:px-6">

           <div className="max-w-7xl mx-auto py-6"> 
            <h1 className="text-sm sm:text-xl font-bold text-slate-800 mb-6">
              {getPageTitle()}
            </h1>
            {children}
          </div>
        </main>
      </div>

  );
}