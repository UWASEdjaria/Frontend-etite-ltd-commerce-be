'use client';

import { useEffect, useState } from 'react';
import { cartService } from '@/services/cartService';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { CartItem } from '@/types/cart';
import { toast } from 'sonner';
import Pagination from '@/components/ui/pagnition';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { getGuestCart, saveGuestCart } from "@/utils/guestCart";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const fetchCart = async (page: number = 1) => {
    const token = localStorage.getItem('token');
  
  if (!token) {
    // Guest Flow: Load from LocalStorage
    const guestItems = getGuestCart();
    setItems(guestItems);
    return;
  }
    try {
      const response = await cartService.getCart(page);
      setItems(response.items || []);
      if (response.totalPages) setTotalPages(response.totalPages);
      if (response.currentPage) setCurrentPage(response.currentPage);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setItems([]);
    }
  };

  useEffect(() => {
    (async () => { await fetchCart(); })();
  }, []);

  const updateQuantity = async (id: string, quantity: number, stockLimit?: number) => {
    if (quantity < 1) return;
    if (stockLimit !== undefined && quantity > stockLimit) {
    toast.error("Stock limit reached", {
      description: `Only ${stockLimit} items available in stock.`,
      duration: 4000,
    });
    return;
  }
    const token = localStorage.getItem('token');
    if (!token) {
      // Guest Flow: Update localStorage
      const guestItems = getGuestCart();
      const updated = guestItems.map(item => item.id === id ? { ...item, quantity } : item);
      saveGuestCart(updated);
      setItems(updated);
      window.dispatchEvent(new Event('cartUpdated'));
      return;
    }
    // Logged-in Flow: Call API
    try {
      await cartService.updateItem(id, quantity);
      fetchCart();
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const message = err.response?.data?.message || "Could not update quantity";
      toast.error(message, {
        description: "Please adjust your quantity or choose fewer items.",
        duration: 4000,
      });
    }
  };
const removeItem = async (id: string) => {
    const token = localStorage.getItem('token');

    if (!token) {
      // Guest Flow: Remove from localStorage
      const guestItems = getGuestCart();
      const updated = guestItems.filter(item => item.id !== id);
      saveGuestCart(updated);
      setItems(updated);
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success("Item removed");
      setDeletingId(null);
      return;
    }
    // Logged-in Flow: Call API
    try {
      await cartService.removeItem(id);
      fetchCart(currentPage);
      toast.success("Item removed");
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const message = err.response?.data?.message || "Could not remove item";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };


  const subtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  return (
    <div className="w-full">
      {/* Top Banner Section with Background Image */}
      <div className="relative w-full h-40 sm:h-56 md:h-64 lg:h-72 bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=870&auto=format&fit=crop')] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">My Cart</h1>
          <p className="mt-2 text-sm text-slate-200">
            Home / Shop / <span className="text-orange-400 font-semibold">Cart</span>
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto">
        <div className="mb-6">
          <p className="text-slate-600 max-w-3xl text-sm">
            Review the products you've selected before proceeding to checkout. You can update quantities, remove items, or continue shopping.
          </p>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            Secure checkout • Fast delivery • Easy order tracking
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <p className="text-slate-500 mb-4">Your cart is currently empty.</p>
            <button 
              onClick={() => router.push('/user-dashboard/products')}
              className="bg-orange-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-orange-600 transition"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* LEFT COLUMN: Product List */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="divide-y divide-slate-100">
                {items.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between p-6 gap-6">
                    
                    <div className="flex items-center gap-4 w-full sm:w-auto flex-1">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 rounded-xl border border-slate-100 shrink-0 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={item.product.imageUrl || '/placeholder.png'} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 text-base truncate">{item.product.name}</h3>
                        <p className="text-sm text-orange-500 font-semibold mt-1">{item.product.price.toLocaleString()} RWF</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                      <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.product.stock)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 transition"
                          aria-label="Decrease quantity"
                        >
                          <FiMinus size={16} />
                        </button>
                        <span className="w-8 text-center font-bold text-slate-700 text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.product.stock)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 transition"
                          aria-label="Increase quantity"
                        >
                          <FiPlus size={16} />
                        </button>
                      </div>

                      <div className="text-right min-w-[90px] font-bold text-slate-800 text-sm hidden sm:block">
                        {(item.product.price * item.quantity).toLocaleString()} RWF
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
            </div>

            {/* RIGHT COLUMN: Cart Totals Sticky Summary Box */}
            <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-8">
              <h2 className="text-lg font-bold text-slate-900 pb-4 border-b border-slate-100">Cart Totals</h2>
              
              <div className="py-4 space-y-3">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">{subtotal.toLocaleString()} RWF</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600 border-t border-slate-100 pt-3">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="font-bold text-orange-600">{subtotal.toLocaleString()} RWF</span>
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => router.push('/user-dashboard/checkout')}
                  className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition shadow-sm text-sm tracking-wide"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>

          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center pb-12">
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={(page) => { setCurrentPage(page); fetchCart(page); }} 
            />
          </div>
        )}
      </div>
    </div>
  );
}