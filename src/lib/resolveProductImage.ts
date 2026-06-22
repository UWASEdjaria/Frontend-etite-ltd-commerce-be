import { UserProduct } from '@/types/userProduct';

const FALLBACK = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%2394a3b8'%3ENo Image%3C/text%3E%3C/svg%3E`;

export function resolveProductImage(product: UserProduct): string {
  if (product.imageUrl && product.imageUrl.trim() !== '') return product.imageUrl;

  if (Array.isArray(product.images) && product.images.length > 0) {
    const first = product.images[0];
    if (typeof first === 'string' && first.trim() !== '') return first;
    if (typeof first === 'object' && 'url' in first && first.url.trim() !== '') return first.url;
  }

  return FALLBACK;
}
