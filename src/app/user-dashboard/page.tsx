'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiShoppingBag, FiPackage, FiHeart, FiClock } from 'react-icons/fi';

const stats = [
  { label: 'Total Orders', value: '0', icon: FiShoppingBag, color: 'bg-blue-50 text-blue-700' },
  { label: 'Active Orders', value: '0', icon: FiPackage, color: 'bg-emerald-50 text-emerald-700' },
  { label: 'Wishlist Items', value: '0', icon: FiHeart, color: 'bg-rose-50 text-rose-700' },
  { label: 'Pending Reviews', value: '0', icon: FiClock, color: 'bg-amber-50 text-amber-700' },
];

export default function DashboardPage() {
  const router = useRouter();

 const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      
      setIsAuthenticated(false);
      router.replace('/login');
    } else {
      setTimeout(() => {
      setIsAuthenticated(true);
      }, 0);
    }
  }, [router]);
    if (isAuthenticated === null || !isAuthenticated) {
    return null;
  }
  return (
       <>
          {/* Welcome */}
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <h2 className="text-xl font-extrabold text-slate-900">Welcome back 👋</h2>
            <p className="text-sm text-slate-500 mt-1">Here&apos;s an overview of your account activity.</p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className={`rounded-xl p-4 ${color} flex items-center gap-3`}>
                <Icon size={20} />
                <div>
                  <p className="text-2xl font-extrabold leading-none">{value}</p>
                  <p className="text-xs font-semibold mt-1 opacity-80">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent orders placeholder */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-700">Recent Orders</h3>
            </div>
            <div className="px-6 py-16 text-center text-slate-400 text-sm">
              No orders yet. Start shopping to see your orders here.
            </div>
          </div>
      </>
  );
}
