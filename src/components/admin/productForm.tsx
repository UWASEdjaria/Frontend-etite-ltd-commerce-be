'use client';

import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { createProductSchema } from '@/lib/validations/product';
import { adminProductService } from '@/services/adminProduct.service';
import { AdminProduct, Category, FormInputs, ValidationError } from '@/types/product.types';

export const ProductForm = ({
  onSuccess,
  product,
}: {
  onSuccess: () => void;
  product?: AdminProduct | null;
}) => {
  const isEdit = !!product;
  const [categories, setCategories] = useState<Category[]>([]);
  const [useUrlInput, setUseUrlInput] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      categoryId: '',
      condition: 'NEW',
    },
  });

  useEffect(() => {
    adminProductService.getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        categoryId: product.categoryId,
        condition: product.condition,
      });
      setImageUrl(product.imageUrl || '');
      setUseUrlInput(!!product.imageUrl);
    }
  }, [product, reset]);

  const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400';

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const formData = new FormData();

    if (imageFile) formData.append('image', imageFile);
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', String(data.price));
    formData.append('stock', String(data.stock));
    formData.append('categoryId', data.categoryId);
    formData.append('condition', data.condition || 'NEW');
    formData.append('imageUrl', imageUrl || '');

    try {
      if (isEdit && product) {
        await adminProductService.update(product.id, formData);
      } else {
        await adminProductService.create(formData);
      }
      onSuccess();
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const serverError = error.response.data as ValidationError;
        console.error('Submission failed:', serverError.message);
        alert(`Error: ${serverError.message}`);
      } else {
        console.error('Submission failed:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">zz
      <div>
        <button type="button" onClick={() => setUseUrlInput(!useUrlInput)} className="text-xs text-orange-600 underline">
          {useUrlInput ? 'Use file upload' : 'Use image URL'}
        </button>
        {!useUrlInput ? (
          <input type="file" accept="image/*" className={inputClass} onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
        ) : (
          <input className={inputClass} placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        )}
      </div>

      <input {...register('name')} placeholder="Product name" className={inputClass} />
      {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}

      <input type="number" {...register('price', { valueAsNumber: true })} placeholder="Price" className={inputClass} />
      <input type="number" {...register('stock', { valueAsNumber: true })} placeholder="Stock" className={inputClass} />
      <textarea {...register('description')} placeholder="Description" className={inputClass} />

      <select {...register('categoryId')} className={inputClass}>
        <option value="">Select category</option>
        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>

      <select {...register('condition')} className={inputClass}>
        <option value="NEW">New</option>
        <option value="REFURBISHED">Refurbished</option>
        <option value="HEAVY_DUTY">Heavy Duty</option>
      </select>

      <button type="submit" disabled={isSubmitting} className="w-full bg-orange-700 text-white py-2 rounded-lg">
        {isSubmitting ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
      </button>
    </form>
  );
};