'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { orderService } from '@/services/orderService';
import { paymentService } from '@/services/paymentService';
import { authService } from '@/services/authService';
import { cartService } from '@/services/cartService';
import type { CartItem } from '@/types/cart';
import type { FlutterwaveResponse } from '@/types/flutterwave';
import { AxiosError } from 'axios';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { getGuestCart } from "@/utils/guestCart";
import { useRouter } from 'next/navigation';


export default function Checkout() {
  const [address, setAddress] = useState('');
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<'DELIVERY' | 'MOMO'>('DELIVERY');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [isGuest, setIsGuest] = useState(false);
  const [user, setUser] = useState<{ email?: string; name?: string } | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [clientName, setClientName] = useState('');
  const [txRef, setTxRef] = useState(() => `tx_${Date.now()}`);
  
  useEffect(() => {
    const token = localStorage.getItem('token');

    const loadData= async () => {
        if (!token) {
          setIsGuest(true);
          setUser({ email: '', name: 'Guest' });
          // Load guest cart from local storage helper
          setCartItems(getGuestCart());
          return;
        }
       // Load Logged-in User Profile
      try {
        const response = await authService.getProfile();
        const profile = (response as { user?: { email?: string; name?: string }; data?: { email?: string; name?: string } }).user
          ?? (response as { user?: { email?: string; name?: string }; data?: { email?: string; name?: string } }).data
          ?? response;

        setUser({
          email: profile?.email || '',
          name: profile?.name || 'User',
        });
        // Pre-fill clientName with logged-in user's name so they can see/edit it
        setClientName(profile?.name || '');
      } catch {
        setUser({ email: '', name: 'User' });
    };

      try {
        const response = await cartService.getCart();
        setCartItems(response.items || []);
      } catch {
        setCartItems([]);
    };
  }
    loadData();
  }, []);

  const totalAmount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cartItems]
  );
  const totalItems = useMemo(
  () => cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  ),
  [cartItems]
);
const fwConfig = {
  public_key: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY || '',
  tx_ref: txRef,//help to knows which amount to other to separate the transaction
  amount: totalAmount,
  currency: 'RWF',
  payment_options: 'mobilemoneyrwanda',

  customer: {
      email: isGuest ? guestEmail : (user?.email || ''),
      phone_number: phoneNumber,
      name: clientName.trim() ? clientName : (user?.name || 'User'),
  },

  customizations: {
    title:'JaJa Shop',
    description: 'Order Payment',
    logo: '',
  },
};

const handleFlutterPayment = useFlutterwave(fwConfig);
const resetFormAndRedirect = () => {
    setAddress('');
    setPhoneNumber('');
    setGuestEmail('');
    setClientName('');
    setTxRef(`tx_${Date.now()}`);
    
    // Redirect user back to home page after a short delay
    setTimeout(() => {
      router.push('/user-dashboard/orders');
    }, 1500);
  };

  const handleCheckout = async () => {
  try {
    if (!address.trim()) {
      toast.error('Please enter a shipping address.');
      return;
    }
    if (!clientName.trim()) {
        toast.error('Please enter your full name.');
        return;
      }
      if (isGuest && !guestEmail.includes('@')) {
        toast.error('Enter a valid email');
        return;
      }
    if (isGuest && !guestEmail.includes('@')) return toast.error('Enter a valid email');
    if (paymentMethod === 'MOMO' && !phoneNumber.trim()) {
      toast.error('Please enter your Mobile Money number.');
      return;
    }
    const token = localStorage.getItem('token');
    const actuallyIsGuest = !token;

    let order;

     if (actuallyIsGuest) {
        // Guest Checkout Path
        if (cartItems.length === 0) {
          toast.error('Your cart is empty.');
          return;
        }
       order = await orderService.createGuestOrder({
          shippingAddress: address,
          paymentMethod,
          fullName: clientName,
          phone: phoneNumber.trim() || undefined, 
          email: guestEmail.trim() || undefined,
          items: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        });
        localStorage.setItem('last_guest_order_id', order.id);

        // Clear guest cart after a successful order request
        localStorage.removeItem('guest_cart');
        setCartItems([]);
        //Notify navbar/other components that the cart has changed
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
        // Logged-in User Checkout Path
        order = await orderService.createOrder({
          shippingAddress: address,
          paymentMethod,
          fullName: clientName,
          email: user?.email || undefined,
          phone: phoneNumber.trim() || undefined,
          items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
          })),

        });
        // Clear backend cart and reset local state for logged-in users
        await cartService.clearCart();
        setCartItems([]);
        window.dispatchEvent(new Event('cartUpdated'));
      }

      if (paymentMethod === 'MOMO') {
        handleFlutterPayment({
          callback: async (response: FlutterwaveResponse) => {
            try {
              await paymentService.verify(
                order.id,
                String(response.transaction_id)
              );
              toast.success('Payment verified and order confirmed!');
              resetFormAndRedirect();
            } catch (error) {
              console.error("Payment verification error:", error);
              toast.error('Payment verification failed.');
            }
            closePaymentModal();
          },
          onClose: () => {},
        });
      } else {
        // DELIVERY: cart already cleared above, now redirect to orders
        toast.success('Order placed! We will deliver and collect payment.');
        resetFormAndRedirect();
      }

    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;

      toast.error(
        err.response?.data?.message ||
        'Checkout failed'
      );
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Checkout</h1>
          <p className="text-sm text-slate-500 mt-2">Complete your delivery details and choose your payment method.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Delivery Information</h2>
              <div className="space-y-5">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Full Name</label>
                  <input type="text" placeholder="John Doe" value={clientName} onChange={(e) => setClientName(e.target.value)} className="border border-slate-300 bg-slate-50 text-slate-800 placeholder:text-slate-400 rounded-2xl w-full p-3 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
               {/* Email Address - Only shown for guests */}
                {isGuest && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Email Address (Required for Receipt)</label>
                    <input type="email" placeholder="you@example.com" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} className="border border-slate-300 bg-slate-50 text-slate-800 placeholder:text-slate-400 rounded-2xl w-full p-3 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Shipping Address</label>
                  <input placeholder="123 Kigali Avenue, Nyarugenge" value={address} onChange={(e) => setAddress(e.target.value)} className="border border-slate-300 bg-slate-50 text-slate-800 placeholder:text-slate-400 rounded-2xl w-full p-3 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Payment Method</label>
                  <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as 'DELIVERY' | 'MOMO')} className="border border-slate-300 bg-slate-50 text-slate-800 rounded-2xl w-full p-3 focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option value="DELIVERY">Pay on Delivery</option>
                    <option value="MOMO">Mobile Money</option>
                  </select>
                </div>

                {paymentMethod === "MOMO" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Mobile Money Number</label>
                    <input placeholder="078xxxxxxx" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="border border-slate-300 bg-slate-50 text-slate-800 placeholder:text-slate-400 rounded-2xl w-full p-3 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    <p className="text-xs text-slate-500">We will only use this number for payment verification.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-slate-900 pb-4 border-b border-slate-200">Order Summary</h2>
              <div className="py-5 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Items</span>
                  <span className="font-semibold text-slate-500">{totalItems}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Delivery</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <div className="flex justify-between items-center border-t pt-4">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="text-xl font-extrabold text-orange-600">{totalAmount.toLocaleString()} RWF</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 text-sm text-slate-600 mb-5">
                Your order will be confirmed after checkout. We will send confirmation details after purchase.
              </div>
              <button onClick={handleCheckout} className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-2xl py-3 font-bold transition shadow-sm">
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}