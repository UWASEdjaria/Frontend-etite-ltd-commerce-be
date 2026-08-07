'use client';
import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { toast } from 'sonner';
import { adminStockService } from '@/services/adminStockService';
import { IEditStockDto, IStockItem } from '@/types/adminStock';

interface Props {
  stock: IStockItem;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditStockModal({ stock, onClose, onSuccess }: Props) {
  const [form, setForm] = useState<IEditStockDto>({
    quantity: stock.quantity,
    price: stock.price,
    expiryDate: stock.expiryDate ?? '',
    batchCode: stock.batchCode ?? '',
  });
  const [loading, setLoading] = useState(false);

  const set = (field: keyof IEditStockDto, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminStockService.editStock(stock.id, {
        ...form,
        expiryDate: form.expiryDate || undefined,
        batchCode: form.batchCode || undefined,
      });
      toast.success('Stock updated successfully');
      onSuccess();
      onClose();
    } catch {
      toast.error('Failed to update stock');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[300] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Edit Stock Batch</h2>
            <p className="text-xs text-gray-500">{stock.productName} · {stock.batchCode || 'No batch code'}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-full transition">
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input type="number" min={0} value={form.quantity} onChange={(e) => set('quantity', Number(e.target.value))} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
              <input type="number" min={0.01} step={0.01} value={form.price} onChange={(e) => set('price', Number(e.target.value))} className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
            <input
              type="date"
              value={form.expiryDate ? form.expiryDate.split('T')[0] : ''}
              onChange={(e) => set('expiryDate', e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Batch Code</label>
            <input type="text" value={form.batchCode ?? ''} onChange={(e) => set('batchCode', e.target.value)} className={inputClass} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="flex-1 bg-orange-600 text-white py-2 rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={onClose} className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg font-semibold hover:bg-slate-200 transition">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
