'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FiShoppingBag, FiPackage, FiHeart } from 'react-icons/fi';
import { dashboardService } from '../../services/dashboardService';
import { OrderResponse } from '@/types/order';
import Pagination from '@/components/ui/pagnition';


export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // State for stats and orders
  const [statsData, setStatsData] = useState({ 
    totalOrders: 0, 
    activeOrders: 0, 
    wishlistItems: 0, 
    pendingReviews: 0 
  });
  const [recentOrders, setRecentOrders] = useState([]);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = useCallback(async (page: number) => {
    try {
      const response = await dashboardService.getRecentOrders(page);
      setRecentOrders(response.orders || []);
      setTotalPages(response.totalPages);
      
      if (page === 1) {
        const summary = await dashboardService.getSummary();
        setStatsData(summary);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      router.replace('/login');
    } else {
      setIsAuthenticated(true);
      fetchData(1);
    }
  }, [router, fetchData]);

  const stats = [
    { label: 'Total Orders', value: statsData.totalOrders.toString(), icon: FiShoppingBag, color: 'bg-blue-50 text-blue-700' },
    { label: 'Active Orders', value: statsData.activeOrders.toString(), icon: FiPackage, color: 'bg-emerald-50 text-emerald-700' },
    { label: 'Wishlist Items', value: statsData.wishlistItems.toString(), icon: FiHeart, color: 'bg-rose-50 text-rose-700' },
  ];

  if (isAuthenticated === null || !isAuthenticated) return null;

  return (
       <>
          {/* Welcome */}
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <h2 className="text-xl font-extrabold text-slate-900">Welcome back 👋</h2>
            <p className="text-sm text-slate-500 mt-1">Here&apos;s an overview of your account activity.</p>
          </div>
        ))}
      </div>

      <div>
        <div className="text-gray-600 px-6 py-4 border-b text-xs font-bold">
          All Orders
        </div>

        {/* FIXED: Added (recentOrders || []) to ensure it never crashes */}
        {(recentOrders || []).map((order: OrderResponse) => {
          const item = order.orderItems?.[0];
          const product = item?.product;

          return (
            <div key={order.id} className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-4">
                {product?.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-16 h-16 rounded-md object-cover border border-slate-200" 
                  />
                ) : (
                  <div className="w-16 h-16 bg-slate-100 rounded-md flex items-center justify-center">
                    <FiShoppingBag className="text-slate-400" />
                  </div>
                )}
                <div>
                  <p className="font-bold text-slate-800">{product?.name || "Product Name N/A"}</p>
                  <p className="text-sm text-slate-500">Status: {order.status}</p>
                </div>
              </div>
              {/* FIXED: Added optional chaining to totalAmount */}
              <p className="font-bold text-gray-600">{order.totalAmount?.toLocaleString() ?? 0} RWF</p>
            </div>
          );
        })}
        
       <div className="mt-6 pb-32 mb-10 flex justify-center pb-10">
       <Pagination
         currentPage={currentPage}
         totalPages={totalPages}
         onPageChange={(page) => {
          setCurrentPage(page);
          fetchData(page);
          }}
           />
        </div>
       
      </div>
    </>
  );
}