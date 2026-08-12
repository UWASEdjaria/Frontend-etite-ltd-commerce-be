'use client';
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { FiPlus, FiEdit2, FiSearch } from 'react-icons/fi';
import { adminStockService } from '@/services/adminStockService';
import { IStockItem, StockStatus } from '@/types/adminStock';
import AddStockModal from '@/components/admin/addStockModal';
import EditStockModal from '@/components/admin/EditStockModal';
import Pagination from '@/components/ui/pagnition';

const STATUS_STYLES: Record<StockStatus, string> = {
  NORMAL: 'bg-green-100 text-green-800',
  LOW: 'bg-yellow-100 text-yellow-800',
  OUT_OF_STOCK: 'bg-red-100 text-red-800',
  OVERSTOCK: 'bg-blue-100 text-blue-800',
  EXPIRED: 'bg-red-200 text-red-900',
};

const STATUS_LABELS: Record<StockStatus, string> = {
  NORMAL: 'Normal',
  LOW: 'Low Stock',
  OUT_OF_STOCK: 'Out of Stock',
  OVERSTOCK: 'Overstock',
  EXPIRED: 'Expired',
};

export default function StockPage() {
  const [stocks, setStocks] = useState<IStockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState<IStockItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StockStatus | 'ALL'>('ALL');

  const load = useCallback(async (page: number = 1) => {
    try {
      const res = await adminStockService.getAll(page);
      setStocks(res.data);
      setTotalPages(res.totalPages);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || 'Failed to load stock');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(currentPage);
  }, [currentPage, load]);

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-slate-500 text-sm">Loading stock...</div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Stock Management</h1>
          <p className="text-sm text-gray-500">Track inventory batches — IN from purchases, OUT from orders.</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-700 transition"
        >
          <FiPlus size={16} /> Add New Stock
        </button>
      </div>

      {stocks.filter(s => s.status === 'EXPIRED').length > 0 && (
        <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          <span className="font-bold">⚠ {stocks.filter(s => s.status === 'EXPIRED').length} expired batch{stocks.filter(s => s.status === 'EXPIRED').length > 1 ? 'es' : ''}</span>
          <span className="text-red-500">on this page — these cannot be sold and should be removed.</span>
          <button onClick={() => setStatusFilter('EXPIRED')} className="ml-auto text-xs underline font-semibold">Show only expired</button>
        </div>
      )}

      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="relative max-w-sm flex-1">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search by product name..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as StockStatus | 'ALL'); setCurrentPage(1); }}
          className="border border-slate-200 rounded-lg text-sm text-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="ALL">All Statuses</option>
          {(Object.keys(STATUS_LABELS) as StockStatus[]).map(s => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Product', 'Batch Code', 'Batch Qty', 'Total Stock', 'Price', 'Status', 'Expiry', 'Added', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stocks
              .filter((s) =>
                s.productName.toLowerCase().includes(search.toLowerCase()) &&
                (statusFilter === 'ALL' || s.status === statusFilter)
              )
              .map((s) => (
              <tr key={s.id} className={`transition-colors ${s.status === 'EXPIRED' ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}`}>
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{s.productName}</td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{s.batchCode || '—'}</td>
                <td className="px-4 py-3 text-gray-500 font-mono">{s.quantity}</td>
                <td className="px-4 py-3 font-mono font-bold text-slate-800">{s.productStock}</td>
                <td className="px-4 py-3 text-gray-500">
                  {s.price.toLocaleString()} RWF
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${STATUS_STYLES[s.status]}`}>
                    {STATUS_LABELS[s.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                  {s.expiryDate ? new Date(s.expiryDate).toLocaleDateString() : '—'}
                </td>
                <td className="px-4 py-3 text-gray-400 whitespace-nowrap text-xs">
                  {new Date(s.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setEditTarget(s)}
                    className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
                    title="Edit batch"
                  >
                    <FiEdit2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {stocks.length === 0 && (
          <p className="text-center text-sm text-slate-400 py-10">No stock entries found. Add your first stock purchase.</p>
        )}
      </div>

      {/* Pagination component container */}
      <div className="mt-6 mb-10 flex justify-center pb-10">
        {totalPages > 1 ? (
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={(page) => setCurrentPage(page)} 
          />
        ) : (
          <p className="text-xs text-slate-400">
            Showing all {stocks.length} stock entries (Page {currentPage} of {totalPages})
          </p>
        )}
      </div>

      {showAdd && <AddStockModal onClose={() => setShowAdd(false)} onSuccess={() => load(currentPage)} />}
      {editTarget && <EditStockModal stock={editTarget} onClose={() => setEditTarget(null)} onSuccess={() => load(currentPage)} />}
    </div>
  );
}