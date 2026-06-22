'use client';

import { ProductForm } from "./productForm";
import { FiX } from "react-icons/fi";
import { AdminProduct } from "@/types/adminProduct";

export default function ProductModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  product,
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSuccess: () => void;
  product?: AdminProduct | null;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-gray-800">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-500 hover:text-orange-700 hover:bg-orange-50 rounded-full transition-all duration-200"
            aria-label="Close"
          >
            <FiX size={20} />
          </button>
        </div>
        <div className="p-6 text-gray-600">
          <ProductForm 
            product={product}
            onSuccess={() => { 
              onSuccess(); 
              onClose(); 
            }} 
          />
        </div>
      </div>
    </div>
  );
}
