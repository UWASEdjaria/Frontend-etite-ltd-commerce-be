'use client';
import { useEffect, useState,useCallback } from 'react';
import { orderService } from '@/services/orderService';
import { OrderResponse } from '@/types/order';
import Pagination from '@/components/ui/pagnition';

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = useCallback(async (page: number) => {
    console.log("Fetching data for page:", page);
    const data = await orderService.getMyOrders(page);
    setOrders(data.orders);
    setTotalPages(data.totalPages);
    setCurrentPage(data.currentPage);
  }, []);

  useEffect(() => {
    fetchOrders(1);
  }, [fetchOrders]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">My Orders</h1>
      {orders.map((order) => (
        <div key={order.id} className="bg-white p-4 rounded-lg shadow mb-4 border border-slate-200">
          <div className="flex justify-between items-center">
            <p className="font-bold text-gray-600">Order: #{order.id.slice(0, 8)}</p>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              order.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {order.status}
            </span>
          </div>
          <p className="text-slate-600 mt-2">Total: {order.totalAmount.toLocaleString()} RWF</p>
        </div>
      ))}
    <div className="mt-6 pb-32 mb-10 flex justify-center pb-10">
    
         {totalPages > 1 && (
         <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={(page: number) => fetchOrders(page)}
          />
          )}
        </div>
    </div>
  );
}