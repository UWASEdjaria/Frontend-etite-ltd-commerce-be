'use client';

import { useCallback, useEffect, useState } from 'react';
import { cartService } from '@/services/cartService';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { CartItem } from '@/types/cart';
import { toast, Toaster } from 'react-hot-toast';
import { AxiosError } from 'axios';
import { createOrderSchema } from '@/lib/validations/orderValidation';
import { useRouter } from 'next/navigation';
import { orderService } from '@/services/orderService';
import Pagination from '@/components/ui/pagnition';

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // State to track which item is currently asking for deletion confirmation
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const router = useRouter();
  
  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const shippingAddress = formData.get("address") as string;

    try {
      createOrderSchema.parse({ shippingAddress });
      setIsCheckingOut(true);
      
      await orderService.createOrder({ shippingAddress });
      
      toast.success("Order placed successfully!");
      router.push('/user-dashboard/orders');
    } catch (err) {
      toast.error("Checkout failed. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const fetchCart =useCallback(async (page: number) => {
    try {
      const response = await cartService.getCart(page);
      console.log("API Response:", response);
      setItems(response.items || []);
      setTotalPages(response.totalPages || 1);
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
   } , []);

  useEffect(() => {
    fetchCart(1);
  }, [fetchCart]);

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      await cartService.updateItem(id, quantity);
      fetchCart(currentPage);
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const message = err.response?.data?.message || "Could not update quantity";
      toast.error(message);
    }
  };
 
  const removeItem = async (id: string) => {
    try {
      await cartService.removeItem(id);
      if (items.length === 1 && currentPage > 1) {
      fetchCart(currentPage - 1);
      } else {
      fetchCart(currentPage);
    }
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
   <div className="w-full px-4 sm:px-6 lg:px-8 py-6 pb-20 max-w-5xl mx-auto min-h-screen overflow-y-auto">
   
      <Toaster position="top-right" />
      <h1 className="text-xl sm:text-2xl font-bold mb-6 text-slate-800">Shopping Cart</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
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
                  <div className="mt-8 p-6 bg-white rounded-xl shadow-sm border border-slate-200">
                      <div className="flex justify-between font-bold text-lg mb-1">
                  <span  className="text-slate-500">Total</span>
                 <span className="text-slate-500">{items.reduce((acc, i) => acc + (i.product.price * i.quantity), 0).toLocaleString()} RWF</span>
                  </div>
                  {items.length > 0 && (
                        <form onSubmit={handleCheckout} className="mt-8 mb-4 bg-slate-50 p-6 rounded-xl border border-slate-200">
                        <h2 className="text-lg font-bold mb-4 text-slate-800">Complete Order</h2>
                         <div className="flex flex-col gap-3">
                          <input 
                             name="address" 
                             required 
                             placeholder="Enter shipping address" 
                             className="w-full p-2 border border-slate-300 rounded-lg text-slate-900"
                            />
                        <button 
                              type="submit" 
                              disabled={isCheckingOut}
                              className="w-full bg-orange-600 text-white py-2 rounded-lg font-bold hover:bg-orange-700 disabled:bg-slate-400"
                              >
                             {isCheckingOut ? "Processing..." : "Place Order"}
                        </button>
                     </div>
                 </form>
               )}      
           </div>
            <div className="mt-6 pb-32 mb-10 flex justify-center pb-10">

           {totalPages > 1 && (
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={(page) => fetchCart(page)} 
          />
        )}
        </div>
           </div>
           
         );
     }