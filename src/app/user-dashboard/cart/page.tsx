'use client';

import { useEffect, useState } from 'react';
import { cartService } from '@/services/cartService';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { CartItem } from '@/types/cart';
import { toast, Toaster } from 'react-hot-toast';
import { AxiosError } from 'axios';

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  // State to track which item is currently asking for deletion confirmation
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCart = async () => {
    try {
      const data = await cartService.getCart();
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      await cartService.updateItem(id, quantity);
      fetchCart();
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const message = err.response?.data?.message || "Could not update quantity";
      toast.error(message);
    }
  };

  const removeItem = async (id: string) => {
    try {
      await cartService.removeItem(id);
      fetchCart();
      toast.success("Item removed");
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const message = err.response?.data?.message || "Could not remove item";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 max-w-5xl mx-auto">
      <Toaster position="top-right" />
      <h1 className="text-xl sm:text-2xl font-bold mb-6 text-slate-800">Shopping Cart</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {items.length === 0 ? (
          <p className="p-10 text-center text-slate-500">Your cart is empty.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 gap-4 sm:gap-6">
                
                <div className="flex items-center gap-4 w-full sm:w-auto flex-1">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 rounded-lg border border-slate-100 shrink-0 overflow-hidden">
                    <img 
                      src={item.product.imageUrl || '/placeholder.png'} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 truncate">{item.product.name}</h3>
                    <p className="text-sm text-orange-700 font-semibold">{item.product.price.toLocaleString()} RWF</p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-4 bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 text-slate-400 hover:text-slate-700 transition"
                      aria-label="Decrease quantity"
                    >
                      <FiMinus size={18} />
                    </button>
                    <span className="w-8 text-center font-bold text-slate-700">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 text-slate-400 hover:text-slate-700 transition"
                      aria-label="Increase quantity"
                    >
                      <FiPlus size={18} />
                    </button>
                  </div>

                  {deletingId === item.id ? (
                    <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                      <span className="text-xs font-bold text-slate-500">Delete?</span>
                      <button onClick={() => removeItem(item.id)} className="text-xs font-bold text-red-600 hover:underline">Yes</button>
                      <button onClick={() => setDeletingId(null)} className="text-xs font-bold text-slate-500 hover:underline">No</button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setDeletingId(item.id)} 
                      className="p-2 text-slate-400 hover:text-red-600 transition border-l border-slate-200 pl-4"
                      aria-label="Remove item"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
