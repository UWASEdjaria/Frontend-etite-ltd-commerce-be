'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Toaster } from 'sonner';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';
import AdminNotificationManager from '@/components/admin/AdminNotificationManager';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.replace('/login'); return; }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role !== 'ADMIN') router.replace('/login');
    } catch {
      router.replace('/login');
    }
  }, [router]);

  const getPageTitle = () => {
    //if (pathname.includes('/users')) return 'user Management'; 
    //if (pathname.includes('/products')) return 'Product Management';
    //if (pathname.includes('/orders')) return 'Order Management';
    if (pathname.includes('/analytics')) return 'Carts Management'
    //if (pathname.includes('stock')) return 'stock Management'
    if(pathname.includes('settings')) return 'setting dashboard'
    return '';
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Toaster position="top-right" />
      {/* Topbar always on top, full width, above everything */}
      <AdminTopbar onMenuClick={() => setSidebarOpen(prev => !prev)} title={getPageTitle()} />
      <div className="flex flex-1 min-h-0">
        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <AdminNotificationManager />
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-4">
          <div className="max-w-7xl mx-auto"> 
            <h1 className="text-sm sm:text-1xl font-bold text-slate-800 mb-6">
              {getPageTitle()}
            </h1>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
     
