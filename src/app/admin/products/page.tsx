'use client';

import { useState, useEffect, useCallback} from 'react';
import { FiX, FiSearch } from 'react-icons/fi';
import AdminProductTable from '@/components/admin/AdminProductTable';
import ProductModal from '@/components/admin/ProductModal';
import { adminProductService } from '@/services/adminProduct.service';
import { AdminProduct } from '@/types/adminProduct';
import Pagination from '@/components/ui/pagnition';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories] = useState<{ id: string; name: string }[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);
  const [editProduct, setEditProduct] = useState<AdminProduct | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts =useCallback(async (page: number = 1) => {
    try {
      const response = await adminProductService.getAll({ page, name: search, categoryId: categoryFilter });
        setProducts(response.data);
        setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  }, [search, categoryFilter]);

useEffect(() => {
  fetchProducts(currentPage);
}, [currentPage,fetchProducts]);  


  const handleEdit = (product: AdminProduct) => {
    setEditProduct(product);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditProduct(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">Manage your inventory and product listings.</p>
        </div>
        <button 
          onClick={() => { setEditProduct(null); setIsModalOpen(true); }}
          className="bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-800 transition"
        >
          + Add New Product
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => {setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <select
          aria-label="Filter products by category"
          value={categoryFilter}
          onChange={(e) => {setCategoryFilter(e.target.value)
            setCurrentPage(1);
          }}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <AdminProductTable 
        products={products} 
        onDelete={fetchProducts} 
        onViewDetails={setSelectedProduct}
        onEdit={handleEdit}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
      
      <ProductModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose}
        onSuccess={fetchProducts}
        product={editProduct}
      />

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg bg-white p-6 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedProduct(null)} 
              aria-label="Close product details"
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-orange-50 transition"
            >
              <FiX size={20} className="text-orange-700" />
            </button>
            <h2 className="text-xl font-bold mb-4 text-orange-900">Product Details</h2>
            {selectedProduct.imageUrl && (
              <img 
                src={selectedProduct.imageUrl} 
                alt={selectedProduct.name} 
                className="w-full h-64 object-cover rounded-xl border border-orange-100" 
              />
            )}
            <h2 className="text-2xl font-bold mt-4 text-slate-900">{selectedProduct.name}</h2>
            <p className="text-slate-600 mt-2">{selectedProduct.description}</p>
            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-orange-100 pt-4">
              <div>
                <p className="text-xs text-orange-600 font-semibold uppercase">Price</p>
                <p className="font-bold text-lg text-slate-900">{selectedProduct.price.toLocaleString()} RWF</p>
              </div>
              <div>
                <p className="text-xs text-orange-600 font-semibold uppercase">Stock</p>
                <p className="font-bold text-lg text-slate-900">{selectedProduct.stock}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="mt-6 pb-32 mb-10 flex justify-center pb-10">
  {totalPages > 1 ? (
    <Pagination 
      currentPage={currentPage} 
      totalPages={totalPages} 
      onPageChange={(page) => setCurrentPage(page)} 
    />
  ) : (
    <p className="text-xs text-slate-400">
      Showing all {products.length} products (Page {currentPage} of {totalPages})
    </p>
  )}
</div>
    </div>
  );
}
