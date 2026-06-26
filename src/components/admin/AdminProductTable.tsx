'use client';

import { adminProductService } from "@/services/adminProduct.service";
import { AdminProduct } from "@/types/adminProduct";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import { isAxiosError } from "axios";


interface Props {
  products: AdminProduct[];
  onDelete: () => void;
  onViewDetails: (product: AdminProduct) => void;
  onEdit: (product: AdminProduct) => void;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;

}

export default function AdminProductTable({
  products,
  onDelete,
  onViewDetails,
  onEdit,
  currentPage,
  totalPages,
  setCurrentPage

}: Props) {

  const handleDelete = (id: string) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium">
            Are you sure you want to delete this product?
          </p>

          <div className="flex gap-2">
            <button
              className="bg-red-600 text-white px-3 py-1 rounded text-xs"
              onClick={async () => {
                toast.dismiss(t.id);

                try {
                  await adminProductService.delete(id);
                  toast.success("Product deleted successfully");
                  onDelete();
                } catch (error) {
                  if (isAxiosError(error)) {
                    toast.error(
                      error.response?.data?.message ||
                      "Failed to delete product"
                    );
                  } else {
                    toast.error("Something went wrong");
                  }
                }
              }}
            >
              Yes
            </button>

            <button
              className="bg-slate-200 px-3 py-1 rounded text-xs"
              onClick={() => toast.dismiss(t.id)}
            >
              No
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  return (
    <>
      <Toaster position="top-right" />

      <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm sm:text-base">
          <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
            <tr>
              <th className="p-4 text-left font-semibold">Product</th>
              <th className="p-4 text-left font-semibold">Stock</th>
              <th className="p-4 text-left font-semibold">Price</th>
              <th className="p-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="p-4 font-medium text-slate-900 truncate max-w-[150px] sm:max-w-xs">
                  {product.name}
                </td>

                <td className="p-4 text-slate-600">
                  <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                    {product.stock}
                  </span>
                </td>

                <td className="p-4 text-slate-700 font-medium">
                  {product.price.toLocaleString()}{" "}
                  <span className="text-slate-400 text-xs ml-1">RWF</span>
                </td>

                <td className="p-4">
                  <div className="flex justify-end items-center gap-2">
                    <button
                      onClick={() => onViewDetails(product)}
                      aria-label={`View ${product.name}`}
                      className="text-orange-700 hover:underline text-sm font-medium mr-2"
                    >
                      Details
                    </button>

                    <button
                      onClick={() => onEdit(product)}
                      aria-label={`Edit ${product.name}`}
                      className="p-2 text-slate-500 hover:text-orange-600"
                    >
                      <FiEdit size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(product.id)}
                      aria-label={`Delete ${product.name}`}
                      className="p-2 text-slate-500 hover:text-red-600"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}