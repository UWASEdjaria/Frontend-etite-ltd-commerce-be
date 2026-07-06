"use client";

import { useEffect, useState, useCallback } from "react";
import { wishlistService } from "@/services/wishlistService";
import { WishlistResponse } from "@/types/wishlist";
import axios from "axios";
import { Trash2 } from "lucide-react";

export default function WishlistPage() {
  const [data, setData] = useState<WishlistResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: "error" | "success" } | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true);
      const response = await wishlistService.getWishlist();
      setData(response);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleRemove = async () => {
    if (!itemToDelete) return;

    try {
      setMessage(null);
      await wishlistService.removeItem(itemToDelete);
      setMessage({ text: "Item removed successfully", type: "success" });
      setItemToDelete(null);
      fetchWishlist();
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || "Failed to remove item"
        : "An unexpected error occurred";
      setMessage({ text: errorMessage, type: "error" });
      setItemToDelete(null);
    }
  };

  if (loading) return <div className="max-w-4xl mx-auto p-6 text-sm text-gray-500">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">My Wishlist</h1>

      {message && (
        <div className={`mb-4 p-3 rounded-lg text-xs border ${message.type === "error" ? "bg-red-50 text-red-700 border-red-200" : "bg-green-50 text-green-700 border-green-200"}`}>
          {message.text}
        </div>
      )}

      {data?.userWishlist.length === 0 ? (
        <p className="text-slate-600">Your wishlist is empty.</p>
      ) : (
        <div className="space-y-4">
          {data?.userWishlist.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow border border-slate-200 flex items-start gap-4">
              {/* Product Image */}
              <img 
                src={item.product.imageUrl || "/placeholder.png"} 
                alt={item.product.name} 
                className="w-20 h-20 object-cover rounded-md border border-slate-100"
              />
              
              {/* Content Section */}
              <div className="flex-1">
                <h2 className="font-bold text-gray-800">{item.product.name}</h2>
                <p className="text-sm text-slate-600 mt-1 line-clamp-2">{item.product.description}</p>
                <p className="text-slate-900 font-semibold mt-2">{item.product.price.toLocaleString()} RWF</p>
              </div>

              {/* Action Section */}
              {itemToDelete === item.productId ? (
                <div className="flex flex-col gap-2 items-end text-xs">
                  <span className="text-slate-500">Confirm remove?</span>
                  <div className="flex gap-2">
                    <button onClick={handleRemove} className="font-bold text-red-600 hover:underline">Yes</button>
                    <button onClick={() => setItemToDelete(null)} className="text-slate-500 hover:underline">No</button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setItemToDelete(item.productId)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}