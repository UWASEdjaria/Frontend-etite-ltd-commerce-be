'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FiShoppingBag, FiPackage, FiHeart, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
import { dashboardService } from '../../services/dashboardService';
import { wishlistService } from '@/services/wishlistService';
import { OrderResponse } from '@/types/order';
import { WishlistResponse } from '@/types/wishlist';
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
  
  // State for pagination & items per page (set to 3 items)
  const [currentPage, setCurrentPage] = useState(1);
  const [orderTotalPages, setOrderTotalPages] = useState(1);
  const itemsPerPage = 3;

  // State for wishlist logic
  const [wishlistData, setWishlistData] = useState<WishlistResponse | null>(null);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: "error" | "success" } | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const fetchData = useCallback(async (page: number) => {
    try {
      const response = await dashboardService.getRecentOrders(page);
      setRecentOrders(response.orders || []);
      setOrderTotalPages(response.totalPages);
      
      if (page === 1) {
        const summary = await dashboardService.getSummary();
        setStatsData(summary);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  }, []);

  const fetchWishlist = useCallback(async () => {
    try {
      setWishlistLoading(true);
      const response = await wishlistService.getWishlist();
      setWishlistData(response);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    } finally {
      setWishlistLoading(false);
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
      fetchWishlist();
    }
  }, [router, fetchData, fetchWishlist]);

  const handleRemoveWishlistItem = async () => {
    if (!itemToDelete) return;

    try {
      setMessage(null);
      await wishlistService.removeItem(itemToDelete);
      setMessage({ text: "Item removed successfully", type: "success" });
      setItemToDelete(null);
      fetchWishlist();
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || "Failed to remove item"
        : "An unexpected error occurred";
      setMessage({ text: errorMessage, type: "error" });
      setItemToDelete(null);
    }
  };

  // Calculate wishlist pagination locally based on the shared page state (3 items per page)
  const allWishlistItems = wishlistData?.userWishlist || [];
  const wishlistTotalPages = Math.ceil(allWishlistItems.length / itemsPerPage) || 1;
  const paginatedWishlist = allWishlistItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Use the maximum total pages between orders and wishlist to sync the pagination component correctly
  const maxTotalPages = Math.max(orderTotalPages, wishlistTotalPages);

  const stats = [
    { label: 'Total Orders', value: statsData.totalOrders.toString(), icon: FiShoppingBag, color: 'bg-blue-50 text-blue-700' },
    { label: 'Active Orders', value: statsData.activeOrders.toString(), icon: FiPackage, color: 'bg-emerald-50 text-emerald-700' },
    { label: 'Wishlist Items', value: (allWishlistItems.length ?? statsData.wishlistItems).toString(), icon: FiHeart, color: 'bg-rose-50 text-rose-700' },
  ];

  if (isAuthenticated === null || !isAuthenticated) return null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      {/* Welcome */}
      <h2 className="text-xl font-extrabold text-slate-900">Welcome back 👋</h2>
      <p className="text-sm text-slate-500 mt-1">Manage your orders, wishlist and account.</p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4 shadow-sm">
            <div className={`p-3 rounded-lg ${color}`}>
              <Icon size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500">{label}</p>
              <p className="text-xl font-extrabold text-slate-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Optional feedback message for wishlist deletion */}
      {message && (
        <div className={`mt-4 p-3 rounded-lg text-xs border ${message.type === "error" ? "bg-red-50 text-red-700 border-red-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}>
          {message.text}
        </div>
      )}

      {/* Side-by-Side Grid Layout for Recent Orders and Wishlist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        
        {/* Recent Orders Box */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden">
          <div>
            <div className="text-gray-600 px-6 py-4 border-b text-xs font-bold uppercase tracking-wide">
              Recent Orders
            </div>

            <div className="min-h-[220px] flex flex-col justify-center">
              {(recentOrders || []).length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-10">No orders yet.</p>
              ) : (
                <div className="divide-y divide-slate-100 w-full">
                  {(recentOrders || []).slice(0, itemsPerPage).map((order: OrderResponse) => {
                    const item = order.orderItems?.[0];
                    const product = item?.product;
                    return (
                      <div key={order.id} className="p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {product?.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                              <FiShoppingBag className="text-slate-400" size={18} />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">{product?.name || 'Product N/A'}</p>
                            <p className="text-xs text-slate-500 mt-0.5"><span className="font-medium text-slate-700 capitalize">{order.status}</span></p>
                          </div>
                        </div>
                        <p className="font-bold text-slate-700 text-sm shrink-0">{order.totalAmount?.toLocaleString() ?? 0} <span className="text-slate-400 font-normal">RWF</span></p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Wishlist Box */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden">
          <div>
            <div className="text-gray-600 px-6 py-4 border-b text-xs font-bold uppercase tracking-wide">
              Wishlist
            </div>

            <div className="min-h-[220px] flex flex-col justify-center">
              {wishlistLoading ? (
                <p className="text-sm text-slate-400 text-center py-10">Loading wishlist...</p>
              ) : paginatedWishlist.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-10">Your wishlist is empty.</p>
              ) : (
                <div className="divide-y divide-slate-100 w-full">
                  {paginatedWishlist.map((item) => {
                    const product = item.product;
                    return (
                    <div key={item.id} className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={product?.imageUrl || "/placeholder.png"} 
                          alt={product?.name || "Product image"} 
                          className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
                            <FiHeart className="text-rose-500 fill-rose-500" size={14} /> {product?.name || 'Product N/A'}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">{(product?.price ?? 0).toLocaleString()} RWF</p>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {itemToDelete === item.productId ? (
                          <div className="flex flex-col gap-1 items-end text-xs">
                            <span className="text-slate-500">Confirm?</span>
                            <div className="flex gap-2">
                              <button onClick={handleRemoveWishlistItem} className="font-bold text-red-600 hover:underline cursor-pointer">Yes</button>
                              <button onClick={() => setItemToDelete(null)} className="text-slate-500 hover:underline cursor-pointer">No</button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setItemToDelete(item.productId)}
                            className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            <FiTrash2 size={14} /> Remove
                          </button>
                        )}
                      </div>
                    </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Single Main Page-Level Pagination Control for Both Sections */}
      {maxTotalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={maxTotalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              fetchData(page);
            }}
          />
        </div>
      )}
    </div>
  );
}