'use client';
import { useEffect, useState } from 'react';
import { adminAnalyticsService } from '@/services/adminAnalytics.service';
import { PaginatedCartsResponse } from '@/types/adminAnalytics';
import Pagination from '@/components/ui/pagnition';



export default function AdminAnalyticsPage() {
  const [cartsData, setCartsData] = useState<PaginatedCartsResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const loadData = async (page: number) => {
    setLoading(true);
    try {
      const data = await adminAnalyticsService.getActiveCarts(page);
      setCartsData(data);
    } catch (error) {
      console.error("Failed to load carts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(currentPage);
  }, [currentPage]);

  if (loading) return <div className="flex items-center justify-center h-64 text-slate-500 text-sm">Loading...</div>;
  if (!cartsData) return <div>No data found.</div>;

  return (
    <div className="p-4 sm:p-6 bg-slate-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Active Carts</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Products currently sitting in customer carts.</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cartsData.carts.map((cart) => (
              <tr key={cart.id} className="hover:bg-gray-50">
                <td className="px-4 sm:px-6 py-4 flex items-center gap-3">
                  <img src={cart.product.imageUrl || "/fallback-product.png"} alt={cart.product.name} className="w-9 h-9 rounded object-cover bg-gray-200 shrink-0" />
                  <span className="text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-xs">{cart.product.name}</span>
                </td>
                <td className="px-4 sm:px-6 py-4 text-sm text-gray-500 truncate max-w-[120px] sm:max-w-none">{cart.user.email}</td>
                <td className="px-4 sm:px-6 py-4 text-sm text-gray-500 font-mono whitespace-nowrap">
                  {cart.product.price.toLocaleString()} RWF
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> <Pagination 
          currentPage={cartsData.currentPage} 
          totalPages={cartsData.totalPages} 
          onPageChange={setCurrentPage} 
        />
    </div>
  );
}