'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiShoppingCart } from 'react-icons/fi';
import { getGuestCart } from '@/utils/guestCart';
import { cartService } from '@/services/cartService';
import { usePathname } from "next/navigation";

export default function CartIcon() {
  const [cartCount, setCartCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  const checkIfAdmin = () => {
    // 1. Check direct role keys if any exist
    const role = localStorage.getItem('role') || localStorage.getItem('userRole');
    if (role && role.toUpperCase() === 'ADMIN') return true;

    // 2. Check if user object is stored and contains a role
    const userStr = localStorage.getItem('user') || localStorage.getItem('userInfo');
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        if (userObj?.role && String(userObj.role).toUpperCase() === 'ADMIN') return true;
      } catch (e) {
        // parsing failed, ignore
      }
    }

    // 3. Fallback: Decode JWT token payload to check role securely
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const decodedToken = JSON.parse(jsonPayload);
        
        // Check common fields where backend stores roles in JWT
        const tokenRole = decodedToken?.role || decodedToken?.userRole || decodedToken?.type;
        if (tokenRole && String(tokenRole).toUpperCase() === 'ADMIN') {
          return true;
        }
      } catch (err) {
        console.error("Failed to parse token payload", err);
      }
    }

    return false;
  };

  const updateCartBadge = async () => {
    if (checkIfAdmin()) {
      setIsAdmin(true);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      const guestItems = getGuestCart();
      const totalCount = guestItems.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(totalCount);
    } else {
      try {
        const response = await cartService.getCart();
        const items = response.items || [];
        const totalCount = items.reduce((acc: number, item: { quantity: number }) => acc + item.quantity, 0);
        setCartCount(totalCount);
      } catch {
        setCartCount(0);
      }
    }
  };

  useEffect(() => {
    if (checkIfAdmin()) {
      setIsAdmin(true);
      return;
    }

    updateCartBadge();

    window.addEventListener('cartUpdated', updateCartBadge);
    window.addEventListener('storage', updateCartBadge);
    return () => {
      window.removeEventListener('cartUpdated', updateCartBadge);
      window.removeEventListener('storage', updateCartBadge);
    };
  }, []);

  // If the user is an admin, do not render anything and stop all execution
  if (isAdmin) {
    return null;
  }

  return (
    <Link
     href="/user-dashboard/cart"
     className={`relative p-2 transition ${
     pathname === "/user-dashboard/cart"
     ? "text-orange-600"
     : "text-slate-500 hover:text-orange-600"
     }`}
     >
      <FiShoppingCart size={22} />
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {cartCount}
        </span>
      )}
    </Link>
  );
}