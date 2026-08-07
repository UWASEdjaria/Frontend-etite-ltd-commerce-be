'use client';
import { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { toast } from 'sonner';
import { adminStockService } from '@/services/adminStockService';
import { adminProductService } from '@/services/adminProduct.service';
import { IAddStockDto } from '@/types/adminStock';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

type ProductOption = {
  id: string;
  name: string;
  stock?: number;
};

type ProductListResponse = ProductOption[] | { data?: ProductOption[] };

const defaultForm: IAddStockDto = {
  productId: '',
  quantity: 1,
  price: 0,
  expiryDate: '',
  batchCode: '',
};

export default function AddStockModal({ onClose, onSuccess }: Props) {
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [form, setForm] = useState<IAddStockDto>(defaultForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    adminProductService.getAll({ limit: 200 })
      .then((res: ProductListResponse) => {
        const nextProducts = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
            ? res.data
            : [];
        setProducts(nextProducts);
      })
      .catch(() => {
        setProducts([]);
      });
  }, []);

  const setField = <K extends keyof IAddStockDto>(field: K, value: IAddStockDto[K]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.productId) { toast.error('Select a product'); return; }
    if (form.quantity < 1) { toast.error('Quantity must be at least 1'); return; }
    if (form.price <= 0) { toast.error('Price must be greater than 0'); return; }
    setLoading(true);
    try {
      await adminStockService.addStock({
        ...form,
        expiryDate: form.expiryDate || undefined,
        batchCode: form.batchCode || undefined,
      });
      toast.success('Stock added successfully');
      onSuccess();
      onClose();
    } catch {
      toast.error('Failed to add stock');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[300] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-gray-800">Add New Stock (Purchase)</h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-full transition">
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
           <select 
             value={form.productId} 
              onChange={(e) => {
            const selectedId = e.target.value;
            const foundProduct = products.find((p) => p.id === selectedId);
              setForm((prev) => ({
               ...prev,
                productId: selectedId,
               // Automatically set the quantity field to the product's actual current stock level
                quantity: foundProduct ? foundProduct.stock ?? 1 : 1 
               }));
              }} 
              className={inputClass} 
              required
                >
              <option value="">Select a product</option>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input type="number" min={1} value={form.quantity} onChange={(e) => setField('quantity', Number(e.target.value))} className={inputClass} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
              <input type="number" min={0.01} step={0.01} value={form.price} onChange={(e) => setField('price', Number(e.target.value))} className={inputClass} required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date <span className="text-gray-400 font-normal">(optional)</span></label>
            <input type="date" value={form.expiryDate ?? ''} onChange={(e) => setField('expiryDate', e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Batch Code <span className="text-gray-400 font-normal">(optional)</span></label>
            <input type="text" value={form.batchCode ?? ''} onChange={(e) => setField('batchCode', e.target.value)} placeholder="e.g. BATCH-2025-001" className={inputClass} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="flex-1 bg-orange-600 text-white py-2 rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-50">
              {loading ? 'Adding...' : 'Add Stock'}
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
