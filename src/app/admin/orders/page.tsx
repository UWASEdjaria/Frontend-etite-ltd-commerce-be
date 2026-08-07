'use client'
import { adminOrderService } from '@/services/adminOrderService';
import { PaginatedOrdersResponse } from '@/types/order';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const AdminOrdersDashboard = () => {
  const [ordersData, setOrdersData] = useState<PaginatedOrdersResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async (page: number = 1) => {
    setLoading(true);
    try {
      const data = await adminOrderService.getAll(page);
      setOrdersData(data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await adminOrderService.updateStatus(id, status);
      fetchOrders(); // Refresh table after update
    } catch {
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    (async () => { await fetchOrders(); })();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64 text-slate-500 text-sm">Loading orders...</div>;

  return (
    <div className="flex flex-col gap-6 pb-16 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Order Management</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Manage customer orders, track shipping, and update statuses.</p>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Update</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Contact</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ordersData?.orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-600 font-mono">{order.id.slice(0, 8)}...</td>
                <td className="px-4 py-4 text-sm text-gray-700">
                  <p className="font-semibold">{order.user?.name}</p>
                  <p className="text-xs text-gray-500">{order.user?.email}</p>
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="text-xs">• {item.product.name} <span className="font-bold">x{item.quantity}</span></div>
                  ))}
                </td>
                <td className="px-4 py-4 text-sm text-gray-600 max-w-[140px] truncate">{order.shippingAddress}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{order.totalAmount.toLocaleString()} RWF</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                      order.status === 'PAID' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'PROCESSING' ? 'bg-orange-100 text-orange-800' :
                      order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' : 
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <select 
                    aria-label={`Update status for order ${order.id}`}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    defaultValue={order.status}
                    className="block w-full py-1.5 px-2 border border-gray-300 bg-white rounded-md text-gray-600 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-xs"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PAID">PAID</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <a 
                    href={`mailto:${order.user?.email}?subject=Regarding Order #${order.id.slice(0, 8)}&body=Hello ${order.user?.name}, regarding your order #${order.id.slice(0, 8)},`}
                    className="text-orange-600 hover:text-orange-800 font-medium text-xs underline"
                  >
                    Email
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-4">
        {ordersData?.orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-gray-500">{order.id.slice(0, 10)}...</span>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                  order.status === 'PAID' ? 'bg-purple-100 text-purple-800' :
                  order.status === 'PROCESSING' ? 'bg-orange-100 text-orange-800' :
                  order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' : 
                  order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'}`}>
                {order.status}
              </span>
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-800">{order.user?.name}</p>
              <p className="text-xs text-gray-500">{order.user?.email}</p>
            </div>
            <div className="text-xs text-gray-600">
              {order.orderItems.map((item) => (
                <div key={item.id}>• {item.product.name} <span className="font-bold">x{item.quantity}</span></div>
              ))}
            </div>
            <p className="text-xs text-gray-500 truncate">{order.shippingAddress}</p>
            <p className="font-bold text-sm text-slate-800">{order.totalAmount.toLocaleString()} RWF</p>
            <div className="flex items-center gap-3">
              <select 
                aria-label={`Update status for order ${order.id}`}
                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                defaultValue={order.status}
                className="flex-1 py-2 px-2 border border-gray-300 bg-white rounded-lg text-gray-600 text-xs focus:outline-none focus:ring-orange-500"
              >
                <option value="PENDING">PENDING</option>
                <option value="PAID">PAID</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
              <a 
                href={`mailto:${order.user?.email}?subject=Regarding Order #${order.id.slice(0, 8)}&body=Hello ${order.user?.name},`}
                className="text-orange-600 hover:text-orange-800 font-medium text-xs underline whitespace-nowrap"
              >
                Email
              </a>
            </div>
          </div>
        ))}
      </div>
   </div>
  );
};

export default AdminOrdersDashboard;