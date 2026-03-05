import type { Product, ProductsResponse, ProductFilters, Category } from '../../entities/types';
import { apiRequest } from './client';

function buildQuery(filters?: ProductFilters): string {
  if (!filters) return '';
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.category) params.set('category', filters.category);
  if (filters.min_price !== undefined) params.set('min_price', String(filters.min_price));
  if (filters.max_price !== undefined) params.set('max_price', String(filters.max_price));
  if (filters.page !== undefined) params.set('page', String(filters.page));
  const q = params.toString();
  return q ? `?${q}` : '';
}

export async function getProducts(filters?: ProductFilters): Promise<ProductsResponse> {
  return apiRequest<ProductsResponse>(`/products/${buildQuery(filters)}`);
}

export async function getProduct(id: number | string): Promise<Product> {
  return apiRequest<Product>(`/products/${id}/`);
}

export async function getCategories(): Promise<Category[]> {
  return apiRequest<Category[]>('/products/categories/');
}
