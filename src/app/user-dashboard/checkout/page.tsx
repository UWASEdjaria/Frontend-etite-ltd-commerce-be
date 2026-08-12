'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { orderService } from '@/services/orderService';
import { paymentService } from '@/services/paymentService';
import { authService } from '@/services/authService';
import { cartService } from '@/services/cartService';
import type { CartItem } from '@/types/cart';
import { AxiosError } from 'axios';
import { getGuestCart } from '@/utils/guestCart';
import { useRouter } from 'next/navigation';
import { FiRefreshCw, FiClock } from 'react-icons/fi';

export default function Checkout() {
  const router = useRouter();
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'DELIVERY' | 'MOMO'>('DELIVERY');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [isGuest, setIsGuest] = useState(false);
  const [user, setUser] = useState<{ email?: string; name?: string } | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [clientName, setClientName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // After MOMO order is placed — waiting for payment confirmation
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [pendingPhone, setPendingPhone] = useState('');
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const loadData = async () => {
      if (!token) {
        setIsGuest(true);
        setUser({ email: '', name: 'Guest' });
        setCartItems(getGuestCart());
        return;
      }
      try {
        const response = await authService.getProfile();
        const profile = (response as { user?: { email?: string; name?: string }; data?: { email?: string; name?: string } }).user
          ?? (response as { user?: { email?: string; name?: string }; data?: { email?: string; name?: string } }).data
          ?? response;
        setUser({ email: (profile as { email?: string })?.email || '', name: (profile as { name?: string })?.name || 'User' });
        setClientName((profile as { name?: string })?.name || '');
      } catch {
        setUser({ email: '', name: 'User' });
      }
      try {
        const response = await cartService.getCart();
        setCartItems(response.items || []);
      } catch {
        setCartItems([]);
      }
    };
    loadData();
  }, []);

  const totalAmount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cartItems]
  );
  const totalItems = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  const clearCartAfterSuccess = async () => {
    if (isGuest) {
      localStorage.removeItem('guest_cart');
    } else {
      await cartService.clearCart();
    }
    setCartItems([]);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleCheckout = async () => {
    if (!address.trim()) { toast.error('Please enter a shipping address.'); return; }
    if (!clientName.trim()) { toast.error('Please enter your full name.'); return; }
    if (isGuest && !guestEmail.includes('@')) { toast.error('Enter a valid email'); return; }
    if (paymentMethod === 'MOMO' && !phoneNumber.trim()) { toast.error('Please enter your Mobile Money number.'); return; }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const actuallyIsGuest = !token;
      let order;

      if (actuallyIsGuest) {
        if (cartItems.length === 0) { toast.error('Your cart is empty.'); return; }
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
      } else {
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
      }

      if (paymentMethod === 'MOMO') {
        // Send payment prompt — do NOT clear cart yet
        await paymentService.processCheckout({
          phone: phoneNumber,
          amount: totalAmount,
          orderId: order.id,
        });
        // Show waiting screen — cart stays intact until payment confirmed
        setPendingOrderId(order.id);
        setPendingPhone(phoneNumber);
        toast.message('Check your phone!', {
          description: 'Enter your Mobile Money PIN to complete payment.',
        });
      } else {
        // DELIVERY — clear cart immediately, redirect
        await clearCartAfterSuccess();
        toast.success('Order placed! We will deliver and collect payment.');
        setTimeout(() => router.push('/user-dashboard/orders'), 1500);
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || 'Checkout failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryPayment = async () => {
    if (!pendingOrderId) return;
    setIsRetrying(true);
    try {
      await paymentService.retryPayment(pendingOrderId, pendingPhone);
      toast.message('Prompt resent!', { description: 'Check your phone and enter your PIN.' });
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || 'Failed to resend payment prompt');
    } finally {
      setIsRetrying(false);
    }
  };

  const handlePaymentDone = async () => {
    // User says they paid — clear cart and go to orders to check status
    await clearCartAfterSuccess();
    router.push('/user-dashboard/orders');
  };

  const handleCancelPending = () => {
    // User gives up — go back to checkout form, cart still intact
    setPendingOrderId(null);
    setPendingPhone('');
  };

  // ── MOMO Waiting Screen ──────────────────────────────────────────
  if (pendingOrderId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiClock size={32} className="text-orange-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Waiting for Payment</h2>
          <p className="text-slate-500 text-sm mb-1">A payment prompt was sent to</p>
          <p className="font-bold text-slate-800 text-lg mb-6">{pendingPhone}</p>
          <p className="text-slate-500 text-sm mb-8">
            Open your Mobile Money app and enter your PIN to confirm.
            If you did not receive the prompt, click <strong>Resend</strong>.
          </p>

          <div className="space-y-3">
            <button
              onClick={handleRetryPayment}
              disabled={isRetrying}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl py-3 font-bold transition disabled:opacity-50"
            >
              <FiRefreshCw size={16} className={isRetrying ? 'animate-spin' : ''} />
              {isRetrying ? 'Resending...' : 'Resend Payment Prompt'}
            </button>

            <button
              onClick={handlePaymentDone}
              className="w-full bg-green-500 hover:bg-green-600 text-white rounded-2xl py-3 font-bold transition"
            >
              I Have Paid — Check My Order
            </button>

            <button
              onClick={handleCancelPending}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl py-3 font-semibold transition text-sm"
            >
              Go Back to Checkout
            </button>
          </div>

          <p className="text-xs text-slate-400 mt-6">
            Order ID: {pendingOrderId.slice(0, 12)}...
          </p>
        </div>
      </div>
    );
  }

  // ── Normal Checkout Form ─────────────────────────────────────────
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
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Full Name</label>
                  <input type="text" placeholder="John Doe" value={clientName} onChange={(e) => setClientName(e.target.value)} className="border border-slate-300 bg-slate-50 text-slate-800 placeholder:text-slate-400 rounded-2xl w-full p-3 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>

                {isGuest && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Email Address</label>
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

                {paymentMethod === 'MOMO' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Mobile Money Number</label>
                    <input placeholder="078xxxxxxx" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="border border-slate-300 bg-slate-50 text-slate-800 placeholder:text-slate-400 rounded-2xl w-full p-3 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    <p className="text-xs text-slate-500">We will only use this number for payment.</p>
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
                Your order will be confirmed after checkout.
              </div>
              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-2xl py-3 font-bold transition shadow-sm disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
