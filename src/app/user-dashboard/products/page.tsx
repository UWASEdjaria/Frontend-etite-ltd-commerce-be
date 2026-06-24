'use client';
import ProductCard from "@/components/product/productCard";
import { userProductService } from "@/services/userProduct.service";
import { adminProductService } from "@/services/adminProduct.service";
import { UserProduct } from "@/types/userProduct";
import { useEffect, useState, useMemo, useRef } from "react";
import { FiSearch } from "react-icons/fi";

export default function UserProductsPage() {
  const [products, setProducts] = useState<UserProduct[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    userProductService.getAll()
      .then((data) => {
        const raw = Array.isArray(data) ? data
          : Array.isArray((data as { data?: UserProduct[] }).data) ? (data as { data: UserProduct[] }).data
          : [];
        // Deduplicate by name (backend has duplicate entries with different ids)
        const unique = Array.from(new Map(raw.map((p) => [p.name.trim().toLowerCase(), p])).values());
        setProducts(unique);
      })
      .catch((err) => console.error('FETCH ERROR:', err));
    adminProductService.getCategories()
      .then((data) => {
        const unique = Array.from(new Map(data.map((c: { id: string; name: string }) => [c.id, c])).values());
        setCategories(unique);
      })
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchName = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = categoryId ? p.categoryId === categoryId : true;
      return matchName && matchCategory;
    });
  }, [products, searchTerm, categoryId]);

  return (
    <div className="p-4 sm:p-6 pb-10">
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

      {filtered.length === 0 ? (
        <p className="text-center text-slate-400 py-16">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-8">
          {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}