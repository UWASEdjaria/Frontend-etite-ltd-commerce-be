'use client';
import ProductCard from "@/components/product/productCard";
import { adminProductService } from "@/services/adminProduct.service";
import { UserProduct } from "@/types/userProduct";
import { FiSearch } from "react-icons/fi";
import { useEffect, useState, useCallback } from "react";
import Pagination from "@/components/ui/pagnition";

export default function UserProductsPage() {
  const [products, setProducts] = useState<UserProduct[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryId, setCategoryId] = useState('');
  
  //Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
 // 1. Fetch categories ONCE when the page loads
 
  // 2. Fetch products whenever search or category changes
  
    const fetchProducts = useCallback(async (page: number) => {
      try {
        const response = await adminProductService.getAll({ 
          name: searchTerm, 
          categoryId: categoryId,
          page: page 
        });
        setProducts(response.data || []);
        setTotalPages(response.totalPages || 1);
      } catch (err) {
        console.error('FETCH ERROR:', err);
        setProducts([]);
      }
  }, [searchTerm, categoryId]);

  // Initial load for categories
   useEffect(() => {
    adminProductService.getCategories()
      .then((data) => setCategories(data))
      .catch((err) => console.error("Category fetch error:", err));
  }, []);
  // Fetch products when filters change (Reset to page 1)
  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage, fetchProducts]);

  return (
    <div className="p-4 sm:p-6 pb-40 mb-10">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={searchTerm}
            placeholder="Search tools by name..."
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 outline-none focus:ring-2 focus:ring-orange-600"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          aria-label="Select product category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-600 bg-white"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-8">
        {products.length > 0 ? (
          products.map((p) => <ProductCard key={p.id} product={p} />)
        ) : (
          <p className="col-span-full text-center text-slate-400 py-16">No products found.</p>
        )}
      </div>
       <div className="mt-6 pb-32 mb-10 flex justify-center pb-10">
        {totalPages > 1 ? (
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={(page) => setCurrentPage(page)} 
          />
        ) : (
          <p className="text-sm text-slate-400">
            Showing all {products.length} products (Page {currentPage} of {totalPages})
          </p>
        )}
      </div>
    </div>
  );
}