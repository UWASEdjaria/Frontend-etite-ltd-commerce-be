'use client';
import { userProductService } from "@/services/userProduct.service";
import { UserProduct } from "@/types/userProduct";
import { resolveProductImage } from "@/lib/resolveProductImage";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { cartService } from "@/services/cartService";
import { AxiosError } from 'axios';
import { wishlistService } from "@/services/wishlistService";
import { FiHeart } from 'react-icons/fi';
import { getGuestCart, saveGuestCart } from "@/utils/guestCart";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<UserProduct | null>(null);
  const [isAdding, setIsAdding] = useState(false);
 const [isWishlisting, setIsWishlisting] = useState(false);
 const [notification, setNotification] = useState<{ message: string; isError: boolean } | null>(null);

  const showNotification = useCallback((message: string, isError: boolean = false) => {
    setNotification({ message, isError });
    setTimeout(() => setNotification(null), 3000);
  }, []);
  useEffect(() => {
    if (id) userProductService.getById(id as string).then(setProduct);
  }, [id]);

  if (!product) return <div className="p-10">Loading...</div>;

  const imageUrl = resolveProductImage(product);
 
  const addToCart = async () => {
    setIsAdding(true);
    try {
    const token = localStorage.getItem('token');
    if (!token) {
        // Guest Flow: Save to LocalStorage
        const currentCart = getGuestCart();
        const existingItem = currentCart.find(item => item.productId === product.id);
        const currentQty = existingItem ? existingItem.quantity : 0;
        if (product.stock !== undefined && currentQty + 1 > product.stock) {
          showNotification(`Only ${product.stock} items available in stock.`, true);
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
            product: {
              id: product.id,
              name: product.name,
              price: product.price,
              imageUrl: product.imageUrl,
            }
          });
        }
        saveGuestCart(currentCart);
        window.dispatchEvent(new Event('cartUpdated'));
        showNotification("Added to guest cart!", false);
      } else {
        // Logged-in Flow: Call API
    await cartService.addToCart({ productId: product.id, quantity: 1 }); // Assuming 1 is the quantity
    showNotification("Added to cart!", false);
   }
  } catch (error) {
    console.error("Cart Error:", error);

    const err = error as AxiosError<{ message?: string }>;

    const msg =
      err.response?.data?.message ||
      "Unable to add this product to cart";

    if (
      msg.toLowerCase().includes("stock") ||
      msg.toLowerCase().includes("available")
    ) {
      showNotification(
        "This product is currently out of stock or the requested quantity is not available. Please contact support for assistance.",
        true
      );
    } else {
      showNotification(msg, true);
    }
  } finally {
  
    setIsAdding(false);
  }
};
const addToWishlist = async () => {
  const token = localStorage.getItem('token');
    if (!token) {
      showNotification('Please login first to add items to your wishlist', true);
      return;
    }
    setIsWishlisting(true);
    try {
      await wishlistService.addToWishlist(product.id);
      showNotification("Added to wishlist!", false);
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const msg = err.response?.data?.message || 'Failed to add to wishlist';
      showNotification(msg, true);
    } finally {
      setIsWishlisting(false);
    }
  };
  return (
  <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
    {notification && (
      <div
        className={`fixed top-20 right-4 z-50 px-4 sm:px-6 py-3 rounded-lg text-white font-bold shadow-lg animate-pulse text-sm ${
          notification.isError ? "bg-red-600" : "bg-green-600"
        }`}
      >
        {notification.message}
      </div>
    )}

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">

      {/* Image Card */}
      <div className="bg-white rounded-xl border shadow-sm hover:shadow-lg transition-all p-4 sm:p-6">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-56 sm:h-72 lg:h-96 object-contain bg-slate-100 rounded-xl p-4"
        />
      </div>

      {/* Product Info Card */}
      <div className="space-y-4">
        <h1 className="text-lg sm:text-xl font-bold text-slate-700">{product.name}</h1>
        <p className="text-orange-500 font-extrabold text-lg sm:text-xl">{product.price.toLocaleString()} RWF</p>
        <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm">🚚 We Deliver</h3>
            <p className="text-xs text-slate-600 mt-1">Fee calculated at checkout based on your location.</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm">↩ Returns</h3>
            <p className="text-xs text-slate-600 mt-1">Return within 24 hours if not satisfied.</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm">Availability</h3>
            <p className="text-xs text-green-600 font-semibold mt-1">In Stock</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={addToCart}
            disabled={isAdding}
            className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg font-bold disabled:opacity-50 hover:bg-orange-600 transition"
          >
            {isAdding ? "Adding..." : "Add to Cart"}
          </button>
          <button
            onClick={addToWishlist}
            disabled={isWishlisting}
            className="flex-1 flex items-center justify-center gap-2 border border-slate-300 px-6 py-3 rounded-lg font-bold text-slate-600 hover:bg-slate-50 transition"
          >
            <FiHeart />
            {isWishlisting ? "Adding..." : "Wishlist"}
          </button>
        </div>
      </div>
    </div>

    {/* Description Card */}
    <div className="bg-white rounded-xl border shadow-sm p-4 sm:p-6">
      <h2 className="text-base font-bold text-slate-700 mb-3">Product Description</h2>
      <p className="text-slate-600 leading-7 text-sm">{product.description}</p>
    </div>
  </div>
)};