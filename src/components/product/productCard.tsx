'use client';
import { useState } from 'react';
import { UserProduct } from "@/types/userProduct";
import { resolveProductImage } from "@/lib/resolveProductImage";
import Link from "next/link";
import { cartService } from "@/services/cartService";

export default function ProductCard({ product }: { product: UserProduct }) {
  const [isAdding, setIsAdding] = useState(false);
  const imageUrl = resolveProductImage(product);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await cartService.addToCart({ productId: product.id, quantity: 1 });
      alert('Product added to cart!');
      } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition flex flex-col">
      {/* Image — fixed height */}
      <div className="h-56 w-full bg-white shrink-0 flex items-center justify-center p-3">
        <img src={imageUrl} alt={product.name} className="w-full h-full object-contain" />
      </div>

      {/* Content — grows to fill, never clips */}
      <div className="flex flex-col flex-1 p-3 gap-1">
        <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1">{product.name}</h3>
        <span className="text-xs text-slate-400 uppercase font-semibold tracking-wide">{product.condition}</span>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{product.description}</p>

        {/* Price + button always at bottom */}
        <div className="mt-auto pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <span className="font-extrabold text-orange-700 text-sm">{product.price.toLocaleString()} RWF</span>
          <Link
            href={`/user-dashboard/products/${product.id}`}
            className="text-xs font-bold bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-orange-700 transition shrink-0"
          >
            View Details
          </Link>
          <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="text-xs font-bold bg-orange-700 text-white px-3 py-1.5 rounded-lg hover:bg-orange-800 transition shrink-0 disabled:opacity-50"
            >
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </button>
        </div>
      </div>
    </div>
  );
}
