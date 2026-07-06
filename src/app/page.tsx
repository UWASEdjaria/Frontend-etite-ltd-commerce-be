'use client';

import Link from "next/link";
import ProductCard from "@/components/product/productCard";

import { UserProduct } from "@/types/userProduct";
import { FiSearch } from "react-icons/fi";
import { useEffect, useState, useCallback } from "react";
import Pagination from "@/components/ui/pagnition";
import { userProductService } from "@/services/userProduct.service";
import { adminProductService } from "@/services/adminProduct.service";

export default function HomePage() {
  const [products, setProducts] = useState<UserProduct[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [notification, setNotification] = useState<{ message: string; isError: boolean } | null>(null);

  const handleNotify = (message: string, isError: boolean) => {
    setNotification({ message, isError });
    setTimeout(() => setNotification(null), 3000);
  };

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = useCallback(async (page: number) => {
    try {
      const response = await userProductService.getAll({ 
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

  // Fetch products when filters or page change
  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage, fetchProducts]);

  return (
    <div className="min-h-screen bg-slate-50">
      {notification && (
        <div className={`fixed top-20 right-5 z-50 px-6 py-3 rounded-lg text-white font-bold shadow-lg animate-pulse ${notification.isError ? 'bg-red-600' : 'bg-green-600'}`}>
          {notification.message}
        </div>
      )}

      {/* Hero Section - Split Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & CTA */}
          <div className="md:col-span-7 text-left">
            <span className="inline-block mb-4 px-4 py-1 bg-orange-100 border border-orange-200 text-orange-500 text-xs font-bold rounded-full tracking-widest uppercase">
              Industrial Procurement
            </span>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
              Construction Tools & <span className="text-orange-500">Equipment</span>
            </h1>

            <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600">
              Shop premium construction tools, industrial equipment, and building
              materials from trusted suppliers. Whether you're managing a
              construction project or purchasing tools for everyday work,
              ConstructPro helps you find reliable products, competitive pricing,
              and a seamless shopping experience.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="#catalog"
                className="px-8 py-3 text-center bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-800 transition shadow-sm"
              >
                Start Shopping
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 pt-8 border-t border-slate-200 flex flex-wrap gap-6 text-sm font-medium text-slate-600">
              <span>✔ Quality Products</span>
              <span>✔ Trusted Suppliers</span>
              <span>✔ Secure Shopping</span>
              <span>✔ Fast Delivery</span>
            </div>

            {/* Statistics */}
            <div className="mt-8 grid grid-cols-3 gap-6 pt-4">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">500+</p>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Products</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">100+</p>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Trusted Suppliers</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">24/7</p>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Customer Support</p>
              </div>
            </div>
          </div>

          {/* Right Column: Styled Image Card */}
          <div className="md:col-span-5 relative">
            <div className="relative mx-auto max-w-md md:max-w-none rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-900">
              <div 
                className="h-[580px] sm:h-[440px] bg-cover bg-center transform hover:scale-105 transition duration-500" 
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=870&auto=format&fit=crop')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <p className="text-xs uppercase tracking-wider text-orange-400 font-bold">Professional Grade</p>
                    <p className="text-lg font-bold mt-1">Equipped for heavy-duty construction sites</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Product Catalog Section */}
      <div id="catalog" className="max-w-7xl mx-auto p-4 sm:p-6 pb-20 pt-8 border-t border-slate-200">
        <div className="mb-8 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Shop Construction Essentials</h2>
          <p className="text-slate-500 text-sm mt-1">Browse our collection of reliable construction tools and equipment from trusted suppliers at competitive prices.</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={searchTerm}
              placeholder="Search tools by name..."
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 outline-none focus:ring-2 focus:ring-orange-600 bg-white"
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

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-8">
          {products.length > 0 ? (
            products.map((p) => (
              <ProductCard 
                key={p.id} 
                product={p} 
                onNotify={handleNotify} 
              />
            ))
          ) : (
            <p className="col-span-full text-center text-slate-400 py-16">No products found.</p>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-center pb-10">
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
    </div>
  );
}