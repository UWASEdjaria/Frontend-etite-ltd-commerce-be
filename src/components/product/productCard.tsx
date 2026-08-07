'use client';

import { UserProduct } from "@/types/userProduct";
import { resolveProductImage } from "@/lib/resolveProductImage";
import Link from "next/link";
import { cartService } from "@/services/cartService";
import { AxiosError } from 'axios';
import { wishlistService } from "@/services/wishlistService";
import { FiHeart,FiShoppingCart } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { getGuestCart, saveGuestCart } from '@/utils/guestCart';

export default function ProductCard({ product , onNotify}: { product: UserProduct;onNotify: (message: string, isError: boolean) => void }) {
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlisting, setIsWishlisting] = useState(false);
  const imageUrl = resolveProductImage(product);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    try {
     if (isLoggedIn) {
        // Use Database
        await cartService.addToCart({ productId: product.id, quantity: 1 });
        window.dispatchEvent(new Event('cartUpdated'));
        onNotify('Product added to cart!', false);
      } else {
        // Use localStorage
        const currentCart = getGuestCart();
        const existingItem = currentCart.find(item => item.productId === product.id);
        const currentQty = existingItem ? existingItem.quantity : 0;
        if (product.stock !== undefined && currentQty + 1 > product.stock) {
          onNotify(`Only ${product.stock} items available in stock.`, true);
          setIsAdding(false);
          return;
        }
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          currentCart.push({
            id: Date.now().toString(),
             productId: product.id,
              quantity: 1,
              userId: 'guest',
              product:{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  imageUrl: product.imageUrl,
                  stock: product.stock
              }
             });
        }
        saveGuestCart(currentCart);
        window.dispatchEvent(new Event('cartUpdated'));
        onNotify('Added to guest cart!', false);
      }
      } catch (error) {
       const err = error as AxiosError<{ message?: string }>;
       const errorMessage = err.response?.data?.message || 'Failed to add to cart';
      console.log('Cart Error:', errorMessage);
      onNotify(errorMessage, true);
    } finally {
      setIsAdding(false);
    }
  };
  const handleToggleWishlist = async (e: React.MouseEvent) => {
     e.preventDefault();
    e.stopPropagation();
    
    if (!isLoggedIn) {
      onNotify('Please login first to add items to your wishlist', true);
      return;
    }
    setIsWishlisting(true);
    try {
      await wishlistService.addToWishlist(product.id);
      onNotify('Added to wishlist!', false);
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      onNotify(err.response?.data?.message || 'Failed to add to wishlist', true);
    } finally {
      setIsWishlisting(false);
    }
  };

  return (
    <Link href={`/user-dashboard/products/${product.id}`}  className="bg-white  shadow:md hover:shadow-lg transition-all border border-slate-200 rounded-xl overflow-hidden flex flex-col">
      {/* Image — fixed height */}
      <div className="relative   h-56 w-full bg-slate-100 shrink-0  flex items-center justify-center p-3">
        <img src={imageUrl} alt={product.name} className="w-full h-full object-contain" />
        {/* Wishlist Button */}
        <button 
            aria-label="Add to wishlist"
            onClick={handleToggleWishlist}
            disabled={isWishlisting}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-slate-50 transition"
        >
            <FiHeart className={isWishlisting ? "animate-pulse text-orange-500" : "text-orange-600"} />
        </button>
      </div>

      {/* Content — grows to fill, never clips */}
      <div className="flex flex-col flex-1 p-3 gap-1">
        <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1">{product.name}</h3>
        <span className="text-xs text-slate-400 uppercase font-semibold tracking-wide">{product.condition}</span>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{product.description}</p>

        {/* Price + button always at bottom */}
        <div className="mt-auto pt-2 border-t border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center">
            <span className="font-extrabold text-orange-500 text-sm  whitespace-nowrap">{product.price.toLocaleString()} RWF</span>
          </div>
          <div className="ml-auto">
           
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="text-orange-500 p-2 hover:text-orange-600 transition disabled:opacity-50 flex items-center justify-center"
            > <FiShoppingCart 
               className={isAdding ? "animate-pulse" : ""}
               size={18}
               />
           
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
