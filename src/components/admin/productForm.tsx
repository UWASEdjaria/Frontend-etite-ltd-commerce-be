'use client';

import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { createProductSchema } from '@/lib/validations/product';
import { adminProductService } from '@/services/adminProduct.service';
import { AdminProduct, Category, FormInputs, ValidationError } from '@/types/adminProduct';

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
  const [imageUrl, setImageUrl] = useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({
    resolver: zodResolver(createProductSchema),
   values: {
      name: product?.name || '',
      description: product?.description || '',
      categoryId: product?.categoryId || '',
      condition: product?.condition || 'NEW',
      minThreshold: product?.minThreshold ?? 5,
      maxThreshold: product?.maxThreshold ?? 100,
    },
  });

  useEffect(() => {
    adminProductService.getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    if (product) {
      reset({
        name: product.name || '',
        description: product.description || '',
        categoryId: product.categoryId || '',
        condition: product.condition || 'NEW',
        minThreshold: product?.minThreshold ?? 5,
        maxThreshold: product?.maxThreshold ?? 100,
      });
      setImageUrl(product.imageUrl || '');
      setUseUrlInput(!!product.imageUrl);
    } else {
      reset({ name: '', description: '', categoryId: '', condition: 'NEW', minThreshold: 5, maxThreshold: 100 });
      setImageUrl('');
      setUseUrlInput(false);
    }
  }, [product, reset]);

  const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400';

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const formData = new FormData();

    if (imageFile) formData.append('image', imageFile);
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('categoryId', data.categoryId);
    formData.append('condition', data.condition || 'NEW');
    formData.append('minThreshold', String(data.minThreshold ?? 5));
    formData.append('maxThreshold', String(data.maxThreshold ?? 100));
   
    if (imageUrl) {
    formData.append('imageUrl', imageUrl);
  }

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
        toast.error(`Error: ${serverError.message}`);
      } else {
        console.error('Submission failed:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <button type="button" onClick={() => setUseUrlInput(!useUrlInput)} className="text-xs text-orange-600 underline">
          {useUrlInput ? 'Use file upload' : 'Use image URL'}
        </button>
        {!useUrlInput ? (
          <div>
            <label htmlFor="image-file" className="sr-only">Product image file</label>
            <input
              id="image-file"
              key="image-file-input"
              type="file"
              accept="image/*"
              className={inputClass}
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
          </div>
        ) : (
          <div>
            <label htmlFor="image-url" className="sr-only">Product image URL</label>
            <input id="image-url" className={inputClass} placeholder="Image URL" value={imageUrl || ''} onChange={(e) => setImageUrl(e.target.value)} />
          </div>
        )}
      </div>
      <div>
        <label htmlFor="name" className="sr-only">Product name</label>
        <input id="name" {...register('name')} defaultValue="" placeholder="Product name" className={inputClass} />
      </div>
      {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
      <div>
        <label htmlFor="description" className="sr-only">Description</label>
        <textarea id="description" {...register('description')} defaultValue="" placeholder="Description" className={inputClass} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label htmlFor="minThreshold" className="block text-xs text-gray-500 mb-1">Min Threshold</label>
          <input id="minThreshold" type="number" {...register('minThreshold')} placeholder="Min Threshold" className={inputClass} />
          {errors.minThreshold && <p className="text-red-500 text-xs mt-1">{errors.minThreshold.message}</p>}
        </div>
        <div>
          <label htmlFor="maxThreshold" className="block text-xs text-gray-500 mb-1">Max Threshold</label>
          <input id="maxThreshold" type="number" {...register('maxThreshold')} placeholder="Max Threshold" className={inputClass} />
          {errors.maxThreshold && <p className="text-red-500 text-xs mt-1">{errors.maxThreshold.message}</p>}
        </div>
      </div>
      <div>
        <label htmlFor="categoryId" className="sr-only">Category</label>
        <select id="categoryId" {...register('categoryId')} className={inputClass}>
        <option value="">Select category</option>
        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="condition" className="sr-only">Condition</label>
        <select id="condition" {...register('condition')} className={inputClass}>
        <option value="NEW">New</option>
        <option value="REFURBISHED">Refurbished</option>
        <option value="HEAVY_DUTY">Heavy Duty</option>
        </select>
      </div>

      <button type="submit" disabled={isSubmitting} className="w-full bg-orange-500 text-white py-2 rounded-lg">
        {isSubmitting ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
      </button>
    </form>
  );
};