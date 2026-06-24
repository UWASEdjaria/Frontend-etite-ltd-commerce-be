'use client';
import { userProductService } from "@/services/userProduct.service";
import { UserProduct } from "@/types/userProduct";
import { resolveProductImage } from "@/lib/resolveProductImage";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<UserProduct | null>(null);

  useEffect(() => {
    if (id) userProductService.getById(id as string).then(setProduct);
  }, [id]);

  if (!product) return <div className="p-10">Loading...</div>;

  const imageUrl = resolveProductImage(product);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-3">
      <img src={imageUrl} alt={product.name} className="w-full h-48 object-cover rounded-xl" />
      <h1 className="text-2xl text-slate-700 font-bold">{product.name}</h1>
      <p className="text-orange-700 font-extrabold text-xl mt-1">{product.price} RWF</p>
      <p className="mt-3 text-slate-600 leading-relaxed">{product.description}</p>
      <button className="mt-4 bg-orange-700 text-white px-6 py-2 rounded-lg font-bold">
        Add to Cart
      </button>
    </div>
  );
}