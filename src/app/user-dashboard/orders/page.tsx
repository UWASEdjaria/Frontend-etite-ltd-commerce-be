'use client';

import { useEffect, useState, useCallback } from 'react';
import { orderService } from '@/services/orderService';
import { OrderResponse } from '@/types/order';
import Pagination from '@/components/ui/pagnition';
import { toast } from 'sonner';
import { FiShoppingBag, FiClock, FiCheckCircle, FiXCircle, FiSearch, FiArrowRight, FiPackage, FiShield, FiTruck, FiHeadphones, FiCheck, FiRefreshCw } from 'react-icons/fi';

interface ApiError {
  response?: {
    data?: {
      message: string;
    };
  };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  
  // Guest tracking states
  const [isGuest, setIsGuest] = useState(false);
  const [searchOrderId, setSearchOrderId] = useState('');
  const [singleGuestOrder, setSingleGuestOrder] = useState<OrderResponse | null>(null);

  const fetchOrders = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const data = await orderService.getMyOrders(page);
      setOrders(data.orders);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsGuest(true);
      setLoading(false);
      // Read orderId from URL first (comes from email link), then fall back to localStorage
      const urlParams = new URLSearchParams(window.location.search);
      const urlOrderId = urlParams.get('orderId');
      const savedOrderId = urlOrderId || localStorage.getItem('last_guest_order_id');
      if (savedOrderId) {
        setSearchOrderId(savedOrderId);
        orderService.getOrderById(savedOrderId)
          .then((data) => setSingleGuestOrder(data))
          .catch(() => localStorage.removeItem('last_guest_order_id'));
      }
      return;
    }
    fetchOrders(1);
  }, [fetchOrders]);

  const handleGuestSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchOrderId.trim()) {
      toast.error('Please enter your Order ID');
      return;
    }

    setLoading(true);
    try {
      const orderData = await orderService.getOrderById(searchOrderId.trim());
      setSingleGuestOrder(orderData);
      toast.success('Order found!');
    } catch {
      toast.error('Order not found. Please check your Order ID.');
      setSingleGuestOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId: string) => {
    toast.promise(
      (async () => {
        await orderService.cancelOrder(orderId);
        if (isGuest && singleGuestOrder) {
          const updated = await orderService.getOrderById(orderId);
          setSingleGuestOrder(updated);
        } else {
          await fetchOrders(currentPage);
        }
      })(),
      {
        loading: 'Cancelling order...',
        success: 'Order cancelled successfully!',
        error: (err: ApiError) => {
          return err.response?.data?.message || 'Failed to cancel order';
        },
      }
    );
  };

  // Compute live statistics for cards from current list data
  const totalOrdersCount = orders.length;
  const activeOrdersCount = orders.filter(o => o.status !== 'CANCELLED' && o.status !== 'DELIVERED' && o.status !== 'PAID').length;
  const completedOrdersCount = orders.filter(o => o.status === 'PAID' || o.status === 'DELIVERED').length;

  if (loading && !isGuest) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-500 text-sm gap-2">
        <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        Loading your orders...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      
      {/* Header Section with Reduced Text & Added Value Details */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg mb-8">
        <div className="max-w-2xl">
          <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3 backdrop-blur-sm">
            Customer Dashboard & Support Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Your Order Activity Hub 🚀</h1>
          <p className="text-orange-50 text-sm sm:text-base mt-2 leading-relaxed">
            Track real-time purchases and live shipments in one centralized place.
          </p>

          {/* Expanded Informational Bullet Points & Highlights */}
          <div className="mt-5 pt-5 border-t border-white/20 grid grid-cols-1 sm:grid-cols-2 gap-3 text-orange-50 text-xs">
            <div className="flex items-center gap-2">
              <span className="p-1 bg-white/20 rounded-full"><FiCheck size={12} className="text-white" /></span>
              <span>Instant order updates & push notifications</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="p-1 bg-white/20 rounded-full"><FiCheck size={12} className="text-white" /></span>
              <span>Direct cancellation support for pending orders</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="p-1 bg-white/20 rounded-full"><FiCheck size={12} className="text-white" /></span>
              <span>Automated digital receipts and invoice history</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="p-1 bg-white/20 rounded-full"><FiCheck size={12} className="text-white" /></span>
              <span>Dedicated dispatch tracking across all districts</span>
            </div>
          </div>

          {/* Badges Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/20">
            <div className="flex items-center gap-2.5 text-orange-50 text-xs font-medium">
              <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
                <FiShield size={16} className="text-white" />
              </div>
              <span>Secure Transactions</span>
            </div>
            <div className="flex items-center gap-2.5 text-orange-50 text-xs font-medium">
              <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
                <FiTruck size={16} className="text-white" />
              </div>
              <span>Fast Kigali Delivery</span>
            </div>
            <div className="flex items-center gap-2.5 text-orange-50 text-xs font-medium">
              <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
                <FiHeadphones size={16} className="text-white" />
              </div>
              <span>24/7 Order Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Statistics Cards Section */}
      {!isGuest && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <FiShoppingBag size={22} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Loaded Orders</p>
              <p className="text-xl font-black text-slate-800">{totalOrdersCount}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <FiClock size={22} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Pending/Active</p>
              <p className="text-xl font-black text-slate-800">{activeOrdersCount}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <FiCheckCircle size={22} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Completed/Paid</p>
              <p className="text-xl font-black text-slate-800">{completedOrdersCount}</p>
            </div>
          </div>
        </div>
      )}

      {/* Guest Lookup Form */}
      {isGuest && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl">
              <FiSearch size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Track Guest Order</h2>
              <p className="text-xs text-slate-500">Enter the unique Order ID you received after checkout.</p>
            </div>
          </div>
          <form onSubmit={handleGuestSearch} className="flex flex-col sm:flex-row gap-3 mt-4">
            <input
              type="text"
              placeholder="e.g. ord_987234abc..."
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
              className="border border-slate-300 bg-slate-50 text-slate-800 rounded-2xl px-4 py-3 flex-1 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
            />
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              Find Order <FiArrowRight size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Render Orders in a 2-Column Grid to Use Space Wisely */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isGuest ? (
          singleGuestOrder ? (
            <div className="md:col-span-2">
              <OrderCard order={singleGuestOrder} onCancel={cancelOrder} />
            </div>
          ) : (
            !loading && (
              <div className="md:col-span-2 bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-center">
                <FiPackage className="mx-auto text-slate-300 mb-3" size={40} />
                <p className="text-slate-600 font-semibold text-sm">No order selected</p>
                <p className="text-slate-400 text-xs mt-1">Search for an order using your Order ID above to see status info.</p>
              </div>
            )
          )
        ) : (
          orders.length > 0 ? (
            orders.map((order) => <OrderCard key={order.id} order={order} onCancel={cancelOrder} />)
          ) : (
            <div className="md:col-span-2 bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-center">
              <FiPackage className="mx-auto text-slate-300 mb-3" size={40} />
              <p className="text-slate-600 font-semibold text-sm">No orders found</p>
              <p className="text-slate-400 text-xs mt-1">You haven&apos;t placed any orders yet.</p>
            </div>
          )
        )}
      </div>

      {/* Pagination for Logged-in Users */}
      {!isGuest && totalPages > 1 && (
        <div className="mt-8 flex justify-center pb-8">
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={(page: number) => fetchOrders(page)}
          />
        </div>
      )}
    </div>
  );
}

// Reusable Order Card Subcomponent formatted for 2-column layout
function OrderCard({ order, onCancel }: { order: OrderResponse; onCancel: (id: string) => void }) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
      case 'DELIVERED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'CANCELLED':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 transition-all hover:shadow-md flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Order Reference</span>
            <p className="font-black text-slate-800 text-sm sm:text-base">#{order.id.slice(0, 12)}...</p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 ${getStatusBadge(order.status)}`}>
              {order.status === 'PAID' || order.status === 'DELIVERED' ? <FiCheckCircle size={13} /> : <FiClock size={13} />}
              {order.status}
            </span>

            {order.status === 'PENDING' && (
              <button 
                onClick={() => onCancel(order.id)} 
                className="text-red-500 hover:bg-red-50 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <FiXCircle size={14} /> Cancel
              </button>
            )}
          </div>
        </div>

        <div className="divide-y divide-slate-100 my-2">
          {order.orderItems.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img 
                  src={item.product.imageUrl || '/placeholder.png'} 
                  alt={item.product.name} 
                  className="w-12 h-12 object-cover rounded-2xl border border-slate-100 shrink-0 shadow-xs"
                />
                <div>
                  <p className="font-bold text-slate-800 text-sm line-clamp-1">{item.product?.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Quantity: <span className="font-semibold text-slate-700">{item.quantity}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50/70 p-4 rounded-2xl">
        <div>
          <p className="text-xs text-slate-500 font-medium">Shipping Destination</p>
          <p className="text-xs text-slate-800 font-semibold mt-0.5 truncate max-w-[200px]">{order.shippingAddress}</p>
        </div>
        <div className="text-right w-full sm:w-auto">
          <p className="text-xs text-slate-500 font-medium">Total Amount</p>
          <p className="text-base font-black text-slate-900">
            {order.totalAmount.toLocaleString()} <span className="text-xs font-normal text-slate-500">RWF</span>
          </p>
        </div>
      </div>
    </div>
  );
}